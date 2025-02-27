<template>
	<div class="bg-#fafafa min-h-100dvh pt-55 pb-60">
		<NormalHeader>
			<template #center>
				<div
					class="absolute top-0 left-50% -translate-x-50% lh-45 truncate w-280 font-600 text-20 text-center"
				>
					{{ headerTitle }}
				</div>
			</template>
		</NormalHeader>

		<div class="mb-15">
			<BallList
				:lotteryData="lotteryData"
				:year="year"
				:period="period"
				:periodFull="periodFull"
				:lastIssue="lastIssue"
			/>
		</div>

		<div class="px-10" id="scrollToTargetElement">
			<UserProfile :userId="params.postUserId" :time="params.postTime" />
			<Ranking :userId="params.postUserId" />
		</div>

		<div class="px-10">
			<div class="mb-20">
				<Card class="mt-16" :detailData="detailData">
					<div
						class="p-10 lh-24 w-full color-#434343"
						v-if="detailData.annotateContent"
					>
						{{ detailData.annotateContent }}
					</div>
				</Card>
			</div>

			<div class="w-full flex-y-center mb-10 color-#434343">
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

		<CommentList
			ref="commentRef"
			:issueId="detailData.issueId"
			class="mt-20"
			postType="c"
		/>
		<Footer
			:detailData="detailData"
			@afterReply="commentRef.reset()"
			postType="c"
		/>

		<!-- 絕對定位的圖解 -->
		<FixedDescription
			:description="detailData.annotateContent"
			v-show="showStory"
		/>

		<!-- 下一期圖紙按鈕 -->
		<div
			class="fixed right-0 bottom-20% z-12 pc:right-[calc(50%-240px)]"
			@click="seeNextIssuePaper"
			v-if="!isLast"
		>
			<svgIcon name="btn-next" size="1.875rem" />
		</div>
	</div>
</template>

<script setup>
	import { ref, watch, provide, onMounted, nextTick } from 'vue'
	import { storeToRefs } from 'pinia'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import BallList from '@/components/BallList/index.vue'
	import Card from '@/views/pictureDetail/Card/index.vue'
	import CommentList from '@/views/pictureDetail/CommentList/index.vue'
	import Footer from '@/views/pictureDetail/Footer/index.vue'
	import UserProfile from '@/components/UserProfile/index.vue'
	import Ranking from '@/components/Ranking/index.vue'
	import FixedDescription from '@/views/pictureDetail/FixedDescription/index.vue'
	import AnnotateContent from '@/views/pictureDetail/AnnotateContent/index.vue'

	import { useNavigation } from '@/hooks/useNavigation.js'
	import { useScrollToElement } from '@/hooks/useScrollToElement.js'
	import { usePictureDetailStore } from '@/stores/pictureDetail'
	import { useLotteryStore } from '@/stores/lottery'
	import { getLotteryResultApi, getLastLotteryResultApi } from '@/api/lottery'
	import { getPictureExplanationList, getPictureDetail } from '@/api/picture'

	const { toRoute } = useNavigation()
	const { scrollToElement } = useScrollToElement()
	const { lotteryType } = storeToRefs(useLotteryStore())
	const { setYear, setPeriod, getIssueParam, setPeriodFull } =
		usePictureDetailStore()
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
	const title = _get(props.params, 'title', '')
	const headerTitle = (() => {
		return title ? `${title}第${props.params.period}期` : '无标题'
	})()
	const commentRef = ref(null)
	const lastIssue = ref('')

	// 取得 SSR 環境的傳入的初始值
	detailData.value = _get(props.data, 'pictureDetailResult.data', {})

	const postIdMap = new Map()
	const page = ref(Math.floor(_get(props.params, 'currentIndex') / 10) + 1)
	const size = 25
	const total = ref(0)
	const isFinished = ref(false)
	const isLast = ref(true)
	const currentIndex = ref(+_get(props.params, 'currentIndex'))

	provide('data', _get(props, 'data', {}))

	const getLotteryResult = async () => {
		const response = await getLotteryResultApi({
			lotteryType: lotteryType.value,
			year: year.value,
			issue: getIssueParam(),
		})
		lotteryData.value = _get(response, 'data', {})
		return response
	}

	const seeNextIssuePaper = async () => {
		const nextIndex = +currentIndex.value + 1
		const lastKey = Math.max(...Array.from(postIdMap.value.keys()))

		if (nextIndex >= lastKey && !isFinished.value) {
			page.value += 1
			const resp = await getPictureExplanationList({
				page: page.value,
				size,
				issueId: detailData.value?.issueId,
			})
			if (!resp.success) return

			const newData = _get(resp, 'data.list', [])
			if (!newData.length) {
				isFinished.value = true
			}

			const startIndex = (+page.value - 1) * 25
			newData.forEach((item, index) => {
				const mapKey = startIndex + index
				postIdMap.value.set(mapKey, item.postId)
			})

			total.value = +_get(resp, 'data.total', 0)
			isFinished.value = nextIndex >= total.value
		}

		let nextPostId = postIdMap.value.get(nextIndex)
		if (!nextPostId) {
			console.warn('沒找到下一則postId')
			return
		}

		const res = await getPictureDetail({
			issueId: detailData.value?.issueId,
			postId: nextPostId,
		})
		if (!res.success) return

		detailData.value = _get(res, 'data', {})
		currentIndex.value = nextIndex

		isLast.value = currentIndex.value == lastKey
	}

	watch([year, period], ([newYear, newPeriod]) => {
		if (!initDone.value) return
		getLotteryResult()
	})

	onMounted(() => {
		let issueFull = String(_get(detailData.value, 'issue', 0))
		let issueShort = issueFull.length > 3 ? issueFull.slice(-3) : issueFull

		// 更新期數和年份
		setPeriodFull(issueFull)
		setPeriod(+issueShort)
		setYear(+_get(detailData.value, 'year', 0))

		getLastLotteryResultApi({
			lotteryType: lotteryType.value,
		}).then((res) => {
			lastIssue.value = _get(res, 'data.nextIssue', '')
		})

		setTimeout(() => {
			initDone.value = true //避免上面初始更新store的年份 期數觸發watch
		}, 1000)

		getLotteryResult().then(() => {
			nextTick(() => {
				// 58 = header 45 + margin 15 - lotteryResult 陰影 2
				scrollToElement({ target: '#scrollToTargetElement', offset: -58 })
			})
		})

		getPictureExplanationList({
			page: page.value,
			size,
			issueId: detailData.value.issueId,
		}).then((res) => {
			const newList = _get(res, 'data.list', [])
			const newMap = new Map()
			const startIndex = (+page.value - 1) * 25
			newList.forEach((item, index) => {
				const mapKey = startIndex + index
				newMap.set(mapKey, item.postId)
			})

			total.value = _get(res, 'data.total', 0)

			const lastKey = Math.max(...Array.from(newMap.keys()))
			isFinished.value = +lastKey + 1 >= total.value
			isLast.value = currentIndex.value == lastKey

			postIdMap.value = newMap
		})
	})
</script>
