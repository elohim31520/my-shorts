import { ref, onBeforeUnmount } from 'vue'
import { getCid, getWebSocketProtocol, getOrDefault } from '@/modules/util'
import { useUserStore } from '@/stores/user'
import { useWebInfo } from '@/hooks/useWebInfo'
import ReconnectingWebSocket from 'reconnecting-websocket'

const ws = ref(null)
const onMessage = ref(null)
const isConnected = ref(true) // 用於表示連接狀態
const currentReconnectCount = ref(0)
const isReconnectLimitReached = ref(false) // 用於表示重連次數是否已達上限

const maxReconnectCount = 20

export function useWebSocket() {
	function connect() {
		const { data: userData } = useUserStore()
		const { getManageSiteId } = useWebInfo()

		// 用戶信息
		const cid = getCid()
		const anonymousToken = getOrDefault(userData, 'anonymousToken', '')
		const token = getOrDefault(userData, 'token', anonymousToken)
		const manageSiteId = getManageSiteId()
		const clientType = window?._global?.clientType
		const wsBaseUrl = import.meta.env.PUBLIC_BASE_CHAT_WS_URL
		const protocol = getWebSocketProtocol()
		const businessType = 'XTK'

		if (!cid || !token || !manageSiteId || !clientType) {
			console.error('WebSocket url 組成錯誤')
			console.table({
				cid,
				token,
				manageSiteId,
				clientType,
			})
			return
		}

		const serverUrl = `${protocol}${wsBaseUrl}/${cid}/${token}/${clientType}/${businessType}/${manageSiteId}`

		// 如果已有連接，先關閉
		if (ws.value) {
			ws.value.close()
		}

		ws.value = new ReconnectingWebSocket(serverUrl, [], {
			maxRetries: maxReconnectCount,
			reconnectInterval: 5000,
		})

		ws.value.onopen = () => {
			console.log('WebSocket 連接已打開')
			isConnected.value = true
			currentReconnectCount.value = 0
			isReconnectLimitReached.value = false
		}

		ws.value.onmessage = (event) => {
			if (onMessage.value) {
				onMessage.value(event)
			}
		}

		ws.value.onerror = (error) => {
			console.error('WebSocket 錯誤', error)
		}

		ws.value.onclose = () => {
			console.log('WebSocket 連接已關閉')
			isConnected.value = false
			currentReconnectCount.value += 1
			if (currentReconnectCount.value >= maxReconnectCount) {
				isReconnectLimitReached.value = true
			}
		}
	}

	function setOnMessage(callback) {
		onMessage.value = callback
	}

	function send(data) {
		if (ws.value && ws.value.readyState === WebSocket.OPEN) {
			ws.value.send(JSON.stringify(data))
		} else {
			console.error('WebSocket 連接未打開')
		}
	}

	// onBeforeUnmount(() => {
	// 	if (ws.value) ws.value.close()
	// })

	return {
		ws,
		connect,
		send,
		setOnMessage,
		isConnected,
		currentReconnectCount,
		isReconnectLimitReached,
	}
}
