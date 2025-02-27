import { getLastLotteryResultApi } from '@/api/lottery.js'
import { formatTimestamp } from '@/modules/date.js'
import { getLotteryType } from '@/modules/util.js'

export function useLottery({ format = 'MM月dd日 HH:mm' } = {}) {
	async function getOpenDatetime() {
		const lotteryType = getLotteryType()
		const res = await getLastLotteryResultApi({ lotteryType })
		const nextTime = _get(res, 'data.nextTime')
		return formatTimestamp(nextTime, format)
	}

	return { getOpenDatetime }
}
