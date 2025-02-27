// 字段映射配置
const apiFieldMappings = _map(
	[
		{
			// 推薦圖紙 KV
			pattern: '*/issue/*/recommend',
			fieldMappings: {
				id: 'targetId',
				imgSrc: 'img[0].url',
				seriesName: 'serialName',
				likeCount: 'totalLikeCount',
				// 以下在聊天室選擇圖紙用到
				imgPath: 'img[0].url',
				newspaperName: 'title',
				issueId: 'targetId',
			},
		},
		{
			// 全部圖紙 KV
			pattern: '*/issue/*/current',
			fieldMappings: {
				id: 'targetId',
				imgSrc: 'img[0].url',
				seriesName: 'serialName',
				likeCount: 'likeNum',
				// 以下在聊天室選擇圖紙用到
				imgPath: 'img[0].url',
				newspaperName: 'title',
				issueId: 'targetId',
			},
		},
		{
			// 圖紙
			pattern: 'gameTypeNewspaperIssue/list',
			fieldMappings: {
				id: 'issueId',
				title: 'newspaperName',
				imgSrc: 'imgPath',
			},
		},
		{
			// 圖紙瀏覽紀錄
			pattern: 'viewhistory/newspaperList',
			fieldMappings: {
				id: 'issueId',
				title: 'newspaperName',
				imgSrc: 'imgPath',
			},
		},
		{
			// 創作帖子
			pattern: 'bbsForumPost/list',
			fieldMappings: {
				id: 'postId',
				imgSrc: 'attachments[0].url',
			},
		},
		{
			// 收藏圖紙
			pattern: 'favorite/myFavoriteIssues',
			fieldMappings: {
				id: 'issueId',
				imgSrc: 'imgPath',
				title: 'newspaperName',
			},
		},
		{
			// 喜歡圖紙
			pattern: 'like/myLikeIssues',
			fieldMappings: {
				id: 'issueId',
				imgSrc: 'imgPath',
				title: 'newspaperName',
			},
		},
		// 發現推薦頁的內容
		{
			pattern: 'attention/list',
			fieldMappings: {
				imgSrc: 'img',
				seriesName: 'tagName',
				forumId: 'bbsId',
			},
		},
		{
			// 搜索的圖紙
			pattern: 'search/issue/query',
			fieldMappings: {
				id: 'issueId',
				title: 'newspaperName',
				imgSrc: 'imgPath',
			},
		},
	],
	(data) => ({
		regex: new RegExp('^' + data.pattern.replace(/\*/g, '.*') + '$'),
		...data,
	})
)

export function useGallery() {
	// const observeImages = () => {
	// 	const images = document.querySelectorAll('.lazyload')
	// 	const io = new IntersectionObserver(
	// 		(entries) => {
	// 			entries.forEach((entry) => {
	// 				if (entry.isIntersecting) {
	// 					const img = entry.target
	// 					const datasetSrc = _get(img, 'dataset.src', '')
	// 					if (datasetSrc && datasetSrc !== 'null') {
	// 						img.src = getCdnUrl(datasetSrc)
	// 					}
	// 					io.unobserve(entry.target)
	// 				}
	// 			})
	// 		},
	// 		{
	// 			root: null,
	// 			rootMargin: '0px 0px 100px 0px',
	// 		}
	// 	)
	// 	images.forEach((image) => {
	// 		io.observe(image)
	// 		image.classList.remove('lazyload')
	// 	})
	// }

	const formatGalleryData = (data, apiPath) => {
		const cloneData = _cloneDeep(data)
		const mapping = _find(apiFieldMappings, (mapping) => {
			return mapping.regex.test(apiPath)
		})

		if (!mapping) return cloneData

		const fieldMappings = mapping.fieldMappings

		_forEach(_entries(fieldMappings), ([targetField, sourceField]) => {
			const value = _get(cloneData, sourceField)
			if (!_isUndefined(value)) cloneData[targetField] = value
		})

		return cloneData
	}

	return { formatGalleryData }
}
