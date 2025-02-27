import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDrawScreeningStore = defineStore('drawScreening', () => {
	const show = ref(false)

	function open() {
		show.value = true
	}

	return { show, open }
})
