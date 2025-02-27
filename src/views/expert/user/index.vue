<template>
	<div class="com-min-h-with-header mt-45 bg-#fafafa">
		<NormalHeader :title="props.data.title" />
		<div class="p-10">
			<UserProfile
				class="shadow-primary"
				:userId="data.userId"
				:showHistory="false"
				:showDonate="true"
				:showLocate="true"
				:showViewSelf="false"
			/>
		</div>

		<TabSwitcher
			class="sticky top-45 z-10"
			v-model:activeValue="activeValue"
			:loading="loading"
		/>
		<TypeTab
			v-if="activeValue == 'history' && fetchDone"
			class="sticky top-80 z-10"
			v-model:typeName="typeName"
			v-model:typeValue="typeValue"
			:loading="loading"
			:playTypeCodeList="playTypeCodeList"
		/>
		<NoContent v-if="!predictList.length" text="暂无数据" />
		<van-list
			v-else
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
		>
			<div class="mt-5 px-10">
				<Prediction
					v-for="(vo, index) in predictList"
					:key="index"
					:data="vo"
					:showAvatar="false"
					:showFooter="activeValue == 'current'"
					class="mb-5"
				/>
			</div>
		</van-list>

		<PlayCodeSelect
			v-model:typeName="typeName"
			v-model:typeValue="typeValue"
			:playTypeCodeList="playTypeCodeList"
		/>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import UserProfile from '@/components/UserProfile/index.vue'
	import TabSwitcher from '@/views/expert/TabSwitcher/index.vue'
	import TypeTab from '@/views/expert/TypeTab/index.vue'
	import PlayCodeSelect from '@/components/PlayCodeSelect/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import Prediction from '@/components/Prediction/index.vue'
	import { getCurrentLotteryType, updateURLParameter } from '@/modules/util'
	import {
		getCurrentPredictWithUser,
		getHistoryPredictWithUser,
	} from '@/api/predict.js'
	import { getPlayTypeCode } from '@/api/winner.js'
	import { useExpertUserSenseStore } from '@/stores/expertUserSense.js'
	import { ref, watch, onBeforeMount, nextTick } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const expertUserSenseStore = useExpertUserSenseStore()

	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const pageSize = 10
	const fetchDone = ref(false)

	const activeValue = ref('')
	const typeName = ref('综合')
	const typeValue = ref('all')
	const playTypeCodeList = ref([])
	const allDataList = ref([])
	const predictList = ref([])

	onBeforeMount(async () => {
		getUrlParams()
		await nextTick()
		activeValue.value = expertUserSenseStore.sense
	})

	const onLoad = async () => {
		loading.value = true
		page.value += 1

		const newList = await simulateAsyncDataFetch()

		predictList.value.push(...newList)
		loading.value = false

		if (newList.length < pageSize) finished.value = true
	}

	async function getCurrentPredict() {
		const { code: gameType } = getCurrentLotteryType()
		const res = await getCurrentPredictWithUser({
			userId: props.data.userId,
			gameType,
		})
		const list = _get(res, 'data', [])

		const handledList = list.flatMap((item) => {
			const { senseList, ...rest } = item
			return senseList.map((innerItem) => ({
				...innerItem,
				gameSubName: innerItem.gameName,
				gameSubCode: innerItem.gameCode,
				...rest,
				userId: props.data.userId,
			}))
		})

		allDataList.value.push(...handledList)
		predictList.value = allDataList.value.slice(0, pageSize)
	}

	async function getHistoryPredict() {
		const { code: gameType } = getCurrentLotteryType()
		const res = await getHistoryPredictWithUser({
			userId: props.data.userId,
			gameType,
			playCode: typeValue.value,
		})
		const data = _omit(_get(res, 'data', {}), 'senseList')
		const list = _get(res, 'data.senseList', [])

		const handledList = list.map((item) => {
			return {
				...item,
				gameSubName: item.gameName,
				gameSubCode: item.gameCode,
				...data,
				userId: props.data.userId,
			}
		})

		allDataList.value.push(...handledList)
		predictList.value = allDataList.value.slice(0, pageSize)
	}

	async function getPlayTypeCodeList() {
		const res = await getPlayTypeCode({
			bizFlag: 'r',
		})
		const list = _get(res, 'data.list', [])
		playTypeCodeList.value.push(...list)
		fetchDone.value = true
	}

	// 模擬異步取資料
	function simulateAsyncDataFetch() {
		return new Promise((resolve) => {
			setTimeout(() => {
				const data = allDataList.value.slice(
					(page.value - 1) * pageSize,
					page.value * pageSize
				)
				resolve(data)
			}, 100)
		})
	}

	function getUrlParams() {
		const params = new URL(window.location.href).searchParams
		const senseValue = params.get('sense') ?? 'current'
		expertUserSenseStore.setSense(senseValue)
		updateURLParameter('sense', senseValue)
	}

	watch(
		() => activeValue.value,
		(newValue) => {
			page.value = 1
			allDataList.value = []
			predictList.value = []
			finished.value = false
			expertUserSenseStore.setSense(newValue)
			updateURLParameter('sense', newValue)
			if (newValue == 'current') {
				getCurrentPredict()
			} else {
				if (playTypeCodeList.value.length == 0) getPlayTypeCodeList()
				getHistoryPredict()
			}
		}
	)

	watch(
		() => typeValue.value,
		(newValue) => {
			page.value = 1
			allDataList.value = []
			predictList.value = []
			finished.value = false
			getHistoryPredict()
		}
	)
</script>

<style></style>
