import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollPosition() {
	const scrollTop = ref(0)
	let ticking = false

	const updateScrollTop = () => {
		scrollTop.value = window.scrollY || document.documentElement.scrollTop
		ticking = false
	}

	const handleScroll = () => {
		if (!ticking) {
			window.requestAnimationFrame(updateScrollTop)
			ticking = true
		}
	}

	onMounted(() => {
		window.addEventListener('scroll', handleScroll)
		// 初始設置
		updateScrollTop()
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
	})

	return scrollTop
}
