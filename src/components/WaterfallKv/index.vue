<template>
	<div>
		<PageSsr v-if="isSsr" />

		<van-list
			v-model:loading="isLoadingMore"
			:finished="isFinished"
			finished-text="没有更多了"
			@load="onLoad"
			:immediate-check="false"
			v-else
		>
			<div class="w-full flex justify-between p-5 bg-#FAFAFA">
				<div class="w-49%">
					<div
						class="mb-8 shadow-primary rounded-7 overflow-hidden"
						v-for="(item, index) in galleryList1"
						:key="index"
					>
						<!-- 廣告是多張圖用輪播圖 -->
						<Advertisement v-if="item.type == 'a'" :data="item" />
						<Drawing
							v-else
							:data="item"
							:order="index"
							:showIssue="showIssue"
						/>
					</div>
				</div>
				<div class="w-49%">
					<div
						class="mb-8 shadow-primary rounded-7 overflow-hidden"
						v-for="(item, index) in galleryList2"
						:key="index"
					>
						<!-- 廣告是多張圖用輪播圖 -->
						<Advertisement v-if="item.type == 'a'" :data="item" />
						<Drawing
							v-else
							:data="item"
							:order="index"
							:showIssue="showIssue"
						/>
					</div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script setup>
	import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
	import { storeToRefs } from 'pinia'

	import PageSsr from '@/components/WaterfallKv/PageSsr/index.vue'
	import Drawing from '@/components/Drawing/index.vue'
	import Advertisement from '@/components/Advertisement/index.vue'

	import { useWaterfall } from './useWaterfall'
	import { useLotteryStore } from '@/stores/lottery'
	import { useGallery } from '@/hooks/useGallery'
	import {
		getRecommendGallery,
		getAllGallery,
		getPictureList,
	} from '@/api/picture'
	import { getLotteryCode } from '@/modules/util'

	const props = defineProps({
		showIssue: {
			type: Boolean,
			default: false,
		},
	})

	const { formatGalleryData } = useGallery()
	const { kvList } = useWaterfall()
	const { lotteryType } = storeToRefs(useLotteryStore())

	const list = reactive([]) // 用於 Vant List 的顯示資料
	const isSsr = ref(true)

	// Vant List 使用的狀態
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
				gameType: getLotteryCode(lotteryType.value),
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

	onMounted(async () => {
		isSsr.value = false
		// 推薦的資料最多是60筆做SSR用，call current的KV拿更多
		const res = await getAllGallery({ lotteryType: lotteryType.value })
		const apiPath = _get(res, 'apiPath', '')
		const list = _map(_get(res, 'data.issueList', []), (data) =>
			formatGalleryData(data, apiPath)
		)

		kvList.push(...list)
		onLoad()
	})

	watch(
		() => lotteryType.value,
		async (newValue) => {
			// 彩種變化，重置kv
			kvList.splice(0, kvList.length)

			const fetchData = async (apiFunction) => {
				const res = await apiFunction({ lotteryType: newValue })
				const apiPath = _get(res, 'apiPath', '')
				return _map(_get(res, 'data.issueList', []), (data) =>
					formatGalleryData(data, apiPath)
				)
			}

			// 先獲取推薦圖紙
			const recommendedData = await fetchData(getRecommendGallery)
			kvList.push(...recommendedData)

			// 再獲取所有圖紙
			const allData = await fetchData(getAllGallery)
			kvList.push(...allData)

			reset()
		}
	)
</script>
