import { kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'

export async function getGuessDetail() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/guess/detail`,
	})
}

/**
 * 獲取參與幽默競猜人數
 *
 * @param {Object} options
 * @param {'a6'|'hk6'|'tw6'|'sg6'|'xa6'} options.lotteryType - 彩種
 * @param {number|string} options.year - 年份
 * @param {number|string} options.issue - 期數
 * @returns {Promise<Object>}
 */
export function getHumorParticipantCountApi({ lotteryType, year, issue } = {}) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `gr/${lotteryType}/players/${manageSiteId}/${year}/${issue}`,
	})
}

export function getGuessImage(lotteryType) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/forum/guessImg/${lotteryType}`,
	})
}

export function getGuessVideo(lotteryType) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/forum/guessVideo/${lotteryType}`,
	})
}
