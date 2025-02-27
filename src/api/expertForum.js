import { kvRequest, bizRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'

export function getBbsSiteList() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `tk/bbsSiteList/${manageSiteId}`,
	})
}

export function getUserPublic() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/userPublic/detail`,
	})
}

export function getNewspaperPost({
	page = 1,
	size = 10,
	gameType,
	isHot,
	isSelected,
	isRecommended,
	isBloom,
} = {}) {
	return bizRequest({
		url: 'tk/newspaperIssuePost/graphicSolutionGroup',
		method: 'POST',
		data: {
			page,
			size,
			gameType,
			isHot,
			isSelected,
			isRecommended,
			isBloom,
		},
	})
}
