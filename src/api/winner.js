import { bizRequest } from '@/modules/service'

export function getHistoricalChampionList({ gameType, issue, current, year }) {
	return bizRequest({
		url: 'predict/historicalChampion',
		method: 'POST',
		data: { gameType, issue, current, year },
	})
}

/**
 * 连胜榜 https://dev-torna.pwtk.cc/#/view/e24r4djX
 * @param {
 * 	sortName: update_time(时间) | recent_continue_win_count(连胜) | predict_read_number(查看数)
 * }
 * @returns
 */
export function getContinueWinnerList({
	page = 1,
	size = 10,
	isAll = true,
	gameType,
	playTypeCode = '',
	sortName = 'recent_continue_win_count',
	sortOrder = 'DESC',
} = {}) {
	return bizRequest({
		method: 'POST',
		url: 'predict/continueWinList',
		data: {
			page,
			size,
			playTypeCode,
			gameType,
			sortName,
			sortOrder,
			isAll,
		},
	})
}
export function getSixKingList({
	page,
	size,
	sortName,
	playTypeCode,
	gameType,
	issue,
	current,
}) {
	return bizRequest({
		url: 'predict/sixKing ',
		method: 'POST',
		data: { page, size, sortName, playTypeCode, gameType, issue, current },
	})
}

/**
 * 查询所选彩种一级玩法和一级玩法对应的二级玩法
 * @param {
 * 	bizFlag: b(bbs) | t(圖庫) | p(競選) | r(心水)
 * }
 */

export function getPlayTypeCode({ bizFlag = 'r' } = {}) {
	return bizRequest({
		method: 'POST',
		url: 'predict/type/list',
		data: {
			bizFlag,
		},
	})
}
