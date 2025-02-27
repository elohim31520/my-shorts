<template>
	<div class="bg-#fafafa min-h-100dvh pt-55 pb-60">
		<Head :detailData="detailData" />

		<div class="mb-15" v-show="isRenderDone">
			<BallList
				:lotteryData="lotteryData"
				:year="year"
				:period="period"
				:periodFull="periodFull"
				:lastIssue="lastIssue"
			/>
		</div>

		<div id="scrollToTargetElement" class="px-10 min-h-21">
			<YearPeriodScroller
				:issueListKV="issueListKV"
				:lastIssue="lastIssue"
				:filter="{ gameType, newspaperCode, seriesCode }"
			/>
		</div>

		<div class="px-10 mb-20">
			<div>
				<Card class="mt-16" :detailData="detailData" />
			</div>

			<Vote
				ref="voteRef"
				:year="year"
				:fullIssue="periodFull"
				:period="period"
				:gameType="gameType"
			/>

			<div class="w-full flex-y-center mt-20 mb-10 color-#434343">
				<div class="font-700 text-18 lh-24.515">查看图解</div>
				<a
					class="ml-auto flex-y-center text-14"
					:href="
						toRoute('pictureExplanation', {
							title: detailData.newspaperName,
							period: detailData.issue,
							issueId: detailData.issueId,
							year: detailData.year,
						})
					"
				>
					<div class="flex-y-center">
						<div class="mr-1">其他图解</div>
						<svgIcon name="arrow_right" size="1.25rem" />
					</div>
				</a>
			</div>

			<AnnotateContent :description="detailData.annotateContent" />
		</div>

		<RecommendImg
			:list="recommendPictures"
			v-if="recommendPictures.length > 0"
		/>

		<div v-if="daniuList.length > 0">
			<div class="ml-10 text-18 font-700 lh-24.515 color-#434343 mt-10">
				推荐大牛
			</div>

			<RecommendUser :list="daniuList" />
		</div>

		<CommentList
			ref="commentRef"
			:issueId="detailData.issueId"
			:isUseKV="isCommentUseKV"
			class="mt-10"
		/>

		<Footer
			:detailData="detailData"
			@afterReply="commentRef.reset()"
			@likeSuccess="likeSuccess"
		/>

		<!-- 絕對定位的圖解 -->
		<FixedDescription
			:description="detailData.annotateContent"
			v-show="showStory"
		/>

		<!-- 下一期圖紙按鈕 -->
		<div
			class="fixed right-0 bottom-20% z-5 pc:right-[calc(50%-240px)]"
			@click="seeNextIssuePaper"
			v-show="!isLastIssue"
		>
			<svgIcon name="btn-next" size="1.875rem" />
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		computed,
		watch,
		provide,
		onMounted,
		nextTick,
		onBeforeMount,
	} from 'vue'
	import { storeToRefs } from 'pinia'

	import Head from './Header/index.vue'
	import YearPeriodScroller from '@/components/YearPeriodScroller/index.vue'
	import BallList from '@/components/BallList/index.vue'
	import Card from './Card/index.vue'
	import RecommendImg from '@/components/RecommendImg/index.vue'
	import RecommendUser from '@/components/RecommendUser/index.vue'
	import CommentList from './CommentList/index.vue'
	import Footer from './Footer/index.vue'
	import Vote from '@/components/Vote/index.vue'
	import FixedDescription from '@/views/pictureDetail/FixedDescription/index.vue'
	import AnnotateContent from '@/views/pictureDetail/AnnotateContent/index.vue'

	import { addVisitLogApi, setJustView, getPictureViewed } from '@/api/user'
	import { useNavigation } from '@/hooks/useNavigation.js'
	import { useScrollToElement } from '@/hooks/useScrollToElement.js'
	import { usePictureDetailStore } from '@/stores/pictureDetail'
	import { useLotteryStore } from '@/stores/lottery'
	import { getLotteryResultApi, getLastLotteryResultApi } from '@/api/lottery'
	import {
		getPictureDetailByParams,
		getRecommendGallery,
		getPictureDetailKV,
	} from '@/api/picture'
	import {
		toast,
		isLogin,
		getLotteryTypeList,
		getShortIssue,
	} from '@/modules/util'
	import { getDaniuListKV } from '@/api/daniu'
	import { getIssueListKV } from '@/api/common'
	import { useUserStore } from '@/stores/user'

	const { data: userData } = useUserStore()
	const { toRoute } = useNavigation()
	const { scrollToElement } = useScrollToElement()
	const { lotteryType } = storeToRefs(useLotteryStore())
	const {
		setYear,
		setPeriod,
		postsKV,
		setPeriodFull,
		getIssueParam,
		setCommentCount,
	} = usePictureDetailStore()
	const { year, period, showStory, periodFull } = storeToRefs(
		usePictureDetailStore()
	)

	const props = defineProps({
		params: { type: Object },
		data: { type: Object },
	})

	// Reactive References
	const detailData = ref({})
	const initDone = ref(false)
	const lotteryData = ref({})
	const daniuList = ref([])
	const recommendPictures = ref([])
	const issueListKV = ref([])
	const voteRef = ref(null)
	const commentRef = ref(null)
	const isCommentUseKV = ref(false)
	const lastIssue = ref('')
	const isRenderDone = ref(false)
	const lotteryTypes = getLotteryTypeList()

	// 取得 SSR 環境的傳入的初始值
	detailData.value = _get(props.data, 'pictureDetailResult.data', {})
	// 切換期數的時候會用到，是常數 同個系列 期刊 不同年份期數而已
	const newspaperCode = ref('')
	const seriesCode = ref('')
	const gameType = ref('')
	const issue = ref('')

	provide('data', _get(props, 'data', {}))

	const isLastIssue = computed(() => {
		const yearData = issueListKV.value.find((item) => item.year == year.value)

		if (!yearData) return false

		const issues = _get(yearData, 'issues', [])
		const currentIssue = issues.find(
			(issue) => issue.issueShort == period.value
		)
		if (!currentIssue) return false

		return currentIssue.issueShort == issues[issues.length - 1].issueShort
	})

	const getLotteryResult = async () => {
		const response = await getLotteryResultApi({
			lotteryType: lotteryType.value,
			year: year.value,
			issue: getIssueParam(lotteryType.value),
		})
		lotteryData.value = _get(response, 'data', {})
	}

	const seeNextIssuePaper = () => {
		const list = _find(issueListKV.value, (vo) => vo.year == year.value)?.issues
		const currentIndex = list.findIndex((vo) => vo.issueShort == period.value)

		// 如果找到了当前期数，并且当前期数不是最后一个
		if (currentIndex !== -1 && currentIndex < list.length - 1) {
			// 获取下一个期数并更新 period
			const nextIssueShort = _get(list[currentIndex + 1], 'issueShort')
			const nextIssueFull = _get(list[currentIndex + 1], 'issue')
			setPeriod(nextIssueShort)
			setPeriodFull(nextIssueFull)
		} else {
			// 如果没有找到当前期数或已是最后一个期数，可以选择不做任何操作或处理其他情况
			toast('已是最后一期')
			console.warn('已是最后一期或当前期数无效')
		}

		// 滚动到页面顶部
		window.scrollTo(0, 0)
	}

	const likeSuccess = () => {
		if (
			detailData.value.seriesLikeStatus === 'n' &&
			detailData.value.likeStatus === 'y'
		)
			detailData.value.seriesLikeStatus = 'y'
	}

	watch([year, period], ([newYear, newPeriod]) => {
		if (!initDone.value) return
		voteRef.value.resetData()
		getLotteryResult()
		getPictureDetailByParams({
			issue: getIssueParam(lotteryType.value), //傳完整期數
			year: year.value,
			gameType: gameType.value,
			newspaperCode: newspaperCode.value,
			seriesCode: seriesCode.value,
		}).then((res) => {
			const newData = _get(res, 'data')
			detailData.value = newData ? newData : {}
			commentRef.value.reset()
		})

		const issueId = _get(detailData.value, 'issueId')
		if (issueId) {
			addVisitLogApi({
				viewType: 'tk',
				targetId: issueId,
			})
		}
	})

	onBeforeMount(() => {
		// 從currentInfo取當前彩種的當前期數 取得KV期數列表後，把current以後的濾掉
		getLastLotteryResultApi({ lotteryType: lotteryType.value }).then((res) => {
			lastIssue.value = +_get(res, 'data.nextIssue', '')
		})
	})

	onMounted(async () => {
		const detailLotteryType = _get(detailData.value, 'gameType')
		if (detailLotteryType) {
			//考慮到api掛掉
			const detailLotteryKey = lotteryTypes.find(
				(vo) => vo.code == detailLotteryType
			)?.key

			// 考慮有一種情況 當前查看的圖紙對應的彩種，非外面選擇的不一致，ex: 瀏覽a6 但點擊hk6的圖紙網址，近來的內容就要全改成hk6
			if (detailLotteryKey != lotteryType.value) {
				lotteryType.value = detailLotteryKey
			}
		}

		const issueId = props.params.id

		if (_isEmpty(detailData.value)) {
			const res = await getPictureDetailKV(issueId)
			detailData.value = _get(res, 'data.issue', {})
			commentRef.value.reset()
			isCommentUseKV.value = true
			postsKV.push(..._get(res, 'data.posts', []))
		}

		newspaperCode.value = _get(detailData.value, 'newspaperCode', '')
		seriesCode.value = _get(detailData.value, 'seriesCode', '')
		gameType.value = _get(detailData.value, 'gameType', '')
		issue.value = _get(detailData.value, 'issue', '')
		setCommentCount(_get(detailData.value, 'replyCount', 0))

		let issueFull = String(issue.value)
		let currentIssueShort = getShortIssue(issue.value, lotteryType.value)

		setYear(+_get(detailData.value, 'year')) //順序要先set year 因為store中set PeriodFull要用到年份
		setPeriodFull(issueFull)

		getIssueListKV({ lotteryType: lotteryType.value }).then((resp) => {
			issueListKV.value = _get(resp, 'data', [])
			const thisYearIssues = _find(
				issueListKV.value,
				(vo) => vo.year == year.value
			)?.issues
			const issueShort = _get(
				_find(
					thisYearIssues,
					(vo) => vo.issue == issueFull || vo.issueShort == currentIssueShort
				),
				'issueShort'
			)
			if (!issueShort) {
				console.warn(
					'期數kv沒有找到對應的issueShort, 將使用顯示issueFull:',
					issueFull
				)
				setPeriod(issueFull)
			} else {
				setPeriod(issueShort)
			}
		})

		setTimeout(() => {
			initDone.value = true //避免上面初始更新store的年份 期數觸發watch
		}, 1000)

		addVisitLogApi({
			viewType: 'tk',
			targetId: issueId,
		})

		//一些kv改到CSR再做
		getDaniuListKV().then((res) => {
			daniuList.value = _get(res, 'data', [])
		})

		getRecommendGallery({ lotteryType: lotteryType.value }).then((res) => {
			const list = _get(res, 'data.issueList', [])
			// 過濾掉當前正在看的圖紙
			recommendPictures.value = _filter(list, (vo) => vo.targetId != issueId)
		})

		getLotteryResult().then(() => {
			isRenderDone.value = true
			nextTick().then(() => {
				// 58 = header 45 + margin 15 - lotteryResult 陰影 2
				scrollToElement({
					target: '#scrollToTargetElement',
					offset: -58,
					behavior: 'auto',
				})
			})
		})

		// 一秒後去設置 “剛剛看過”
		setTimeout(() => {
			if (isLogin()) {
				getPictureViewed('tk', userData.userId).then((res) => {
					let data = _get(res, 'data')
					const viewedIds = (data = data ? data.toString().split(',') : [])
					const isViewed = _includes(viewedIds, issueId)
					if (!isViewed) {
						setJustView({
							viewType: 'tk',
							postIds: [...viewedIds, issueId].toString(),
						})
					}
				})
			}
		}, 1000)
	})
</script>
