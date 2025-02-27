<template>
	<div>
		<div
			class="cs"
			:class="status === '' ? 'com-min-h-with-header' : 'election-detail-min-h'"
		>
			<div
				class="labels text-center text-14 h-25 py-4 bg-white color-#AEAEB1 sticky top-40 z-10"
				:class="{ 'justify-around': status === 'e' }"
			>
				<div class="w-30%">会员</div>
				<template v-if="status === 'y' || status === ''">
					<div class="w-20%">期数</div>
					<div class="w-35%">竞选</div>
					<div class="w-15%">结果</div>
				</template>
				<template v-else-if="status === 'e'">
					<div class="w-30%">参与期数</div>
					<div class="w-20%">中奖注数</div>
				</template>
			</div>
			<div v-if="status === ''" class="mt-40"></div>
			<NoContent v-if="!campaignList.length && !loading" text="暂无数据" />
			<van-list
				v-else
				:class="{ isHistory: status === '' }"
				v-model:loading="loading"
				:finished="finished"
				:finished-text="campaignList.length ? '没有更多了' : ''"
				@load="onLoad"
			>
				<div
					class="content text-center text-14 pt-8 h-35 color-#656565"
					:class="{ 'justify-around': status === 'e' }"
					v-for="(item, index) in campaignList"
					:key="index"
				>
					<div class="w-30% truncate pl-8">{{ item.nickname }}</div>
					<template v-if="status === 'y' || status === ''">
						<div class="w-20%">{{ item.issue }}</div>
						<div class="w-35%">{{ item.predict.toString() }}</div>
						<div class="w-15%">{{ isHitResult(item.isHit) }}</div>
					</template>
					<template v-if="status === 'e'">
						<div class="w-30%">{{ item.issue }}</div>
						<div class="w-20%">{{ isHitResult(item.isHit) }}</div>
					</template>
				</div>
			</van-list>
		</div>
	</div>
</template>

<script setup>
	import { ref, inject, onBeforeMount } from 'vue'
	import { listPlayTypeForCampaign, getPredictResult } from '@/api/election.js'
	import NoContent from '@/components/NoContent/index.vue'

	const status = inject('status', '')

	const loading = ref(true)
	const finished = ref(false)
	const campaignList = ref([])
	const apiParams = {
		page: 1,
		size: 10,
		bizFlag: 'p',
	}
	const emit = defineEmits(['getCampaignData'])

	function isHitResult(value) {
		let text
		if (value === 'y') {
			text = '已中'
		} else if (value === 'n') {
			text = '未中'
		} else if (value === 'i') {
			text = '待开'
		}
		return text
	}

	async function fetchApi() {
		let apiFunc
		if (status === 'y' || status == '') {
			apiFunc = listPlayTypeForCampaign
		} else if (status === 'e') {
			apiFunc = getPredictResult
		}
		const res = _get(await apiFunc(apiParams), 'data', {})
		campaignList.value.push(...res.list)
		const { list, ...rest } = res
		emit('getCampaignData', rest)
		finished.value = campaignList.value.length >= res.total
	}

	async function onLoad() {
		apiParams.page++
		loading.value = true
		await fetchApi()
		loading.value = false
	}

	onBeforeMount(async () => {
		const url = new URL(window.location.href)
		const match = url.pathname.match(/\/detail\/(\d+)/)
		const bizId = url.searchParams.get('bizId')
		apiParams.bizId = bizId ? bizId : match ? match[1] : null
		campaignList.value.length = 0
		await fetchApi()
		loading.value = false
	})
</script>

<style lang="scss" scoped>
	.cs {
		.labels {
			display: flex;
			// justify-content: space-around;
		}
		.content {
			display: flex;
			// justify-content: space-around;
			&:nth-child(odd) {
				background-color: #fff;
			}
			&:nth-child(even) {
				background-color: #fafafa;
			}
		}
		.isHistory {
			margin-top: 2.81rem;
		}
		:deep(.van-list__finished-text) {
			background-color: #fafafa;
		}
	}
	.election-detail-min-h {
		min-height: calc(100dvh - 14.8rem);
		padding-bottom: 3.2rem;
	}
</style>
