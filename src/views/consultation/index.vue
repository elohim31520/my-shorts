<template>
	<div>
		<NormalHeader title="查询工具" :isTop="true">
			<p
				class="pr-10 color-primary text-14 font-600"
				@click="showYearSelection = !showYearSelection"
			>
				{{ selectedYear }}年
			</p>
		</NormalHeader>

		<div class="fixed z-10 w-full max-w-480px mt-45">
			<!-- 年份選擇器 -->
			<div class="h-40 bg-#fafafa flex-y-center">
				<swiper :slides-per-view="4.58" :space-between="10" class="px-10">
					<swiper-slide
						v-for="(year, yearIndex) in availableYears"
						:key="yearIndex"
						class="lh-30 rounded-15 font-600 text-14 text-center bd-#e0e0e0"
						:class="{
							'bg-#f1fee6 color-primary bd-#34C759!': year === selectedYear,
						}"
						@click="selectYear(year)"
					>
						{{ year }}年
					</swiper-slide>
				</swiper>
			</div>

			<div
				class="toggle-section"
				:class="[showYearSelection ? 'move-down' : 'move-up']"
			>
				<!-- 查询操作栏 -->
				<div class="h-30 bg-#fafafa flex justify-between px-10">
					<div class="flex-y-center">
						<SvgIcon
							size="1.25rem"
							name="icon_Information Circle"
							class="mr-5"
							@click="showTipPopup = !showTipPopup"
						/>
						<p class="mr-6.5">仅显示出现的期数</p>
						<van-checkbox
							v-model="showOnlyHighlighted"
							shape="square"
							icon-size="0.9375rem"
							checked-color="#34C759"
						></van-checkbox>
					</div>
					<div class="flex-y-center cursor-pointer" @click="toggleFilterPanel">
						<p>查询条件</p>
						<SvgIcon size="1.25rem" name="icon_Log_arrow" class="mr-4" />
					</div>
				</div>

				<!-- 表頭 -->
				<ul
					class="h-35 bg-#F2F2F2 flex-y-center text-14 color-#656565 text-center"
				>
					<li
						v-for="(header, headerIndex) in columnHeaders"
						:key="headerIndex"
						class="w-12.5%"
					>
						{{ header }}
					</li>
				</ul>
			</div>
		</div>

		<!-- 數據展示區域 -->
		<div
			class="relative padding-slide"
			:class="[showYearSelection ? 'move-down' : 'move-up']"
		>
			<ul class="text-center text-14 color-#434343">
				<li
					v-for="(record, recordIndex) in filteredRecords"
					:key="record.yearAndIssue"
					:class="{ 'even:bg-#FAFAFA': recordIndex % 2 === 1 }"
				>
					<ul class="flex-y-center justify-between h-33">
						<li
							v-for="(number, numberIndex) in record.processedNumbers"
							:key="numberIndex"
							class="w-12.5% flex-x-center"
						>
							<div
								v-if="number.isHighlighted"
								class="w-22 h-22 rounded-full color-#F2F2F2 z-5"
								:style="{ backgroundColor: `${number.color}` }"
								ref="highlightedNumberRefs"
							>
								{{ number.value }}
							</div>
							<div v-else>{{ number.value }}</div>
						</li>
					</ul>
				</li>
			</ul>

			<!-- 連線線條 -->
			<svg class="absolute w-full h-full left-0 top-0">
				<polyline
					v-if="polylinePoints && shouldDrawPolyline"
					:points="polylinePoints"
					class="fill-transparent stroke-#FA2A42 stroke-2"
				/>
			</svg>
		</div>

		<!-- 查詢條件操作面板 -->
		<van-action-sheet v-model:show="showFilterPanel" title="查询条件">
			<div class="relative overflow-y-scroll">
				<div class="px-9.75 pb-60">
					<!-- 主選項 -->
					<h3 class="mb-10 text-18 font-600">属性</h3>
					<div class="grid grid-cols-3 gap-x-8 gap-y-10 mb-30">
						<div
							v-for="(category, categoryIndex) in filterCategories"
							:key="categoryIndex"
							class="h-33 flex-center bg-#F2F2F2 rounded-8 box-border cursor-pointer"
							:class="{
								'bg-#F4FFE8 bd-#34C759 color-primary':
									selectedFilterCategoryKey === category.key,
							}"
							@click="selectFilterCategory(category.key)"
						>
							{{ category.label }}
						</div>
					</div>

					<!-- 子選項 -->
					<div>
						<div class="flex-y-center mb-10">
							<h3 class="mr-10 text-18 font-600">
								{{ currentSubOptions.label }}
							</h3>
							<span
								v-if="currentSubOptions.maxSelections > 1"
								class="text-12 color-#AEAEB1"
							>
								最多选{{ currentSubOptions.maxSelections }}个选项
							</span>
						</div>
						<div
							class="grid gap-x-8 gap-y-10"
							:style="{
								'grid-template-columns': `repeat(${currentSubOptions.columnCount},minmax(0,1fr))`,
							}"
						>
							<div
								v-for="(option, optionIndex) in currentSubOptions.options"
								:key="optionIndex"
								class="flex-center h-33 bg-#F2F2F2 rounded-8 box-border relative cursor-pointer"
								:class="{
									'bg-#F4FFE8 bd-#34C759 color-primary': isOptionSelected(
										option.key
									),
								}"
								@click="toggleOptionSelection(option.key)"
							>
								<p>{{ option.label }}</p>
								<div
									v-if="shouldDisplaySelectionOrder(option.key)"
									class="absolute -bottom-1 -right-1 w-15 h-15 rounded-full bg-primary color-#fff flex-center"
								>
									<span class="text-mini-10">
										{{ getOptionSelectionOrder(option.key) }}
									</span>
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
						class="w-132 h-40 bg-#E0E0E0 color-#434343 font-600 text-18 rounded-8 flex-center cursor-pointer"
						@click="resetAllFilters"
					>
						重置
					</div>
					<div
						class="w-215.5 h-40 flex-center rounded-8 bg-primary color-#fff cursor-pointer"
						@click="applyFilters"
					>
						确认
					</div>
				</div>
			</div>
		</van-action-sheet>

		<!-- 操作提示彈窗 -->
		<van-popup
			v-model:show="showTipPopup"
			:class="[showYearSelection ? 'top-130!' : 'top-90!']"
		>
			<div class="color-#434343">
				<h3 class="text-18 font-600">查询助手</h3>
				<p class="mb-6">
					选择条件可查询号码等条件的历史出现位置。目前提供的条件有：号码、生肖、五行、波色、家野、尾数。
				</p>
				<h3 class="text-18 font-600">如何使用</h3>
				<p>
					选择条件可查询号码等条件的历史出现位置。目前提供的条件有：号码、生肖、五行、波色、家野、尾数。
				</p>
			</div>
		</van-popup>
	</div>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		onBeforeUnmount,
		nextTick,
		provide,
		watch,
		reactive,
	} from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { getConsultationApi } from '@/api/toolbox'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)

	// 查詢條件操作面板顯示與否
	const showFilterPanel = ref(false)

	// 操作提示彈窗
	const showTipPopup = ref(false)

	// 年份選擇面板顯示與否
	const showYearSelection = ref(false)

	// 從數據中提取可用年份和開獎資料
	const availableYears = _get(props.data, 'lotteryYear.data.list', [])
	const consultationRecords = ref(
		_get(props.data, 'consultation.data.rols', [])
	)

	// 表頭標題行
	const columnHeaders = ['期数', '一', '二', '三', '四', '五', '六', '特码']

	// 當前選中的年份
	const selectedYear = ref(availableYears[0] || new Date().getFullYear())

	// 僅顯示出現的期數
	const showOnlyHighlighted = ref(false)

	// 引用所有高亮號碼，用於計算連線點
	const highlightedNumberRefs = ref([])

	// 儲存 SVG polyline 的點
	const polylinePoints = ref('')

	// 高亮颜色数组，用於高亮多個篩選出的不同號碼
	const highlightColors = ['#ff0000', '#0000ff', '#008000'] // 红、蓝、绿

	// 過濾器類別
	const filterCategories = [
		{
			key: 1,
			label: '数字',
			maxSelections: 3,
			columnCount: 6,
			options: Array.from({ length: 49 }, (_, i) => ({
				key: _padStart(i + 1, 2, '0'),
				label: i + 1,
			})),
		},
		{
			key: 2,
			label: '生肖',
			maxSelections: 3,
			columnCount: 6,
			options: [
				{ key: '鼠', label: '鼠' },
				{ key: '牛', label: '牛' },
				{ key: '虎', label: '虎' },
				{ key: '兔', label: '兔' },
				{ key: '龙', label: '龙' },
				{ key: '蛇', label: '蛇' },
				{ key: '马', label: '马' },
				{ key: '羊', label: '羊' },
				{ key: '猴', label: '猴' },
				{ key: '鸡', label: '鸡' },
				{ key: '狗', label: '狗' },
				{ key: '猪', label: '猪' },
			],
		},
		{
			key: 3,
			label: '五行',
			maxSelections: 1,
			columnCount: 5,
			options: [
				{ key: '金', label: '金' },
				{ key: '木', label: '木' },
				{ key: '水', label: '水' },
				{ key: '火', label: '火' },
				{ key: '土', label: '土' },
			],
		},
		{
			key: 4,
			label: '波色',
			maxSelections: 1,
			columnCount: 3,
			options: [
				{ key: '红波', label: '红波' },
				{ key: '蓝波', label: '蓝波' },
				{ key: '绿波', label: '绿波' },
			],
		},
		{
			key: 5,
			label: '家野',
			maxSelections: 1,
			columnCount: 2,
			options: [
				{ key: '家禽', label: '家禽' },
				{ key: '野兽', label: '野兽' },
			],
		},
		{
			key: 6,
			label: '尾数',
			maxSelections: 1,
			columnCount: 5,
			options: Array.from({ length: 10 }, (_, i) => ({
				key: _padStart(i, 1, '0'),
				label: `${i}尾`,
			})),
		},
	]

	// 當前選中的過濾類別 key
	const selectedFilterCategoryKey = ref(1)

	// 用來保存選中類別的子選項 key 值
	const selectedOptions = reactive({
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: [],
	})

	// 根據當前選擇的主選項獲取子選項
	const currentSubOptions = computed(() =>
		_find(
			filterCategories,
			(category) => category.key === selectedFilterCategoryKey.value
		)
	)

	// 檢查是否選中某個子選項
	const isOptionSelected = (optionKey) =>
		selectedOptions[selectedFilterCategoryKey.value].includes(optionKey)

	// 選擇或取消選擇子選項
	const toggleOptionSelection = (optionKey) => {
		const maxAllowed = getMaxAllowedSelections(selectedFilterCategoryKey.value)
		const currentSelections = selectedOptions[selectedFilterCategoryKey.value]

		if (currentSubOptions.value.maxSelections === 1) {
			// 如果最大選擇為1，清空原有選擇，添加新的選擇
			selectedOptions[selectedFilterCategoryKey.value] = [optionKey]
		} else {
			if (isOptionSelected(optionKey)) {
				// 如果已經選中，再次點選取消選擇
				selectedOptions[selectedFilterCategoryKey.value] =
					currentSelections.filter((key) => key !== optionKey)
			} else if (currentSelections.length < maxAllowed) {
				// 如果尚未選中，且沒有超過選擇上限，則新增選擇
				selectedOptions[selectedFilterCategoryKey.value].push(optionKey)
			}
		}
	}

	// 根據主選項獲取最多可選擇的子選項數量
	const getMaxAllowedSelections = (categoryKey) => {
		const category = filterCategories.find((cat) => cat.key === categoryKey)
		return category ? category.maxSelections : 0
	}

	// 選擇主選項
	const selectFilterCategory = (categoryKey) => {
		const previousCategoryKey = selectedFilterCategoryKey.value
		if (previousCategoryKey !== categoryKey) {
			// 清空之前類別的選項
			selectedOptions[previousCategoryKey] = []
		}
		// 更新當前選擇的類別
		selectedFilterCategoryKey.value = categoryKey
	}

	// 獲取子選項的選擇順序
	const getOptionSelectionOrder = (optionKey) => {
		const selections = selectedOptions[selectedFilterCategoryKey.value]
		const index = selections.indexOf(optionKey)
		return index !== -1 ? index + 1 : null
	}

	// 是否應該顯示選取順序
	const shouldDisplaySelectionOrder = (optionKey) =>
		getOptionSelectionOrder(optionKey) !== null &&
		currentSubOptions.value.maxSelections > 1

	// 切換過濾面板的顯示狀態
	const toggleFilterPanel = () => {
		showFilterPanel.value = !showFilterPanel.value
	}

	// 重置所有選擇的過濾器
	const resetAllFilters = () => {
		_forEach(_keys(selectedOptions), (key) => {
			selectedOptions[key] = []
		})
		selectedFilterCategoryKey.value = 1
	}

	// 確認並應用過濾器
	const applyFilters = () => {
		showFilterPanel.value = false
		getConsultation()
	}

	// 獲取開獎資料
	const getConsultation = async () => {
		const currentCategoryKey = selectedFilterCategoryKey.value
		const selectedValues = selectedOptions[currentCategoryKey]

		const consultationResponse = await getConsultationApi({
			year: selectedYear.value,
			queryType: currentCategoryKey,
			value: _join(selectedValues, ','),
		})

		consultationRecords.value = _get(consultationResponse, 'data.rols', [])
	}

	// 處理年份選擇
	const selectYear = (year) => {
		selectedYear.value = year
		getConsultation()
	}

	// 過濾後並處理開獎資料，是否高亮、高亮顏色為何、號碼去掉開頭的 0
	const filteredRecords = computed(() => {
		return _filter(
			_map(consultationRecords.value, (record) => {
				const {
					yearAndTerm,
					normal1,
					normal2,
					normal3,
					normal4,
					normal5,
					normal6,
					special,
				} = record
				const issue = yearAndTerm.split('-')[1]

				const numberFields = [
					normal1,
					normal2,
					normal3,
					normal4,
					normal5,
					normal6,
					special,
				]
				const processedNumbers = _map(numberFields, (number) => ({
					value: number.value.replace(/(^0+|波)/, ''),
					isHighlighted: number.right,
					color: number.right ? getHighlightColor(number.value) : '#ff0000',
				}))

				// 將期數添加到號碼列表的開頭，方便 for 操作
				processedNumbers.unshift({
					value: issue,
					isHighlighted: false,
					color: null,
				})

				// 判斷是否有高亮號碼
				const hasHighlightedNumber = _some(
					numberFields,
					(number) => number.right === 1
				)

				return {
					yearAndIssue: record.yearAndTerm,
					processedNumbers,
					hasHighlightedNumber,
					issue,
				}
			}),
			(record) => !showOnlyHighlighted.value || record.hasHighlightedNumber
		)
	})

	// 為高亮號碼分配顏色，保持相同數值的顏色一致
	const getHighlightColor = (value) => {
		const selectedNumbers = selectedOptions[selectedFilterCategoryKey.value]
		const index = selectedNumbers.indexOf(value)
		return highlightColors[index] || '#ff0000'
	}

	// 計算 polyline 點
	async function updatePolylinePoints() {
		await nextTick()

		if (shouldDrawPolyline.value) {
			const points = _map(highlightedNumberRefs.value, (highlightedNumber) => {
				const x =
					highlightedNumber.offsetLeft + highlightedNumber.offsetWidth / 2
				const y =
					highlightedNumber.offsetTop + highlightedNumber.offsetHeight / 2
				return `${x},${y}`
			})

			polylinePoints.value = points.join(' ')
		} else {
			polylinePoints.value = ''
		}
	}

	const shouldDrawPolyline = computed(() => {
		return (
			selectedFilterCategoryKey.value === 1 && selectedOptions[1].length <= 1
		)
	})

	// 防抖處理更新 polyline 點
	const debouncedUpdatePolylinePoints = _debounce(updatePolylinePoints, 300)

	watch(
		() => [
			consultationRecords.value,
			showOnlyHighlighted.value,
			showYearSelection.value,
		],
		debouncedUpdatePolylinePoints
	)

	onMounted(() => {
		updatePolylinePoints()
		// 監聽窗口大小變化，重新計算 polyline 點
		window.addEventListener('resize', debouncedUpdatePolylinePoints)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', debouncedUpdatePolylinePoints)
	})
