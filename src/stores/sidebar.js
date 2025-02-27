import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
	const visible = ref(false)
	function open() {
		visible.value = true
	}
	return { visible, open }
})
