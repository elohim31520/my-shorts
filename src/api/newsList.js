import { bizRequest } from '@/modules/service'

export function getNewsList({ userId, type, page, size }) {
	return bizRequest({
		url: 'message/list',
		method: 'post',
		data: {
			userId,
			page,
			size,
			type, // s系统消息 l点赞 c收藏, i关注, d评论 a安特 v活动 r聊天室
		},
	})
}

export function readMsg({ type, userId, ids }) {
	return bizRequest({
		url: 'message/markAsRead',
		method: 'post',
		data: {
			type,
			userId,
			ids,
		},
	})
}

export function anyUnreadMsg({ userId }) {
	return bizRequest({
		url: `message/hasUnreadMessages`,
		method: 'post',
		data: {
			userId,
		},
	})
}

export function getFavoritesAndLikes({ userId, page, size }) {
	return bizRequest({
		url: 'message/list/favoritesAndLikes',
		method: 'post',
		data: {
			userId,
			page,
			size,
		},
	})
}

export function getFollowers({ userId, page, size }) {
	return bizRequest({
		url: 'message/list/followers',
		method: 'post',
		data: {
			userId,
			page,
			size,
		},
	})
}

export function getCommentsAndMentions({ userId, page, size }) {
	return bizRequest({
		url: 'message/list/commentsAndMentions',
		method: 'post',
		data: {
			userId,
			page,
			size,
		},
	})
}
