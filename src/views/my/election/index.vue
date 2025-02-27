<template>
	<div class="com-min-h-with-header mt-45 bg-#fafafa">
		<NormalHeader title="我的竞选" />
		<LotteryTypes sync />
		<NoContent v-if="!electionList.length" text="暂无数据" />
		<van-list
			v-else
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
			:immediate-check="false"
		>
			<div class="mt-5 px-10">
				<ElectionList
					class="mb-10"
					v-for="(vo, index) in electionList"
					:key="index"
					:electionData="vo"
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
	import { ref, computed, watch, onBeforeMount } from 'vue'
	import { storeToRefs } from 'pinia'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import ElectionList from '@/views/election/ElectionList/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import { getCurrentLotteryType } from '@/modules/util'
	import { useLotteryStore } from '@/stores/lottery'
	import { getMyCampaignList } from '@/api/election.js'

	const { lotteryType } = storeToRefs(useLotteryStore())
	const gameType = computed(() => getCurrentLotteryType(lotteryType.value).code)

	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const electionList = ref([])

	onBeforeMount(() => {
		getElectionList()
	})

	const onLoad = async () => {
		loading.value = true
		page.value += 1
		await getElectionList()
		loading.value = false
	}

	async function getElectionList() {
		const res = await getMyCampaignList({
			page: page.value,
			size: 10,
			gameType: gameType.value,
		})
		const list = _get(res, 'data.list', [])
		const total = _get(res, 'data.total', 0)
		electionList.value.push(...list)
		finished.value = electionList.value.length >= total || list.length == 0
	}

	watch(
		() => gameType.value,
		(newValue) => {
			page.value = 1
			electionList.value = []
			if (newValue) getElectionList()
		}
	)
</script>

<style lang="scss" scoped></style>
