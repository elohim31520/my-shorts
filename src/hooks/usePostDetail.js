import { toast } from '@/modules/util.js'
import { toggleLike, toggleCollect } from '@/api/common.js'
import { replyPost } from '@/api/bbs.js'

export function usePostDetail() {
	async function clickLike(data, { likeFlag, targetRef }) {
		const { postId, isLike, likeCount } = data
		const isAdd = isLike == 'n'
		const res = await toggleLike({ targetId: postId, likeFlag, targetRef })
		if (!_get(res, 'success')) return
		toast(`${isAdd ? '' : '取消'}喜欢成功`)
		data.isLike = isAdd ? 'y' : 'n'
		data.likeCount = isAdd ? +likeCount + 1 : +likeCount - 1
	}

	async function clickCollect(data, { favoriteFlag, targetRef }) {
		const { postId, isCollect, favoriteCount } = data
		const isAdd = isCollect == 'n'
		const res = await toggleCollect({
			targetRef,
			targetId: postId,
			favoriteFlag,
		})
		if (!_get(res, 'success')) return
		toast(`${isAdd ? '' : '取消'}收藏成功`)
		data.isCollect = isAdd ? 'y' : 'n'
		data.favoriteCount = isAdd ? +favoriteCount + 1 : +favoriteCount - 1
	}

	async function doReply({
		postRef,
		threadPostId,
		content,
		attachments = [],
	} = {}) {
		const res = await replyPost({
			postRef,
			threadPostId,
			content,
			hasAttachment: attachments.length > 0 ? 'y' : 'n',
			attachments,
		})
		if (!_get(res, 'success')) return
		toast('评论成功')
		return true
	}

	function formatIssue(value) {
		if (!value) return ''
		let issue = String(value)
		if (issue.length > 3) issue = issue.slice(-3)
		return `第${issue}期`
	}

	function formatTitle(str) {
		return _truncate(str, { length: 24 })
	}

	return { clickLike, clickCollect, doReply, formatIssue, formatTitle }
}
