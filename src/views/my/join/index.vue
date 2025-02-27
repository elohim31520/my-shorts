<template>
	<div class="com-min-h-with-header mt-45 bg-#fafafa">
		<NormalHeader title="我的参与" />
		<div
			class="sticky top-45 z-10 px-20 flex justify-between items-center gap-42 text-align-center bg-white border-b-1px border-b-[#E7E7E7] text-14 font-400 lh-38 color-#AEAEB1"
		>
			<span class="w-15%">期数</span>
			<span class="w-45%">特码竞选</span>
			<span class="w-15%">结果</span>
		</div>
		<NoContent v-if="!joinList.length" text="暂无数据" />
		<van-list
			v-else
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
			:immediate-check="false"
		>
			<div class="join-list" v-for="(item, index) in joinList" :key="index">
				<span class="w-15%">{{ item.period }}</span>
				<span class="w-45%">{{ item.predict.join(',') }}</span>
				<span class="w-15%">{{ isHitResult(item.isHit) }}</span>
			</div>
		</van-list>
	</div>
</template>

<script setup>
	import { ref, onBeforeMount } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { getMyListPlayTypeForCampaign } from '@/api/election.js'

	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const joinList = ref([])

	onBeforeMount(() => {
		getJoinList()
	})

	const onLoad = async () => {
		loading.value = true
		page.value += 1
		await getJoinList()
		loading.value = false
	}

	function getSearchParams() {
		const url = new URL(window.location.href)
		const bizId = url.searchParams.get('bizId')
		return bizId
	}

	async function getJoinList() {
		const bizId = getSearchParams()
		if (_isNull(bizId)) return
		const res = await getMyListPlayTypeForCampaign({
			page: page.value,
			size: 10,
			bizId,
			bizFlag: 'p',
		})
		const list = _get(res, 'data.list', [])
		const total = _get(res, 'data.total', 0)
		joinList.value.push(...list)
		finished.value = joinList.value.length >= total || list.length == 0
	}

	function isHitResult(value) {
		let text
		if (value == 'y') {
			text = '已中'
		} else if (value == 'n') {
			text = '未中'
		} else if (value == 'i') {
			text = '待开'
		}
		return text
	}
</script>

<style lang="scss" scoped>
	.join-list {
		padding: 0 1.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2.625rem;
		text-align: center;
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 2.375rem;
		color: #656565;
		&:nth-child(odd) {
			background-color: white;
		}
	}
</style>
