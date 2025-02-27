import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSsrStore = defineStore('ssr', () => {
	const count1 = ref(0)

	return { count1 }
})
