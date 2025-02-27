import { bizRequest, chatRequest, chatRequestOnUnload } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo'

/**
 * 獲取聊天室房間列表
 *
 * @param {Object} data
 * @param {'VOICE'|'CHAT'} [data.type] - 房間類型，不填默認為VOICE，VOICE:語音房、CHAT:聊天室
 * @param {string} data.roomId - 房間編號
 * @param {string} data.userId - 用戶編號
 * @param {string} data.title - 房間名稱
 * @param {number} data.sortRule - 排序規則，默認按照創建時間，0:熱度、1:人數
 * @param {string} data.manageSetId - 站點 ID
 * @param {number} data.gameType - 彩種
 * @param {string} data.gameSerialNo - 系列 code
 * @param {string} data.serialPeriodNo - 系列期號
 * @param {number} [data.page] - 頁碼，默認 1
 * @param {number} [data.size] - 每頁顯示條數，默認 10
 * @returns {Promise<Object>}
 */
export function getChatRoomListApi({
	type,
	roomId,
	userId,
	title,
	sortRule,
	gameType,
	gameSerialNo,
	serialPeriodNo,
	page = 1,
	size = 10,
} = {}) {
	const manageSiteId = useWebInfo().getManageSiteId()

	return chatRequest({
		method: 'post',
		url: 'voice/room/list',
		data: {
			type,
			roomId,
			userId,
			title,
			sortRule,
			manageSetId: manageSiteId,
			gameType,
			gameSerialNo,
			serialPeriodNo,
			page,
			size,
		},
	})
}

/**
 * 創建聊天室房間
 *
 * @param {Object} data
 * @param {'VOICE'|'CHAT'} [data.type] - 房間類型，不填默認為VOICE，VOICE:語音房、CHAT:聊天室
 * @param {string} [data.title] - 房間名稱
 * @param {string} [data.note] - 房間簡介
 * @param {string} [data.secret] - 房間密碼
 * @param {string} [data.backgroundImg] - 房間圖
 * @param {string} [data.manageSetId] - 站點 ID
 * @param {number} [data.gameType] - 彩種
 * @param {string} [data.gameSerialNo] - 系列 code
 * @param {string} [data.serialPeriodNo] - 系列期號
 * @param {string} [data.issueId] - 圖紙 ID
 * @param {0|1} [data.seatState] - 麥位顯示，0：關閉、1：開啟
 * @param {0|1} [data.speakState] - 連麥開關，0：關閉、1：開啟
 * @param {string} data.nickname - 房主暱稱
 * @returns {Promise<Object>}
 */
export function createChatRoomApi({
	type,
	title,
	note,
	secret,
	backgroundImg,
	gameType,
	gameSerialNo,
	serialPeriodNo,
	userId,
	issueId,
	seatState,
	speakState,
	nickname,
} = {}) {
	const manageSiteId = useWebInfo().getManageSiteId()

	return chatRequest({
		method: 'post',
		url: 'voice/room/create',
		data: {
			type,
			title,
			note,
			secret,
			backgroundImg,
			manageSetId: manageSiteId,
			gameType,
			gameSerialNo,
			serialPeriodNo,
			userId,
			issueId,
			seatState,
			speakState,
			nickname,
		},
	})
}

/**
 * 關閉聊天室房間
 *
 * @param {string} roomId - 房間編號
 * @returns {Promise<Object>}
 */
export function closeChatRoomApi(roomId) {
	return chatRequestOnUnload({
		method: 'get',
		url: 'voice/room/close',
		params: { roomId },
	})
}

/**
 * 加入聊天室房間
 *
 * @param {Object} data
 * @param {string} data.roomId - 房間編號
 * @param {string} data.nickname - 用戶暱稱
 * @param {string} [data.secret] - 房間密碼
 * @returns {Promise<Object>}
 */
export function joinChatRoomApi({ roomId, nickname, secret }) {
	return chatRequest({
		method: 'post',
		url: 'voice/room/join',
		data: { roomId, nickname, secret },
	})
}

/**
 * 離開聊天室房間
 *
 * @param {Object} params
 * @param {string} data.roomId - 房間編號
 * @param {string} data.userId - 用戶編號
 * @returns {Promise<Object>}
 */
export function leaveChatRoomApi({ roomId, userId }, headers = {}) {
	return chatRequestOnUnload({
		method: 'get',
		url: 'voice/room/leave',
		params: { roomId, userId },
		headers,
	})
}

