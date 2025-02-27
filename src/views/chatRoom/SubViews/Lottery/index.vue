<template>
	<div class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full-limited">
		<NormalHeader
			title="历史开奖"
			:onBack="
				() => {
					showLottery = false
				}
			"
		>
			<p
				class="pr-10 color-primary text-14 font-600"
				@click="showYearSelection = !showYearSelection"
			>
				{{ selectedYear }}年
			</p>
		</NormalHeader>

		<LotteryTypes class="fixed top-45 z-30" />

		<!-- 年份選擇器 -->
		<div
			v-show="showYearSelection"
			class="px-5 fixed top-85 z-15 h-40 bg-#fafafa flex-y-center w-full"
		>
			<swiper
				:slides-per-view="4.58"
				:space-between="10"
				class="w-full flex-y-center"
			>
				<swiper-slide
					v-for="(year, yearIndex) in availableYears"
					:key="yearIndex"
				>
					<div
						class="lh-30 rounded-15 font-600 text-14 text-center bd-#e0e0e0"
						:class="{
							'bg-#f1fee6 color-primary bd-#34C759!': selectedYear == year,
						}"
						@click="selectedYear = year"
					>
						{{ year }}年
					</div>
				</swiper-slide>
			</swiper>
		</div>

		<div>
			<!-- 頂部操作欄 -->
			<div
				class="fixed top-0 z-5 flex-y-center justify-between pt-105 px-10 mb-10 bg-#fafafa w-full max-w-480px"
			>
				<p class="text-18 font-600 color-#434343">
					{{ selectedYear }}年开奖记录
				</p>
				<div class="flex text-14">
					<!-- 紀錄排序切換按鈕 -->
					<div class="flex-center mr-10" @click="toggleSortOrder">
						<SvgIcon :name="sortOrderIcon" size="1.25rem" />
						<span>{{ sortOrderText }}</span>
					</div>
					<!-- 顯示五行信息開關 -->
					<div
						class="flex-center mr-10"
						:class="[showWs ? ' color-#434343' : 'color-#AEAEB1']"
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
				class="pt-142"
				:finished="finished"
				:immediate-check="false"
				finished-text="没有更多了"
				@load="handleLoad"
			>
				<div
					class="px-10 mb-8"
					v-for="(item, index) in displayList"
					:key="index"
				>
					<div
						class="shadow-primary p-10 rounded-10 bg-#fff relative"
						@click="toggleOptionSelection(item)"
					>
						<div
							class="absolute h-full w-full top-0 left-0 bd-#34c759-3 mask"
							v-if="selectedMap.has(item)"
						></div>
						<!-- 開獎信息標題 -->
						<div class="text-14 flex-y-center justify-between mb-5">
							<p class="color-#656565 text-14 font-600">
								第 {{ item.issue }} 期开奖结果
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

		<div
			class="h-60 flex-y-center justify-evenly bg-#fff fixed bottom-0 w-full max-w-480px"
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
	import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
	import { storeToRefs } from 'pinia'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import BallList from '@/views/lotteryHistory/BallList/index.vue'

	import { MESSAGE_TYPES, CLIENT_CODES } from '@/constants/chat'
	import { useWebSocket } from '@/hooks/useChatWebSocket'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'
	import { getLotteryResultHistoryApi } from '@/api/lottery'
	import { formatTimestamp } from '@/modules/date'
	import { useLotteryStore } from '@/stores/lottery'
	import { getIssueListKV } from '@/api/common'
	import { getLotteryTypeList } from '@/modules/util'

	const { lotteryType } = storeToRefs(useLotteryStore())
	const { send } = useWebSocket()
	const { roomData } = useRoomData()
	const { showLottery } = useDisplayStates()

	const selectedOptions = reactive([])
	const maxSelections = 1
	const showYearSelection = ref(false)
	const availableYears = ref([])
	const selectedYear = ref(
		_get(availableYears, '[0]', new Date().getFullYear())
	)

	const loading = ref(false)
	const finished = ref(false)
	const pageSize = 5
	const pageIndex = ref(1)
	const showWs = ref(false)

	const SORT_ORDER = {
		DESCENDING: 0, // 降序
		ASCENDING: 1, // 升序
	}

	// 排序順序（0-降序，1-升序）
	const sortOrder = ref(SORT_ORDER.DESCENDING)

	// 開獎記錄列表
	const recordList = ref([])
	const displayList = ref(recordList.value)

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

	const toggleOptionSelection = (item) => {
		const index = _findIndex(selectedOptions, item)
		if (index == -1) {
			selectedOptions.length = 0
			selectedOptions.push(item)
			// 保留多選邏輯： 尚未選擇，且未達最大選擇數量則選中
			// if (selectedOptions.length < maxSelections) selectedOptions.push(item)
		} else {
			// 已選擇，點擊後取消選擇
			selectedOptions.splice(index, 1)
		}
	}

	const handleReset = () => {
		selectedOptions.length = 0
	}

	const handleSubmit = () => {
		const { roomId, self } = roomData

		const lotteryTypeList = getLotteryTypeList()
		const gameType = _find(lotteryTypeList, {
			key: lotteryType.value,
		})?.code

		_forEach(selectedOptions, (vo) => {
			const msg = {
				gameType,
				issue: vo.issue,
				recordTime: vo.recordTime,
				openNo: _map(vo.openCode, (vo) => vo.value), //开奖号码
			}
			const data = {
				code: CLIENT_CODES.SEND_MESSAGE,
				roomId,
				type: MESSAGE_TYPES.LOTTERY,
				userId: self.userId,
				msg,
			}
			send(data)
		})

		showLottery.value = false
	}

	const selectedMap = computed(() => {
		const map = new Map()

		_forEach(selectedOptions, (item, index) => map.set(item, index))

		return map
	})

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

	// 切換排序順序的文本顯示
	const sortOrderText = computed(() =>
		sortOrder.value === SORT_ORDER.DESCENDING ? '降序' : '升序'
	)

	const sortOrderIcon = computed(() =>
		sortOrder.value === SORT_ORDER.DESCENDING
			? 'icon_HistoricalIottery_decline'
			: 'icon_HistoricalIottery_rise'
	)

	watch(
		() => selectedYear.value,
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
			lotteryType: lotteryType.value,
			year: selectedYear.value,
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

	// 切換五行顯示
	const toggleShowWs = () => {
		showWs.value = !showWs.value
	}

	onMounted(() => {
		getLotteryResultHistory()

		getIssueListKV({ lotteryType: lotteryType.value }).then((resp) => {
			const list = _get(resp, 'data', [])
			const yearSet = new Set()
			list.forEach((entry) => {
				const year = entry.year
				yearSet.add(year)
			})
			availableYears.value = Array.from(yearSet)
		})
	})

	watch(
		() => lotteryType.value,
		async (newVal) => {
			loading.value = false
			finished.value = false
			pageIndex.value = 1
			handleReset()
			await nextTick()
			await getLotteryResultHistory()
			handleLoad()
		}
	)
</script>

<style lang="scss" scoped>
	.mask {
		background: rgba(#b0ffa0, 0.2);
		background-blend-mode: multiply;
		border-radius: 0.625rem;
	}
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
