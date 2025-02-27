import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export const useForumListStore = defineStore('forumList', () => {
	const target = ref(null)
	const targetIsVisible = ref(false)
	const top = ref(0)
	const minHeight = ref(0)

	function setTop(value) {
		top.value = value
	}

	function setMinHeight(value) {
		minHeight.value = value
	}

	onMounted(() => {
		const headerEl =
			document.getElementById('home-header') ||
			document.querySelector('.the-header')
		const headerHeight = _get(headerEl, 'offsetHeight', 0)
		useIntersectionObserver(
			target,
			([entry]) => {
				targetIsVisible.value = entry?.isIntersecting || false
			},
			{
				rootMargin: `-${headerHeight + 20}px 0px 0px 0px`,
			}
		)
	})

	return { target, targetIsVisible, top, setTop, minHeight, setMinHeight }
})
