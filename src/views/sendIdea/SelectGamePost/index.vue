<template>
	<div>
		<!-- 選擇參賽 -->
		<van-popup
			v-model:show="showCategory"
			@close="onCloseCategory"
			class="rounded-10"
		>
			<div class="px-20 py-20">
				<div class="text-18 color-#434343 text-center font-600">请选择类型</div>
				<p class="text-18 color-#656565 pt-10">每人每期只能选择一种类型参赛</p>
				<ul class="flex w-full justify-between py-30">
					<li
						v-for="(vo, index) in predictionRules"
						:key="index"
						class="bg-#F2F2F2 color-#656565 text-16 py-5 rounded-10 w-30% text-center"
						:class="{
							'btn-active': vo.code == mainCategory,
							'btn-disable': playedCode.includes(vo.code),
						}"
						@click="changeCategory(vo.code)"
					>
						{{ vo.name }}
					</li>
				</ul>
				<van-button size="large" class="btn" @click="submitCategory">
					确认
				</van-button>
			</div>
		</van-popup>

		<!-- 選擇玩法 -->
		<van-popup v-model:show="showSelect" position="right" class="w-full">
			<div class="bg-#fafafa com-min-h-with-header">
				<NormalHeader
					:title="`参赛${selectedCategory.name}`"
					:onBack="() => (showSelect = false)"
				/>
				<div class="mt-45 default-h">
					<div
						class="pt-20 ml-10 text-18 color-#434343 font-600"
						@click="showChangeCategory = true"
					>
						类型:
						<span class="color-#34C759">{{ selectedCategory.name }}</span>
						<SvgIcon
							name="green_arrow_down"
							size="1.53125rem"
							class="color-primary inline-block"
						/>
					</div>
					<template v-for="(list, index) in infoList" :key="index">
						<div
							class="flex-center justify-between mx-10 py-10 color-#656565 text-14"
						>
							<div>
								请选择{{ selectedCategory.playRules[index]?.name }}：
								<span class="color-primary">
									{{ selectContent[index]?.length || 0 }} /
									{{ maxCount[index] }}
								</span>
							</div>
							<div class="text-14 color-#FC7E7E" @click="clearSelected(index)">
								清空
							</div>
						</div>
						<div
							class="shadow-[0_0_0.5rem_0_#0000001A] mb-10 rounded-10 p-10 mx-10 bg-#fff"
						>
							<div class="flex flex-col items-center">
								<div class="grid grid-cols-7 gap-12 rounded-10">
									<div
										class="col-span-1"
										v-for="item in list"
										@click="addContent(item, index)"
										:key="index"
									>
										<div class="rounded-25">
											<div class="relative">
												<div>
													<SvgIcon size="2.4375rem" name="ball-green" />
													<SvgIcon
														v-if="selectContent[index]?.includes(item)"
														size="0.9375rem"
														name="icon_choose_orange"
														class="absolute right--5 bottom-0 z-10"
													/>
												</div>

												<div
													class="w-100% h-100% absolute left-0 top-0 flex-y-center justify-center"
												>
													<div
														class="font-600 lh-20 color-#fff whitespace-nowrap"
														:class="[item.length >= 2 ? 'text-16' : 'text-20']"
													>
														{{ item }}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<template
							v-if="
								mainCategory != 27 &&
								infoList.length == index + 1 &&
								index + 1 < selectedCategory.playRules.length
							"
						>
							<van-button
								class="btn btn-add"
								@click="addNewPlayRules(index)"
								:disabled="isAddDisabled(index)"
							>
								<SvgIcon
									size="1.25rem"
									name="add_new_category"
									class="inline-block"
								/>
								添加{{ selectedCategory.playRules[index + 1]?.name }}
							</van-button>
						</template>
					</template>
				</div>
				<div
					class="sticky z-20 bottom-0 h-60 w-full px-9.75 mx-auto flex-y-center justify-between bg-#fff max-w-480px"
				>
					<div
						class="w-132 h-40 bg-#F2F2F2 color-#434343 font-600 text-18 rounded-8 flex-center mr-10"
						@click="resetSelection"
					>
						重置
					</div>
					<van-button
						class="min-w-215.5 h-40 flex-center rounded-8 bg-primary color-#fff btn"
						@click="publishContent"
						:disabled="isSubmitDisabled"
					>
						提交
					</van-button>
				</div>
			</div>
		</van-popup>

		<!-- 切換玩法 -->
		<van-popup v-model:show="showChangeCategory" position="bottom" round>
			<div
				class="font-600 text-20 color-#434343 text-center py-10 border-b border-[#E0E0E0]"
			>
				类型:
			</div>
			<ul class="flex-center flex-col py-20">
				<li
					v-for="(vo, index) in predictionRules"
					:key="index"
					class="font-400 text-18 color-#434343 py-8 w-80% text-center bg-#F2F2F2 rounded-10 mb-20"
					:class="{
						'btn-active': vo.code == mainCategory,
						'btn-disable': playedCode.includes(vo.code),
					}"
					@click="changeCategory(vo.code, true)"
				>
					{{ vo.name }}
				</li>
			</ul>
		</van-popup>
	</div>
</template>

