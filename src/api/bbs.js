import { bizRequest, kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'

//帖子列表
export function getBBSForumPosts({
	forumId,
	postYear,
	postIssue,
	page = 1,
	size = 10,
	isHot,
	isSelected,
	isRecommended,
	isBloom,
	isFollow,
	predictFlag,
	postUserId,
	gameType,
} = {}) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/list`,
		data: {
			forumId,
			postYear,
			postIssue,
			page,
			size,
			sortOrder: 'DESC',
			isHot,
			isSelected,
			isRecommended,
			isBloom,
			isFollow,
			predictFlag,
			postUserId,
			gameType,
		},
	})
}

//論壇列表
export function getBBSForums({
	mainBoardId,
	gameYear,
	page = 1,
	size = 10,
} = {}) {
	return bizRequest({
		method: 'POST',
		url: `bbsForum/list`,
		data: {
			mainboardId: mainBoardId,
			gameYear,
			page,
			size,
			sortOrder: 'DESC',
		},
	})
}

//帖子收藏/取消收藏
export function collectPost({ postId, userId, mainPostId } = {}) {
	mainPostId = _defaultTo(mainPostId, postId)
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/collect`,
		data: {
			postId,
			userId,
			mainPostId,
		},
	})
}

//帖子詳情
export function getPostDetail(postId) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/detail`,
		data: {
			postId,
		},
	})
}

export function getPrimaryComment({ page = 1, size = 10, postId } = {}) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/getPrimaryComment`,
		data: {
			page,
			size,
			postId,
		},
	})
}

export function getReplyComment({ page = 1, size = 10, postId } = {}) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/getReplyComment`,
		data: {
			page,
			size,
			postId,
		},
	})
}

/*
postRef: 主贴ID
threadPostId 要回覆的帖子id
*/
export function replyPost({
	postRef,
	threadPostId,
	content,
	hasAttachment = 'n',
	attachments,
}) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/replyPost`,
		data: {
			postRef,
			postContent: content,
			threadPostId,
			fromClientFlag: window._global.clientFlag,
			hasAttachment,
			attachments,
		},
	})
}

export function getPostCountInfo(postId) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/postCountInfo`,
		data: {
			postId,
		},
	})
}

/**
 * 取 forumId mainboardId
 * @returns {Promise<Object[]>}
 */
export function getForumIdListKV() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/lottery/detail`,
	})
}

/**
 * 获取上一期帖子内容
 */
export function getLastIssuePost({ postGametypeRef, forumId }) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/lastIssuePost`,
		data: {
			postGametypeRef,
			forumId,
		},
	})
}

/**
 * 资料大全论坛List
 * @param {Object} options - 请求参数
 * @param {gameType} options.gameType - 彩种
 * @param {forumName} options.forumName - 论坛名称
 * @param {year} options.year - 年份
 * @returns {Promise<Object[]>}
 */
export function getCorpusForumsAPi({ gameType, forumName, year }) {
	return bizRequest({
		method: 'POST',
		url: `bbsForum/corpusForumList`,
		data: {
			gameType,
			forumName,
			year,
		},
	})
}
