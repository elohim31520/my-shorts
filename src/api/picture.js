import { Base64 } from 'js-base64'

import { kvRequest, bizRequest } from '@/modules/service'
import { getIPInfo } from '@/api/common.js'
import { useWebInfo } from '@/hooks/useWebInfo.js'
import { isLogin } from '@/modules/util.js'

/**
 * 獲取推荐tk圖紙，只有60条
 * @param {Object} options
 * @param {'a6'|'hk6'|'tw6'|'sg6'|'xa6'} options.lotteryType - 彩票種類的 ID
 * @returns {Promise<Object[]>}
 */
export function getRecommendGallery({ lotteryType } = {}) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `tk/${manageSiteId}/issue/${lotteryType}/recommend`,
	})
}

/**
 * 獲取全部tk圖紙
 * @param {Object} options
 * @param {'a6'|'hk6'|'tw6'|'sg6'|'xa6'} options.lotteryType - 彩票種類的 ID
 * @returns {Promise<Object[]>}
 */
export function getAllGallery({ lotteryType } = {}) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `tk/${manageSiteId}/issue/${lotteryType}/current`,
	})
}

/**
 * 獲取圖紙系列
 * @param {Object} options
 * @param {'a6'|'hk6'|'tw6'|'sg6'|'xa6'} options.lotteryType - 彩票種類的 ID
 * @returns {Promise<Object>}
 */
export function getPictureSeriesApi({ lotteryType } = {}) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `tk/${manageSiteId}/${lotteryType}/serialList`,
	})
}

/**
 * 獲取圖紙詳情
 * @param {Object} options
 * @param {string} options.issueId - 圖紙id
 * @param {string} options.postId - 圖解的postId，有傳入返回的是圖解的詳情
 * @returns {Promise<Object[]>}
 */
export function getPictureDetail({ issueId, postId }) {
	return bizRequest({
		method: 'POST',
		url: 'gameTypeNewspaperIssue/getDetailById',
		data: {
			issueId,
			postId,
		},
	})
}

/**
 * 獲取圖紙詳情 (KV)
 * @param {number|string} issueId - 圖紙id
 * @returns {Promise<Object>}
 */
export function getPictureDetailKV(issueId) {
	return kvRequest({
		url: `tk/pw01tk01/issue/${issueId}`,
	})
}

/**
 * 透過 多個參數 獲取圖紙詳情
 * @param {Object} params
 * @param {number} params.issue - 期數 (int32)
 * @param {number} params.year - 年份 (int32)
 * @param {string} params.newspaperCode - 報紙編碼 (string)
 * @param {number} params.gameType - 彩種 (int64)
 * @param {string} params.seriesCode - 系列編碼 (string)
 * @returns {Promise<Object[]>} - 返回圖紙詳情的Promise
 */
export function getPictureDetailByParams({
	issue,
	year,
	newspaperCode,
	gameType,
	seriesCode,
}) {
	// 参数校验（可选）
	if (!issue || !year || !newspaperCode || !gameType || !seriesCode) {
		return Promise.reject(new Error('缺少必需的參數'))
	}

	return bizRequest({
		method: 'POST',
		url: 'gameTypeNewspaperIssue/getDetailByIndex',
		data: {
			issue,
			year,
			newspaperCode,
			gameType,
			seriesCode,
		},
	})
}

