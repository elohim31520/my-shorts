import { bizRequest } from '@/modules/service'

/**
 * 根据昵称检索用户
 * @param {Object} options - 请求参数
 * @param {number} options.page - 页码，从1开始
 * @param {number} options.size - 每页显示条数
 * @param {string} [options.sortName] - 排序字段（可选）
 * @param {'ASC'|'DESC'} [options.sortOrder] - 排序方式（可选），ASC:升序，DESC:降序，默认为ASC
 * @param {string} options.nickname - 用户昵称，最大长度64
 * @param {'u'|'a'|'s'|'b'|'o'|'L'} [options.userType] - 用户类型（可选），u:用户,a:代理,s:子账号,b:后台,o:开放平台,L:全部，最大长度1
 * @returns {Promise<Object[]>} - 返回用户列表的Promise
 */
export function queryUserApi(options) {
	const params = {
		page: Number(options.page) || 1,
		size: Number(options.size) || 10,
		sortName: options.sortName,
		sortOrder: options.sortOrder,
		nickname: options.nickname,
		userType: options.userType,
	}

	return bizRequest({
		method: 'POST',
		url: 'search/user/query',
		data: params,
	})
}

/**
 * 全文检索帖子
 * @param {Object} options - 请求参数
 * @param {number} options.page - 页码，从1开始
 * @param {number} options.size - 每页显示条数
 * @param {string} [options.sortName] - 排序字段（可选）
 * @param {'ASC'|'DESC'} [options.sortOrder] - 排序方式（可选），ASC:升序，DESC:降序，默认为ASC
 * @param {string} options.text - 输入文字，最大长度64
 * @param {number} [options.isBoom] - 是否爆款（可选），0或1，默认为0
 * @param {number} [options.isTop] - 是否置顶（可选），0或1，默认为0
 * @param {number} [options.isRecommended] - 是否推荐（可选），0或1，默认为0
 * @param {number} [options.isSelected] - 是否精选（可选），0或1，默认为0
 * @param {number} [options.isHot] - 是否热门（可选），0或1，默认为0
 * @param {number} [options.year] - 年份(可選)
 * @returns {Promise<Object[]>} - 返回帖子列表的Promise
 */
export function queryPostApi(options) {
	const params = {
		page: Number(options.page) || 1,
		size: Number(options.size) || 10,
		sortName: options.sortName,
		sortOrder: options.sortOrder,
		text: options.text,
		isBoom: options.isBoom,
		isTop: options.isTop,
		isRecommended: options.isRecommended,
		isSelected: options.isSelected,
		isHot: options.isHot,
		year: options.year,
	}

	return bizRequest({
		method: 'POST',
		url: 'search/post/query',
		data: params,
	})
}

/**
 * 全文检索图库
 * @param {Object} options - 请求参数
 * @param {number} options.page - 页码，从1开始
 * @param {number} options.size - 每页显示条数
 * @param {string} [options.sortName] - 排序字段（可选）
 * @param {'ASC'|'DESC'} [options.sortOrder] - 排序方式（可选），ASC:升序，DESC:降序，默认为ASC
 * @param {string} options.text - 输入文字，最大长度64 (關鍵字)
 * @param {number} [options.isBoom] - 是否爆款（可选），0或1，默认为0
 * @param {number} [options.isTop] - 是否置顶（可选），0或1，默认为0
 * @param {number} [options.isRecommended] - 是否推荐（可选），0或1，默认为0
 * @param {number} [options.isSelected] - 是否精选（可选），0或1，默认为0
 * @param {number} [options.isHot] - 是否热门（可选），0或1，默认为0
 * @param {number|null} [options.isColorful] -顏色(可選)，null:全部、1:彩色、2:黑白
 * @param {number} [options.year] - 年份(可選)
 * @returns {Promise<Object[]>} - 返回图库列表的Promise
 */
export function queryIssueApi(options) {
	const params = {
		page: Number(options.page) || 1,
		size: Number(options.size) || 10,
		sortName: options.sortName,
		sortOrder: options.sortOrder,
		text: options.text,
		isBoom: options.isBoom,
		isTop: options.isTop,
		isRecommended: options.isRecommended,
		isSelected: options.isSelected,
		isHot: options.isHot,
		isColorful: options.isColorful,
		year: options.year,
	}

	return bizRequest({
		method: 'POST',
		url: 'search/issue/query',
		data: params,
	})
}

/**
 * 检索全部内容
 * @param {Object} options - 请求参数
 * @param {number} options.page - 页码，从1开始
 * @param {number} options.size - 每页显示条数
 * @param {string} [options.sortName] - 排序字段（可选）
 * @param {'ASC'|'DESC'} [options.sortOrder] - 排序方式（可选），ASC:升序，DESC:降序，默认为ASC
 * @param {string} options.text - 输入文字，最大长度64
 * @param {number|null} [options.isColorful] -顏色(可選)，null:全部、1:彩色、2:黑白
 * @param {number} [options.year] - 年份(可選)
 * @returns {Promise<Object[]>} - 返回检索结果列表的Promise
 */
export function queryAllApi(options) {
	// 参数验证和处理
	const params = {
		page: Number(options.page) || 1,
		size: Number(options.size) || 10,
		sortName: options.sortName,
		sortOrder: options.sortOrder,
		text: options.text,
		isColorful: options.isColorful,
		year: options.year,
	}

	return bizRequest({
		method: 'POST',
		url: 'search/all/query',
		data: params,
	})
}
