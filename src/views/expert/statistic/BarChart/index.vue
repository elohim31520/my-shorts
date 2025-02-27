<template>
	<div class="mb-5 bg-#fff chart-outer">
		<div class="h-190 chart-inner">
			<div class="chart-wrapper">
				<div
					ref="barChart"
					:class="['h-190', 'font-size-12']"
					:style="{ width: `${barWidth}px`, minWidth: '100%' }"
				></div>
			</div>
		</div>

		<div class="font-700 mt-10 text-center remarks">
			{{ periodName }}（共{{ totalUserCount }}人）
		</div>
	</div>
</template>

<script setup>
	import { ref, watch, computed, onMounted } from 'vue'
	import * as charts from 'echarts'
	import { useBar } from './useBar.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const barData = ref(_get(props, 'data.list', []))
	const periodName = ref(_get(props, 'data.periodName', ''))
	const totalUserCount = ref(_get(props, 'data.totalUserCount', 0))

	const bar = useBar()
	let instance = null
	const barChart = ref(null)
	const barWidth = computed(() => barData.value.length * 50 + 120)

	watch(
		() => barData.value,
		() => {
			createChart()
		}
	)

	onMounted(createChart)

	const tooltip = {
		backgroundColor: '#434343',
		borderColor: '#434343',
		formatter(params) {
			return `${params.marker}${params.name}<span style="float: right; margin-left: 1px">:${params.value}人</span>`
		},
		textStyle: {
			color: '#fff',
		},
		padding: [3, 5, 3, 5],
	}

	async function createChart() {
		if (!barData.value.length) return
		let series = []
		let xAxis = []
		barData.value.map((item, index) => {
			if (index === 0) {
				series.push({
					value: item.userCount,
					label: {
						color: '#FF9400',
					},
					itemStyle: {
						borderRadius: [5, 5, 0, 0],
						color: new charts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#FEEAC6' },
							{ offset: 1, color: '#F3C280' },
						]),
					},
				})
			} else {
				series.push({
					value: item.userCount,
					label: {
						color: '#34C759',
					},
					itemStyle: {
						borderRadius: [5, 5, 0, 0],
						color: new charts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#EBFFCA' },
							{ offset: 1, color: '#ABF182' },
						]),
					},
				})
			}
			xAxis.push(item.value)
		})

		if (!instance) instance = charts.init(barChart.value)
		const options = bar.getOptions(charts)
		options.xAxis.data = xAxis
		options.series[0].data = series
		options.tooltip = tooltip
		instance.setOption(options)
	}
</script>

<style lang="scss" scoped>
	.chart-outer {
		width: 100%;
		padding: 0.625rem;

		.chart-inner {
			margin-left: 0.625rem;

			.chart-wrapper {
				width: 100%;
				overflow-x: auto;
			}
		}
	}

	.remarks {
		line-height: 1.375;
	}
</style>
