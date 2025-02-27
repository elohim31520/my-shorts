import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLotteryStore = defineStore(
	'lottery',
	() => {
		const lotteryType = ref('a6')
		function setLotteryType(value) {
			lotteryType.value = value
		}

		return {
			lotteryType,
			setLotteryType,
		}
	},
	{
		persistedState: {
			// 啟用狀態持久化功能，使用 cookies 作為儲存介質
			persist: true,
		},
	}
)
