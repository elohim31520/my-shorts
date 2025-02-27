<template>
	<div class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full max-w-480px">
		<NormalHeader title="选择图纸" :onBack="goBack" />

		<LotteryTypes
			class="fixed top-45 z-30"
			v-model:selectedType="lotteryType"
		/>

		<PictureSeriesTab
			:selectedFilters="selectedFilters"
			class="fixed top-85 z-30 w-full bg-#fafafa max-w-480px"
			@update:seriesActive="updateSeriesCode"
			isSelectorPageMode
			:pictureSeries="pictureSeries"
			v-model:selectedType="lotteryType"
		/>
		<div class="py-125 pb-65">
			<WaterfallKv v-if="isUseKV" :lotteryType="lotteryType" />
			<Waterfall
				v-if="!isUseKV"
				:apiParams="apiParams"
				:apiFunction="getPictureList"
			/>
		</div>

		<DrawScreening
			@updateData="updateWaterFallParams"
			:lotteryType="lotteryType"
		/>

		<div
			class="h-60 flex-y-center justify-evenly bg-#fff fixed bottom-0 w-full-limited z-6"
		>
			<van-button
				class="reset-button"
				:disabled="!selectedOptions.length"
				@click="handleReset"
			>
				重置
			</van-button>
			<van-button
				class="submit-button"
				:disabled="!selectedOptions.length"
				@click="handleSubmit"
			>
				提交
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { ref, onBeforeMount, computed, watch } from 'vue'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import PictureSeriesTab from '@/components/PictureSeriesTab/index.vue'
	import DrawScreening from '@/components/DrawScreening/index.vue'
	import Waterfall from '../../common/Waterfall/index.vue'
	import WaterfallKv from '../../common/WaterfallKv/index.vue'

	import { MESSAGE_TYPES, CLIENT_CODES } from '@/constants/chat'
	import { useWebSocket } from '@/hooks/useChatWebSocket'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'
	import { useSelector } from '../../common/useSelector'
	import { usePictureSeries } from '@/hooks/usePictureSeries.js'
	import {
		getLotteryTypeList,
		getOrDefault,
		getLotteryCode,
	} from '@/modules/util'
	import { getPictureList } from '@/api/picture'

	const { selectedOptions, handleReset } = useSelector()
	const { send } = useWebSocket()
	const { roomData } = useRoomData()
	const { showPicture } = useDisplayStates()
	const lotteryTypeList = getLotteryTypeList()
	const lotteryType = ref(getOrDefault(lotteryTypeList, '[0].key', ''))
	const { cacheSeries, fetchSeries } = usePictureSeries()

	const isUseKV = ref(true)
	const selectedFilters = ref({})
	const apiParams = ref({
		gameType: getLotteryCode(lotteryType.value),
	})
	const pictureSeries = ref([])

	const handleSubmit = () => {
		const { roomId, self } = roomData

		_forEach(
			selectedOptions,
			({
				issueId,
				imgPath,
				newspaperName,
				seriesName,
				likeCount,
				thumbnailImages,
			}) => {
				const data = {
					code: CLIENT_CODES.SEND_MESSAGE,
					roomId,
					type: MESSAGE_TYPES.PICTURE,
					userId: self.userId,
					msg: {
						issueId,
						imgPath,
						newspaperName,
						seriesName,
						likeCount,
						thumbnailImages,
					},
				}

				send(data)
			}
		)

		showPicture.value = false
		selectedOptions.splice(0, selectedOptions.length)
	}

	const updateWaterFallParams = async (params) => {
		handleReset()
		selectedFilters.value = params
		apiParams.value = params
		isUseKV.value = false
	}

	const updateSeriesCode = (seriesCode) => {
		handleReset()
		selectedFilters.value = {}
		if (!seriesCode) {
			isUseKV.value = true
			return
		}
		apiParams.value = {
			gameType: getLotteryCode(lotteryType.value),
			seriesCode,
		}
		isUseKV.value = false
	}

	const goBack = () => {
		showPicture.value = false
		selectedOptions.splice(0, selectedOptions.length)
	}

	onBeforeMount(async () => {
		await cacheSeries(lotteryType.value)
		pictureSeries.value = fetchSeries(lotteryType.value)
	})
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
</style>
