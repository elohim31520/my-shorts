import { ref, computed, reactive, watch } from 'vue'
import { useDisplayStates } from '@/views/chatRoom/useDisplayStates'

const { showPicture, showCreation } = useDisplayStates()

const selectedOptions = reactive([])
const maxSelections = 9
const kvList = reactive([]) // 獲取KV的原始資料

const selectedMap = computed(() => {
	const map = new Map()
	_forEach(selectedOptions, (item, index) => map.set(item, index))
	return map
})

watch([showPicture, showCreation], () => {
	useSelector().handleReset()
})

export function useSelector() {
	const toggleOptionSelection = (item) => {
		const index = _findIndex(selectedOptions, item)
		if (index == -1) {
			// 尚未選擇，且未達最大選擇數量則選中
			if (selectedOptions.length < maxSelections) selectedOptions.push(item)
		} else {
			// 已選擇，點擊後取消選擇
			selectedOptions.splice(index, 1)
		}
	}

	const handleReset = () => {
		selectedOptions.length = 0
	}

	return {
		selectedOptions,
		toggleOptionSelection,
		selectedMap,
		handleReset,
		kvList,
	}
}
