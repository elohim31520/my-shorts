import { toast } from '@/modules/util.js'
import { toggleLike, toggleCollect } from '@/api/common.js'
import { comment } from '@/api/picture'

export function usePostDetail() {
	async function clickLike(data, { likeFlag }) {
		const { postId, likeStatus, likeCount, issueId } = data

		const isAdd = likeStatus == 'n'
		const res = await toggleLike({
			targetId: postId,
			targetRef: issueId,
			likeFlag,
		})
		if (!_get(res, 'success')) return
		toast(`${isAdd ? '' : '取消'}喜欢成功`)
		data.likeStatus = isAdd ? 'y' : 'n'
		data.likeCount = isAdd ? +likeCount + 1 : +likeCount - 1
	}

	async function clickCollect(data, { favoriteFlag }) {
		const { postId, isCollect } = data
		const isAdd = isCollect == 'n'
		const res = await toggleCollect({
			targetId: postId,
			favoriteFlag,
		})
		if (!_get(res, 'success')) return
		toast(`${isAdd ? '' : '取消'}收藏成功`)
		data.isCollect = isAdd ? 'y' : 'n'
	}

	async function doReply({
		postContent,
		threadPostId,
		issueId,
		attachments,
		postType,
	} = {}) {
		const res = await comment({
			postContent,
			threadPostId,
			issueId,
			attachments,
			postType,
		})

		if (!_get(res, 'success')) return
		toast('评论成功')
		return true
	}

	function getImgExplainIdParam(postType) {
		if (!['c', 'a'].includes(postType)) return
		const url = window.location.search
		const urlParams = new URLSearchParams(url)
		const imageExplainId = urlParams.get('imageExplainId')
		return imageExplainId
	}

	return { clickLike, clickCollect, doReply, getImgExplainIdParam }
}
