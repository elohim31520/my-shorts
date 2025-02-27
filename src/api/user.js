import { clientRequest, bizRequest, kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo'
import { useUserStore } from '@/stores/user.js'
import { getIPInfo } from '@/api/common.js'
import { Base64 } from 'js-base64'
import { isTokenInvalid, delay } from '@/modules/util'

/**
 * 申請客戶端 ID
 * @returns {Promise<Object>}
 */
export function getCidApi() {
	return clientRequest({
		url: 'cid',
		method: 'get',
	})
}

/**
 * 註冊客戶端 ID
 * @param {Object} data
 * @param {string} data.cid - 客戶端 ID
 * @param {string} data.manageSiteId - 站點 ID
 * @param {'S_WEB'|'C_APP'|'C_WEB'|'C_H5'} data.clientType - 客戶端類型，S_WEB:超級管理員後臺、C_APP:移動應用客戶端、C_WEB:PC網頁客戶端、C_H5:移動網頁客戶端
 * @param {'w'|'h'|'a'|'i'} data.clientFlag - 終端標記，w:web、h:h5、a:android、i:iOS
 * @returns {Promise<Object>}
 */
export function registerCidApi({ cid, manageSiteId, clientType, clientFlag }) {
	return clientRequest({
		url: 'register-cid',
		method: 'post',
		data: {
			cid,
			manageSiteId,
			clientType,
			clientFlag,
		},
	})
}

export function getUserInfo(options = {}) {
	return getUserInfoBiz({
		timeout: 4000,
		...options,
		quiet: true,
	}).then((res) => {
		if (_get(res, 'success') || isTokenInvalid(res)) return res
		return getUserInfoKV()
	})
}

export function getUserInfoBiz(options = {}) {
	return bizRequest({
		url: 'user/self',
		method: 'get',
		...options,
	})
}

export function getUserInfoKV() {
	const manageSiteId = useWebInfo().getManageSiteId()
	const userId = useUserStore().data.userId
	return kvRequest({
		url: `user/${manageSiteId}/profile/${userId}`,
	})
}

export function getBalance() {
	return bizRequest({
		url: 'userScore/balance',
		method: 'get',
	})
}

/**
 * 查詢訪客紀錄
 * @param {Object} data
 * @param {number} [data.page] - 頁碼，默認 1
 * @param {number} [data.size] - 每頁顯示條數，默認 10
 * @param {string} [data.sortName] - 排序字段名
 * @param {'1'|'2'} [data.direct] - 查詢的方向， 1 表示"我看過誰"、 2 表示"誰看過我"，默認 2
 * @returns {Promise<Object>}
 */
export function getVisitorApi({
	page = 1,
	size = 10,
	sortName,
	direct = '2',
} = {}) {
	return bizRequest({
		url: 'visit/list',
		method: 'post',
		data: {
			page,
			size,
			sortName,
			direct,
		},
	})
}

/**
 * 添加訪客紀錄
 * @param {Object} data
 * @param {number} [data.targetUserId] - 對方用戶ID
 * @param {string} [data.ipInfo] - Base64編碼後的用戶IP及位置信息
 * @returns {Promise<Object>}
 */
export async function addVisitorLogApi(targetUserId) {
	const ipJson = await getIPInfo()
	const ipBase64 = Base64.encode(JSON.stringify(ipJson))

	return bizRequest({
		url: 'visit/add',
		method: 'post',
		data: {
			targetUserId,
			ipInfo: ipBase64,
		},
	})
}

//取得他人的用戶信息
export function getSomeoneProfile(userId) {
	return bizRequest({
		url: `user/profile/${userId}`,
		method: 'get',
	})
}

/**
 * 獲取用戶瀏覽紀錄
 *
 * @param {Object} data
 * @param {number} [data.page] - 頁碼，默認 1
 * @param {number} [data.size] - 每頁顯示條數，默認 10
 * @param {string} [data.sortName] - 排序字段名
 * @param {'ASC'|'DESC'} [data.sortOrder] - 排序，默認 ASC
 * @param {'tk'｜'bbs'|'news'|'soft'} [data.viewType] - 瀏覽類型，tk:圖庫、bbs:BBS、news:新聞、soft:軟件站
 * @returns {Promise<Object>}
 */
export function getUserVisitHistoryApi({
	page = 1,
	size = 10,
	sortName,
	sortOrder = 'ASC',
	viewType,
} = {}) {
	return bizRequest({
		method: 'post',
		url: 'viewhistory/list',
		data: {
			page,
			size,
			sortName,
			sortOrder,
			viewType,
		},
	})
}

//我的喜欢 图纸列表
export function getMyLikeIssues(data) {
	return bizRequest({
		url: 'like/myLikeIssues',
		method: 'post',
		data,
	})
}

//我的收藏 图纸列表
export function getMyFavoriteIssues(data) {
	return bizRequest({
		url: 'favorite/myFavoriteIssues',
		method: 'post',
		data,
	})
}

//我的喜欢 論壇
export function getBbsForumPostMyLike(data) {
	return bizRequest({
		url: 'bbsForumPost/myLike',
		method: 'post',
		data,
	})
}

//我的收藏 論壇
export function getBbsForumPostMyCollect(data) {
	return bizRequest({
		url: 'bbsForumPost/myCollect',
		method: 'post',
		data,
	})
}

/**
 * 獲取用戶瀏覽圖庫紀錄
 *
 * @param {Object} data
 * @param {number} [data.page] - 頁碼，默認 1
 * @param {number} [data.size] - 每頁顯示條數，默認 10
 * @param {string} [data.sortName] - 排序字段名
 * @param {1|2|3|4} [data.recentFlag] - 指定時間範圍，1:今天、2:近一个月、3:近半年、4:近一年，默認 1
 * @returns {Promise<Object>}
 */
export function getVisitGalleryHistoryApi({
	page = 1,
	size = 10,
	sortName,
	recentFlag = 1,
} = {}) {
	return bizRequest({
		method: 'post',
		url: 'viewhistory/newspaperList',
		data: {
			page,
			size,
			sortName,
			recentFlag,
		},
	})
}

/**
 * 獲取用戶瀏覽論壇紀錄
 *
 * @param {Object} data
 * @param {number} [data.page] - 頁碼，默認 1
 * @param {number} [data.size] - 每頁顯示條數，默認 10
 * @param {string} [data.sortName] - 排序字段名
 * @param {1|2|3|4} [data.recentFlag] - 指定時間範圍，1:今天、2:近一个月、3:近半年、4:近一年，默認 1
 * @returns {Promise<Object>}
 */
export function getVisitForumHistoryApi({
	page = 1,
	size = 10,
	sortName,
	recentFlag = 1,
} = {}) {
	return bizRequest({
		method: 'post',
		url: 'bbsForumPost/myRead',
		data: {
			page,
			size,
			sortName,
			recentFlag,
		},
	})
}

/**
 * 添加用戶瀏覽紀錄
 *
 * @param {Object} data
 * @param {'tk'|'bbs'|'news'|'soft'} [data.viewType] - 瀏覽資源類型，tk:圖庫、bbs:BBS、news:新聞、soft:軟體站
 * @param {number} [data.targetRef] - 目標引用
 * @param {number} [data.targetId] - 目標ID
 * @param {string} [data.ipInfo] - Base64編碼後的用戶IP及位置信息
 * @returns {Promise<Object>}
 */
export async function addVisitLogApi({ viewType, targetRef, targetId } = {}) {
	const ipJson = await getIPInfo()
	const ipBase64 = Base64.encode(JSON.stringify(ipJson))

	await delay(1)

	return bizRequest({
		method: 'post',
		url: 'viewhistory/add',
		data: {
			viewType,
			targetRef,
			targetId,
			ipInfo: ipBase64,
		},
	})
}

export async function getUserMedal() {
	return bizRequest({
		url: 'userMedal/page',
	})
}

//取得個人vip詳情
export async function getVipDetails() {
	return bizRequest({
		url: 'vip/myVip',
	})
}

/*
排名类型组合
0：积分日排名
1：积分周排名
2：积分月排名
3：积分总排名
4：热度日排名
5：热度周排名
6：热度月排名
7：热度总排名
8：粉丝数日排名
9：粉丝数周排名
10：粉丝数月排名
11：粉丝数总排名
*/

//取得個人排行榜
export async function getMyRanking(keys = []) {
	return bizRequest({
		url: 'userRanking/myRanking',
		method: 'post',
		data: {
			keys,
		},
	})
}

//批量查询用户已获得勋章
export function getUserMedalBatch(userIds = []) {
	return bizRequest({
		url: 'userMedal/batch-get',
		method: 'post',
		data: {
			targetUserIdList: userIds,
		},
	})
}

//查詢已看過圖紙
export function getPictureViewed(type, userId) {
	return kvRequest({
		url: `ue/view/just/${type}/${userId}`,
	})
}

/**
 * 剛剛看過
 *
 * @param {Object} data
 * @param {'tk'|'bbs'} [data.viewType] - 瀏覽資源類型，tk:圖庫、bbs:BBS、news:新聞、soft:軟體站
 * @param {value}
 */
export function setJustView({ viewType, postIds }) {
	return bizRequest({
		url: 'justview/set',
		method: 'post',
		data: {
			viewType,
			value: postIds,
		},
	})
}

/*
b：bbs
f：论坛
m：主板
p：帖子
t：图库
c：论坛评论
u：图库评论
*/

//用户或设备对资源行为的统计数
export function getResourceCnt() {
	return bizRequest({
		url: 'user/resourceCnt',
	})
}

/**
 * 批量獲取用戶信息
 *
 * @param {Array<string>} userIds - 用戶編號列表
 * @returns {Promise<Object>}
 */
export function getUserInfoBatchApi(userIds) {
	return bizRequest({
		method: 'post',
		url: 'user/batchList',
		data: userIds,
	})
}

/**
 * 批量獲取用戶信息
 *
 * @param {string} baseTime - 1732604967000
 * @returns {Promise<Object>}
 */
export function checkVisited(baseTime) {
	return bizRequest({
		method: 'post',
		url: 'visit/checkVisited',
		data: {
			baseTime,
		},
	})
}

//取得他人排名 https://dev-torna.pwtk.cc/#/view/JzAWRgM8
/*
keys
排名类型组合
0：积分日排名
1：积分周排名
2：积分月排名
3：积分总排名
4：热度日排名
5：热度周排名
6：热度月排名
7：热度总排名
8：粉丝数日排名
9：粉丝数周排名
10：粉丝数月排名
11：粉丝数总排名
*/
export function getRanking(userId, keys = []) {
	return bizRequest({
		method: 'post',
		url: 'userRanking/rankingInfo',
		data: {
			keys,
			userId,
		},
	})
}
