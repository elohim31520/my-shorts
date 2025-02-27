import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLotteryStore } from '@/stores/lottery'
import { getCurrentLotteryType } from '@/modules/util'
import { predictBuyList } from '@/api/predict.js'

export function useMyBuy() {
	const page = ref(1)
	const pageSize = ref(10)

	const loading = ref(false)
	const finished = ref(false)
	const refresh = ref(false)
	const lists = ref([])
	const total = ref(0)

	const { lotteryType } = storeToRefs(useLotteryStore())
	const gameType = computed(() => getCurrentLotteryType(lotteryType.value).code)
	const sortName = ref('')

	const onLoad = async () => {
		if (refresh.value) {
			page.value = 1
			total.value = 0
			lists.value = []
			refresh.value = false
		}

		const res = await predictBuyList({
			page: page.value,
			size: pageSize.value,
			sortName: sortName.value,
			gameType: Number(gameType.value),
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
		gameType,
	}
}
