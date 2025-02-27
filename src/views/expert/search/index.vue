<template>
	<div class="px-10">
		<NormalHeader title="搜索" />
		<SearchBar
			placeholder="搜寻用户"
			v-model="keyword"
			class="mt-55 mb-10"
			@click-search="onClickSearch"
		/>

		<p class="color-#434343 text-18 font-600 my-10">推荐专家</p>
		<van-list
			v-show="items.length > 0"
			finished-text="没有更多了"
			:finished="isFinished || useKV"
			v-model:loading="isLoading"
			@load="onLoad"
			:immediate-check="false"
		>
			<User
				v-for="(vo, index) in items"
				:key="index"
				class="my-10"
				:user="vo"
			/>
		</van-list>

		<NotFound
			v-show="items.length == 0 && fetchDone"
			text="未搜到相关的内容，请重新输入"
		/>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import SearchBar from '@/components/SearchBar/index.vue'
	import NotFound from '@/components/NotFound/index.vue'
	import ClientOnly from '@/components/ClientOnly/index.vue'
	import User from './User/index.vue'
	import { ref, onBeforeMount, computed, watch } from 'vue'
	import { getRecommendExpert, expertSearch } from '@/api/expert.js'
	import { isBlank } from '@/modules/util.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const itemsKV = ref(_get(props.data, 'items', []))
	const itemsApi = ref([])
	const keyword = ref('')
	const useKV = ref(true)
	const fetchDone = ref(false)
	const isLoading = ref(false)
	const isFinished = ref(false)
	const page = ref(1)
	const size = 10

	onBeforeMount(getItems)

	watch(
		() => keyword.value,
		(value) => {
			if (isBlank(value)) useKV.value = true
		}
	)

	const items = computed(() => {
		return useKV.value ? itemsKV.value : itemsApi.value
	})

	//從KV獲取，前10筆SSR，其他的CSR
	async function getItems() {
		const res = await getRecommendExpert()
		const rest = _slice(_get(res, 'data', []), 10)
		itemsKV.value.push(...rest)
	}

	async function onClickSearch() {
		if (isBlank(keyword.value)) return
		page.value = 1
		itemsApi.value = []
		doFetch()
	}

	async function doFetch() {
		fetchDone.value = false
		useKV.value = false
		const res = await expertSearch({
			name: keyword.value,
			page: page.value,
			size,
		})
		const { total, list } = res.data
		itemsApi.value.push(...list)
		isLoading.value = false
		isFinished.value = itemsApi.value.length >= total
		fetchDone.value = true
	}

	function onLoad() {
		page.value++
		doFetch()
	}
</script>
