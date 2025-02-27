import { kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'

export function getBbsSiteList() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `tk/bbsSiteList/${manageSiteId}`,
	})
}

export async function getRecommendForumId() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/recommend/detail`,
	})
}

/**
 * 取推薦生肖資料
 * @returns {Promise<Object[]>}
 */
export function getRecommendZodiacKV(forumId) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/forum/${forumId}`,
	})
}
