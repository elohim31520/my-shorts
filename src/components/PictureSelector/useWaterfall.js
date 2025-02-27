import { ref, reactive, computed, nextTick } from 'vue'
import { useGallery } from '@/hooks/useGallery'
import { useSelector } from './useSelector'
import {
	getPictureList,
	getRecommendGallery,
	getAllGallery,
} from '@/api/picture'

const { selectedSeriesCode, selectedLottery } = useSelector()

const RECOMMEND_CODE = 'RECOMMEND_CODE'
const apiParams = ref({})

const list = reactive([])
const isLoadingMore = ref(false)
const isFinished = ref(false)
const page = ref(1)
const size = 10
const total = ref(0)

const kvMap = new Map()
const isKVFinished = ref(false)
const kvPage = ref(0)

const isUseKV = ref()

const galleryList1 = computed(() =>
	_filter(list, (_, index) => index % 2 === 0)
)

const galleryList2 = computed(() =>
	_filter(list, (_, index) => index % 2 !== 0)
)

export function useWaterfall() {
	const { formatGalleryData } = useGallery()

	const loadAPi = async () => {
		isLoadingMore.value = true

		const params = {
			page: page.value,
			size,
			seriesCode: _getSeriesCodeParam(),
			...apiParams.value,
		}
		const res = await getPictureList(params)
		const newData = _get(res, 'data.list', [])
		const apiPath = _get(res, 'apiPath', '')
		total.value = +_get(res, 'data.total', 0)

		if (newData.length == 0) {
			isFinished.value = true
		}

		list.push(..._map(newData, (data) => formatGalleryData(data, apiPath)))
		page.value += 1
		isFinished.value = list.length >= total.value
		await nextTick()
		isLoadingMore.value = false
	}

	const loadKV = async () => {
		isLoadingMore.value = true
		const kvList = fetchKvList(selectedLottery.value)
		const current = kvPage.value * size
		const next = (kvPage.value + 1) * size
		const newData = kvList.slice(current, next)
		if (!newData.length) {
			isKVFinished.value = true
		}

		list.push(...newData)
		kvPage.value += 1
		await nextTick()
		isLoadingMore.value = false
	}

	const onLoad = async () => {
		if (isUseKV.value && !isKVFinished.value) {
			await loadKV()
		} else {
			await loadAPi()
		}
	}

	const reset = async () => {
		// 重置狀態
		list.splice(0, list.length)
		isLoadingMore.value = false
		isFinished.value = false
		page.value = 1
		total.value = 0

		isKVFinished.value = false
		kvPage.value = 0
	}

	async function _fetchData(apiFunction, lotteryType) {
		const res = await apiFunction({
			lotteryType,
		})
		const apiPath = _get(res, 'apiPath', '')
		return _map(_get(res, 'data.issueList', []), (data) =>
			formatGalleryData(data, apiPath)
		)
	}

	function _getSeriesCodeParam() {
		return selectedSeriesCode.value == RECOMMEND_CODE
			? ''
			: selectedSeriesCode.value
	}

	const AD_TYPE = 'a'

	const cacheGalleriesKV = async (lotteryType) => {
		if (kvMap.has(lotteryType)) {
			return
		}
		// 先獲取推薦圖紙
		const recommendedData = await _fetchData(getRecommendGallery, lotteryType)
		const filterdRecommendData = _filter(
			recommendedData,
			(vo) => vo.type != AD_TYPE
		)
		// 再獲取所有圖紙
		const currentData = await _fetchData(getAllGallery, lotteryType)
		const filterdCurrentData = _filter(currentData, (vo) => vo.type != AD_TYPE)
		kvMap.set(lotteryType, [...filterdRecommendData, ...filterdCurrentData])
	}

	const fetchKvList = (lotteryType) => {
		return kvMap.get(lotteryType) || []
	}

	return {
		list,
		isLoadingMore,
		isFinished,
		onLoad,
		reset,
		galleryList1,
		galleryList2,
		isUseKV,
		cacheGalleriesKV,
		fetchKvList,
		apiParams,
		RECOMMEND_CODE,
	}
}
