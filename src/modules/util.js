import { ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import UAParser from 'ua-parser-js'
import { pageStore } from '@/stores'
import Cookies from 'js-cookie'
import { pop } from './history.js'
import { isFinite as _isFinite, floor as _floor } from 'lodash-es'
import { useLoginPopupStore } from '@/stores/loginPopup.js'

export { getBallNumberData, zodiacs } from '@/adapters/util'

let locale = null
export function inject(value) {
	locale = value
}

const toastDefault = {
	position: 'middle', // top|bottom|middle
	duration: 2000,
}

export function toast(message, options = {}) {
	return showToast({
		message,
		...toastDefault,
		...options,
	})
}

export function dialog(message, options = {}) {
	return showDialog({
		message,
		...options,
	})
}

export function confirmDialog(message, options = {}) {
	return showConfirmDialog({
		message,
		...options,
	})
}

const notifyDefault = {
	type: 'success', // primary|success|warning|danger
	duration: 2000,
}

export function notify(message, options = {}) {
	return showNotify({
		message,
		...notifyDefault,
		...options,
	})
}

export function clipboard(msg, { onSuccess, onError } = {}) {
	try {
		navigator.clipboard
			.writeText(msg)
			.then(() => {
				onSuccess ? onSuccess() : notify('复制成功')
			})
			.catch(() => {
				fallbackCopy()
			})
	} catch (error) {
		fallbackCopy()
	}

	// 非安全域名的複製方案
	function fallbackCopy() {
		try {
			const textarea = document.createElement('textarea')
			textarea.value = msg
			textarea.style.position = 'fixed'
			textarea.style.opacity = '0'
			document.body.appendChild(textarea)
			textarea.select()
			document.execCommand('copy')
			document.body.removeChild(textarea)
			onSuccess ? onSuccess() : notify('复制成功')
		} catch (err) {
			onError ? onError() : notify('复制失败', { type: 'warning' })
		}
	}
}

const ballColors = {
	red: [
		'01',
		'02',
		'07',
		'08',
		'12',
		'13',
		'18',
		'19',
		'23',
		'24',
		'29',
		'30',
		'34',
		'35',
		'40',
		'45',
		'46',
	],
	blue: [
		'03',
		'04',
		'09',
		'10',
		'14',
		'15',
		'20',
		'25',
		'26',
		'31',
		'36',
		'37',
		'41',
		'42',
		'47',
		'48',
	],
	green: [
		'05',
		'06',
		'11',
		'16',
		'17',
		'21',
		'22',
		'27',
		'28',
		'32',
		'33',
		'38',
		'39',
		'43',
		'44',
		'49',
	],
}

/**
 * 根據號碼獲取相應的顏色。
 * @param {number} ballNumber - 球號碼
 * @returns {string} 對應的顏色
 */
export function getBallColor(ballNumber) {
	const ballNumberStr = _padStart(String(ballNumber), 2, '0') // 將數字轉換為兩位字串
	for (let color in ballColors) {
		if (ballColors[color].includes(ballNumberStr)) {
			return color // 返回匹配到的顏色
		}
	}
	return 'red' // 如果沒有找到匹配項，預設返回紅色
}

/**
 * 解析 URLSearchParams 物件，返回包含所有查詢引數的物件
 * @param {URLSearchParams} searchParams - URLSearchParams 物件
 * @returns {Object.<string, any>} 包含所有查詢引數的鍵值對物件
 */
export function parseSearchParams(searchParams) {
	return Object.fromEntries(searchParams.entries())
}

/**
 * 更新瀏覽器 URL 的查詢引數，不重新載入頁面
 * @param {String} param - 查詢引數 key
 * @param {String} value - 查詢引數 value
 * @param {Boolean} keepOthers - 是否保留其他參數
 * EX:?a=1&b=2
 * updateURLParameter('a',100, false) => a=100
 * updateURLParameter('a',100, true) => a=100&b=2
 */
export function updateURLParameter(param, value, keepOthers = false) {
	const newUrl = new URL(window.location)
	if (!keepOthers) newUrl.search = ''
	if (value === null) {
		//表示要刪除這個key
		if (!newUrl.searchParams.has(param)) return
		newUrl.searchParams.delete(param)
	} else {
		newUrl.searchParams.set(param, value)
	}
	window.history.replaceState({}, '', newUrl)
}

/**
 * 導航到指定的路徑，並附加參數
 *
 * @param {string} path - 目標路徑
 * @param {Object} [params={}] - 參數對象
 */
export function navigateTo(path, params = {}) {
	const url = new URL(path, window.location.origin)
	_forEach(_entries(params), ([key, value]) => {
		url.searchParams.set(key, value)
	})
	window.location.href = String(url)
}

const A6_LOTTERY_CODE = new Map([
	['a6', 2],
	['xa6', 5],
	['hk6', 1],
	['tw6', 3],
	['sg6', 2], //待確認
])

export function getA6LotteryCode(code) {
	return A6_LOTTERY_CODE.get(code)
}

export function getCdnUrl(path) {
	if (!path) return null
	const slash = path.startsWith('/') ? '' : '/'
	return `${import.meta.env.PUBLIC_CDN_IMAGE_HOST}${slash}${path}` //尚未考慮 PUBLIC_CDN_IMAGE_HOST 打包處理
}

export function useFontSize(px) {
	const { width } = useWindowSize()
	const convert = (px) => {
		if (import.meta.env.SSR) return 0
		return (
			(px / 16) *
			window
				.getComputedStyle(document.getElementsByTagName('html')[0])
				.getPropertyValue('font-size')
				.replace(/\D/g, '')
		)
	}

	const remPx = ref(convert(px))
	watch(width, () => {
		remPx.value = convert(px)
	})
	return remPx
}

export function getDevice(userAgent) {
	if (import.meta.env.SSR && !userAgent)
		throw new Error(
			'在 SSR 環境調用 getDevice 必須提供 userAgent 引數以正確識別裝置型別'
		)
	const parser = new UAParser()
	parser.setUA(userAgent || navigator.userAgent)
	const result = parser.getResult()
	const deviceType = _get(result, 'device.type', '')

	let isH5 = false
	let isPC = false

	if (/(mobile|tablet|wearable)/.test(deviceType)) {
		isH5 = true
	} else {
		isPC = true
	}

	return { isH5, isPC, result }
}

//這個回傳的 key (a6)
export function getLotteryType() {
	if (import.meta.env.SSR) return _get(pageStore, 'lottery.lotteryType', 'a6')
	try {
		return _get(
			JSON.parse(JSON.parse(Cookies.get('lottery'))),
			'lotteryType',
			''
		)
	} catch (error) {
		return 'a6'
	}
}

//所有的彩種列表
export function getLotteryTypeList() {
	return import.meta.env.SSR ? locale.lotteryTypes : window.LOTTERY_TYPES
}

//取得當前彩種 vo : { key: 'a6', name: '澳六', code: '2032', codeA6: 2, fullName: '澳门六合彩' }
export function getCurrentLotteryType() {
	const key = getLotteryType()
	let lotteryTypes = getLotteryTypeList()
	return _find(lotteryTypes, (vo) => vo.key == key)
}

//取得當前彩種code, lotteryType參數有非當前全局彩種的需求
export function getLotteryCode(lotteryType) {
	let lotteryTypes = getLotteryTypeList()
	return _find(lotteryTypes, (vo) => vo.key == lotteryType)?.code
}

export function getCid() {
	if (import.meta.env.SSR) return _get(pageStore, 'client.cid', '')
	try {
		return _get(JSON.parse(JSON.parse(Cookies.get('client'))), 'cid', '')
	} catch (error) {
		return ''
	}
}

export function getUser() {
	if (import.meta.env.SSR) return _get(pageStore, 'user.data', {})
	try {
		return _get(JSON.parse(JSON.parse(Cookies.get('user'))), 'data', {})
	} catch (error) {
		return {}
	}
}

export function isBlank(str = '') {
	if (str === null || str === undefined) return true
	return /^\s*$/.test(str + '')
}

export function isNotBlank(str) {
	return !isBlank(str)
}

/**
 * prependProtocol("http://abc.com") --> http://abc.com
 * prependProtocol("//abc.com") --> //abc.com
 * prependProtocol("abc.com") --> https://abc.com
 * prependProtocol("abc.com", "http:") --> http://abc.com
 */
export function prependProtocol(url, protocol = 'https:') {
	if (isBlank(url)) return url
	if (/^http(s)?:|^\/\//.test(url)) return url
	return `${protocol}//${url}`
}

export function safeOpen(url, protocol = 'https:') {
	if (url) return window.open(prependProtocol(url, protocol))
}

export function back() {
	sessionStorage.setItem('skip', 1)
	const previous = pop()
	if (isBlank(previous)) {
		window.location.href = '/'
		return
	}
	window.location.href = previous
}

export function digitalConversion(count, precision = 1) {
	count = Number(count)
	if (!_isNumber(count)) {
		return
	}
	if (count > 1000000) {
		return _floor(count / 1000000, precision) + 'M'
	} else if (count > 10000) {
		return _floor(count / 10000, precision) + 'W'
	} else if (count > 1000) {
		return _floor(count / 1000, precision) + 'K'
	} else {
		return count
	}
}
/**
 * 合併多個對象並遞歸過濾掉值為 `null`、`undefined` 或空字串的屬性
 * @param {...Object} objects - 要合併和過濾的多個對象
 * @returns {Object} 合併並過濾後的新對象
 */
export function mergeAndFilter(...objects) {
	const merged = _merge({}, ...objects)

	// 遞歸過濾
	const filterObject = (object) => {
		return _transform(
			object,
			(result, value, key) => {
				if (_isObject(value) && !_isArray(value)) {
					const filtered = filterObject(value)
					if (!_isEmpty(filtered)) {
						result[key] = filtered
					}
				} else if (value !== null && value !== undefined && value !== '') {
					result[key] = value
				}
			},
			{}
		)
	}

	return filterObject(merged)
}

/**
 * 將數字轉換為中文數字
 *
 * @param {number} num - 要轉換的整數
 * @returns {string} 對應的中文數字字符串
 *
 * @example
 * numberToChinese(1234) // 返回 "一千二百三十四"
 * numberToChinese(10)   // 返回 "十"
 * numberToChinese(0)    // 返回 "零"
 */
export function numberToChinese(num) {
	const units = ['', '十', '百', '千', '萬', '億', '兆']
	const nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

	if (num === 0) {
		return nums[0]
	}

	let chinese = ''
	let unitPosition = 0
	let zeroFlag = false
	let negative = false

	if (num < 0) {
		negative = true
		num = Math.abs(num)
	}

	while (num > 0) {
		const section = num % 10
		if (section === 0) {
			zeroFlag = true
		} else {
			if (zeroFlag) {
				chinese = nums[0] + chinese
				zeroFlag = false
			}
			chinese = nums[section] + units[unitPosition] + chinese
		}
		unitPosition++
		num = Math.floor(num / 10)
	}

	// 處理特殊情況，例如 "一十" 應為 "十"
	if (chinese.startsWith('一十')) {
		chinese = chinese.substring(1)
	}

	if (negative) {
		chinese = '負' + chinese
	}

	return chinese
}

export function isLogin() {
	return isNotBlank(_get(getUser(), 'token'))
}

/**
 * to: 必須給絕對路徑，EX: /sample
 * options: {
 * 	auth(boolean|string): true 表示是否需要檢核已登入, string 表示未登入時，要跳轉的頁面
 *  skip(boolean): true 表示，忽略存在history，用來避免返回太深層
 *  ignoreSelf (boolean): true 表示當要前往的pathname就是當前的pathname時，不動作
 * }
 * query: 傳遞的 query 參數，對象形式 { key: value }
 */
export function redirect(to, options = {}, query = {}) {
	const { auth = false, skip = false, ignoreSelf = false } = options
	if (to == window.location.pathname && ignoreSelf) return
	if (skip) sessionStorage.setItem('skip', 1)
	if (auth && isAuthRequired(to)) {
		const token = _get(getUser(), 'token')
		if (isBlank(token)) {
			if (_isString(auth)) {
				window.location.href = auth
			} else {
				useLoginPopupStore().toggle()
			}
			return
		}
	}

	// 構建 query string
	const searchParams = new URLSearchParams(query).toString()
	let url = to

	if (!_isEmpty(searchParams)) {
		url += (to.includes('?') ? '&' : '?') + String(searchParams)
	}

	window.location.href = url
}

export function isAuthRequired(pathname) {
	let result = false
	_forEach(authPaths, (path) => {
		result = path.includes('*')
			? new RegExp(path).test(pathname)
			: path == pathname
		if (result) return false
	})
	return result
}

export const authPaths = [
	'/my/setting/name',
	'/my/setting/phone',
	'/my/setting/memo',
	'/my/setting/inviter',
	'/my/channel',
	'/my/channel/follow',
	'/my/channel/fans',
	'/my/channel/recommend',
	'/my/setting/head',
	'/my/star',
	'/my/score',
	'/my/election',
	'/my/join',
	'/my/review/*',
	'/expert/user',
	'/my/buy',
	'/my/sell',
	'/my/sell/detail/*',
	'/my/invite',
]

export function moneyFormat(num, digit = 0) {
	if (isBlank(num)) return num
	return Number(num).toLocaleString('en-US', {
		minimumFractionDigits: digit,
		maximumFractionDigits: digit,
	})
}

/**
 * 判斷日期是昨天還是前N天，N是數字
 * @param {Date} date - 日期對象
 * @returns {string} 返回 "昨天" 或 "N天前"
 */
export function getRelativeDayDescription(date) {
	if (!date) return ''
	const now = new Date()
	const oneDay = 24 * 60 * 60 * 1000
	const diffDays = Math.floor((now - date) / oneDay)

	if (diffDays === 1) {
		return '昨天'
	} else if (diffDays > 1) {
		return `${diffDays}天前`
	} else {
		return '今天'
	}
}

/* 
res : { data : []}
fields: ['需要保留的字段']
*/
export function loseWeight(res, fields) {
	if (!_get(res, 'data')) return
	if (_isArray(res.data)) {
		res.data = res.data.map((vo) => {
			return fields.reduce((acc, cur) => {
				acc[cur] = vo[cur]
				return acc
			}, {})
		})
	} else if (_isPlainObject(res.data)) {
		res.data = _pick(res.data, fields)
	}
}

const locationTranslations = {
	cn: '中国',
	tw: '台湾',
	hk: '香港',
	mo: '澳门',
	sg: '新加坡',
	jp: '日本',
	th: '泰国',
	vn: '越南',
	ph: '菲律宾',
	my: '马来西亚',
}

/**
 * 將英文地理名稱轉換為中文
 * @param {string} locationName - 英文地理名稱
 * @returns {string} - 中文地理名稱
 */
export function translateLocationName(locationName) {
	const normalizedLocation = _toLower(_trim(locationName))
	const translation = locationTranslations[normalizedLocation]

	return translation || locationName
}

/*"
"10006", 获取用户登录上下文失败
"10033", 令牌已过期，需要重新登录
"10034", 用户已登出，需要重新登录
*/
export function isTokenInvalid(res) {
	const errCode = _get(res, 'errCode')
	return _includes([10006, 10033, 10034], Number(errCode))
}

/**
 * 延遲指定的秒數
 *
 * @param {number} seconds - 要延遲的秒數
 * @returns {Promise<void>}
 */
export function delay(second) {
	return new Promise((resolve) => setTimeout(resolve, second * 1000))
}

/**
 * 從對象中按順序嘗試多個路徑，返回第一個通過任意檢查函數的值
 *
 * @param {Object} obj - 要查詢的對象
 * @param {string[]} paths - 要嘗試的路徑數組
 * @param {Function[]} predicates - 檢查函數數組，每個函數接受一個參數，返回布爾值
 * @param {*} [defaultValue] - 如果所有路徑都沒有找到符合條件的值，返回的默認值
 * @returns {*} - 第一個通過任意檢查的值，或默認值
 *
 * @example
 * const obj = { data: { issue: { title: '測試' }, title: 123456 } };
 * const result = getFirstAvailable(obj, ['data.title', 'data.issue.title'], [_isString], '');
 * // result 為 測試
 */
export function getFirstAvailable(obj, paths, predicates, defaultValue) {
	for (let path of paths) {
		let value = _get(obj, path)
		if (_some(predicates, (predicate) => predicate(value))) {
			return value
		}
	}
	return defaultValue
}

/**
 * 檢查元素內的文本是否在高度和寬度上被截斷
 * @param {HTMLElement} element - 要檢查的元素
 * @returns {boolean} - 如果文本在高度或寬度上被截斷，返回 true；否則返回 false
 */
export function isElementTextTruncated(element) {
	if (!element || !(element instanceof HTMLElement)) return false

	// 確保元素在 DOM 中可見
	if (element.offsetParent === null) return false

	const isVerticalTruncated = element.scrollHeight > element.clientHeight
	const isHorizontalTruncated = element.scrollWidth > element.clientWidth

	return isVerticalTruncated || isHorizontalTruncated
}

/**
 * 獲取 WebSocket 協議
 * @returns {string}
 */
export function getWebSocketProtocol() {
	return window.location.protocol === 'https:' ? 'wss://' : 'ws://'
}

export const fileExtension = [
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.tiff',
	'.txt',
	'.doc',
	'.docx',
	'.pdf',
	'.mp4',
	'.avi',
	'.mov',
	'.wav',
	'.mp3',
	'.ogg',
	'.zip',
	'.tar',
	'.gz',
	'.exe',
	'.apk',
]

export function isFileAccept(filename) {
	const ext = filename.substring(filename.lastIndexOf('.'))
	return _includes(fileExtension, ext)
}

/**
 * 從物件中獲取指定路徑的值，如果該值為指定的 falsy，則返回預設值。
 *
 * @param {Object} object - 目標物件
 * @param {string|string[]} path - 屬性路徑
 * @param {*} defaultValue - 當獲取的值為 falsy 時返回的預設值
 * @param {Array} [falsyValues=[]] - 需要視為 falsy 的值列表
 * @returns {*} 獲取的值或預設值
 */
export function getOrDefault(object, path, defaultValue, falsyValues = []) {
	const value = _get(object, path)
	const result = _defaultTo(value, defaultValue)
	return falsyValues.includes(result) ? defaultValue : result
}

export function getWebTitle() {
	return import.meta.env.SSR ? locale.webTitle : window.WEB_TITLE
}

export function getPlayCodeBallWord(title, layer = 1) {
	if (isBlank(title)) return ''

	const firstWord = title.substring(0, 1)
	if (_includes(['1', '2', '3'], firstWord)) {
		return parseInt(title)
	}

	if (layer === 2 && (title === '一肖' || title === '一尾')) {
		return firstWord
	}

	switch (title) {
		case '特码':
			return '8'
		case '杀肖':
			return '猪'
		case '杀特尾':
			return '特'
		case '一肖':
		case '杀特肖':
		case '一尾':
		case '杀尾':
		case '杀一头':
		case '杀一合':
			return title.substr(-1)
		case '不中':
		case '家禽野兽':
		case '稳禁一段':
		case '合数单双':
			return title.substr(-2)
		case '天地生肖':
		case '左右生肖':
		case '三行中特':
			return title.substring(0, 2)
		default:
			return firstWord
	}
}

//期數：新彩4位，其余3位， lotteryType|gameType都可以
export function getShortIssue(issue, lotteryType /*彩種 ex: a6 */) {
	if (isBlank(issue)) return issue
	if (!lotteryType) lotteryType = getLotteryType()
	const len = lotteryType == 'sg6' || lotteryType == '3995' ? 4 : 3
	return _padStart(String(issue).slice(-1 * len), len, '0')
}

/*
將rem 轉換為 數字(px) 回傳，如果傳入是px則直接回傳數字
*/
export function rem2Px(value) {
	const num = _head(/^\d*\.?\d+/.exec(value))
	const unit = _head(/\D+$/.exec(value))
	if (isBlank(unit) || unit == 'px') return num
	const { fontSize } = window.getComputedStyle(document.documentElement)
	return parseFloat(fontSize) * num
}

/**
 * 將字串的 'true'/'false' 轉換為 boolean
 * @param {string} str - 要轉換的字串
 * @returns {boolean}
 */
export function stringToBoolean(str = '') {
	return /^true$/i.test(str)
}
