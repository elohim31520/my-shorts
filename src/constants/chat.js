export const CLIENT_CODES = {
	HEARTBEAT: 1000, // 心跳
	USER_LEAVE_ROOM: 1001, // 離開房間
	SEND_MESSAGE: 1002, // 發送消息
	// SEND_IMAGE: 1003, // 發送圖片，統一使用 1002
}

export const SERVER_CODES = {
	USER_ENTER_ROOM: 3000, // 用戶進入房間
	APPLY_JOIN_MIC: 3001, // 用戶上麥申請
	USER_JOIN_MIC: 3002, // 用戶上麥
	USER_LEAVE_MIC: 3003, // 用戶下麥
	REJECT_JOIN_MIC: 3004, // 用戶拒絕上麥
	USER_MUTE: 3005, // 用戶閉麥
	USER_UNMUTE: 3006, // 用戶開麥
	KICK_USER: 3007, // 踢出用戶
	USER_LEAVE_ROOM: 3008, // 用戶離開房間
	CLOSE_ROOM: 3009, // 房主關閉房間
	DUPLICATE_LOGIN: 3010, // 異地登錄
	USER_MESSAGE: 3011, // 用戶發送的消息
	HEAT_UPDATE: 3012, // 房間熱度值更新
	// USER_IMAGE: 3013, // 用戶發送的圖片，統一使用 3011
	UPDATE_ROOM: 3015, // 房主更新房間
}

// 麥克風狀態
export const MIC_STATUS = {
	OPEN: 2, // 麥克風開啟
	CLOSED: 0, // 麥克風關閉
}

// 用戶發言權限
export const SPEAK_PERMISSION = {
	ALLOW: 1, // 允許發言
	DENY: 0, // 禁止發言
}

// 連麥功能狀態
export const MIC_CONNECT_STATUS = {
	ENABLED: 1, // 開啟連麥
	DISABLED: 0, // 關閉連麥
}

// 空麥位狀態
export const MIC_SLOT_STATUS = {
	SHOW: 1, // 展示空麥位
	HIDE: 0, // 隱藏空麥位
}

export const MIC_ACTION = {
	JOIN_MIC: 'JOIN_MIC', // 上麥
	LEAVE_MIC: 'LEAVE_MIC', // 下麥
}

export const ROOM_TYPES = {
	VOICE: 'VOICE', // 語音房
	CHAT: 'CHAT', // 聊天室
}

export const ROOM_PATHS = {
	VOICE_ROOM: 'voiceRoom',
	CHAT_ROOM: 'chatRoom',
}

export const MESSAGE_TYPES = {
	TEXT: 0, // 文本
	IMAGE: 1, // 圖片
	ROOM: 2, // 房間
	PICTURE: 3, // 圖紙
	LOTTERY: 4, // 開獎
	CREATION: 5, // 創作
	FORUM: 6, // 論壇
	TEXT_WITH_URL: 7, // 包含 URL 的文本
	INVITE: 8, // 邀請
}

export const JANUS_ERROR_CODES = {
	ID_EXISTS: 436, // 用戶ID已存在房間中
}

export const API_CODES = {
	SUCCESS: 0,
	ROOM_CLOSED: 10002,
	ROOM_ACCESS_DENIED: 10003,
	ANONYMOUS_TOKEN_EXPIRED: 10015,
}

export const ERROR_MESSAGES = {
	UNKNOWN_ERROR: '发生未知错误\n请检查您的网路连线或稍后重新尝试',
	ROOM_ACCESS_DENIED: '您已被房主踢出\n请等待 30 分钟后再尝试进入房间',
	VOICE_ROOM_CLOSED: '当前直播已结束',
	CHAT_ROOM_CLOSED: '当前房间已关闭',
	ANONYMOUS_TOKEN_EXPIRED: '您的匿名身份已过期\n已重新获取 Token 继续使用',
}
