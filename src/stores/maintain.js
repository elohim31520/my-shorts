import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMaintainStore = defineStore('maintain', () => {
	const items = ref([])

	function setItems(value) {
		items.value = value
	}
	return { items, setItems }
})
