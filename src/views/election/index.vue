<template>
	<div class="bg-#fafafa com-min-h-with-header">
		<NormalHeader title="竞选专家">
			<SvgIcon
				class="cursor-pointer"
				name="user_tag"
				size="1.35rem"
				@click="goTo"
			/>
		</NormalHeader>
		<LotteryTypes class="mt-45" sync />
		<div class="mt-5 px-10">
			<NoContent v-if="!electionList.length" text="暂无数据" />
			<van-list
				v-else
				v-model:loading="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="onLoad"
			>
				<ElectionList
					class="mb-10"
					v-for="(vo, index) in loadElectionList"
					:key="index"
					:electionData="vo"
				/>
			</van-list>
		</div>
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
	import { ref, provide, watch, onBeforeMount } from 'vue'
	import { storeToRefs } from 'pinia'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import ElectionList from './ElectionList/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import { getCurrentLotteryType } from '@/modules/util'
	import { useLotteryStore } from '@/stores/lottery'
	import { getCampaignList } from '@/api/election.js'
	import { redirect } from '@/modules/util.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)

	const { lotteryType } = storeToRefs(useLotteryStore())
	const electionList = ref([])
	const loading = ref(false)
	const finished = ref(false)
	let page = 0
	const size = 10
	const loadElectionList = ref([])
	const gameType = ref('')

	async function getCampaignListData(params) {
		const res = _get(await getCampaignList(params), 'data', {})
		if (Object.keys(res).length === 0) return
		electionList.value = res.list
		let total = res.total
		loadElectionList.value.push(...electionList.value)
		finished.value = loadElectionList.value.length >= Number(total)
	}

	async function onLoad() {
		page++
		loading.value = true
		await getCampaignListData({ page, size, gameType: gameType.value })
		loading.value = false
	}

	function goTo() {
		redirect('/my/election', { auth: true })
	}

	watch(
		() => lotteryType.value,
		async (value) => {
			const lotteryInfo = getCurrentLotteryType()
			gameType.value = _get(lotteryInfo, 'code', '')
			loadElectionList.value.length = 0
			page = 1
			const params = {
				page,
				size,
				gameType: gameType.value,
			}
			await getCampaignListData(params)
		},
		{ immediate: true }
	)
</script>

<style lang="scss" scoped></style>
