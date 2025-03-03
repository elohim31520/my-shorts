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
	console.log('切頁：',params.page);
	
	const { page = 1, size = 10 } = params

	try {
		const response = await axios.get('/data/videos.json')
		const videos = response.data

		const updatedVideos = videos.map((vo) => {
			const videoItem = { ...vo, type: 'recommend-video' }
			const author = '我是作者'
			if (author) {
				videoItem.author = author
			}
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

export function videoComments(params?: any, data?: any) {
	return Promise.resolve({
		url: '/video/comments',
		method: 'get',
		params,
		data,
	})
}
