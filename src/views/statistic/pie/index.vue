<template>
	<div class="chart-wrap pie-chart-main">
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
			<ul class="flex m-10 gap-10">
				<li
					v-for="vo in tabs"
					:key="vo.key"
					class="btn"
					:class="{ active: currentTab == vo.key }"
					@click="currentTab = vo.key"
				>
					{{ vo.name }}
				</li>
			</ul>
			<div class="p8">
				<div id="pie-chart" class="h-420 chart-frame mb-50"></div>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script setup>
	import Header from '@/components/NormalHeader/index.vue'
	import Footer from '../Footer/index.vue'
	import { ref, onMounted, watch, computed } from 'vue'
	import {
		getAnimalStat,
		getColorStat,
		getTailStat,
		getNumberRange,
	} from '@/api/statistic.js'
	import { toast } from '@/modules/util.js'
	import { usePie } from './usePie.js'
	import * as charts from 'echarts'

	const props = defineProps({
		data: {
			type: Object,
		},
	})

	const { title } = props.data
	const isNumberRange = props.data.type == 'number' //是否為號碼波段
	const config = new Map([
		['sxSpecial', { method: getAnimalStat, type: 2 }],
		['sxPositive', { method: getAnimalStat, type: 1 }],
		['spSpecial', { method: getColorStat, type: 2 }],
		['spPositive', { method: getColorStat, type: 1 }],
		['specialTail', { method: getTailStat, type: 2 }],
		['positiveTail', { method: getTailStat, type: 1 }],
		['number', { method: getNumberRange }],
	])
	const pie = usePie()
	const period = ref(100)
	const showPeriod = ref(100)
	const data = ref({})
	const items = computed(() => data.value[currentTab.value])
	const tabs = getTabs()
	const currentTab = ref(tabs[0].key)
	let instance = null

	const tooltip = {
		trigger: 'item',
		backgroundColor: '#434343',
		borderColor: '#434343',
		formatter(params) {
			return `${params.marker}${params.name}<span style="float: right; margin-left: 1px">:${params.value}</span>`
		},
		label: {
			formatter: '',
		},
		textStyle: {
			color: '#fff',
		},
		padding: [3, 5, 3, 5],
	}

	onMounted(createChart)
	watch(items, setChart)

	async function createChart() {
		if (period.value < 4) {
			toast('请从第4期开始搜索')
			return
		}
		showPeriod.value = period.value
		const { method, type } = config.get(props.data.type)
		const res = await method({ type, period: period.value })
		data.value = {}
		if (!res.success) return
		data.value = res.data
	}

	function setChart() {
		const options = pie.getOptions()
		options.legend.formatter = (name) => {
			let obj = items.value.series.data.find((item) => item.name == name)
			return `${name}(${obj.value}次)`
		}
		options.series[0].data = items.value.series.data
		if (!instance) instance = charts.init(document.getElementById('pie-chart'))
		options.tooltip = tooltip

		instance.setOption(options)
	}

	function getTabs() {
		if (isNumberRange) {
			return [
				{ name: '特码', key: 'special' },
				{ name: '正码', key: 'normal' },
			]
		} else {
			return [
				{ name: '热图', key: 'hot' },
				{ name: '冷图', key: 'cold' },
			]
		}
	}
</script>

<style lang="scss">
	@import url('@/styles/chart.scss');
	.pie-chart-main {
		.btn {
			width: 50%;
			height: 1.875rem;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 0.625rem;
			font-weight: 500;
			text-align: center;
			color: #656565;
			border: solid 0.0625rem #e0e0e0;
			&.active {
				background-color: #e0f7fa;
				color: $primary-color;
				border-color: $primary-color;
				font-weight: 600;
				background-color: #f1fee6;
			}
		}
	}
</style>
