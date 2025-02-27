<template>
	<div class="vote-home mb-10 bg-#fafafa mb-50">
		<NormalHeader title="幽默猜测">
			<div class="mr-10 color-primary font-600 text-13">第{{ period }}期</div>
		</NormalHeader>

		<div v-show="renderDone">
			<div class="mt-45 mb-13">
				<div class="w-full h-10"></div>
				<BallList
					:lotteryData="lotteryData"
					:year="year"
					:period="period"
					:periodFull="periodFull"
					:lastIssue="lastIssue"
				/>
			</div>

			<div class="mb-16.5 px-10">
				<YearPeriodScroller
					:issueListKV="issueList"
					:lastIssue="lastIssue"
					:includes="existIssues"
				/>
			</div>
		</div>

		<div class="px-10" id="target" :class="{ gap: !renderDone }">
			<div class="flex-y-center text-12 w-full mb-10 text-16 font-600">
				<a v-redirect.skip.ignoreSelf="'/humorVote'">
					<div
						class="w-172.5 h-30 rounded-10 border-2 flex-y-center justify-center mr-10"
						:class="[
							!isVideo
								? 'bg-#F1FEE6 color-primary border-#34c759 font-600'
								: 'color-#656565 border-#e0e0e0 font-500',
						]"
					>
						图片猜测
					</div>
				</a>
				<a v-redirect.skip.ignoreSelf="'/humorVote/video'">
					<div
						class="w-172.5 h-30 rounded-10 border-2 flex-y-center justify-center"
						:class="[
							isVideo
								? 'bg-#F1FEE6 color-primary border-#34c759 font-600'
								: 'color-#656565 border-#e0e0e0 font-500',
						]"
					>
						视频猜测
					</div>
				</a>
			</div>

			<NotFound v-show="!detailData.postId" text="暂无数据" />
			<div v-show="detailData.postId">
				<div class="pb-5 mb-5">
					<div class="text-16 font-600 color-#434343 text-center mb-8">
						{{ detailData.title }}
					</div>
					<div
						class="text-14 font-400 color-#656565"
						v-html="safeHtml(detailData.postContent)"
					></div>
				</div>

				<!-- 圖片 -->
				<div class="w-full bg-white rounded-12 overflow-hidden card-shadow">
					<div v-if="!isVideo">
						<CdnImage
							v-if="imageUrl"
							:path="imageUrl"
							:config="{ width: '23rem' }"
						/>
					</div>

					<div class="w-full" v-else>
						<div v-show="ready" id="player-wrap" class="w-ful"></div>
						<div
							v-if="!ready"
							class="w-full bg-black h-[calc(100vw*9/16)] pc:h-270px"
						></div>
					</div>

					<div
						class="py-10 px-15 font-500 lh-19.07 w-full color-#AEAEB1 flex-y-center"
					>
						<div class="min-w-57.5 flex-y-center mr-2.5">
							<SvgIcon
								class="cursor-pointer mr-3"
								size="0.9375rem"
								name="like_fill"
							/>
							<span class="color-#aeaeb1">
								{{ digitalConversion(detailData.likeCount || 0) }}
							</span>
						</div>
						<div class="min-w-57.5 flex-y-center mr-2.5">
							<SvgIcon
								class="cursor-pointer mr-3"
								size="0.9375rem"
								name="message_fill"
							/>
							<span class="color-#aeaeb1">
								{{ digitalConversion(detailData.threadCount || 0) }}
							</span>
						</div>
						<div class="min-w-57.5 flex-y-center mr-2.5">
							<SvgIcon
								class="cursor-pointer mr-3"
								size="0.9375rem"
								name="star_fill"
							/>
							<span class="color-#aeaeb1">
								{{ digitalConversion(detailData.favoriteCount || 0) }}
							</span>
						</div>
						<div class="min-w-57.5 flex-y-center mr-2.5">
							<SvgIcon
								class="cursor-pointer mr-3"
								size="0.9375rem"
								name="eye"
							/>
							<span class="color-#aeaeb1">
								{{ digitalConversion(detailData.readCount || 0) }}
							</span>
						</div>

						<div class="flex-y-center flex-1 justify-end">
							<SvgIcon
								name="icon_Warmth"
								size="1.25rem"
								class="mr-5"
								v-if="detailData.isHot == 'y'"
							/>
							<span>{{ lotteryTypeName }}</span>
						</div>
					</div>
				</div>
				<Vote
					class="mb-20 px-10"
					:year="year"
					:fullIssue="period"
					:period="period"
					:gameType="gameType"
				/>
			</div>
		</div>

		<RecommendImg
			:list="recommendPictures"
			v-if="recommendPictures.length > 0"
		/>

		<div v-if="daniuList.length > 0">
			<div class="text-18 color-#434343 font-700 pl-10">推荐大牛</div>
			<RecommendUser :list="daniuList" />
		</div>

		<div class="text-18 font-700 lh-24.515 color-#434343 mb-8 px-10">
			热门评论
		</div>
		<PostComment :post="detailData" class="px-20 mb-70" ref="refPostComment" />

		<Footer :data="detailData" @afterReply="onReply" />

		<!-- 下一期圖紙按鈕 -->
		<div
			class="fixed right-0 bottom-20% z-12 pc:right-[calc(50%-240px)]"
			@click="getNext"
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
		watchEffect,
		inject,
		provide,
		onMounted,
		onBeforeMount,
		nextTick,
	} from 'vue'
	import { storeToRefs } from 'pinia'
	import DOMPurify from 'isomorphic-dompurify'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import BallList from '@/components/BallList/index.vue'
	import YearPeriodScroller from '@/components/YearPeriodScroller/index.vue'
	import RecommendImg from '@/components/RecommendImg/index.vue'
	import RecommendUser from '@/components/RecommendUser/index.vue'
	import Vote from '@/components/Vote/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import NotFound from '@/components/NotFound/index.vue'
	import PostComment from '@/components/PostComment/index.vue'
	import Footer from '@/components/PostFooter/index.vue'

	import { getLotteryResultApi } from '@/api/lottery'
	import { usePictureDetailStore } from '@/stores/pictureDetail'
	import { useLotteryStore } from '@/stores/lottery'
	import { useWebsite } from '@/hooks/useWebsite'
	import {
		toast,
		getCdnUrl,
		digitalConversion,
		getLotteryTypeList,
	} from '@/modules/util'
	import { getGuessDetail } from '@/api/humor'
	import { usePlayer } from '@/hooks/usePlayer.js'
	import { getDaniuListKV } from '@/api/daniu'
	import { getRecommendGallery } from '@/api/picture'
	import { getIssueListKV } from '@/api/common.js'
	import { getBBSForumPosts, getPostCountInfo } from '@/api/bbs.js'
	import { getResourceFlag } from '@/api/common.js'
	import safeHtml from '@/modules/safeHtml.js'

	const props = defineProps({
		params: { type: Object },
		data: { type: Object },
		isVideo: { type: Boolean },
	})

	const detailData = ref(_get(props.data, 'detailResult', {}))
	const { lotteryType } = storeToRefs(useLotteryStore())
	const { setYear, setPeriod, setPeriodFull, getIssueParam } =
		usePictureDetailStore()

	setYear(detailData.value.postYear)
	setPeriod(detailData.value.shortIssue)
	setPeriodFull(detailData.value.postIssue)

	const { year, period, periodFull } = storeToRefs(usePictureDetailStore())
	const website = useWebsite()

	const lotteryTypeList = getLotteryTypeList()

	provide('data', props.data)

	const lastIssue = ref(_get(props.data, 'nextIssue'))
	const ready = ref(false)
	const lotteryData = ref({})
	const daniuList = ref([])
	const recommendPictures = ref([])
	const issueList = ref([])
	const renderDone = ref(false)
	const refPostComment = ref(null)
	let forumId = null

	const voteList = computed(() => _get(detailData.value, 'voteResult.list', []))
	const imageUrl = computed(() => _get(detailData.value, 'attachments.0.url'))
	const videoUrl = computed(() =>
		getCdnUrl(_get(detailData.value, 'attachments.0.url'))
	)
	const gameType = computed(() => detailData.value.postGametypeRef)

	const lotteryTypeName = _get(
		_find(lotteryTypeList, (vo) => vo.key == lotteryType.value),
		'name'
	)

	let player = null
	const existIssues = _get(props.data, 'existIssues')

	onMounted(async () => {
		if (props.isVideo) setPlayer()
	})

	onBeforeMount(async () => {
		getDaniuList()
		getRecommendPictures()
		getForumId()
		await getIssueList()
		if (detailData.value.postId) {
			getFlag()
			getCountInfo()
		}
		await getLotteryResult()
		await nextTick()
		renderDone.value = true
		await nextTick()
		const { offsetTop } = document.getElementById('target')
		const { clientHeight } = document.querySelector('.go-back-header')
		window.scrollTo({ top: offsetTop - clientHeight })
	})

	watch(
		[year, periodFull],
		async ([newYear, newPeriodFull], [oldYear, oldPeriodFull]) => {
			if (oldYear == 0 || oldPeriodFull == '') return
			getLotteryResult()
			const res = await getBBSForumPosts({
				forumId,
				postYear: newYear,
				postIssue: newPeriodFull,
				gameType: lotteryType.value,
			})
			if (!_get(res, 'success')) return
			detailData.value = _head(_get(res, 'data.list', [])) || {}
		}
	)

	watch(
		() => videoUrl.value,
		async (value) => {
			if (!props.isVideo) return
			if (value) {
				await nextTick()
				setPlayer()
			} else {
				if (player) {
					player.destroy()
					player = null
				}
			}
		}
	)

	async function getIssueList() {
		const res = await getIssueListKV({ lotteryType: lotteryType.value })
		issueList.value = _get(res, 'data', [])
	}

	async function getLotteryResult() {
		const response = await getLotteryResultApi({
			lotteryType: lotteryType.value,
			year: year.value,
			issue: getIssueParam(),
		})
		lotteryData.value = _get(response, 'data', {})
	}

	const getNext = () => {
		const list = _find(issueList.value, (vo) => vo.year == year.value)?.issues
		const currentIndex = list.findIndex((vo) => vo.issueShort == period.value)
		if (currentIndex !== -1 && currentIndex < list.length - 1) {
			const nextIssue = list[currentIndex + 1]
			setPeriod(_get(nextIssue, 'issueShort'))
			setPeriodFull(_get(nextIssue, 'issue'))
		} else {
			// 如果没有找到当前期数或已是最后一个期数，可以选择不做任何操作或处理其他情况
			toast('已是最后一期')
			console.warn('已是最后一期或当前期数无效')
		}

		window.scrollTo(0, 0)
	}

	function setPlayer() {
		const { getPlayer, Events } = usePlayer()
		player = getPlayer({
			id: 'player-wrap',
			url: videoUrl.value,
		})
		player.on(Events.LOADED_DATA, () => {
			ready.value = true
		})
	}

	async function getDaniuList() {
		const res = await getDaniuListKV()
		daniuList.value = _get(res, 'data', [])
	}

	async function getRecommendPictures() {
		const res = await getRecommendGallery({ lotteryType: lotteryType.value })
		recommendPictures.value = _get(res, 'data.issueList', [])
	}

	async function getForumId() {
		const res = await getGuessDetail()
		const index = props.isVideo ? 1 : 0
		forumId = _get(res, `data.0.forumList.${index}.forumId`)
	}

	function onReply() {
		detailData.value.isComment = 'y'
		refPostComment.value.refresh()
	}

	async function getFlag() {
		const res = await getResourceFlag({
			targetId: detailData.value.postId,
			resourceFlag: 'p',
		})
		detailData.value.isLike = _get(res, 'data.isLike') ? 'y' : 'n'
		detailData.value.isCollect = _get(res, 'data.isFavorite') ? 'y' : 'n'
		detailData.value.isComment = _get(res, 'data.isComment') ? 'y' : 'n'
	}

	async function getCountInfo() {
		const res = await getPostCountInfo(detailData.value.postId)
		const fields = ['favoriteCount', 'likeCount', 'readCount', 'threadCount']
		_forEach(fields, (field) => {
			detailData.value[field] = _get(res, `data.${field}`, 0)
		})
	}
</script>

<style lang="scss" scoped>
	.card-shadow {
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
	}
	.gap {
		margin-top: 2.8125rem;
	}
</style>
