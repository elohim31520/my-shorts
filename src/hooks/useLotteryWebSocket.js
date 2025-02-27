import { ref } from 'vue'
import { WebSocketManager } from '@/modules/wsHandler'
import { getBallColor } from '@/modules/util'
import { getCombinedParity, getTailSize } from '@/adapters/util'

const LIVE_URL = 'wss://a6tkchat.com/websocket/lottery'

export const useLotteryWebSocket = () => {
	const wsDataMap = ref({
		1: null,
		2: null,
		3: null,
		4: null,
		5: null,
	})

	function connect() {
		const webSocketManager = new WebSocketManager(LIVE_URL)
		webSocketManager.onMessage = (event) => {
			try {
				const data = _get(JSON.parse(event.data), 'content', {})
				const key = data.lotteryType

				// 確認鍵名是否存在於 wsDataMap 中
				if (_has(wsDataMap.value, key)) {
					_set(wsDataMap.value, key, transformLotteryData(data))
				} else {
					console.warn('接收到未知的 lotteryType:', data.lotteryType)
				}
			} catch (err) {
				console.error('解析 WebSocket 消息時發生錯誤:', err)
			}
		}
		return webSocketManager
	}

	function transformOpenCode(numberList) {
		return numberList.map((item) => {
			return {
				value: item.number,
				pet: item.shengXiao, // 根據屬相對應
				ws: item.wuXing, // 五行
				color: isNaN(item.number) ? 'black' : getBallColor(item.number), // 將數字 color 轉換成顏色字符串
				parity: item.danShuang, // 單雙
				combinedParity: isNaN(item.number)
					? ''
					: getCombinedParity(item.number), //雙數總和的單雙
				size: item.daXiao, // 大小
				tailSize: isNaN(item.number) ? '' : getTailSize(item.number), // 雙數總和的尾大小
			}
		})
	}

	function transformLotteryData(data) {
		// 將字段做轉換，因為使用了ballList組件
		const list = _get(data, 'numberList', [])
		const openCode = transformOpenCode(list)

		return {
			year: data.year,
			issue: `${data.year}${data.period}`,
			openCode,
			nextIssue: data.nextLotteryNumber, //顯示用的參數 ex: 港彩 001
			nextIssueInt: data.nextIntLotteryNumber, //獲取資料用的參數 ex: 港彩 1
			nextTime: data.nextLotteryTimestamp,
			isDrawing: data.display == 1,
		}
	}

	return {
		wsDataMap,
		transformOpenCode,
		connect,
	}
}
