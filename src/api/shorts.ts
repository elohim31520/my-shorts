import axios from 'axios'

export function historyOther(params?: any, data?: any) {
	return Promise.resolve({
		url: '/video/historyOther',
		method: 'get',
		params,
		data,
	})
}

export function historyVideo(params?: any, data?: any) {
	return Promise.resolve({ url: '/video/history', method: 'get', params, data })
}

export async function recommendedVideo(params = {}) {
	console.log('切頁：', params.page)

	const { page = 1, size = 10 } = params

	try {
		const response = await axios.get('/data/videos.json')
		const videos = response.data

		const updatedVideos = videos.map((vo) => {
			const videoItem = { author: {}, ...vo, type: 'recommend-video' }
			return videoItem
		})

		const startIndex = (page - 1) * size
		const endIndex = startIndex + size
		const paginatedVideos = updatedVideos.slice(startIndex, endIndex)

		return Promise.resolve({
			success: true,
			code: 200,
			data: {
				list: paginatedVideos,
				total: updatedVideos.length,
				page,
				size,
			},
		})
	} catch (error) {
		console.error('Failed to fetch data:', error)
		return Promise.reject({
			success: false,
			code: 500,
			message: 'Failed to fetch recommended videos',
		})
	}
}

export function recommendedLongVideo(params?: any, data?: any) {
	return Promise.resolve({
		url: '/video/long/recommended/',
		method: 'get',
		params,
		data,
	})
}

export function myVideo(params?: any, data?: any) {
	return Promise.resolve({ url: '/video/my', method: 'get', params, data })
}

export function privateVideo(params?: any, data?: any) {
	return Promise.resolve({ url: '/video/private', method: 'get', params, data })
}

export function likeVideo(params?: any, data?: any) {
	return Promise.resolve({ url: '/video/like', method: 'get', params, data })
}

export async function videoCommentsApi(params?: any) {
	const { id } = params
	console.log('評論id', id)

	try {
		const response = await axios.get(`/data/comments/video_id_${id}.json`)
		const comments = response.data

		return Promise.resolve({
			success: true,
			code: 200,
			data: {
				list: comments,
				total: comments.length,
			},
		})
	} catch (error) {
		console.error('Failed to fetch data:', error)
		return Promise.reject({
			success: false,
			code: 500,
			message: 'Failed to fetch comments',
		})
	}
}

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

export function recommendedShop(params?: any, data?: any) {
	return Promise.resolve({
		url: '/shop/recommended',
		method: 'get',
		params,
		data,
	})
}
