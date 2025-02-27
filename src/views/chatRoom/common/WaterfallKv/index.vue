<template>
	<div>
		<van-list
			v-model:loading="isLoadingMore"
			:finished="isFinished"
			finished-text="没有更多了"
			@load="onLoad"
			:immediate-check="false"
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
	</div>
</template>

<script setup>
	import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'

	import Card from '../Card/index.vue'

	import { useGallery } from '@/hooks/useGallery'
	import {
		getRecommendGallery,
		getAllGallery,
		getPictureList,
	} from '@/api/picture'
	import { getLotteryCode } from '@/modules/util'
	import { useSelector } from '../useSelector'

	const { toggleOptionSelection, kvList } = useSelector()
	const { formatGalleryData } = useGallery()

	const props = defineProps({
		lotteryType: {
			type: String,
			require: true,
		},
	})

	const list = reactive([])
	const isLoadingMore = ref(false)
	const isKVFinished = ref(false)
	const isFinished = ref(false)
	const page = ref(1)
	const kvPage = ref(0)
	const size = 10
	const total = ref(0)

	const onLoad = async () => {
		if (isFinished.value) return

		isLoadingMore.value = true

		// 結束條改為kv取完，取api
		if (isKVFinished.value) {
			const res = await getPictureList({
				gameType: getLotteryCode(props.lotteryType),
				page: page.value,
				size,
			})
			const newData = _get(res, 'data.list', [])
			const apiPath = _get(res, 'apiPath', '')
			total.value = +_get(res, 'data.total', 0)

			list.push(..._map(newData, (data) => formatGalleryData(data, apiPath)))
			page.value += 1

			isFinished.value = list.length >= +total.value + kvList.length
			if (!newData.length) {
				isFinished.value = true
			}
		} else {
			const newData = kvList.slice(
				kvPage.value * size,
				(kvPage.value + 1) * size
			)
			if (!newData.length) {
				isKVFinished.value = true
			}

			list.push(...newData)
			kvPage.value += 1
		}

		await nextTick()
		isLoadingMore.value = false
	}

	const galleryList1 = computed(() =>
		_filter(list, (_, index) => index % 2 === 0)
	)

	const galleryList2 = computed(() =>
		_filter(list, (_, index) => index % 2 !== 0)
	)

	const reset = async () => {
		list.splice(0, list.length)
		await nextTick()
		isLoadingMore.value = false
		isFinished.value = false
		isKVFinished.value = false
		page.value = 1
		kvPage.value = 0
		total.value = 0
		onLoad()
	}

	defineExpose({ reset })

	const fetchData = async (apiFunction, lotteryType) => {
		const res = await apiFunction({
			lotteryType,
		})
		const apiPath = _get(res, 'apiPath', '')
		return _map(_get(res, 'data.issueList', []), (data) =>
			formatGalleryData(data, apiPath)
		)
	}

	const AD_TYPE = 'a'

	const getGalleriesKV = async (lotteryType) => {
		// 先獲取推薦圖紙
		const recommendedData = await fetchData(getRecommendGallery, lotteryType)
		const filterdRecommendData = _filter(
			recommendedData,
			(vo) => vo.type != AD_TYPE
		)
		kvList.push(...filterdRecommendData)

		// 再獲取所有圖紙
		const currentData = await fetchData(getAllGallery, lotteryType)
		const filterdCurrentData = _filter(currentData, (vo) => vo.type != AD_TYPE)
		kvList.push(...filterdCurrentData)
	}

	onMounted(async () => {
		await getGalleriesKV(props.lotteryType)
		onLoad()
	})

	watch(
		() => props.lotteryType,
		async (newValue) => {
			// 彩種變化，重置kv
			kvList.splice(0, kvList.length)

			await getGalleriesKV(newValue)

			reset()
			window.scrollTo(0, 0)
		}
	)
</script>
