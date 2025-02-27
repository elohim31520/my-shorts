import { bizRequest, kvRequest } from '@/modules/service'

// 专家统计 （一次获取所有数据，不分页） https://dev-torna.pwtk.cc/#/view/a26Pj46X
export function getExpertStatistics({ gameType, playTypeCode }) {
	return bizRequest({
		method: 'POST',
		url: 'predict/expertStatistics',
		data: {
			gameType,
			playTypeCode,
		},
	})
}

//推薦專家 https://ocs.ai4funs.com/pwtk/user/pw01tk01/talents/recommend
export function getRecommendExpert() {
	return kvRequest({
		url: `user/pw01tk01/talents/recommend`,
	})
}

//专家搜索 https://dev-torna.pwtk.cc/#/view/PzmPOQKX
export function expertSearch({ page = 1, size = 10, name } = {}) {
	return bizRequest({
		method: 'POST',
		url: 'sense/expertSearch',
		data: {
			nickname: name,
			page,
			size,
		},
	})
}

//获取用户打赏上下限 https://dev-torna.pwtk.cc/#/view/kXOxpwbz
export function getRewardLimit() {
	return bizRequest({
		method: 'GET',
		url: 'reward/get-limit',
		data: {},
	})
}