/**
 * 獲取圖紙list
 * @param {Object} options
 * @param {number} options.page - 页码，從 0 開始
 * @param {number} options.size - 每页显示条数
 * @param {string} [options.sortName] - 排序字段（可選）
 * @param {number} [options.issue] - 第几期（可選）
 * @param {number} [options.year] - 年份（可選）
 * @param {string} [options.seriesCode] - 图纸系列代码（可選）
 * @param {string} [options.newspaperCode] - 图纸报纸代码（可選）
 * @param {string} [options.gameType] - 彩种（可選）
 * @param {string} [options.imgPath] - 图纸URI（可選）
 * @param {string} [options.isColorful] - 是否彩色; y為彩色，n為黑白（可選）
 * @param {string} [options.isTop] - 是否置顶; y為是，n為否（可選）
 * @param {string} [options.isSelected] - 是否精选; y為是，n為否（可選）
 * @param {string} [options.isHot] - 是否热门; y為是，n為否（可選）
 * @param {string} [options.isBloom] - 是否爆款; y為是，n為否（可選）
 * @param {string} [options.isRecommended] - 是否推荐; y為是，n為否（可選）
 * @param {string} [options.commentFlag] - 评论标记; y為可以，n為不可以（可選）
 * @param {string} [options.voteFlag] - 投票标记; y為可以，n為不可以（可選）
 * @param {string} [options.isAllAnnotateContent] - 是否全部注解内容; y為是，n為否（可選）
 * @param {number} [options.likeCount] - 点赞数量 0：没心水 1：有心水 可選）
 * @param {string} [options.annotateContent] - 注解（可選）
 *
 * @returns {Promise<Object[]>}
 */
export function getPictureList(options) {
	options.year = +options.year

	return bizRequest({
		method: 'POST',
		url: 'gameTypeNewspaperIssue/list',
		data: options,
	})
}

/**
 * 喜歡圖紙 喜歡評論，取消也是同一隻
 * @param {Object} options - 傳入的參數對象
 * @param {number} options.id - 圖紙ID
 * @param {number} [options.selectedUserId] - 所选择的用户ID（可选） 白話：登入userId
 * @param {string} options.postYear - 发布年份 (长度最多4位)
 * @param {string} options.postIssue - 发布期数 (长度最多32位)
 * @param {number} options.issueId - 期刊ID
 * @param {number} options.postId - 評論ID
 * @returns {Promise<Object[]>}
 */

/**
 * 取得評論列表
 * @param {Object} data - 傳入的參數對象
 * @param {number} [data.page=1] - 页码，默认值为 1
 * @param {number} [data.size=10] - 每页显示的评论数量，默认值为 10
 * @param {number} [data.postId] - 评论 ID，若為空則返回一級評論，不為空則返回一級評論下的二三級評論
 * @param {number|string} [data.issueId] - 圖紙 ID
 * @param {string} [data.postType] - 评论类型，可能的值包括 'a'（图解评论）等
 * @param {number} [data.imageExplainId] - 图解 ID，若评论类型为图解评论时必传
 * @returns {Promise<Object[]>} - 返回评论列表
 *
 * @description
 * 當 `postType` 為 'a' 且需要獲取圖解評論時，必須同時傳入 `imageExplainId` 和 `postType`，
 * `postId` 是選填的，若提供則會返回指定帖子下的二、三級評論。
 * 后端如何判断是查询期刊还是图解？ issueId不为空，即查询期刊;issueId为空查询图解。
 * {"issueId":"333","postId":"666"} 查询期刊
 * {"imageExplainId":"888","postType":"a","postId":"999"} 查询图解
 */
export function getCommentList({
	page = 1,
	size = 10,
	postId,
	issueId,
	postType,
	imageExplainId,
} = {}) {
	return bizRequest({
		method: 'POST',
		url: 'tk/newspaperIssuePost/listTree',
		data: {
			page,
			size,
			postId,
			issueId,
			postType,
			imageExplainId,
		},
	})
}

/**
 * 附件信息
 * @typedef {Object} Attachment
 * @property {string} url - 附件的URL
 * @property {string} fileType - 附件的文件類型（例如：'p' 表示圖片）
 */

/**
 * 評論 圖紙 ， 發布圖解
 * @param {Object} data - 傳入的參數對象
 * @param {string} data.postContent - 貼文內容
 * @param {string} data.threadPostId - 貼文的 ID
 * @param {string} data.issueId - 圖紙的 ID
 * @param {Attachment[]} [data.attachments] - 附件數組，默認為空數組
 * @param {'p'|'a'|'c'} [data.postType] - 評論類型，p,期刊评论; a,图解; c,图解的评论
 * @returns {Promise<Object[]>}
 */
