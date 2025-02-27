import { bizRequest } from '@/modules/service'

/**
 * 獲取我關注的人發佈的資源列表
 *
 * @param {Object} data
 * @param {number} [data.page] - 頁碼，默認 1
 * @param {number} [data.size] - 每頁顯示條數，默認 10
 * @param {string} [data.sortName] - 排序字段名
 * @param {string} [data.seriesCode] - 系列編號
 * @param {string} [data.gameTypeCode] - 彩種編號
 * @returns {Promise<Object>}
 */
export function getFollowedResourcesApi({
	page = 1,
	size = 10,
	sortName,
	seriesCode,
	gameTypeCode,
} = {}) {
	return bizRequest({
		method: 'post',
		url: 'attention/list',
		data: {
			page,
			size,
			sortName,
			seriesCode,
			gameTypeCode,
		},
	})
}

/**
 * 檢查關注的人是否有發佈新的資源
 *
 * @param {string} [startTime] - 開始時間 (時間戳)
 * @returns {Promise<Object>}
 */
export function checkNewResourcesApi(startTime) {
	return bizRequest({
		method: 'post',
		url: 'bbsForumPost/hasNewFind',
		data: {
			startTime,
		},
	})
}
