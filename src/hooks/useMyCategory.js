import { ref } from 'vue'
import {
	getMyFavoriteIssues,
	getMyLikeIssues,
	getVisitGalleryHistoryApi,
	getBbsForumPostMyLike,
	getBbsForumPostMyCollect,
	getVisitForumHistoryApi,
} from '@/api/user'
import { getBBSForumPosts } from '@/api/bbs'

export function useMyCategory() {
	function setApiFunction(viewType, userId) {
		const params = {}
		if (userId) params.userId = userId
		const waterfallApiFunction = ref(() => Promise.resolve([]))
		const waterfallApiParams = ref({})
		const forumApiFunction = ref(() => Promise.resolve([]))
		const forumApiParams = ref({})

		switch (viewType) {
			case 'write': //創作
				waterfallApiFunction.value = getBBSForumPosts
				waterfallApiParams.value = {
					...params,
					forumId: 'myForum',
					postUserId: userId,
				}
				forumApiFunction.value = getBBSForumPosts
				forumApiParams.value = {
					...params,
					forumId: 'userPublic',
					postUserId: userId,
				}
				break
			case 'collect': //收藏
				waterfallApiFunction.value = getMyFavoriteIssues
				waterfallApiParams.value = { ...params }
				forumApiFunction.value = getBbsForumPostMyCollect
				forumApiParams.value = { ...params }
				break
			case 'like': //喜歡
				waterfallApiFunction.value = getMyLikeIssues
				waterfallApiParams.value = { ...params }
				forumApiFunction.value = getBbsForumPostMyLike
				forumApiParams.value = { ...params }
				break
			case 'follow': //關注
				waterfallApiFunction.value = getBBSForumPosts
				waterfallApiParams.value = {
					...params,
					forumId: 'myForum',
					isFollow: 'y',
				}
				forumApiFunction.value = getBBSForumPosts
				forumApiParams.value = {
					...params,
					forumId: 'userPublic',
					isFollow: 'y',
				}
				break
			case 'tempView': //最近瀏覽
				waterfallApiFunction.value = getVisitGalleryHistoryApi
				waterfallApiParams.value = { ...params, recentFlag: 2 }
				forumApiFunction.value = getVisitForumHistoryApi
				forumApiParams.value = { ...params, recentFlag: 2 }
				break
		}
		return {
			waterfallApiFunction,
			waterfallApiParams,
			forumApiFunction,
			forumApiParams,
		}
	}

	return { setApiFunction }
}