/**
 * 獲取聊天室房間信息
 *
 * @param {string} roomId - 房間編號
 * @returns {Promise<Object>}
 */
export function getChatRoomInfoApi(roomId) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/query/info',
		params: { roomId },
	})
}

/**
 * 獲取聊天室房間在線用戶
 *
 * @param {Object} params
 * @param {string} params.roomId - 房間編號
 * @param {number} [params.page] - 頁碼，默認 1
 * @param {number} [params.size] - 每頁顯示條數，默認 10
 * @returns {Promise<Object>}
 */
export function getChatRoomOnlineUsersApi({ roomId, page = 1, size = 10 }) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/online/user',
		params: { roomId, page, size },
	})
}

/**
 * 上傳圖片到服務器 (聊天室專用，改用通用的上傳檔案，不要用這個，留著只是防止他們朝夕令改)
 *
 * @param {Object} data
 * @param {File} data.file - 圖片文件
 * @param {string} data.fileType - 文件類型，例如 "img"
 * @param {string} data.uploadFrom - 客戶端保留路徑
 * @param {string} data.uploadTarget - 原始文件名
 * @param {'S3'|'R2'} [data.storageType="S3"] - 存儲類型，資源保存的方式，默認為 "S3"
 * @param {string} [data.storageStyle="DATE_STYLE"] - 存儲路徑風格，默認為 "DATE_STYLE"
 * @param {string} [data.env] - 環境，例如 "dev"、"test"，默認為 "dev"
 * @returns {Promise<Object>}
 *
 */
export function uploadFileApi(file) {
	const fileName = file.file.name
	const formData = new FormData()

	formData.append('uploadTarget', fileName)
	formData.append('file', file.file)
	formData.append('storageType', 'S3')
	formData.append('env', 'dev')
	formData.append('fileType', 'img')
	formData.append('uploadFrom', 'chat')

	return chatRequest({
		method: 'post',
		url: 'upload/img',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
	})
}

/**
 * 申請上麥
 *
 * @param {Object} params
 * @param {string} params.roomId - 房間編號
 * @param {string} params.userId - 用戶編號
 * @returns {Promise<Object>}
 */
export function joinMicApi({ roomId, userId }) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/apply/speak',
		params: { roomId, userId },
	})
}

/**
 * 下麥
 *
 * @param {Object} params
 * @param {string} params.roomId - 房間編號
 * @param {string} params.userId - 用戶編號
 * @returns {Promise<Object>}
 */
export function leaveMicApi({ roomId, userId }) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/down/speak',
		params: { roomId, userId },
	})
}

/**
 * 閉麥
 *
 * @param {Object} params
 * @param {string} params.roomId - 房間編號
 * @returns {Promise<Object>}
 */
export function muteMicApi({ roomId }) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/close/speak',
		params: { roomId },
	})
}

/**
 * 開麥
 *
 * @param {Object} params
 * @param {string} params.roomId - 房間編號
 * @returns {Promise<Object>}
 */
export function unmuteMicApi({ roomId }) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/open/speak',
		params: { roomId },
	})
}

/**
 * 禁麥（房主針對用戶）
 *
 * @param {string} userId - 用戶ID
 * @returns {Promise<Object>}
 */
export function muteUserMicApi(userId) {
	return chatRequest({
		method: 'get',
		url: `voice/room/close/speak/${userId}`,
	})
}

/**
 * 解禁麥（房主針對用戶）
 *
 * @param {string} userId - 用戶ID
 * @returns {Promise<Object>}
 */
export function unmuteUserMicApi(userId) {
	return chatRequest({
		method: 'get',
		url: `voice/room/open/speak/${userId}`,
	})
}

/**
 * 踢出房間
 *
 * @param {Object} data
 * @param {string} data.roomId - 房間編號
 * @param {Array<string>} data.userIds - 要踢出的用戶編號列表
 * @returns {Promise<Object>}
 */
export function kickUserApi({ roomId, userIds }) {
	return chatRequest({
		method: 'post',
		url: 'voice/room/kick',
		data: { roomId, userIds },
	})
}

/**
 * 查詢上麥申請
 *
 * @param {string} roomId - 房間編號
 * @returns {Promise<Object>}
 */
export function queryMicJoinRequestsApi(roomId) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/apply/list',
		params: { roomId },
	})
}

/**
 * 審批上麥申請
 *
 * @param {Object} params
 * @param {string} params.roomId - 房間編號
 * @param {string} params.userId - 用戶編號
 * @param {'ALLOW'|'REJECT'} params.approve - 是否批准申請
 * @returns {Promise<Object>}
 */
