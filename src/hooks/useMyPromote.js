import { ref } from 'vue'
import { getMyCustomerList, getOtherCustomerList } from '@/api/promote.js'

export function useMyPromote() {
	const page = ref(1)
	const pageSize = ref(10)

	const loading = ref(false)
	const finished = ref(false)
	const refresh = ref(false)
	const lists = ref([])
	const total = ref(0)

	const tabItems = [
		{ name: '我的客户', level: 1 },
		{ name: '其他客户', level: 2 },
	]
	const activeLevel = ref(1)
	const keyword = ref('')

	const onLoad = async () => {
		if (refresh.value) {
			page.value = 1
			total.value = 0
			lists.value = []
			refresh.value = false
		}

		let res = null
		if (activeLevel.value == 1) {
			res = await getMyCustomerList({
				page: page.value,
				pageSize: pageSize.value,
				nickname: keyword.value,
			})
		} else {
			res = await getOtherCustomerList({
				page: page.value,
				pageSize: pageSize.value,
				nickname: keyword.value,
			})
		}

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

	// 我的客戶/其他客戶 切換
	const clickTab = (level) => {
		activeLevel.value = level
	}

	// 搜尋“邀請客戶”
	const onClickSearch = async () => {
		refresh.value = true
		finished.value = false
		loading.value = true
		onLoad()
	}

	return {
		loading,
		finished,
		refresh,
		lists,
		onLoad,
		tabItems,
		activeLevel,
		keyword,
		clickTab,
		onClickSearch,
	}
}
