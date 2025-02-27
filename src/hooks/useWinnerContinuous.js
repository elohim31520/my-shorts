import { ref } from 'vue'
import { getContinueWinnerList } from '@/api/winner'
import { getCurrentLotteryType } from '@/modules/util'

export function useWinnerContinuous() {
	const page = ref(1)
	const pageSize = ref(10)

	const loading = ref(false)
	const finished = ref(false)
	const refresh = ref(false)
	const lists = ref([])
	const total = ref(0)

	const gameType = getCurrentLotteryType().code
	const playTypeCode = ref('')
	const sortName = ref('recent_continue_win_count')
	const isOnly = ref(false)
	const sortOrder = ref('DESC')

	const onLoad = async () => {
		if (refresh.value) {
			page.value = 1
			total.value = 0
			lists.value = []
			refresh.value = false
		}

		const res = await getContinueWinnerList({
			page: page.value,
			size: pageSize.value,
			isAll: !isOnly.value,
			playTypeCode: playTypeCode.value,
			sortName: sortName.value,
			gameType: Number(gameType),
			sortOrder: sortOrder.value,
		})

		if (res.success) {
			total.value = _get(res, 'data.total', 0)
			const array = _get(res, 'data.list', [])
			lists.value = page.value < 2 ? [...array] : [...lists.value, ...array]

			if (lists.value.length >= parseInt(total.value)) {
				finished.value = true
			} else {
				page.value += 1
			}
		}

		loading.value = false
	}

	return {
		loading,
		finished,
		refresh,
		lists,
		onLoad,
		playTypeCode,
		sortName,
		isOnly,
	}
}
