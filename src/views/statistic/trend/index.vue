<template>
	<div class="chart-wrap">
		<Header :title="title" :isTop="true">
			<div class="mr-16 period">
				<span>期数</span>
				<input
					type="number"
					@change="createChart()"
					v-model="period"
					autocomplete="off"
				/>
			</div>
		</Header>
		<div class="pt-45">
			<div class="color-#656565 text-align-center text-16 font-600 mt-16">
				当前统计期数：{{ showPeriod }}
			</div>
			<div class="p8">
				<div id="trend-chart-hot" class="h-222 chart-frame"></div>
			</div>

			<div class="p8">
				<div id="trend-chart-cold" class="h-222 chart-frame mb-50"></div>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script setup>
	import Header from '@/components/NormalHeader/index.vue'
	import Footer from '../Footer/index.vue'
	import { ref, onMounted, watch } from 'vue'
	import { getNumberStat } from '@/api/statistic.js'
	import { useTrend } from './useTrend.js'
	import { toast } from '@/modules/util.js'
	import * as charts from 'echarts'

	const props = defineProps({
		data: {
			type: Object,
		},
	})

	const period = ref(100)
	const showPeriod = ref(100)
	const trend = useTrend()
	const instances = new Map([
		['hot', null],
		['cold', null],
	])

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
	onMounted(createChart)
	async function createChart() {
		if (period.value < 4) {
			toast('请从第4期开始搜索')
			return
		}
		showPeriod.value = period.value
		const type = props.data.type == 'special' ? 2 : 1
		let res = await getNumberStat({ type, period: period.value })
		if (!res.success) return
		const { data } = res
		setChart(data, true)
		setChart(data, false)
	}

	function setChart(data, isHot) {
		const type = props.data.type == 'special' ? '特码' : '正码'
		const key = isHot ? 'hot' : 'cold'
		const color = isHot ? '#ea4c2d' : '#348FFB'
		const title = isHot ? `${type}历史热图` : `${type}历史冷图`
		let instance = instances.get(key)
		if (!instance) {
			instance = charts.init(document.getElementById(`trend-chart-${key}`))
			instances.set(key, instance)
		}
		const options = trend.getOptions({ color, title })
		if (!window._global.isH5) {
			options.xAxis.min = 1
			options.xAxis.max = 29
		}
		options.xAxis.data = _get(data, `${key}.xAxis.data`)
		options.series[0].data = _get(data, `${key}.series.0.data`)
		options.tooltip = tooltip
		instance.setOption(options)
	}

	const { title } = props.data
</script>

<style lang="scss">
	@import url('@/styles/chart.scss');
</style>
