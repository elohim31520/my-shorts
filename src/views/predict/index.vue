<template>
	<div class="com-min-h-with-header mt-45 bg-#fafafa">
		<NormalHeader title="精选心水" border-bottom-color="#F2F2F2" />
		<SearchBar
			v-model="keyword"
			placeholder="搜寻心水"
			class="p-10"
			@click-search="onClickSearch"
		/>
		<NoContent v-if="handledList.length == 0 && !fetchDone" text="暂无数据" />
		<van-list
			v-if="handledList.length > 0"
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
			:immediate-check="false"
		>
			<div class="mt-10 px-10">
				<Prediction
					v-for="(vo, index) in handledList"
					:key="index"
					:data="vo"
					:showAvatar="true"
					:showFooter="true"
					class="mb-10"
				/>
			</div>
		</van-list>

		<NotFound
			v-if="handledList.length == 0 && fetchDone"
			text="未搜到相关的内容，请重新输入"
		/>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import SearchBar from '@/components/SearchBar/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import Prediction from '@/components/Prediction/index.vue'
	import NotFound from '@/components/NotFound/index.vue'
	import { getCurrentLotteryType } from '@/modules/util'
	import { getPredictRecommend } from '@/api/predict.js'
	import { ref, computed } from 'vue'

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

	const keyword = ref('')
	const fetchDone = ref(false)
	const predictList = ref(_get(props.data, 'predictRecommend.data.list', []))
	const handledList = computed(() => {
		return predictList.value.flatMap((item) => {
			const { senseList, ...rest } = item
			return senseList.map((innerItem) => ({
				...innerItem,
				gameSubName: innerItem.gameName,
				gameSubCode: innerItem.gameCode,
				...rest,
			}))
		})
	})

	const onLoad = async () => {
		loading.value = true
		page.value += 1
		await getPredictList()
		loading.value = false
	}

	async function getPredictList() {
		const { code: gameType } = getCurrentLotteryType()
		const res = await getPredictRecommend({
			page: page.value,
			size: pageSize,
			title: keyword.value,
			gameType,
		})
		const list = _get(res, 'data.list', [])
		const total = _get(res, 'data.total', 0)
		predictList.value.push(...list)
		finished.value = predictList.value.length >= total || list.length == 0
	}

	async function onClickSearch() {
		fetchDone.value = false
		page.value = 1
		predictList.value = []
		await getPredictList()
		fetchDone.value = true
	}
</script>

<style lang="scss" scoped></style>
