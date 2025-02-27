import { kvRequest, a6tkRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'

// post example
// export function createPictureApi(data) {
// 	return request({
// 		url: 'user.favorite.create',
// 		method: 'post',
// 		data,
// 	})
// }

/**
 * 獲取最後一期開獎結果
 * @param {Object} options
 * @param {'a6'|'hk6'|'tw6'|'sg6'|'xa6'} options.lotteryType - 彩票種類的 ID
 * @returns {Promise<Object>}
 */
export function getLastLotteryResultApi({ lotteryType }) {
	return kvRequest({
		url: `gr/${lotteryType}/issue/currentInfo`,
		method: 'get',
	})
}

/**
 * 獲取下一期年份 期數 等資訊
 * @param {Object} options
 * @param {'a6'|'hk6'|'tw6'|'sg6'|'xa6'} options.lotteryType - 彩票種類的 ID
 * @returns {Promise<Object>}
 */
export function getNextLotteryInfoApi(lotteryType) {
	return kvRequest({
		url: `gr/${lotteryType}/issue/info`,
		method: 'get',
	})
}

/**
 * 獲取指定年份和期次的開獎結果
 * @param {Object} options
 * @param {'a6'|'hk6'|'tw6'|'sg6'|'xa6'} options.lotteryType - 彩票種類的 ID
 * @param {string|number} options.year - 指定的年份
 * @param {string|number} options.issue - 指定的彩票期次
 * @returns {Promise<Object>}
 */
export function getLotteryResultApi({ lotteryType, year, issue }) {
	return kvRequest({
		url: `gr/${lotteryType}/issue/${year}/${_trimStart(issue, '0')}`,
		method: 'get',
	})
}

/**
 * 獲取指定彩票種類和年份的歷史開獎記錄
 * @param {Object} options
 * @param {'a6'|'hk6'|'tw6'|'sg6'|'xa6'} options.lotteryType - 彩票種類的 ID
 * @param {string|number} options.year - 指定的年份
 * @returns {Promise<Object>}
 */
export function getLotteryResultHistoryApi({ lotteryType, year }) {
	return kvRequest({
		url: `gr/${lotteryType}/history/${year}`,
		method: 'get',
	})
}

/**
 * 取得彩種
 * @returns {Promise<Object>}
 * 
 [
  { key: 'a6', name: '澳门六', code: 2032 },
  { key: 'xa6', name: '新澳门', code: 5 },
  { key: 'hk6', name: '香港六', code: 1 },
  { key: 'tw6', name: '台彩', code: 84 },
  { key: 'sg6', name: '新彩', code: 3995 }
]
 */
export function getLotteryTypesApi() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `gr/gameType/list/${manageSiteId}`,
	})
}

/**
 * 獲取當月份及下個月的澳門六合彩開獎日期
 *
 * @returns {Promise<Object>} - 包含開獎日期的 Promise 物件
 */
export function getLotteryDateApi() {
	return a6tkRequest({
		url: 'tool/listLotteryDate',
		method: 'get',
	})
}

/**
 * 獲取開獎推薦列表
 * @param lotteryType 彩種
 * @returns {Promise<Object>}
 */
export function getLotteryRecommend({ lotteryType, quiet = false }) {
	return a6tkRequest({
		url: 'index/listLotteryRecommend',
		method: 'get',
		quiet,
		params: { lotteryType },
	})
}

/**
 * 獲取歷史開獎影片列表
 * @param {Object} params - 請求參數
 * @param {number} params.lotteryType - 彩種的類型
 * @param {number} params.pageNum - 當前頁碼
 * @param {number} params.pageSize - 每頁顯示的數量
 * @returns {Promise<Object>} - 返回的影片列表數據
 */
export function getLotteryVideoList({
	lotteryType,
	pageNum = 1,
	pageSize = 10,
	quiet = false,
}) {
	return a6tkRequest({
		url: 'index/listLotteryVideo',
		method: 'get',
		quiet,
		params: {
			pageNum,
			pageSize,
			lotteryType,
		},
	})
}

/**
 * 獲取開獎紀錄 以及直撥連線的開關
 * @param lotteryType 彩種
 * @returns {Promise<Object>}
 */
export function getLotteryRecord({ lotteryType }) {
	return a6tkRequest({
		url: 'index/lastLotteryRecord',
		method: 'get',
		params: { lotteryType },
	})
}

/**
 * 獲取開獎影片
 * @param lotteryVideoId 影片id
 * @returns {Promise<Object>}
 */
export function getLotteryVideoDetail({ lotteryVideoId }) {
	return a6tkRequest({
		url: 'index/lotteryVideoDetail',
		method: 'get',
		params: { lotteryVideoId },
	})
}

/**
 * 獲取開獎年份
 * @returns {Promise<Object>}
 */
export function getLotteryYearApi() {
	return a6tkRequest({
		url: `lottery/listYear`,
		method: 'get',
	})
}
