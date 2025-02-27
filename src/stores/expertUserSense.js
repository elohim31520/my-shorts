import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExpertUserSenseStore = defineStore('expertUserSense', () => {
	const sense = ref('')

	function setSense(val) {
		sense.value = val
	}

	return { sense, setSense }
})
