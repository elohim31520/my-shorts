import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMaterialStore = defineStore('material', () => {
    const lotteryResultInfo = ref({})

	return { lotteryResultInfo }
})