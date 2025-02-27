import { ref, onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'

export function useDragScroll(target) {
	const isDragging = ref(false)
	let element = null
	let startX = 0
	let scrollLeft = 0

	const startDragging = (event) => {
		isDragging.value = true
		startX = event.clientX
		scrollLeft = element.scrollLeft
	}

	const stopDragging = () => {
		isDragging.value = false
	}

	const onDragging = (event) => {
		if (!isDragging.value) return
		const walk = (event.clientX - startX) * 2
		element.scrollLeft = scrollLeft - walk
	}

	onMounted(() => {
		element = _isString(target) ? document.querySelector(target) : target?.value

		if (!element) return
		useEventListener(element, 'mousedown', startDragging)
		useEventListener(element, 'mousemove', onDragging)
		useEventListener(element, 'mouseup', stopDragging)
		useEventListener(element, 'mouseleave', stopDragging)
	})

	return { isDragging }
}
