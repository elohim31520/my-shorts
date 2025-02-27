export class WebSocketManager {
	constructor(requestUrl) {
		if (import.meta.env.SSR) return
		this.webSocket = null
		this.lockReconnect = false
		this.requestUrl = requestUrl
		this.heartbeatTimeout = 60000

		this.heartbeat = {
			timer: null,
			serverTimer: null,
			clearTimers: () => {
				clearTimeout(this.heartbeat.timer)
				clearTimeout(this.heartbeat.serverTimer)
			},
			reset: () => {
				this.heartbeat.clearTimers()
				this.heartbeat.start()
			},
			start: () => {
				this.heartbeat.timer = setTimeout(
					this.checkServerResponse.bind(this),
					this.heartbeatTimeout
				)
			},
		}

		this.initWebSocket()
	}

	checkServerResponse() {
		this.sendData('connectTest')
		this.heartbeat.serverTimer = setTimeout(() => {
			this.webSocket.close()
		}, this.heartbeatTimeout)
	}

	// 初始化 WebSocket 連接
	initWebSocket() {
		if (this.webSocket) {
			return
		}

		this.webSocket = new WebSocket(this.requestUrl)

		this.webSocket.onmessage = (e) => {
			this.heartbeat.reset()
			this.onMessage(e)
		}

		this.webSocket.onclose = (e) => {
			this.attemptReconnect()
			this.onClose(e)
		}

		this.webSocket.onopen = () => {
			console.log('WebSocket 连接成功')
		}

		this.webSocket.onerror = () => {
			this.attemptReconnect()
			console.log('WebSocket 连接发生错误, 5秒后重新连接')
		}
	}

	// 发送数据
	sendData(data) {
		if (!this.webSocket) {
			console.warn('WebSocket 尚未连接')
			return
		}

		if (this.webSocket.readyState === WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
		} else if (this.webSocket.readyState === WebSocket.CONNECTING) {
			setTimeout(() => {
				this.sendData(data)
			}, 1000)
		} else {
			console.warn('WebSocket 连接状态异常')
		}
	}

	// 接收到消息時處理
	// onMessage(event) {} 改到外部定義

	// WebSocket 關閉時處理
	onClose(event) {
		const code = event ? event.code : ''
		console.log(`WebSocket 连接关闭 (代码: ${code})`)
		this.webSocket = null
	}

	// 手动关闭 WebSocket 连接
	closeWebSocket() {
		if (this.webSocket) {
			clearTimeout(this.heartbeat.timer)
			clearTimeout(this.heartbeat.serverTimer)
			this.webSocket.close()
		}
	}

	// 重新连接
	attemptReconnect() {
		if (this.lockReconnect) return
		this.lockReconnect = true
		setTimeout(() => {
			this.initWebSocket()
			this.lockReconnect = false
		}, 5000)
	}
}
