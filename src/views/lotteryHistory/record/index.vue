<template>
	<div class="bg-#FAFAFA min-h-100dvh">
		<NormalHeader title="历史开奖">
			<p
				class="pr-10 color-primary text-14 font-600"
				@click="showYearSelection = !showYearSelection"
			>
				{{ selectedYear }}年
			</p>
		</NormalHeader>

		<Menu class="fixed top-45 z-10 w-full px-10" />

		<!-- 年份選擇器 -->
		<div
			v-show="showYearSelection"
			class="fixed top-45 z-15 w-full max-w-480px h-40 bg-#fafafa flex-y-center"
		>
			<swiper :slides-per-view="4.58" :space-between="10" class="px-10">
				<swiper-slide
					v-for="(year, yearIndex) in availableYears"
					:key="yearIndex"
					class="lh-30 rounded-15 font-600 text-14 text-center bd-#e0e0e0"
					:class="{
						'bg-#f1fee6 color-primary bd-#34C759!': selectedYear === year,
					}"
					@click="selectedYear = year"
				>
					{{ year }}年
				</swiper-slide>
			</swiper>
		</div>

		<List :selectedYear="selectedYear" />
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import Menu from '../Menu/index.vue'
	import List from '../List/index.vue'
	import { ref, provide } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	// 年份選擇面板顯示與否
	const showYearSelection = ref(false)

	// 從數據中提取可用年份和開獎資料
	const availableYears = _map(_get(props.data, 'yearList.data', []), 'value')

	// 當前選中的年份
	const selectedYear = ref(
		_get(availableYears, '[0]', new Date().getFullYear())
	)

	provide('data', props.data)
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
		.van-picker__confirm {
			color: $primary-color;
		}
	}
</style>
