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
			<UserProfile :userId="predictDetail.userId" :time="params.postTime" />
			<Ranking :userId="predictDetail.userId" />
		</div>

		<div class="px-10">
			<div class="mb-20">
				<Card class="mt-16" :detailData="pictureDetail">
					<div class="p-10 lh-24 w-full color-#434343">
						<div class="flex-y-center mb-10">
							{{ predictDetail.playTypeName }} -
							{{ predictDetail.playTypeSubName }}
						</div>
						<div
							v-if="userPredict && userPredict.length"
							class="grid grid-cols-7 gap-[auto] gap-y-8"
						>
							<div
								v-for="vo in userPredict"
								:key="vo"
								class="relative w-full h-full flex-y-center justify-center"
							>
								<SvgIcon size="2.5rem" :name="getBallColor(vo)" />
								<span
									class="text-white absolute top-50% left-50% text-16 translate-x--50% translate-y--50% whitespace-nowrap"
								>
									{{ vo }}
								</span>
							</div>
						</div>
					</div>
				</Card>
			</div>

			<div class="w-full flex-y-center mb-10 color-#434343">
				<div class="font-700 text-18 lh-24.515">查看图解</div>
				<a
					class="ml-auto flex-y-center text-14"
					:href="
						toRoute('pictureExplanation', {
							title: pictureDetail.newspaperName,
							period: pictureDetail.issue,
							issueId: pictureDetail.issueId,
							year: pictureDetail.year,
						})
					"
				>
					<div class="flex-y-center">
						<div class="mr-1">其他图解</div>
						<svgIcon name="arrow_right" size="1.25rem" />
					</div>
				</a>
			</div>

			<AnnotateContent :description="pictureDetail.annotateContent" />
		</div>

		<CommentList
			ref="commentRef"
			:issueId="pictureDetail.issueId"
			class="mt-20"
		/>
		<Footer :detailData="pictureDetail" @afterReply="commentRef.reset()" />

		<!-- 絕對定位的圖解 -->
		<FixedDescription
			:description="pictureDetail.annotateContent"
			v-show="showStory"
		/>
	</div>
</template>

<script setup>
	import { ref, computed, provide, onMounted, nextTick } from 'vue'
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
	import { getPredictionDetail } from '@/api/picture'

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

	const pictureDetail = ref(_get(props.data, 'pictureDetailResult.data', {}))
	const predictDetail = ref({})
	const initDone = ref(false)
	const lotteryData = ref({})

	const headerTitle = computed(() => {
		return predictDetail.value.predictTitle
			? predictDetail.value.predictTitle
			: '无标题'
	})
	const commentRef = ref(null)
	const lastIssue = ref('')

	const userPredict = computed(() => {
		return _get(predictDetail.value, 'predict', [])
	})

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

	const getBallColor = (vo) => {
		if (vo == '红') return 'ball-red'
		if (vo == '蓝') return 'ball-blue'
		return 'ball-green'
	}

	onMounted(() => {
		let issueFull = String(_get(pictureDetail.value, 'issue', 0))
		let issueShort = issueFull.length > 3 ? issueFull.slice(-3) : issueFull

		// 更新期數和年份
		setPeriodFull(issueFull)
		setPeriod(+issueShort)
		setYear(+_get(pictureDetail.value, 'year', 0))

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

		getPredictionDetail(_get(props.params, 'predictId')).then((res) => {
			predictDetail.value = _get(res, 'data', {})
		})
	})
</script>
