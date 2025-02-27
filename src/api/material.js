import { bizRequest, kvRequest, uploadRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'
import { UPLOAD_FROM } from '@/constants/upload'

// 取得“高手論壇”的 forumId
export function getUserPublicDetail() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/userPublic/detail`,
	})
}

// 取得“二創”、“發想法”的 forumId
export function getMyForumDetail() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/myForum/detail`,
	})
}

// step1. 上傳檔案，取得檔案路徑
export function uploadSingleFile(
	file,
	uploadFrom = UPLOAD_FROM.BBS_FORUM_ATTACHMENT
) {
	const fileName = file.file.name

	const formData = new FormData()
	formData.append('uploadTarget', fileName)
	formData.append('file', file.file)
	formData.append('storageType', 'S3')
	formData.append('env', import.meta.env.PUBLIC_IS_PRD ? 'prod' : 'dev')
	formData.append('fileType', 'img')
	formData.append('uploadFrom', uploadFrom)
	formData.append('storageStyle', 6)

	return uploadRequest({
		method: 'POST',
		url: 'upload/single',
		data: formData,
	})
}

/**
 * step2. 發帖
 * title 可為空，取內容前2行
 * 新增 attachments : [{
 * 		url,		// 檔案路徑
 * 		fileType	// 檔案類型
 * }]
 *  */
export function createForumPost({
	forumId,
	title,
	postContent,
	postYear,
	postIssue,
	postGametypeRef,
	seriesId,
	viewFlag,
	attachments,
	predictFlag,
}) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/create`,
		data: {
			forumId,
			title,
			postContent,
			postYear,
			postIssue,
			postGametypeRef,
			seriesId,
			viewFlag,
			attachments,
			predictFlag,
		},
	})
}

/**
 * step2. 參賽帖發帖
 * attachments : [{
 * 		url,		// 檔案路徑
 * 		fileType	// 附件类型;p,图片;f,文件;a,APK;e,EXE;v,视频;s,声频;m,音乐;
 * }]
 * predictions: [{
 * 	gameType(int64): 1,
 *  playTypeCode(String): '',
 * 	predict(Array): 預測結果
 * }]
 *  */
export function createPredictionPost({
	title,
	forumId,
	postContent,
	postGametypeRef,
	fromIp,
	attachments,
	predictions,
}) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/createPostWithPrediction`,
		data: {
			title,
			forumId,
			postContent,
			postGametypeRef,
			fromIp,
			attachments,
			predictions,
		},
	})
}

// 获取参赛贴竞猜规则配置
export function postPredictionRules({ gameType }) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/postPredictionRules`,
		data: {
			gameType,
		},
	})
}

// 取得參賽遊戲
export function allNumInfo() {
	return kvRequest({
		url: `allNumInfo`,
	})
}

// 本期参赛贴参与过的玩法
export function getPredictedCode({ gameType, year, issue }) {
	return bizRequest({
		method: 'POST',
		url: `bbsForumPost/predictedCode`,
		data: {
			gameType,
			year,
			issue,
		},
	})
}
