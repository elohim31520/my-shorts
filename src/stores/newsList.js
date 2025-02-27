import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNewsStore = defineStore('newsList', () => {
	const isAnyUnread = ref(false)

	function changeUnread(data) {
		isAnyUnread.value = data
	}
	return { isAnyUnread, changeUnread }
})
