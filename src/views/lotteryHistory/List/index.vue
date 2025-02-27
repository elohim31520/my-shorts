<template>
	<div>
		<!-- <van-pull-refresh v-model="refreshing" @refresh="handleRefresh"> -->
		<!-- 頂部操作欄 -->
		<div
			class="fixed top-0 z-5 flex-y-center justify-between pt-95 px-10 mb-10 bg-#fafafa w-full max-w-480px"
		>
			<p class="text-18 font-600 color-#434343">{{ selectedYear }}年开奖记录</p>
			<div class="flex text-14 color-#434343">
				<!-- 紀錄排序切換按鈕 -->
				<div class="flex-center mr-10" @click="toggleSortOrder">
					<SvgIcon :name="sortOrderIcon" size="1.25rem" />
					<span>{{ sortOrderText }}</span>
				</div>
				<!-- 顯示五行信息開關 -->
				<div
					class="flex-center mr-10"
					:class="[showWs ? '' : 'color-#AEAEB1']"
					@click="toggleShowWs"
				>
					<SvgIcon
						:name="
							showWs
								? 'icon_HistoricalIottery_show'
								: 'icon_HistoricalIottery_hide'
						"
						size="1.25rem"
					/>
					<span>五行</span>
				</div>
				<!-- 平碼排序選擇 -->
				<div class="flex-center" @click="showPanel = true">
					<span>{{ selectedText }}</span>
					<SvgIcon name="icon_HistoricalIottery_down" size="1.25rem" />
				</div>
			</div>
		</div>

		<!-- 開獎記錄列表 -->
		<van-list
			v-model:loading="loading"
			class="pt-130"
			:finished="finished"
			:immediate-check="false"
			finished-text="没有更多了"
			@load="handleLoad"
		>
			<div
				class="px-10 mb-8"
				v-for="(item, index) in displayList"
				:key="index"
				@click="goToDetail(item)"
			>
				<div class="shadow-primary px-9 py-4 rounded-10 bg-#fff">
					<!-- 開獎信息標題 -->
					<div class="text-14 flex-y-center justify-between mb-5 px-6">
						<p class="color-#656565 text-14 font-600 lh-19">
							第{{ item.issue }}期开奖结果
						</p>
						<p class="color-#AEAEB1 text-12">
							{{ formatTimestamp(item.recordTime) }}
						</p>
					</div>

					<!-- 開獎號碼列表 -->
					<BallList :openCode="item.openCode" :showWs="showWs" />
				</div>
			</div>
		</van-list>
		<!-- </van-pull-refresh> -->

		<!-- 平碼排序選擇 -->
		<van-action-sheet v-model:show="showPanel" title="平码">
			<ul class="p-37.5 pt-27.5 text-18 text-center color-#434343">
				<li
					v-for="(action, index) in actions"
					:key="index"
					class="lh-40 [&:not(:last-child)]:mb-20 rounded-8 bg-#F2F2F2 bd-#F2F2F2"
					:class="{
						' bd-#34C759! bg-#F4FFE8 color-primary':
							selectedOrderType === action.value,
					}"
					@click="handleSelect(action)"
				>
					{{ action.text }}
				</li>
			</ul>
		</van-action-sheet>
	</div>
</template>

