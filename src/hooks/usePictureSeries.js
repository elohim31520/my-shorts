import { getPictureSeriesApi } from '@/api/picture'

const PICTURE_SERIES_KEY_PREFIX = 'picture-series-'

function generateSeriesKey(lotteryType) {
	return `${PICTURE_SERIES_KEY_PREFIX}${lotteryType}`
}

const pictureSeriesCache = new Map()

export function usePictureSeries() {
	const fetchSeries = (lotteryType) => {
		if (typeof lotteryType !== 'string' || lotteryType.trim() === '') {
			console.error('缺少參數:', lotteryType)
			return []
		}
		const key = generateSeriesKey(lotteryType)
		return pictureSeriesCache.get(key) || []
	}

	const cacheSeries = async (lotteryType, force = false) => {
		if (typeof lotteryType !== 'string' || lotteryType.trim() === '') {
			console.error('缺少參數:', lotteryType)
			return
		}
		const key = generateSeriesKey(lotteryType)

		// 如果不是強制更新且已有數據，不再獲取
		if (!force && pictureSeriesCache.has(key)) {
			return
		}

		const res = await getPictureSeriesApi({ lotteryType })
		pictureSeriesCache.set(key, res?.data || [])
	}

	return {
		fetchSeries,
		cacheSeries,
	}
}
