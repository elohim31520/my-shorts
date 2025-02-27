<template>
	<div class="h-100dvh bg-#fff relative flex flex-col">
		<NormalHeader title="搜索">
			<p
				class="pr-10 color-primary text-14 font-600"
				@click="showYearSelection = !showYearSelection"
			>
				{{ selectedYear }}年
			</p>
		</NormalHeader>

		<!-- 搜索框 -->
		<div class="fixed top-45 z-2 w-full-limited bg-#fff">
			<div>
				<van-search
					id="keyword"
					v-model="keyword"
					placeholder="请输入搜寻内容"
					show-action
					autocomplete="off"
				>
					<template #left-icon>
						<div
							class="color-#34C759 w-48 relative"
							@click="showColorSelection = true"
						>
							<span class="text-14 font-600">
								{{ selectedColor.label }}
							</span>
							<SvgIcon
								class="right-0 top-1/2 -translate-y-1/2 absolute"
								name="icon_HistoricalIottery_down"
								size="1.25rem"
							/>
						</div>
					</template>

					<template #action>
						<div
							@click="handleSearch"
							class="font-600 px-14 bg-#34C759 color-#fff rounded-15 text-16"
						>
							搜索
						</div>
					</template>
				</van-search>
			</div>
		</div>

		<!-- 年份選擇器 -->
		<div
			v-show="showYearSelection"
			class="fixed top-45 z-15 w-full-limited h-40 bg-#fafafa flex-y-center"
		>
			<swiper :slides-per-view="4.58" :space-between="10" class="px-10">
				<swiper-slide
					v-for="(year, index) in yearOptions"
					:key="index"
					class="lh-30 rounded-15 font-600 text-14 text-center bd-#e0e0e0"
					:class="{
						'bg-#f1fee6 color-primary bd-#34C759!': selectedYear === year,
					}"
					@click="handleSelectYear(year)"
				>
					{{ year }}年
				</swiper-slide>
			</swiper>
		</div>
		<div v-if="!isSearching" class="mb-95 h-20"></div>

		<!-- 搜尋前：顯示最新期圖紙列表 -->
		<div v-if="!isSearching" class="pictures overflow-scroll">
			<van-index-bar
				:sticky="true"
				:index-list="sortedLetters"
				highlight-color="#34C759"
				class="pr-20 bg-#fff"
			>
				<div v-for="letter in sortedLetters" :key="letter">
					<van-index-anchor :index="letter">
						<span class="text-18 font-600">{{ letter }}</span>
					</van-index-anchor>
					<van-cell
						v-for="item in groupedList[letter]"
						:key="item.id"
						@click="redirect('pictureDetail', {}, { id: item.issueId })"
					>
						<div class="flex justify-between items-center px-10">
							<span class="color-#434343 text-16 truncate">
								{{ item.newspaperName }}
							</span>
							<div
								class="color-#34C759 text-16 lh-20 px-11.25 bg-#F4FFE8 rounded-5"
							>
								{{ getShortIssue(item.issue) }}
							</div>
						</div>
					</van-cell>
				</div>
			</van-index-bar>

			<NoContent text="暂无数据" v-if="!sortedLetters.length" />
		</div>

		<!-- 搜尋後：顯示結果列表 -->
		<div v-else class="pt-95">
			<SearchResult
				ref="resultRef"
				:keyword="keyword"
				:year="selectedYear"
				:color="selectedColor.value"
			/>
		</div>

		<van-action-sheet title="颜色" v-model:show="showColorSelection">
			<div class="pt-50 pb-40 flex-center flex-col">
				<div
					v-for="(color, index) in colorOptions"
					:key="index"
					class="flex-center w-300 h-40 bg-#F2F2F2 rounded-8 mb-20"
					:class="[
						selectedColor.value === color.value
							? 'color-#34C759 font-600 bg-#F4FFE8 bd-#34C759'
							: 'color-#656565',
					]"
					@click="handleSelectColor(color)"
				>
					<SvgIcon v-if="color.icon" :name="color.icon" size="1.5625rem" />
					<span class="text-18">{{ color.label }}</span>
				</div>
			</div>
		</van-action-sheet>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, watch, useTemplateRef } from 'vue'
	import pinyin from 'pinyin'
	import NoContent from '@/components/NoContent/index.vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import SearchResult from './SearchResult/index.vue'
	import { getLatestPictures } from '@/api/picture'
	import {
		getCurrentLotteryType,
		getOrDefault,
		redirect,
		getShortIssue,
	} from '@/modules/util'
	import { getYearList } from '@/api/common'

	const colorOptions = [
		{ label: '全部', icon: '', value: null },
		{ label: '彩色', icon: 'icon_color', value: 1 },
		{ label: '黑白', icon: 'icon_monochrome', value: 0 },
	]

	const keyword = ref('')
	const yearOptions = ref([])
	const selectedYear = ref()
	const originalList = ref([])
	const groupedList = ref({})
	const showYearSelection = ref(false)
	const showColorSelection = ref(false)
	const isSearching = ref(false)
	const selectedColor = ref(colorOptions[1])

	const resultRef = useTemplateRef('resultRef')

	const sortedLetters = computed(() => {
		const letters = _keys(groupedList.value)
		// 排序規則: A~Z在前, '#'在末
		letters.sort((a, b) => {
			if (a === '#') return 1 // '#'排在後面
			if (b === '#') return -1
			return a.localeCompare(b) // 其餘按字母順序比較
		})
		return letters
	})

	watch(
		keyword,
		_debounce(() => {
			if (_trim(keyword.value)) return
			isSearching.value = false
		}, 500)
	)

	const loadLatestPictures = async () => {
		const lotteryType = getCurrentLotteryType()
		const isColorful = (() => {
			if (selectedColor.value.value === 1) return 'y'
			if (selectedColor.value.value === 0) return 'n'
			return null
		})()
		const response = await getLatestPictures({
			gameType: lotteryType?.code,
			year: selectedYear.value,
			isColorful,
		})
		const data = getOrDefault(response, 'data', [])

		originalList.value = data

		groupedList.value = groupByPinyin(data)
	}

	/**
	 * 對列表按“首個中文或英文字符”分組：
	 * 1. 若找到第一個是中文，則以它的拼音首字母（大寫）為分組
	 * 2. 若找到第一個是英文字母，則取其大寫為分組
	 * 3. 若整段標題都沒有英文或中文字符，則歸到 '#'
	 */
	const groupByPinyin = (list) => {
		const grouped = {}

		list.forEach((item) => {
			const pictureName = getOrDefault(item, 'newspaperName', '')

			if (!pictureName) {
				// 沒有標題，直接歸到 '#'
				pushToGroup('#', item)
				return
			}

			// 從左到右，找第一個是“中文”或“英文字母”的字符
			let groupLetter = '#'

			for (let i = 0; i < pictureName.length; i++) {
				const char = pictureName[i]

				// 檢測是否中文字符
				if (/[\u4e00-\u9fa5]/.test(char)) {
					// 用 pinyin 獲取其首字母，並大寫
					const arr = pinyin(char, { style: pinyin.STYLE_FIRST_LETTER })
					groupLetter = (arr?.[0]?.[0] || '#').toUpperCase()
					break
				}

				// 檢測是否英文字母
				if (/[a-zA-Z]/.test(char)) {
					groupLetter = char.toUpperCase()
					break
				}
			}

			// 將數據放到對應的分組中
			pushToGroup(groupLetter, item)
		})

		return grouped

		function pushToGroup(letter, listItem) {
			if (!grouped[letter]) {
				grouped[letter] = []
			}
			grouped[letter].push(listItem)
		}
	}

	const handleSelectColor = (color) => {
		selectedColor.value = color
		showColorSelection.value = false
		!isSearching.value && loadLatestPictures()
	}

	const handleSelectYear = (year) => {
		selectedYear.value = year
		showYearSelection.value = false
		!isSearching.value && loadLatestPictures()
	}

	const getYearOptions = async () => {
		const response = await getYearList()
		const data = getOrDefault(response, 'data', [])

		yearOptions.value = _map(data, 'value')
		selectedYear.value = getOrDefault(
			yearOptions.value,
			'[0]',
			new Date().getFullYear()
		)
	}

	const handleSearch = () => {
		if (!_trim(keyword.value)) return
		isSearching.value = true
		if (resultRef.value?.triggerSearch) resultRef.value.triggerSearch()
	}

	onMounted(async () => {
		await getYearOptions()
		loadLatestPictures()
	})
