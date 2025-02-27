<template>
	<div class="com-min-h-with-header mt-45">
		<NormalHeader title="我的卖料" />
		<LotteryTypes sync />
		<NoContent v-if="handledList.length == 0" text="暂无数据" />
		<van-list
			class="mb-40"
			v-if="handledList.length > 0"
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
		>
			<div class="mt-5 px-10">
				<Prediction
					v-for="(vo, index) in handledList"
					:key="index"
					:data="vo"
					:showAvatar="false"
					:showFooter="false"
					:canViewDetail="true"
					class="mb-5"
				/>
			</div>
		</van-list>
		<DynamicFixedElement
			:position="{ bottom: '-40' }"
			:moveRange="40"
			class="z-10"
		>
			<LotteryTypes sync />
		</DynamicFixedElement>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import Prediction from '@/components/Prediction/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import { getCurrentLotteryType } from '@/modules/util'
	import { getPredictSaleList } from '@/api/predict.js'
	import { useLotteryStore } from '@/stores/lottery'
	import { storeToRefs } from 'pinia'
	import { ref, computed, watch } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const { lotteryType } = storeToRefs(useLotteryStore())
	const gameType = computed(() => getCurrentLotteryType(lotteryType.value).code)

	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const pageSize = 10

	const saleList = ref(_get(props.data, 'predictSaleList.data.list', []))
	const handledList = computed(() => {
		return saleList.value.map((item) => {
			return {
				...item,
				gameName: item.playTypeName,
				gameCode: item.playTypeCode,
				gameSubName: item.playTypeSubName,
				gameSubCode: item.playTypeSubCode,
				point: item.isHit == 'i' ? item.predictScore : 0,
				hasPay: 'n',
				title: item.predictTitle,
			}
		})
	})

	const onLoad = async () => {
		loading.value = true
		page.value += 1
		await getSaleList()
		loading.value = false
	}

	async function getSaleList() {
		const res = await getPredictSaleList({
			page: page.value,
			size: pageSize,
			gameType: gameType.value,
		})
		const list = _get(res, 'data.list', [])
		const total = _get(res, 'data.total', 0)
		saleList.value.push(...list)
		finished.value = saleList.value.length >= total || list.length == 0
	}

	watch(
		() => gameType.value,
		(newValue) => {
			page.value = 1
			saleList.value = []
			if (newValue) getSaleList()
		}
	)
</script>