<script setup>
	import { ref, onMounted, inject, watch, computed, nextTick } from 'vue'
	import { getLotteryResultHistoryApi } from '@/api/lottery'
	import { formatTimestamp } from '@/modules/date'
	import { useLotteryStore } from '@/stores/lottery'
	import { navigateTo } from '@/modules/util'
	import BallList from '../BallList/index.vue'

	const props = defineProps({
		selectedYear: {
			type: Number,
			default: new Date().getFullYear(),
		},
	})

	const loading = ref(false)
	const finished = ref(false)
	const refreshing = ref(false)

	// 每次加載的項目數量
	const pageSize = 5

	// 當前加載的頁數
	const pageIndex = ref(1)

	// 是否顯示五行信息 2025 1/23 edison說改為默認開
	const showWs = ref(true)

	const SORT_ORDER = {
		DESCENDING: 0, // 降序
		ASCENDING: 1, // 升序
	}

	// 排序順序（0-降序，1-升序）
	const sortOrder = ref(SORT_ORDER.DESCENDING)

	// 開獎記錄列表
	const recordList = ref(_get(inject('data'), 'lotteryResultHistoryData', []))
	const displayList = ref(recordList.value)

	// 獲取彩票類型
	const { lotteryType } = useLotteryStore()

	// 控制排序選擇菜單的顯示
	const showPanel = ref(false)

	// 定義排序類型常量
	const ACTION_TYPE = {
		DEFAULT: 'default',
		ASCENDING: 'ascending',
		DESCENDING: 'descending',
	}

	// 排序選項列表
	const actions = [
		{ text: '默认', value: ACTION_TYPE.DEFAULT },
		{ text: '平码升序', value: ACTION_TYPE.ASCENDING },
		{ text: '平码降序', value: ACTION_TYPE.DESCENDING },
	]

	// 當前選中的排序文本和類型
	const selectedText = ref('默认')
	const selectedOrderType = ref(ACTION_TYPE.DEFAULT)

	watch(
		() => props.selectedYear,
		async (newValue) => {
			displayList.value = []
			pageIndex.value = 1
			await nextTick()
			await getLotteryResultHistory()
			finished.value = false
		}
	)

	// 監聽 recordList 的變化，保存原始開獎號碼順序
	watch(
		() => recordList.value,
		(newValue) => {
			_forEach(newValue, (record) => {
				if (!record.originOpenCode) {
					// 保存原始開獎號碼順序
					record.originOpenCode = _cloneDeep(record.openCode)
				}
			})
		},
		{ immediate: true }
	)

	// 監聽選擇的排序類型，根據不同的排序進行處理
	watch(
		() => selectedOrderType.value,
		(newValue) => {
			if (
				newValue === ACTION_TYPE.ASCENDING ||
				newValue === ACTION_TYPE.DESCENDING
			) {
				const orderType = newValue === ACTION_TYPE.ASCENDING ? 'asc' : 'desc'

				_forEach(recordList.value, (record) => {
					// 排除最後一個開獎號碼（特碼），對其餘號碼進行排序
					const lastCode = record.openCode[record.openCode.length - 1]
					const sortedOpenCode = [
						..._orderBy(_slice(record.openCode, 0, -1), ['value'], [orderType]),
						lastCode,
					]

					record.openCode = sortedOpenCode
				})
			} else if (newValue === ACTION_TYPE.DEFAULT) {
				// 恢復原始開獎號碼順序
				_forEach(recordList.value, (record) => {
					if (record.originOpenCode) {
						record.openCode = _cloneDeep(record.originOpenCode)
					}
				})
			}
		}
	)

	// 處理排序選擇
	const handleSelect = (action) => {
		selectedText.value = action.text
		selectedOrderType.value = action.value
		showPanel.value = false
	}

	// 切換排序順序的文本顯示
	const sortOrderText = computed(() =>
		sortOrder.value === SORT_ORDER.DESCENDING ? '降序' : '升序'
	)

	const sortOrderIcon = computed(() =>
		sortOrder.value === SORT_ORDER.DESCENDING
			? 'icon_HistoricalIottery_decline'
			: 'icon_HistoricalIottery_rise'
	)

	// 切換排序順序
	async function toggleSortOrder() {
		sortOrder.value =
			sortOrder.value === SORT_ORDER.DESCENDING
				? SORT_ORDER.ASCENDING
				: SORT_ORDER.DESCENDING
		// 重置加載狀態
		pageIndex.value = 1

		// 重新獲取數據
		await getLotteryResultHistory()
		finished.value = false
	}

	// 獲取開獎歷史記錄
	async function getLotteryResultHistory() {
		const response = await getLotteryResultHistoryApi({
			lotteryType,
			year: props.selectedYear,
		})
		const data = _get(response, 'data', [])
		const orderType = sortOrder.value === SORT_ORDER.ASCENDING ? 'asc' : 'desc'

		recordList.value = _orderBy(
			data,
			[
				(item) => {
					const issue = +item.issue
					return _isNaN(issue) ? 0 : issue
				},
			],
			[orderType]
		)
		displayList.value = _slice(recordList.value, 0, pageSize)
	}

	async function handleRefresh() {
		// 重置狀態
		refreshing.value = true
		pageIndex.value = 1
		// 重新獲取數據
		await getLotteryResultHistory()
		refreshing.value = false
		finished.value = false
	}

	function handleLoad() {
		const start = pageIndex.value * pageSize
		const end = start + pageSize
		// 追加新加載的資料到顯示列表
		displayList.value.push(..._slice(recordList.value, start, end))
		pageIndex.value += 1
		loading.value = false

		// 判斷是否已加載完所有資料
		if (displayList.value.length >= recordList.value.length) {
			finished.value = true
		}
	}

	// 跳轉至紀錄詳情
	function goToDetail({ year, issue } = {}) {
		navigateTo('/lotteryHistory/detail', { year, issue })
	}

	// 切換五行顯示
	const toggleShowWs = () => {
		showWs.value = !showWs.value
	}

	// 當前選中的日期是否為彩票開獎日期
	const isLotteryDate = computed(() => {
		if (!selectedDate.value) return false
		// 將選中的日期轉換為時間戳（不考慮時區差異）
		const selectedTimestamp = new Date(selectedDate.value).setHours(0, 0, 0, 0)
		// 檢查 recordList 中是否存在 recordTime 與選中日期匹配的記錄
		return recordList.value.some((record) => {
			const recordDate = new Date(record.recordTime).setHours(0, 0, 0, 0)
			return recordDate === selectedTimestamp
		})
	})

	onMounted(() => {
		getLotteryResultHistory()
	})
</script>

<style lang="scss" scoped>
	:deep() {
		.van-badge__wrapper {
			border-radius: 0.3125rem;
		}

		.van-action-sheet__close {
			color: #434343;
			font-size: 1.375rem;
		}

		.van-action-sheet__header {
			font-size: 1.25rem;
			border-bottom: 0.0625rem solid #e0e0e0;
		}
	}
</style>