<script setup>
	import { ref, computed, watch } from 'vue'
	import { postPredictionRules, allNumInfo } from '@/api/material'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { toast } from '@/modules/util'

	const props = defineProps({
		gameType: {
			type: String,
			default: '',
		},
		predictionShow: {
			type: Boolean,
			default: false,
		},
		predictedCode: {
			type: Array,
			default: () => [],
		},
	})

	const emit = defineEmits(['closeCategory', 'submitPrediction'])

	const { gameType } = props
	const predictionRules = ref([])
	const mainCategory = ref(null)
	const showCategory = ref(false)
	const showSelect = ref(false)
	const selectedCategory = computed(
		() =>
			predictionRules.value.find(
				(item) => item.code === mainCategory.value
			) || { playRules: [] }
	)
	const allNumInfoList = ref([])
	const infoList = ref([])
	const selectContent = ref([])
	const minCount = ref([])
	const maxCount = ref([])
	const predictionParams = ref({})
	const showChangeCategory = ref(false)
	const playedCode = ref([])

	function onCloseCategory() {
		emit('closeCategory')
	}

	function changeCategory(code, dropDown = false) {
		if (playedCode.value.includes(code)) return
		selectContent.value = []
		infoList.value = []
		minCount.value = []
		maxCount.value = []
		mainCategory.value = code
		if (dropDown) {
			submitCategory()
			showChangeCategory.value = false
		}
	}

	function addContent(item, index) {
		if (!Array.isArray(selectContent.value[index])) {
			selectContent.value[index] = []
		}
		if (infoList.value.length != index + 1) return
		const repeatIndex = selectContent.value[index].indexOf(item)

		if (repeatIndex !== -1) {
			selectContent.value[index].splice(repeatIndex, 1)
			return
		}
		if (selectContent.value[index].length >= maxCount.value[index]) {
			toast(
				`最多选择${maxCount.value[index]}个, 最少${minCount.value[index]}个`
			)
			return
		}
		selectContent.value[index].push(item)
	}

	function addNewPlayRules(index) {
		const nextPlayRule = selectedCategory.value.playRules[index + 1]
		const currentPlayRule = selectedCategory.value.playRules[index]

		minCount.value.push(nextPlayRule.min)
		maxCount.value.push(nextPlayRule.max)

		const filterArr = [
			...new Set(
				allNumInfoList.value.numInfo
					.filter((item) =>
						selectContent.value[index].includes(item[currentPlayRule.source])
					)
					.map((item) => item[nextPlayRule.source])
			),
		]
		filterArr.sort(
			(a, b) =>
				allNumInfoList.value[nextPlayRule.source].indexOf(a) -
				allNumInfoList.value[nextPlayRule.source].indexOf(b)
		)
		infoList.value.push(filterArr)
	}

	const isAddDisabled = computed(() => (index) => {
		return (selectContent.value[index]?.length || 0) < maxCount.value[index]
	})

	const isSubmitDisabled = computed(() => {
		return (selectContent.value[0]?.length || 0) != maxCount.value[0]
	})

	function clearSelected(index) {
		if (index === 0) {
			selectContent.value = []
			infoList.value = infoList.value.slice(0, 1)
		} else {
			selectContent.value.splice(index)
			infoList.value.splice(index)
		}
	}

	function resetSelection() {
		selectContent.value = []
		infoList.value = infoList.value.slice(0, 1)
	}

	function publishContent() {
		predictionParams.value = {
			id: selectedCategory.value.id,
			name: selectedCategory.value.name,
			list: selectContent.value.map((item, index) => {
				const sortItems = [...item].sort(
					(a, b) =>
						allNumInfoList.value[
							selectedCategory.value.playRules[index].source
						].indexOf(a) -
						allNumInfoList.value[
							selectedCategory.value.playRules[index].source
						].indexOf(b)
				)
				return {
					playTypeCode: selectedCategory.value.playRules[index].code,
					predict: sortItems,
				}
			}),
		}
		emit('submitPrediction', predictionParams.value)
		showSelect.value = false
		onCloseCategory()
	}

	async function submitCategory() {
		if (!mainCategory.value) {
			toast('请选择类型')
			return
		}
		showSelect.value = true
		if (!Object.keys(allNumInfoList.value).length) await getAllNumInfo()
		if (!infoList.value.length) {
			infoList.value.push(
				allNumInfoList.value[`${selectedCategory.value.playRules[0].source}`]
			)
			minCount.value.push(selectedCategory.value.playRules[0].min)
			maxCount.value.push(selectedCategory.value.playRules[0].max)
		}
	}

	async function getPredictionRules() {
		const res = await postPredictionRules({ gameType })
		predictionRules.value = _get(res, 'data', [])
	}

	async function getAllNumInfo() {
		const res = await allNumInfo()
		allNumInfoList.value = _get(res, 'data', [])
	}

	watch(
		() => props.predictionShow,
		async (value) => {
			showCategory.value = value
			if (value) await getPredictionRules()
		}
	)

	watch(
		() => props.predictedCode,
		(value) => {
			playedCode.value = value
		}
	)

	watch(
		() => props.gameType,
		(value) => {
			mainCategory.value = null
		}
	)
</script>

<style lang="scss" scoped>
	.btn {
		border-radius: 0.5rem;
		line-height: 2.5;
		height: 2.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		background-color: #34c759;
		color: #fff;
		border: none;
	}
	.btn-add {
		display: block;
		margin: 0.625rem auto 0;
	}
	.btn-active {
		background-color: #f1fee6;
		color: #34c759;
		border: 1px solid #34c759;
		font-weight: 600;
	}
	.van-popup--bottom {
		z-index: 10000 !important;
	}
	.default-h {
		min-height: calc(100dvh - 6.5625rem);
		max-width: 480px;
		margin-right: auto;
		margin-left: auto;
	}
	.btn-disable {
		opacity: 0.5;
	}
</style>
