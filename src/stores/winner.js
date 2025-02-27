import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getContinueWinnerList } from '@/api/winner'
import { getCurrentLotteryType } from '@/modules/util'

export const useWinnerStore = defineStore('winner', () => {
	const isOnly = ref(false)
	const lists = ref([])
	const total = ref(0)
	const sortName = ref('recent_continue_win_count')
	const playTypeCodeList = ref([])
	const predictionTypeName = ref('')
	const predictionTypeCode = ref(null)
	const sortOrder = ref('DESC')

	const getWinnerList = async ({ page = 1, size = 10, playTypeCode = '' }) => {
		const gameType = getCurrentLotteryType().code

		const res = await getContinueWinnerList({
			page,
			size,
			isAll: !isOnly.value,
			playTypeCode,
			sortName: sortName.value,
			gameType,
			sortOrder: sortOrder.value,
		})

		if (res.success) {
			total.value = parseInt(_get(res, 'data.total', 0))
			const appendLists = _get(res, 'data.list', [])
			lists.value =
				page < 2 ? [...appendLists] : [...lists.value, ...appendLists]
		}

		return res
	}

	return {
		isOnly,
		lists,
		sortName,
		playTypeCodeList,
		predictionTypeName,
		predictionTypeCode,
		getWinnerList,
	}
})
