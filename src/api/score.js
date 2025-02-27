import { bizRequest } from '@/modules/service'

export function getScoreList({ startTime, endTime, page, size, type }) {
	return bizRequest({
		url: 'userScore/list',
		method: 'post',
		data: {
			startTime,
			endTime,
			page,
			size,
			type,
		},
	})
}
export function getStarsList({ startTime, endTime, page, size, type }) {
	return bizRequest({
		url: 'userScore/starList',
		method: 'post',
		data: {
			startTime,
			startTime,
			page,
			size,
			type,
		},
	})
}

//用户打赏 https://dev-torna.pwtk.cc/#/view/wXPG0lr8
export function donate({ targetUserId, rewardScore }) {
	return bizRequest({
		url: 'reward/do',
		method: 'post',
		data: {
			targetUserId,
			rewardScore,
		},
	})
}
