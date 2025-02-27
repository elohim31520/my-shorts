import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginPopupStore = defineStore('loginPopup', () => {
	const show = ref(false)
	function toggle() {
		show.value = !show.value
	}
	return { show, toggle }
})
