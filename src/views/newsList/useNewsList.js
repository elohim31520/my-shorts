import { getRelativeDayDescription, isLogin } from '@/modules/util.js'
import { formatTimestamp } from '@/modules/date.js'
import { readMsg } from '@/api/newsList'
import { localStore } from '@/modules/storage.js'

export function useNewsList() {
	function formatTime(timeStamp) {
		let date = new Date(timeStamp)
		let text = getRelativeDayDescription(date)
		if (text === '今天' || text === '昨天') return text
		return formatTimestamp(timeStamp, 'yy-MM-dd')
	}

	async function makeRead({ type, userId, msgId }) {
		if (isLogin()) {
			await readMsg({
				type,
				userId,
				ids: msgId,
			})
		} else {
			const readIds = new Set(localStore.readIds || [])
			readIds.add(news.msgId)
			localStore.readIds = Array.from(readIds)
		}
	}

	return { formatTime, makeRead }
}
