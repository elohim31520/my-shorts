<template>
	<div class="chart-wrap">
		<Header :title="title">
			<div class="mr-16 period">
				<span>期数</span>
				<input
					type="number"
					@change="createChart()"
					v-model.lazy="period"
					autocomplete="off"
				/>
			</div>
		</Header>
		<div class="pt-45">
			<div class="color-#656565 text-align-center text-16 font-600 mt-16">
				当前统计期数：{{ showPeriod }}
			</div>
			<div class="p8">
				<div id="bar-chart" class="h-222 chart-frame"></div>
			</div>
		</div>
		<Footer />
	</div>
</template>
<script setup>
	import Header from '@/components/NormalHeader/index.vue'
	import Footer from '../Footer/index.vue'
	import { ref, onMounted, nextTick, watch } from 'vue'
	import { getNumberAnalyze } from '@/api/statistic.js'
	import * as charts from 'echarts'
	import { toast } from '@/modules/util.js'
	import { useBar } from './useBar.js'

	const props = defineProps({
		data: {
			type: Object,
		},
	})

	const period = ref(100)
	const showPeriod = ref(100)
	const bar = useBar()
	let instance = null

	onMounted(createChart)

	const tooltip = {
		backgroundColor: '#434343',
		borderColor: '#434343',
		formatter(params) {
			return `${params.marker}${params.name}<span style="float: right; margin-left: 1px">:${params.value}</span>`
		},
		textStyle: {
			color: '#fff',
		},
		padding: [3, 5, 3, 5],
	}

	async function createChart() {
		if (period.value < 4) {
			toast('请从第4期开始搜索')
			return
		}
		showPeriod.value = period.value
		const type = props.data.type == 'special' ? 2 : 1
		let res = await getNumberAnalyze({ type, period: period.value })
		if (!res.success) return
		const { data } = res
		await nextTick()
		if (!instance) instance = charts.init(document.getElementById('bar-chart'))
		const options = bar.getOptions(charts)
		options.xAxis.data = data.xAxis.data
		options.series[0].data = data.series.data
		options.tooltip = tooltip
		instance.setOption(options)
	}

	const { title } = props.data
</script>

<style lang="scss">
	@import url('@/styles/chart.scss');
</style>