export function comment({
	postContent,
	threadPostId,
	issueId,
	attachments = [],
	postType,
} = {}) {
	return bizRequest({
		method: 'POST',
		url: 'tk/newspaperIssuePost/replyPost',
		data: {
			postContent,
			threadPostId,
			issueId,
			attachments,
			postType,
		},
	})
}

/**
 * 发起投票
 * @param {Object} options - 傳入的參數對象
 * @param {number} options.gameType - 游戏类型
 * @param {string} options.voteType - 投票类型 ('g' 或 'v')
 * @param {number} options.year - 年份
 * @param {number} options.issue - 期数
 * @param {string} options.vote - 标的（最大长度 5）
 * @param {string} options.ipInfo - IP 信息 (base64形式的json字符串，最大长度 512)
 * @returns {Promise<Object>}
 */
export async function submitVote({ gameType, voteType, year, issue, vote }) {
	const ipJson = await getIPInfo()
	const ipBase64 = Base64.encode(JSON.stringify(ipJson))
	return bizRequest({
		method: 'POST',
		url: 'vote/add',
		data: {
			gameType,
			voteType,
			year,
			issue,
			vote,
			ipInfo: ipBase64,
		},
	})
}

/**
 * 检索投票一览
 * @param {Object} options - 传入的参数对象
 * @param {number} options.page - 页码
 * @param {number} options.size - 每页显示条数
 * @param {string} [options.sortName] - 排序字段 (可选)
 * @param {number} [options.gameType] - 游戏类型 (可选)
 * @param {string} [options.voteType] - 投票类型 ('g' 或 'v', 可选)
 * @param {number} [options.year] - 年份 (可选)
 * @returns {Promise<Object[]>}
 */
export function getVoteList({
	page = 1,
	size = 10,
	sortName,
	gameType,
	voteType,
	year,
} = {}) {
	return bizRequest({
		method: 'POST',
		url: 'vote/list',
		data: {
			page,
			size,
			sortName,
			gameType,
			voteType,
			year,
		},
	})
}

/**
 * 查看投票结果
 * @param {Object} options - 传入的参数对象
 * @param {number} options.gameType - 游戏类型
 * @param {string} options.voteType - 投票类型 ('g' 或 'v')
 * @param {number|string} options.year - 年份
 * @param {number|string} options.issue - 期数
 * @returns {Promise<Object>}
 */
export function getVoteResults({ gameType, voteType, year, issue }) {
	return bizRequest({
		method: 'POST',
		url: 'vote/view',
		data: {
			gameType,
			voteType,
			year,
			issue,
		},
	})
}

/**
 * 獲取圖解小組列表
 * @param {Object} data - 傳入的參數對象
 * @param {number} data.page - 頁碼
 * @param {number} data.size - 每頁顯示條數
 * @param {string} [data.sortName] - 排序字段 (可選)
 * @param {number} [data.gameType] - 彩種類型 (可選)
 * @param {string} [data.postContent] - 評論內容模糊搜尋 (可選)
 * @param {number} [data.postUserId] - 發佈用戶 ID (可選)
 * @param {number} [data.issueId] - 圖紙 ID (可選)
 * @returns {Promise<Object[]>}
 */
export function getPictureExplanationList({
	page = 1,
	size = 10,
	sortName,
	gameType,
	postContent,
	postUserId,
	issueId,
} = {}) {
	return bizRequest({
		method: 'POST',
		url: 'tk/newspaperIssuePost/graphicSolutionGroup',
		data: {
			page,
			size,
			sortName,
			gameType,
			postContent,
			postUserId,
			issueId,
		},
	})
}
/**
 * 依據條件取得系列數量
 * @param {Object} options - 傳入的參數對象
 * @param {number} options.gameType - 彩種
 * @param {number} options.issus - 期數
 * @param {number} options.year - 年份
 * @param {number} options.likeCount - 心水
 * @param {number} options.isColorful - 彩色 全部為null
 * @param {number} options.isTop - 置頂
 * @param {number} options.isSelected - 精選
 * @param {number} options.isHot - 熱門
 * @param {number} options.isBloom - 爆款
 * @param {number} options.isRecommended - 推薦
 * @returns {Promise<Object[]>}
 */