export function approveMicJoinRequestApi({ roomId, userId, approve }) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/approval/speak',
		params: { roomId, userId, approve },
	})
}

/**
 * 更新房間
 *
 * @param {Object} data
 * @param {string} data.roomId - 房間編號
 * @param {string} data.title - 房間名稱
 * @param {string} data.note - 房間簡介
 * @param {string} [data.secret] - 房間密碼
 * @param {string} [data.backgroundImg] - 房間圖
 * @param {number} [data.gameType] - 彩種
 * @param {string} [data.gameSerialNo] - 系列 code
 * @param {string} [data.serialPeriodNo] - 系列期號
 * @param {string} [data.issueId] - 圖紙 ID
 * @param {0|1} [data.seatState] - 麥位顯示，0：關閉、1：開啟
 * @param {0|1} [data.speakState] - 連麥開關，0：關閉、1：開啟
 * @returns {Promise<Object>}
 */
export function updateChatRoomApi({
	roomId,
	title,
	note,
	secret,
	backgroundImg,
	gameType,
	gameSerialNo,
	serialPeriodNo,
	issueId,
	speakState,
	seatState,
}) {
	return chatRequest({
		method: 'post',
		url: 'voice/room/update',
		data: {
			roomId,
			title,
			note,
			secret,
			backgroundImg,
			gameType,
			gameSerialNo,
			serialPeriodNo,
			issueId,
			speakState,
			seatState,
		},
	})
}

/**
 * 獲取隨機房間名稱
 *
 * @param {'VOICE'|'CHAT'} type - 房間類型，VOICE:語音房、CHAT:聊天室
 * @returns {Promise<Object>}
 */
export function getRandomChatRoomNameApi(type) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/randomRoomName',
		params: { type },
	})
}

/**
 * 邀請加入房間
 *
 * @param {Object} data
 * @param {Array<string>} data.invitedUserIds - 被邀人的用戶編號列表
 * @param {string} data.roomId - 房間編號
 * @param {'VOICE'|'CHAT'} data.type - 房間類型，VOICE:語音房、CHAT:聊天室
 * @param {string} data.title - 房間名稱
 * @param {number} [data.userNum] - 房間在線人數
 * @param {0|1} [data.upSpeak] - 是否邀請上麥，0:否、1:是
 * @returns {Promise<Object>}
 */
export function inviteToChatRoomApi({
	invitedUserIds,
	roomId,
	type,
	title,
	userNum,
	upSpeak,
}) {
	return bizRequest({
		method: 'post',
		url: 'chat/invite',
		data: { invitedUserIds, roomId, type, title, userNum, upSpeak },
	})
}

/**
 * 獲取推薦牛人所在的房間
 *
 * @param {Array<string>} userIds - 用戶編號列表
 * @returns {Promise<Object>}
 */
export function getExpertChatRoomsApi(userIds) {
	return chatRequest({
		method: 'post',
		url: 'voice/room/userRooms',
		data: userIds,
	})
}

/**
 * 增加房間熱度
 *
 * @param {Object} params
 * @param {string} params.roomId - 房間編號
 * @param {number} [params.count=1] - 熱度值
 * @returns {Promise<Object>}
 */
export function increaseChatRoomHeatApi({ roomId, count = 1 }) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/add/heat',
		params: { roomId, count },
	})
}

/**
 * 獲取房間用戶
 *
 * @param {Object} params
 * @param {string} params.roomId - 房間編號
 * @param {string} params.nickname - 用戶暱稱（模糊搜尋）
 * @param {number} [params.page] - 頁碼，默認 1
 * @param {number} [params.size] - 每頁顯示條數，默認 10
 * @returns {Promise<Object>}
 */
export function getChatRoomUsersApi({ roomId, nickname, page = 1, size = 10 }) {
	return chatRequest({
		method: 'get',
		url: 'voice/room/online/user',
		params: { roomId, nickname, page, size },
	})
}

/**
 * 獲取匿名token
 *
 * @returns {Promise<Object>}
 */
export function getAnonymousTokenApi() {
	return chatRequest({
		method: 'get',
		url: '/anonymous/token',
	})
}

/**
 * 判断当前用户是否已创建房间
 *
 * @returns {Promise<Object>}
 */
export function checkRoomExistApi({ userId, type }) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return chatRequest({
		method: 'get',
		url: '/admin/room/exist',
		params: { userId, type, manage_set_id: manageSiteId },
	})
}
