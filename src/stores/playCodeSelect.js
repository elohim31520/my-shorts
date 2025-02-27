import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayCodeSelectStore = defineStore('playCodeSelect', () => {
	const show = ref(false)
	const playTypeCode = ref('')

	function open() {
		show.value = true
	}

	function changePlayTypeCode(val) {
		playTypeCode.value = val
	}

	return { show, playTypeCode, open, changePlayTypeCode }
})
