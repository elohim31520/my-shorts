export function useNavigation() {
	const routesConfig = {
		pictureDetail: ['id'],
		'newsList/newsDetail': ['title', 'time', 'content', 'newsType'],
		'pictureDetail/guess': ['title', 'period'],
		'pictureDetail/explanation': ['title', 'period'],
		'pictureDetail/explanation/create': ['title', 'period'],
		sendIdea: ['id', 'page'],
		pictureExplanation: ['title', 'period', 'issueId', 'year'],
		'pictureExplanation/create': ['title', 'period', 'issueId', 'year'],
		'pictureExplanation/detail': [
			'title',
			'period',
			'issueId',
			'year',
			'postUserId',
			'postTime',
			'imageExplainId',
			'currentIndex',
		],
		voteHistory: ['year', 'period', 'periodFull'],
		creationDetail: 'id',
		pictureGuess: ['title', 'period', 'issueId', 'year'],
		'pictureGuess/create': ['title', 'period', 'issueId', 'year'],
		'pictureGuess/detail': [
			'predict',
			'period',
			'seriesName',
			'seriesCode',
			'issueId',
			'year',
			'predictionTypeName',
			'predictTitle',
			'playTypeSubName',
			'userId',
			'predictId',
		],
	}

	const buildParams = (data, fields) => {
		const params = new URLSearchParams()
		fields.forEach((field) => {
			if (data[field] || data[field] === 0) {
				params.append(field, data[field])
			}
		})
		return params.toString()
	}

	const toRoute = (route, data) => {
		const configuredFields = routesConfig[route]

		// 如果路由未在配置中定義，則直接返回基本路由
		if (!configuredFields) return `/${route}`

		if (_isString(configuredFields)) {
			// 如果配置是字串，則將該字段作為路徑參數
			const pathParam = data[configuredFields]
			return `/${route}/${pathParam}`
		} else if (_isArray(configuredFields)) {
			// 如果配置是陣列，則將這些字段作為 query
			const queryParams = buildParams(data, configuredFields)
			return queryParams ? `/${route}?${queryParams}` : `/${route}`
		}
		return `/${route}`
	}

	return { toRoute }
}
