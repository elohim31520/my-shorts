<template>
	<div
		class="bg-#fafafa min-h-100dvh fixed top-0 left-0 z-99 w-full"
		v-show="show"
	>
		<div class="max-w-480px mx-auto">
			<NormalHeader title="选择图纸" :onBack="goBack" />
			<LotteryTypes
				class="fixed top-45 z-30"
				v-model:selectedType="selectedLottery"
			/>
			<div
				class="fixed top-85 z-30 w-full max-w-480px bg-#fff h-35 shadow-[0_-0.125rem_0.75rem_0_#0000001A] flex justify-around rounded-t-10 text-14 px-10 text-center"
			>
				<swiper
					:modules="[Virtual]"
					virtual
					:slides-per-view="5"
					:space-between="5"
					@swiper="initSwiper"
				>
					<swiper-slide
						v-for="(item, index) in tabItems"
						:key="index"
						class="lh-35 flex-center cursor-pointer"
						:class="getTabItemClass(item)"
						@click="clickSeriesTab(item)"
						:virtualIndex="index"
					>
						<p>{{ item.seriesShortName }}</p>
					</swiper-slide>
				</swiper>

				<span
					class="w-55 shrink-0 flex-center color-primary cursor-pointer"
					@click="drawScreeningStore.open"
				>
					+更多
				</span>
			</div>

			<SelectedFiltersDisplay
				v-if="showSelectedFilters"
				:selectedFilters="selectedFilters"
				class="bt-#E7E7E7 fixed top-120 z-30 w-full-limited"
			/>

			<div
				:class="[showSelectedFilters ? 'pt-155' : 'pt-125']"
				class="pb-65 overflow-scroll max-h-100dvh scrollbar-hide"
				v-if="shouldRenderWaterfall"
			>
				<Waterfall2 />
			</div>

			<DrawScreening
				@updateData="updateapiParams"
				:lotteryType="selectedLottery"
			/>

			<div
				class="h-60 flex-y-center justify-evenly bg-#fff fixed bottom-0 w-full max-w-480px z-6"
			>
				<van-button
					class="reset-button"
					:disabled="noSelectedPicture"
					@click="resetPicture"
				>
					重置
				</van-button>
				<van-button
					class="submit-button"
					:disabled="noSelectedPicture"
					@click="submit"
				>
					提交
				</van-button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch, computed, nextTick } from 'vue'
	import { storeToRefs } from 'pinia'
	import { Virtual } from 'swiper/modules'

	import DrawScreening from '@/components/DrawScreening/index.vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import SelectedFiltersDisplay from '@/components/SelectedFiltersDisplay/index.vue'
	import Waterfall2 from './Waterfall2/index.vue'

	import { useDrawScreeningStore } from '@/stores/drawScreening.js'
	import { useLotteryStore } from '@/stores/lottery'
	import { useSelector } from './useSelector'
	import { usePictureSeries } from '@/hooks/usePictureSeries'
	import { getLotteryTypeList, getLotteryCode } from '@/modules/util'
	import { useWaterfall } from './useWaterfall'

	const lotteryTypeList = getLotteryTypeList()
	const show = defineModel('show')
	const emit = defineEmits(['pictureSelected'])
	const { lotteryType } = storeToRefs(useLotteryStore())
	const { cacheSeries, fetchSeries } = usePictureSeries()

	const {
		selectedPicture,
		selectedLottery,
		selectedSeriesCode,
		pictureSeries,
	} = useSelector()

	const {
		onLoad,
		reset: resetWaterfall,
		isUseKV,
		cacheGalleriesKV,
		apiParams,
		RECOMMEND_CODE,
	} = useWaterfall()

	const props = defineProps({
		initialSeriesCode: {
			type: String,
			require: true,
		},
		picture: {
			type: Object,
			default: () => ({}),
		},
	})

	const skipWatchEffect = ref(true)

	const noSelectedPicture = computed(() => {
		return _isEmpty(selectedPicture.value)
	})

	const resetPicture = () => {
		selectedPicture.value = {}
	}

	const goBack = () => {
		show.value = false
	}

	const submit = () => {
		show.value = false
		const picture = selectedPicture.value

		const seriesCode = _get(picture, 'seriesCode', '')
		const gameType = _get(picture, 'gameType', '')

		const series = fetchSeries(selectedLottery.value)

		const selectedLotteryType = lotteryTypeList.find(
			(vo) => vo.code == gameType
		)
		const selectedSeries = _find(series, { seriesCode })

		if (!selectedLotteryType || !selectedSeries) {
			console.error(
				'未找到對應的 LotteryType 或 Series',
				selectedLotteryType,
				selectedSeries
			)
			return
		}
		emit('pictureSelected', {
			picture,
			series: selectedSeries,
			lotteryType: selectedLotteryType.key,
		})
	}

	const drawScreeningStore = useDrawScreeningStore()

	let swiperInstance

	// 圖標映射
	const iconMapping = {
		isRecommended: '',
		isHot: 'fire',
		isTop: 'no1',
		isSelected: '',
		isBloom: '',
	}

	const selectedFilters = ref({})
	const shouldRenderWaterfall = ref(false)

	const showSelectedFilters = computed(
		() => !!selectedFilters.value?.seriesName
	)

	const tabItems = computed(() => {
		const tabs = _map(pictureSeries.value, (item) => ({
			...item,
			icon: getIcon(item),
		}))

		// 頭部添加“推薦”選項
		if (tabs.length) {
			tabs.unshift({
				seriesName: '推荐',
				seriesShortName: '推荐',
				seriesCode: RECOMMEND_CODE,
			})
		}
		return tabs
	})

	// 根據項目屬性獲取對應的圖標名稱
	function getIcon(item) {
		for (const [key, iconName] of _entries(iconMapping)) {
			if (item[key] === 'y') {
				return iconName
			}
		}
		return null
	}

	// 根據項目是否被選中或其他條件返回相應的 CSS 類名
	function getTabItemClass(item) {
		if (selectedSeriesCode.value === item.seriesCode)
			return 'color-#434343 font-bold'
		if (item.class) return item.class
		return 'color-#aeaeb1'
	}

	async function clickSeriesTab(item = {}) {
		// 如果項目有回調函數，則執行回調
		if (_isFunction(item.callback)) {
			item.callback()
			return
		}
		resetPicture() //改為切換系列也要清除上次所選
		apiParams.value = {} //清除上次設定的條件
		selectedFilters.value = {}
		selectedSeriesCode.value = item.seriesCode
		isUseKV.value = selectedSeriesCode.value == RECOMMEND_CODE
		if (isUseKV.value) {
			apiParams.value.gameType = getLotteryCode(selectedLottery.value) //kv往下捲到api時要用這個參數
			await cacheGalleriesKV(selectedLottery.value)
			resetWaterfall()
			await nextTick()
			onLoad()
		} else {
			resetWaterfall()
			onLoad()
		}
	}

	const updateapiParams = async (params) => {
		isUseKV.value = false
		selectedSeriesCode.value = params.seriesCode //同步系列tab
		scrollToSeries(selectedSeriesCode.value)
		selectedFilters.value = params
		apiParams.value = params

		resetWaterfall()
		onLoad()
	}

	const initSwiper = (swiper) => {
		swiperInstance = swiper
	}

	function scrollToSeries(seriesCode) {
		if (!seriesCode) swiperInstance.slideTo(0)

		const index = _findIndex(
			tabItems.value,
			(item) => item.seriesCode == seriesCode
		)

		if (index !== -1 && swiperInstance) {
			swiperInstance.slideTo(index)
		}
	}

	watch(
		() => props.initialSeriesCode,
		(newVal) => {
			// 外部選系列，清掉圖紙
			selectedPicture.value = {}
			selectedSeriesCode.value = newVal
		}
	)

	const syncLottery = () => {
		//有圖片同步圖的彩種，否則同步全局的
		const gameType = _get(props, 'picture.gameType', '')
		const lastLotteryType = _get(
			lotteryTypeList.find((vo) => vo.code == gameType),
			'key',
			''
		)
		selectedLottery.value = lastLotteryType || lotteryType.value
	}

	const syncPicture = () => {
		selectedPicture.value = props.picture || {}
	}

	watch(
		() => show.value,
		async (show) => {
			if (show) {
				//與外部同步資料
				syncLottery()
				await cacheSeries(selectedLottery.value)
				pictureSeries.value = fetchSeries(selectedLottery.value)
				syncPicture()
				//同步外部選的系列
				selectedSeriesCode.value =
					props.initialSeriesCode ||
					_get(props, 'picture.seriesCode') ||
					RECOMMEND_CODE

				scrollToSeries(selectedSeriesCode.value)

				isUseKV.value = selectedSeriesCode.value == RECOMMEND_CODE
				shouldRenderWaterfall.value = true
				skipWatchEffect.value = false

				resetWaterfall()
				onLoad()
			} else {
				shouldRenderWaterfall.value = false //必免在外部切換彩種or系列導致內部waterfall一直重取
				skipWatchEffect.value = true
				apiParams.value = {}
			}
		},
		{
			immediate: true, //立即執行的原因是有父層使用該組件有加v-if
		}
	)

	watch(
		() => selectedLottery.value,
		async (newVal) => {
			if (skipWatchEffect.value) {
				return
			}
			await cacheSeries(newVal)
			pictureSeries.value = fetchSeries(newVal)

			scrollToSeries()
			window.scrollTo(0, 0)
			await cacheGalleriesKV(newVal)

			resetPicture() //改為切換系列也要清除上次所選
			apiParams.value = {} //清除上次設定的條件
			selectedFilters.value = {}
			apiParams.value.gameType = getLotteryCode(selectedLottery.value) //kv往下捲到api時要用這個參數
			isUseKV.value = true
			selectedSeriesCode.value = RECOMMEND_CODE

			resetWaterfall()
			await nextTick()
			onLoad()
		}
	)
</script>

<style lang="scss" scoped>
	.van-button {
		height: 2.5rem;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.van-button.reset-button {
		width: 8.25rem;
		background-color: #f2f2f2;
		color: #434343;
	}

	.van-button.submit-button {
		width: 13.4688rem;
		background-color: #34c759;
		color: #fff;
	}

	.van-button.van-button--disabled {
		background-color: #f2f2f2;
		color: #aeaeb1;
		opacity: 1;
	}

	.scrollbar-hide {
		@include scrollbar-hidden;
	}
</style>
