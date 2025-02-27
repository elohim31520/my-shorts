import { nextTick } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { useFontSize } from '@/modules/util'

export function useScrollToElement() {
	const scrollToElement = async (options) => {
		const { target, offset = 0, behavior = 'smooth' } = options

		await nextTick()

		let targetElement = null

		if (_isString(target)) {
			// 通過選擇器獲取元素
			targetElement = document.querySelector(target)
		} else if (target instanceof Element) {
			// 直接使用傳入的元素
			targetElement = target
		} else {
			console.error('無效的目標元素或選擇器')
			return
		}

		if (targetElement) {
			const { y } = useWindowScroll({ behavior })
			const offsetTop = targetElement.offsetTop

			y.value = offsetTop + useFontSize(offset).value
		}
	}

	return {
		scrollToElement,
	}
}