export function getFilterSeriesCount({
	gameType,
	issue,
	year,
	likeCount,
	isColorful,
	isTop,
	isSelected,
	isHot,
	isBloom,
	isRecommended,
}) {
	return bizRequest({
		url: 'gameTypeNewspaperIssue/selectSeriesCount',
		method: 'POST',
		data: {
			gameType,
			issue,
			year,
			likeCount,
			isColorful,
			isTop,
			isSelected,
			isHot,
			isBloom,
			isRecommended,
		},
	})
}

/**
 * 獲取競猜小組列表
 *
 * @param {Object} data
 * @param {number} [data.page] - 頁碼，默認 1
 * @param {number} [data.size] - 每頁顯示條數，默認 10
 * @param {string} [data.sortName] - 排序字段名
 * @param {string} data.bizId - 圖紙 ID
 * @returns {Promise<Object>}
 */
export function getPictureGuessList({
	page = 1,
	size = 10,
	sortName,
	bizId,
} = {}) {
	return bizRequest({
		method: 'post',
		url: 'predict/listPlayTypeForGallery',
		data: {
			page,
			size,
			sortName,
			bizId,
		},
	})
}

/**
 * 查询所选彩种一级玩法 ex:
 *
 * @param {Object} data
 * @param {string} data.bizFlag - 業務類型，必填 (b: bbs, t: 圖庫, p: 競選, r: 心水)
 * @param {number} params.gameType - 彩種 (int64)
 * @returns {Promise<Object>}
 */
export function getPrimaryPlayTypes({ bizFlag, gameType } = {}) {
	return bizRequest({
		method: 'post',
		url: 'predict/type/list',
		data: {
			bizFlag,
			gameType,
		},
	})
}

/**
 * 期刊里面参与竞猜的发布接口
 *
 * @param {Object} data
 * @param {string} data.bizFlag - 业务类型，必填 (b: bbs, t: 图库, p: 竞选, r: 心水)
 * @param {number} data.bizId - 竞选活动的主键ID
 * @param {string} data.playTypeCode - 玩法code，必填
 * @param {string} [data.playTypeSubCode] - 玩法二级类型code，选填
 * @param {string} [data.playTypeCheckNumberCode] - 正特码类型（1到7之间的正码或特码）
 * @param {string} [data.predictTitle] - 预测标题，选填
 * @param {Array} data.predict - 预测结果数组，必填
 * @param {string} data.fromIp - 来源IP，必填
 * @param {string} [data.token] - 可选的token（如果需要）
 * @returns {Promise<Object>}
 */
export function submitPrediction({
	bizFlag,
	bizId,
	playTypeCode,
	playTypeSubCode,
	playTypeCheckNumberCode,
	predictTitle,
	predict,
	fromIp,
} = {}) {
	return bizRequest({
		method: 'post',
		url: 'predict/createPredictForGallery',
		data: {
			bizFlag,
			bizId,
			playTypeCode,
			playTypeSubCode,
			playTypeCheckNumberCode,
			predictTitle,
			predict,
			fromIp,
		},
	})
}

/**
 * 获取競猜小組预测详情接口
 *
 * @param {number} predictId - 预测id，必填
 * @returns {Promise<Object>}
 */
export function getPredictionDetail(predictId) {
	return bizRequest({
		method: 'post',
		url: 'predict/detailById',
		data: {
			predictId,
		},
	})
}

/**
 * 獲取圖紙列表（僅獲取最新一期，全局搜尋用）
 * @param {Object} options
 * @param {number} options.gameType - 彩種（必傳）
 * @param {number} options.year - 年份（必傳）
 * @param {string} [options.isColorful] - 是否彩色；：'y' 表示彩色，'n' 表示黑白
 * @param {string} [options.seriesCode] - 圖紙系列代碼
 * @returns {Promise<Object>}
 */
export function getLatestPictures({ gameType, year, isColorful, seriesCode }) {
	return bizRequest({
		method: 'POST',
		url: 'gameTypeNewspaperIssue/newspapersWithLatestIssue',
		data: {
			gameType,
			year,
			isColorful,
			seriesCode,
		},
	})
}
