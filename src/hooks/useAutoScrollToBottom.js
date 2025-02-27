import { ref, onMounted, watch, nextTick } from 'vue'
import { useEventListener, unrefElement } from '@vueuse/core'

/**
 * 當監控的資料更新時，若使用者當前已經在容器底部，則自動滾動到底部；若使用者正在查看舊訊息，則不會干擾其捲動位置
 *
 * @param {import('vue').Ref<HTMLElement | null> | HTMLElement} scrollContainerRef - 容器元素 (可為 ref 或原生 DOM)
 * @param {import('vue').Ref<any>} data - 會觸發捲動行為的監控資料
 */
export function useAutoScrollToBottom(scrollContainerRef, data) {
	// 當前是否在容器底部
	const isAtBottom = ref(true)
	const scrollTopFromBottom = ref(0)
	const containerElement = unrefElement(scrollContainerRef)

	// 取得距離底部的位置 (相對於容器底部)
	function getScrollTopFromBottom() {
		if (!containerElement) return 0
		return (
			containerElement.scrollHeight -
			containerElement.scrollTop -
			containerElement.clientHeight
		)
	}

	watch(
		() => data,
		async () => {
			await nextTick()
			// 若目前在最底部，則自動滾到底部
			if (isAtBottom.value) {
				scrollToBottom()
			}
			// 若使用者正在查看舊訊息，則不干擾他的捲動位置
		},
		{ deep: true }
	)

	const handleScroll = () => {
		if (!containerElement) return
		scrollTopFromBottom.value = getScrollTopFromBottom()
		// 檢查是否仍在底部
		isAtBottom.value = scrollTopFromBottom.value <= 5
	}

	/**
	 * 捲動到距離底部 offset 的位置
	 * @param {boolean} [always=false] - 是否強制執行捲動，即便不在底部也要捲下去
	 * @param {number} [offset=0] - 與底部的距離
	 */
	const scrollToBottom = (always = false, offset = 0) => {
		if (!containerElement) return
		if (always || isAtBottom.value) {
			containerElement.scrollTop =
				containerElement.scrollHeight - containerElement.clientHeight - offset
		}
	}

	scrollToBottom()
	useEventListener(containerElement, 'scroll', _throttle(handleScroll, 300))

	return {
		isAtBottom,
		scrollTopFromBottom,
		getScrollTopFromBottom,
		scrollToBottom,
	}
}
