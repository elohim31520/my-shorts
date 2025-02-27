import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDonatePopupStore = defineStore('donatePopup', () => {
	const show = ref(false)
	const recipient = ref(null) //受款者
	const recipientName = ref(null)

	function toggle(userId, userName) {
		show.value = !show.value
		recipient.value = userId
		recipientName.value = userName
	}

	return { show, toggle, recipient, recipientName }
})
