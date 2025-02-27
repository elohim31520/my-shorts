import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMyTabCategoryStore = defineStore('myTabCategory', () => {
	const urlView = ref('')
	const urlSubView = ref('')

	function setView(view, subView) {
		urlView.value = view
		urlSubView.value = subView
	}
	function getView() {
		return { view: urlView.value, subView: urlSubView.value }
	}

	const pageUserId = ref('')
	const pageFollowFlag = ref('')
	const pictureTotal = ref('')
	const forumTotal = ref('')
	function setTotal(type, total) {
		if (type == 'picture') {
			pictureTotal.value = total || 0
		} else if (type == 'forum') {
			forumTotal.value = total || 0
		}
	}

	function setPageIsFollow(userId, flag) {
		const someoneUserId = window.location.pathname.split('/')[2]
		if (someoneUserId == userId) {
			pageUserId.value = userId
			pageFollowFlag.value = flag
		}
	}

	return {
		setView,
		getView,
		urlView,
		urlSubView,
		setPageIsFollow,
		pageUserId,
		pageFollowFlag,
		setTotal,
		pictureTotal,
		forumTotal,
	}
})