</script>

<style lang="scss" scoped>
	.swiper {
		padding: 0 0.625rem;
		width: 100%;
	}

	.swiper-slide {
		width: 19.63%;
		margin-right: 0.625rem;
	}

	:deep() {
		.van-search__content {
			height: 1.875rem;
			padding-left: 0.625rem;
			border-radius: 0.9375rem;
			background-color: #f2f2f2;
			display: flex;
			align-items: center;
		}

		.van-field__control::placeholder {
			color: #aeaeb1;
			font-size: 1rem;
			line-height: 1.875rem;
		}

		.van-hairline--bottom:after {
			border: none;
		}

		.van-search__action > div {
			line-height: 1.875rem;
		}

		.van-index-anchor {
			width: 100%;
			max-width: 480px;
		}

		.van-index-anchor--sticky {
			position: absolute !important;
			top: 5.9375rem;
			left: 0 !important;
			transform: none !important;
			width: 100%;
			max-width: 480px;
		}

		.van-index-bar__index {
			font-size: 0.875rem;
			margin-bottom: 0.3125rem;
		}

		.van-action-sheet__header {
			font-size: 1.25rem;
			border-bottom: 0.0625rem solid #f2f2f2;
		}
		.van-action-sheet__content {
			@include scrollbar-hidden;
		}

		.van-action-sheet__close {
			font-size: 1.375rem;
			color: #434343;
		}

		.van-action-sheet__header {
			border-bottom: 0;
		}

		@media screen and (min-width: 480px) {
			.van-index-bar__sidebar {
				right: calc((100vw - 480px) / 2);
			}
		}
	}

	.pictures {
		@include scrollbar-hidden;
	}
</style>
