import { kvRequest } from '@/modules/service'
import { bizRequest } from '@/modules/service'

// 人氣排行榜
export function getUserRankingHeatDay() {
	return kvRequest({
		url: 'user/ranking/heat/day',
	})
}

export function getUserRankingHeatWeek() {
	return kvRequest({
		url: 'user/ranking/heat/week',
	})
}

export function getUserRankingHeatMonth() {
	return kvRequest({
		url: 'user/ranking/heat/month',
	})
}

export function getUserRankingHeatAll() {
	return kvRequest({
		url: 'user/ranking/heat/all',
	})
}

// 粉絲排行榜
export function getUserRankingFansDay() {
	return kvRequest({
		url: 'user/ranking/fans/day',
	})
}

export function getUserRankingFansWeek() {
	return kvRequest({
		url: 'user/ranking/fans/week',
	})
}

export function getUserRankingFansMonth() {
	return kvRequest({
		url: 'user/ranking/fans/month',
	})
}

export function getUserRankingFansAll() {
	return kvRequest({
		url: 'user/ranking/fans/all',
	})
}

// 積分排行榜
export function getUserRankingScoreDay() {
	return kvRequest({
		url: 'user/ranking/score/day',
	})
}

export function getUserRankingScoreWeek() {
	return kvRequest({
		url: 'user/ranking/score/week',
	})
}

export function getUserRankingScoreMonth() {
	return kvRequest({
		url: 'user/ranking/score/month',
	})
}

export function getUserRankingScoreAll() {
	return kvRequest({
		url: 'user/ranking/score/all',
	})
}

/**
 * 查看任意用户的榜单信息（排名和数值）
 * @param {Object} params
 * @param {array} params.keys - 排名类型组合
 * @param {string} params.userId - 用戶id
 * @returns {Promise<Object[]>} - 返回圖紙詳情的Promise
 * 0：积分日排名 1：积分周排名 2：积分月排名 3：积分总排名 4：热度日排名 5：热度周排名
 * 6：热度月排名 7：热度总排名 8：粉丝数日排名 9：粉丝数周排名 10：粉丝数月排名 11：粉丝数总排名
 */
export function getUserRankingInfo({ keys, userId }) {
	return bizRequest({
		url: 'userRanking/rankingInfo',
		method: 'post',
		data: {
			keys,
			userId,
		},
	})
}
