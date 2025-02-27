<template>
	<div class="bg-#fafafa min-h-100dvh voice-creation">
		<NormalHeader title="参与竞猜" />

		<div class="px-10 mt-50">
			<div
				class="mb-10 flex-y-center font-600 text-18 pt-20"
				@click="showSelector = true"
			>
				<span class="color-#434343 mr-5">类型:</span>
				<span class="color-primary mr-5">
					{{ categoryData.predictionTypeName }}
				</span>
				<SvgIcon
					name="icon_HistoricalIottery_down"
					size="1.5625rem"
					class="color-primary"
				/>
				<div class="ml-a text-14 lh-19.07 color-#AEAEB1">
					已选择
					<span class="color-primary">
						{{ content.length }} / {{ categoryData.maxCount }}
					</span>
				</div>
			</div>

			<div
				class="mb-10 flex-y-center font-600 text-18 pt-20"
				@click="showPositionSelector = true"
				v-if="categoryData.position"
			>
				<span class="color-#434343 mr-5">位置:</span>
				<span class="color-primary mr-5">
					{{ positionOptionTitle }}
				</span>
				<SvgIcon
					name="icon_HistoricalIottery_down"
					size="1.5625rem"
					class="color-primary"
				/>
			</div>

			<!-- 預測項目選擇 -->
			<div class="shadow-[0_0_0.5rem_0_#0000001A] mb-10 rounded-10 p-10">
				<div class="flex flex-col items-center">
					<div class="grid grid-cols-6 gap-16.685 rounded-10">
						<div
							class="col-span-1"
							v-for="vo in options"
							:key="vo.name"
							@click="addContent(vo)"
						>
							<div class="rounded-25">
								<div class="relative">
									<div>
										<!-- 綠色的球 -->
										<SvgIcon size="2.4375rem" :name="`ball-${vo.color}`" />
										<!-- 橘色勾勾 -->
										<SvgIcon
											size="0.9375rem"
											name="icon_choose_orange"
											class="absolute right--5 bottom-0 z-10"
											v-if="content.includes(vo.name)"
										/>
									</div>

									<div
										class="w-100% h-100% absolute left-0 top-0 flex-y-center justify-center"
									>
										<div
											class="font-600 lh-20 color-#fff whitespace-nowrap"
											:class="[vo.name.length >= 2 ? 'text-16' : 'text-20']"
										>
											{{ vo.name }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- 操作按鈕 -->
	<div
		class="fixed bottom-0 h-60 w-full px-9.75 flex-y-center justify-between bg-#fff max-w-480px"
	>
		<div
			class="w-132 h-40 bg-#E0E0E0 color-#434343 font-600 text-18 rounded-8 flex-center"
			@click="resetSelection"
		>
			重置
		</div>
		<div
			class="min-w-215.5 h-40 flex-center rounded-8 bg-primary color-#fff"
			@click="publishContent"
		>
			发布竞猜
		</div>
	</div>

	<!-- 主要類型選擇 -->
	<van-action-sheet v-model:show="showSelector" title="类型">
		<div class="relative overflow-y-scroll">
			<div class="p-10 pt-30">
				<div
					class="grid grid-cols-3 gap-x-8 gap-y-10 color-#656565 text-center"
				>
					<div
						v-for="(vo, index) in guessList"
						:key="index"
						class="rounded-8 bg-#F2F2F2 py-5.5 bd-#F2F2F2 box-border"
						:class="{
							'bg-#F4FFE8 color-#34C759 bd-#34C759!':
								playTypeCode == vo.playTypeCode,
						}"
						@click="selectCategory(vo)"
					>
						{{ vo.predictionTypeName }}
					</div>
				</div>
			</div>
		</div>
	</van-action-sheet>

	<!-- 位置選擇 -->
	<van-action-sheet v-model:show="showPositionSelector" title="类型">
		<div class="relative overflow-y-scroll">
			<div class="p-10 pt-30">
				<div
					class="grid grid-cols-3 gap-x-8 gap-y-10 color-#656565 text-center"
				>
					<div
						v-for="vo in categoryData.position"
						:key="vo.id"
						class="rounded-8 bg-#F2F2F2 py-5.5 bd-#F2F2F2 box-border"
						:class="{
							'bg-#F4FFE8 color-#34C759 bd-#34C759!': positionId == vo.id,
						}"
						@click="doSelectPosition(vo)"
					>
						{{ vo.name }}
					</div>
				</div>
			</div>
		</div>
	</van-action-sheet>
</template>

