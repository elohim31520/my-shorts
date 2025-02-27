import { bizRequest, kvRequest } from '@/modules/service'
/**
 * 我对图库的评论列表
 */
export function getCommentList({ page, size }) {
	return bizRequest({
		url: 'comment/issuePosts',
		method: 'POST',
		data: { page, size },
	})
}

export function getForumList({ page, size }) {
	return bizRequest({
		url: 'bbsForumPost/myComments',
		method: 'POST',
		data: { page, size },
	})
}
