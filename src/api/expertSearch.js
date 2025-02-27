import { bizRequest } from '@/modules/service.js'

export function getFollowFans({
	businessType,
	page,
	size,
	relationFlag,
	direct,
}) {
	return bizRequest({
		method: 'POST',
		url: 'relationship/list',
		headers: {
			businessType,
		},
		data: {
			page,
			size,
			relationFlag,
			direct,
		},
	})
}