<script setup>
	import { ref, computed, onMounted, onBeforeMount } from 'vue'
	import { storeToRefs } from 'pinia'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import {
		toast,
		isLogin,
		redirect,
		getCurrentLotteryType,
	} from '@/modules/util'
	import { getPrimaryPlayTypes, submitPrediction } from '@/api/picture'
	import { getIPInfo } from '@/api/common'
	import { useLoginPopupStore } from '@/stores/loginPopup'
	import { Base64 } from 'js-base64'
	import { useLotteryStore } from '@/stores/lottery'

	const { lotteryType } = storeToRefs(useLotteryStore())

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
		params: {
			type: Object,
			default: () => ({}),
		},
	})

	const positionData = [
		{ id: 1, name: '正一' },
		{ id: 2, name: '正二' },
		{ id: 3, name: '正三' },
		{ id: 4, name: '正四' },
		{ id: 5, name: '正五' },
		{ id: 6, name: '正六' },
		{ id: 7, name: '特码' },
	]

	const apiData = ref([])
	const guessList = computed(() => {
		const list = apiData.value
		const hasPositionItem = ['单双', '波色', '大小']
		return _map(list, (vo) => {
			if (hasPositionItem.includes(vo.predictionTypeName)) {
				vo.position = positionData
			}
			return vo
		})
	})

	const showSelector = ref(false)
	const showPositionSelector = ref(false)

	const playTypeCode = ref()
	const positionId = ref(1)
	const content = ref([])
	const loading = ref(false)
	const ipBase64 = ref('')

	const categoryData = computed(() => {
		const data = guessList.value.find(
			(vo) => vo.playTypeCode == playTypeCode.value
		)
		return data || {}
	})

	const positionOptionTitle = computed(() => {
		const position = _get(categoryData.value, 'position')
		if (!position) return
		const name = position.find((vo) => vo.id == positionId.value)?.name
		return name
	})

	const playTypeSubCode = computed(() => {
		const list = _get(categoryData.value, 'children', [])
		if (!list.length) return
		const data = _find(list, (vo) => vo.maxCount == content.value.length)
		return _get(data, 'playTypeCode', '')
	})

	const options = computed(() => {
		const options = _get(categoryData.value, 'optionList', [])
		const list = options.reduce((accumulator, name, currentIndex) => {
			let color = 'green'
			if (name == '红') color = 'red'
			if (name == '蓝') color = 'blue'
			accumulator.push({
				name,
				disabled: content.value.map((e) => e.name).includes(name),
				color,
			})
			return accumulator
		}, [])
		return list
	})

	const selectCategory = (data) => {
		playTypeCode.value = data.playTypeCode
		content.value = []
		showSelector.value = false
	}

	const doSelectPosition = (data) => {
		positionId.value = data.id
		showPositionSelector.value = false
	}

	const addContent = (item) => {
		const index = content.value.indexOf(item.name)
		// 重複就刪除
		if (index !== -1) {
			content.value.splice(index, 1)
			return
		}

		if (item.disabled) return
		if (content.value.length >= categoryData.value.maxCount) {
			toast(
				`最多选择${categoryData.value.maxCount}个, 最少${categoryData.value.minCount}个`
			)
			return
		}
		content.value.push(item.name)
	}

	const publishContent = async () => {
		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return
		}
		if (loading.value) return
		if (!content.value.length) {
			toast('请选择发布内容')
			return
		}
		if (
			content.value.length > categoryData.value.maxCount ||
			content.value.length < categoryData.value.minCount
		) {
			toast(
				`最多选择${categoryData.value.maxCount}个, 最少${categoryData.value.minCount}个`
			)
			return
		}
		loading.value = true

		const res = await submitPrediction({
			bizFlag: 't',
			bizId: props.params.issueId,
			playTypeCode: playTypeCode.value,
			playTypeSubCode: playTypeSubCode.value,
			playTypeCheckNumberCode: positionId.value,
			// predictTitle,
			predict: content.value,
			fromIp: ipBase64.value,
		})
		loading.value = false
		if (res.success) {
			toast('发布成功')
			setTimeout(() => {
				redirect('/pictureGuess', {}, props.params)
			}, 500)
		}
	}

	const resetSelection = () => {
		content.value = []
	}

	onBeforeMount(async () => {
		const { code: gameType } = getCurrentLotteryType()
		const resp = await getPrimaryPlayTypes({ bizFlag: 't', gameType })
		apiData.value = _get(resp, 'data.list', [])
		playTypeCode.value = _get(apiData.value, '[0].playTypeCode', '')
	})

	onMounted(() => {
		getIPInfo().then((ipJson) => {
			ipBase64.value = Base64.encode(JSON.stringify(ipJson))
		})
	})
</script>

<style>
	.van-action-sheet__description {
		padding-top: 0.5rem !important;
		padding-bottom: 0.3125rem !important;
	}
</style>