</script>

<style lang="scss" scoped>
	.swiper {
		padding: 0 0.625rem;
		width: 100%;
		z-index: 0;
	}

	.swiper-slide {
		width: 19.63%;
		margin-right: 0.625rem;
	}

	.toggle-section {
		transition: transform 0.3s ease;

		&.move-up {
			transform: translateY(-2.5rem);
		}
		&.move-down {
			transform: translateY(0);
		}
	}

	.padding-slide {
		transition: padding-top 0.3s ease;
		&.move-up {
			padding-top: 6.875rem;
		}
		&.move-down {
			padding-top: 9.375rem;
		}
	}

	.van-popup--center {
		padding: 1.25rem;
		width: 20.625rem;
		transform: none;
		border-radius: 0.5rem;
		overflow-y: visible;

		&::after {
			content: '';
			position: absolute;
			top: -1.5rem;
			left: 1.25rem;
			border: 0.75rem solid transparent;
			border-left-width: 0.625rem;
			border-right-width: 0.625rem;
			border-bottom: 0.75rem white solid;
		}
	}

	:deep() {
		.van-badge__wrapper {
			border-radius: 0.3125rem;
		}

		.van-action-sheet__close {
			color: #434343;
		}

		.van-action-sheet {
			height: 33.75rem;
		}

		.van-action-sheet__header {
			font-size: 1.25rem;
		}

		.van-action-sheet__close {
			font-size: 1.375rem;
		}
	}
</style>
