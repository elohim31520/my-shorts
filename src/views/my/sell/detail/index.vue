<template>
	<div class="com-min-h-with-header mt-45">
		<NormalHeader title="卖料明細" />
		<NoContent v-if="detailList.length == 0" text="暂无数据" />
		<van-list
			class="py-5"
			v-if="detailList.length > 0"
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
		>
			<div class="px-10">
				<User v-for="(vo, index) in detailList" :key="index" :user="vo" />
			</div>
		</van-list>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import User from '@/views/my/sell/detail/User/index.vue'
	import { getSenseSaleDetail } from '@/api/predict.js'
	import { ref, computed, watch } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const pageSize = 10

	const detailList = ref(_get(props.data, 'saleDetailList.data.list', []))

	const onLoad = async () => {
		loading.value = true
		page.value += 1
		await getDetailList()
		loading.value = false
	}

	async function getDetailList() {
		const res = await getSenseSaleDetail({
			page: page.value,
			size: pageSize,
			predictionId: props.data.predictId,
		})
		const list = _get(res, 'data.list', [])
		const total = _get(res, 'data.total', 0)
		detailList.value.push(...list)
		finished.value = detailList.value.length >= total || list.length == 0
	}
</script>
