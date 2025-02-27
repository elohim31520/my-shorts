<template>
	<van-list
		v-model:loading="isLoadingMore"
		:finished="isFinished"
		@load="onLoad"
	>
		<div class="w-full flex justify-between p-5 bg-#FAFAFA">
			<div class="w-49%">
				<div
					class="mb-8 shadow-primary rounded-7 overflow-hidden"
					v-for="(item, index) in galleryList1"
					:key="index"
				>
					<Card
						:data="item"
						:order="index"
						@click="toggleOptionSelection(item)"
					/>
				</div>
			</div>
			<div class="w-49%">
				<div
					class="mb-8 shadow-primary rounded-7 overflow-hidden"
					v-for="(item, index) in galleryList2"
					:key="index"
				>
					<Card
						:data="item"
						:order="index"
						@click="toggleOptionSelection(item)"
					/>
				</div>
			</div>
		</div>
	</van-list>
	<NoContent v-show="list.length == 0" text="暂无数据" />
</template>

<script setup>
	import NoContent from '@/components/NoContent/index.vue'
	import Card from '../Card/index.vue'

	import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
	import { useGallery } from '@/hooks/useGallery'
	import { useMyTabCategoryStore } from '@/stores/MyTabCategory'
	import { useSelector } from '../useSelector'

	const { formatGalleryData } = useGallery()
	const useMyTabStore = useMyTabCategoryStore()
	const { setTotal } = useMyTabStore
	const { toggleOptionSelection } = useSelector()

	const props = defineProps({
		apiParams: {
			type: Object,
			default: () => ({}),
		},
		top: {
			type: Number,
			default: 0,
		},
		apiFunction: {
			type: Object,
			default: () => {},
		},
	})

	const list = reactive([]) // 用於 Vant List 的顯示資料

	// Vant List 使用的狀態
	const isLoadingMore = ref(false)
	const isFinished = ref(false)
	const page = ref(1)
	const size = ref(10)
	const total = ref(0)

	const onLoad = async () => {
		if (isFinished.value) return

		isLoadingMore.value = true

		const params = { page: page.value, size: size.value, ...props.apiParams }
		const res = await props.apiFunction(params)
		const newData = _get(res, 'data.list', [])
		const apiPath = _get(res, 'apiPath', '')
		total.value = +_get(res, 'data.total', 0)
		setTotal('picture', total.value)

		if (newData.length == 0) {
			isFinished.value = true
		}

		list.push(..._map(newData, (data) => formatGalleryData(data, apiPath)))
		isFinished.value = list.length >= total.value

		page.value += 1

		isLoadingMore.value = false
		await nextTick()
	}

	const galleryList1 = computed(() =>
		_filter(list, (_, index) => index % 2 === 0)
	)

	const galleryList2 = computed(() =>
		_filter(list, (_, index) => index % 2 !== 0)
	)

	watch(
		() => props.apiParams,
		(newValue, oldValue) => {
			// 重置狀態
			list.length = 0
			isLoadingMore.value = false
			isFinished.value = false
			page.value = 1
			size.value = 10
			total.value = 0

			onLoad()
		},
		{ deep: true }
	)
</script>
