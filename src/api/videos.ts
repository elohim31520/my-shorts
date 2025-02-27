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
	const { pageNo = 1, pageSize = 10 } = params // 設置默認值

	try {
		const response = await axios.get('/data/videos.json')
		const videos = response.data // 直接使用 JSON 數據，無需 JSON.parse

		const updatedVideos = videos.map((vo) => {
			const videoItem = { ...vo, type: 'recommend-video' }
			const author = '我是作者'
			if (author) {
				videoItem.author = author
			}
			return videoItem
		})

		// 計算分頁的起始和結束索引
		const startIndex = (pageNo - 1) * pageSize
		const endIndex = startIndex + pageSize

		// 根據 pageSize 切片數據
		const paginatedVideos = updatedVideos.slice(startIndex, endIndex)

		// 回傳分頁結果及總數
		return Promise.resolve({
			success: true,
			code: 200,
			data: {
				list: paginatedVideos,
				total: updatedVideos.length,
				pageNo,
				pageSize,
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
