import { reactive } from 'vue'

const kvList = reactive([]) // 獲取KV的原始資料

export const useWaterfall = () => {
	return {
		kvList,
	}
}
