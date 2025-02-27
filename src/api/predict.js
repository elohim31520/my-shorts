import { bizRequest } from '@/modules/service'

// 本期推荐 https://dev-torna.pwtk.cc/#/view/pX9A57jX
export function getCurrentPredictWithUser({ userId, gameType } = {}) {
	return bizRequest({
		method: 'POST',
		url: 'sense/currentSense',
		data: {
			userId,
			gameType,
		},
	})
}

// 历史推荐 https://dev-torna.pwtk.cc/#/view/q2RobYY8
export function getHistoryPredictWithUser({ userId, gameType, playCode } = {}) {
	return bizRequest({
		method: 'POST',
		url: 'sense/openedSense',
		data: {
			userId,
			gameType,
			playCode,
		},
	})
}

// 精选心水 https://dev-torna.pwtk.cc/#/view/Wz31PPa8
export function getPredictRecommend({ page, size, title, gameType } = {}) {
	return bizRequest({
		method: 'POST',
		url: 'predict/senseRecommend',
		data: {
			page,
			size,
			title,
			gameType,
		},
	})
}

//获取详情 https://dev-torna.pwtk.cc/#/view/e24roqeX
/*
E500057: 此心水花费积分
E500058: 请先购买心水
*/
export function getPredictDetail(predictId) {
	return bizRequest({
		method: 'POST',
		url: 'predict/detailById',
		quiet: ['E500058', 'E500057'],
		data: {
			predictId,
		},
	})
}

//获取六合王 歷史冠軍 專家統計 心水總數 https://dev-torna.pwtk.cc/#/view/nzd0bkxz
export function getPlatformSwitchInfo(gameType) {
	return bizRequest({
		method: 'POST',
		url: 'predict/platformSwitchInfo',
		data: {
			gameType,
		},
	})
}

// 发布心水 https://dev-torna.pwtk.cc/#/view/qXBNgL3X
export function createPreferredChoicePredict({
	bizFlag = 'r',
	// bizId,
	gameType,
	playTypeCode,
	predictScore,
	// playTypeCheckNumberCode,
	predictTitle,
	predict,
	fromIp,
} = {}) {
	return bizRequest({
		method: 'POST',
		url: 'predict/createPreferredChoicePredict',
		data: {
			bizFlag,
			// bizId,
			gameType,
			playTypeCode,
			predictScore,
			// playTypeCheckNumberCode,
			predictTitle,
			predict,
			fromIp,
		},
	})
}

//买料 https://dev-torna.pwtk.cc/#/view/qXBDMqd2
export function buyPredict({
	predictionId,
	predictionUser,
	point,
	guaranteed = 'n',
}) {
	return bizRequest({
		method: 'POST',
		url: 'predict/buy',
		data: {
			predictionId,
			predictionUser,
			point,
			guaranteed,
		},
	})
}

//买料记录 https://dev-torna.pwtk.cc/#/view/qXbDJZO2
export function predictBuyList({
	page = 1,
	size = 10,
	sortName = '',
	gameType,
}) {
	return bizRequest({
		method: 'POST',
		url: 'predict/buyList',
		data: {
			page,
			size,
			sortName,
			gameType,
		},
	})
}

// 我的卖料 https://dev-torna.pwtk.cc/#/view/nzd0V3ez
export function getPredictSaleList({ page, size, gameType } = {}) {
	return bizRequest({
		method: 'POST',
		url: 'predict/saleList',
		data: {
			page,
			size,
			gameType,
		},
	})
}

//担保支付倍率 https://dev-torna.pwtk.cc/#/view/xXaOy4v2
export function getGuaranteedRate() {
	return bizRequest({
		method: 'POST',
		url: 'sense/guaranteedMultiple ',
	})
}

// 我的心水卖出明细(卖料明細) https://dev-torna.pwtk.cc/#/view/P81nkDGX
export function getSenseSaleDetail({ page, size, predictionId } = {}) {
	return bizRequest({
		method: 'POST',
		url: 'predict/senseSaleDetail',
		data: {
			page,
			size,
			predictionId,
		},
	})
}
