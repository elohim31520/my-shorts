<template>
	<div class="mt-45 mb-50">
		<Header :title="title">
			<img
				class="w-16 h-16 mr-10"
				src="/public-assets/images/statistic/rili.png"
				@click="showSelect = true"
			/>
		</Header>
		<table class="tb">
			<thead>
				<tr class="tb-th">
					<th v-for="item in headerList" :key="item">{{ item.label }}</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(item, index) in dataList"
					:key="item.yearAndTerm"
					class="tb-tr text-center"
					:class="index % 2 === 0 ? 'tb-bg1' : ''"
				>
					<td
						v-for="(headerItem, index) in headerList"
						:key="index"
						:class="textClass(item[headerItem.prop])"
					>
						<template v-if="type === 'lm' || type === 'lx'">
							<div :class="textClass(item[headerItem.prop].red)">
								{{ item[headerItem.prop].value }}
							</div>
						</template>
						<template v-else-if="type === 'ws' || type === 'jqys'">
							{{ item[headerItem.prop] }}
						</template>
					</td>
				</tr>
			</tbody>
		</table>
		<van-popup v-model:show="showSelect" position="bottom">
			<van-picker
				:columns="options"
				@confirm="onConfirm"
				@cancel="showSelect = false"
			/>
		</van-popup>
		<Footer />
	</div>
</template>

<script setup>
	import Header from '@/components/NormalHeader/index.vue'
	import {
		getTailBigSmall,
		getAnimalAnalyze,
		getConsecutiveStat,
		getListYear,
	} from '@/api/statistic'
	import { ref, watch } from 'vue'
	import Footer from '../Footer/index.vue'
	const props = defineProps({
		data: {
			type: Object,
		},
	})

	const { type, title } = props.data
	const headerList = ref([])
	const dataList = ref([])
	const options = ref([])
	const yearValue = ref('')
	const showSelect = ref(false)
	const apiMapping = new Map([
		['ws', { method: getTailBigSmall }],
		['jqys', { method: getAnimalAnalyze }],
		['lm', { method: getConsecutiveStat, type: 1 }],
		['lx', { method: getConsecutiveStat, type: 2 }],
	])
	const onConfirm = ({ selectedValues }) => {
		showSelect.value = false
		yearValue.value = selectedValues[0]
	}
	getListYear().then((res) => {
		let data = []
		res.data.list.forEach((element) => {
			data.push({ text: element, value: element })
		})
		options.value = data
		if (options.value.length > 0) {
			yearValue.value = options.value[0].value
		}
	})
	const getApi = async (apiType, year) => {
		const { method, type } = apiMapping.get(apiType)
		const res = await method(year, type ? type : null)
		if (!res.success) return
		setData(res.data)
	}

	const setData = (data) => {
		headerList.value = data.rows
		dataList.value = data.rols
	}
	const textClass = (text) => {
		if (text === '大' || text === '野') return 'red'
		if (text === 1) return 'red-round'
	}
	watch(yearValue, (val) => {
		getApi(type, val)
	})
</script>
<style scoped>
	.tb {
		width: 100%;
	}
	.tb-th {
		font-weight: 400;
		color: #a9a9a9;
		font-size: 0.75rem;
	}
	.tb-bg1 {
		background-color: #f8f8f8;
	}
	.tb-tr {
		line-height: 2rem;
		font-size: 0.75rem;
	}
	.red {
		color: red;
	}
	.red-round {
		width: 1.2rem;
		height: 1.2rem;
		color: #fff;
		background: red;
		border-radius: 50%;
		text-align: center;
		line-height: 1.2rem;
		margin: 0 auto;
	}
</style>
