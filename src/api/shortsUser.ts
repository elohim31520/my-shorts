export function userinfo(params?: any, data?: any) {
	return Promise.resolve({ url: '/user/userinfo', method: 'get', params, data })
}

export function userVideoList(params?: any, data?: any) {
	return Promise.resolve({
		url: '/user/video_list',
		method: 'get',
		params,
		data,
	})
}

export function panel(params?: any, data?: any) {
	return Promise.resolve({ url: '/user/panel', method: 'get', params, data })
}

export function friends(params?: any, data?: any) {
	return Promise.resolve({ url: '/user/friends', method: 'get', params, data })
}

export function userCollect(params?: any, data?: any) {
	return Promise.resolve({ url: '/user/collect', method: 'get', params, data })
}

export function recommendedPost(params?: any, data?: any) {
	return Promise.resolve({
		url: '/post/recommended',
		method: 'get',
		params,
		data,
	})
}

export function recommendedShop(params?: any, data?: any) {
	return Promise.resolve({
		url: '/shop/recommended',
		method: 'get',
		params,
		data,
	})
}
