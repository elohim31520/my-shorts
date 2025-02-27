import { bizRequest } from '@/modules/service'
/**
 * 活動列表
 */
export function getActivityList({ page, size, userId }) {
	return bizRequest({
		url: 'message/list/activity',
		method: 'POST',
		data: { page, size, userId },
	})
}
export function addMessage({ type, title, userId, img, content }) {
	return bizRequest({
		url: 'user/message/addMessage',
		method: 'POST',
		data: { type, title, userId, img, content },
	})
}
// https://dev198.pwtk.cc/webgw/user/message/addMessage
