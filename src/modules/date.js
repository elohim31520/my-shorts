//日期 時間相關方法，使用 date-fns https://date-fns.org/docs/Getting-Started
import {
	format,
	subMonths,
	intervalToDuration,
	isWithinInterval,
	parse,
	differenceInMilliseconds,
	differenceInSeconds,
	differenceInMinutes,
	differenceInHours,
	differenceInDays,
	differenceInWeeks,
	differenceInMonths,
	differenceInYears,
	isValid,
} from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

const DEFAULT_TIME_ZONE = 'Asia/Shanghai'

export function current() {
	return format(getZonedDate(), 'yyyy/MM/dd HH:mm:ss')
}

export function currentDate() {
	return format(getZonedDate(), 'yyyy/MM/dd')
}

export function currentTime() {
	return format(getZonedDate(), 'HH:mm:ss')
}
export function subMonth(date, month) {
	return subMonths(date, month)
}

const defaultOptions = {
	showDay: true,
	showTotalHours: false,
	hideZeroHours: false,
}

export class Countdown {
	constructor(deadline, options = {}) {
		if (typeof deadline == 'string') {
			this.deadline = parse(deadline, 'yyyy-MM-dd HH:mm:ss', getZonedDate())
		} else if (_isDate(deadline)) {
			this.deadline = deadline
		} else {
			throw new Error('deadline must be a type of string or date!')
		}
		this.options = {
			...defaultOptions,
			...options,
		}
	}

	get() {
		const now = getZonedDate()
		const remainingSeconds = differenceInSeconds(this.deadline, now)
		if (remainingSeconds <= 0) return null //倒時結束
		const duration = intervalToDuration({
			start: now,
			end: this.deadline,
		})

		let hours, minutes, seconds

		// 計算總小時數或常規小時數
		if (this.options.showTotalHours) {
			hours = Math.floor(remainingSeconds / 3600)
		} else {
			hours = duration.hours
		}

		minutes = duration.minutes
		seconds = duration.seconds

		const days =
			this.options.showDay && !this.options.showTotalHours
				? `${_defaultTo(duration.days, 0)}天 `
				: ''

		// 判斷是否在小時為零時隱藏小時部分
		const hoursDisplay =
			this.options.hideZeroHours && hours === 0 ? '' : `${padZero(hours)}:`

		const result = `${days}${hoursDisplay}${padZero(minutes)}:${padZero(seconds)}`
		return result
	}
}

function padZero(str) {
	return _padStart(str, 2, '0')
}

//時間戳 (以毫秒為單位) EX: 1718726400000
export function isBetween(startTime, endTime) {
	const start = getZonedDate(startTime)
	const end = getZonedDate(endTime)
	return isWithinInterval(getZonedDate(), {
		start,
		end,
	})
}

/**
 * 將時間戳格式化為指定格式的日期字串
 *
 * @param {number|string} timestamp - 要格式化的時間戳 (不只有timestamp，有定義在 patterns的 都支持)
 * @param {string} [formatString='yyyy年MM月dd日'] - 可選的日期格式字串，預設值為 'yyyy年MM月dd日'
 * @returns {string} 格式化後的日期字串
 */
export function formatTimestamp(
	timestamp,
	formatString = 'yyyy年MM月dd日',
	options = {}
) {
	const date = getDate(timestamp)
	if (!date) return timestamp
	return format(date, formatString, options)
}

export function getTimeDifference(dateString) {
	const now = getZonedDate()
	let pastDate = getDate(dateString)
	if (!pastDate) return ''
	const milliseconds = differenceInMilliseconds(now, pastDate)

	if (milliseconds < 60000) {
		return '刚刚'
	} else if (milliseconds < 3600000) {
		const minutes = differenceInMinutes(now, pastDate)
		return `${minutes}分钟前`
	} else if (milliseconds < 86400000) {
		const hours = differenceInHours(now, pastDate)
		return `${hours}小时前`
	} else if (milliseconds < 604800000) {
		const days = differenceInDays(now, pastDate)
		return `${days}天前`
	} else if (milliseconds < 2592000000) {
		const weeks = differenceInWeeks(now, pastDate)
		return `${weeks}周前`
	} else if (milliseconds < 31536000000) {
		const months = differenceInMonths(now, pastDate)
		return `${months}个月前`
	} else {
		const years = differenceInYears(now, pastDate)
		return `${years}年前`
	}
}

const patterns = [
	'yyyy-MM-dd HH:mm:ss',
	'yyyy-MM-dd',
	'yyyy/MM/dd HH:mm:ss',
	'yyyy/MM/dd',
]

/**
 * 轉換成 date物件， input 可以 timestamp 或者 符合patterns中預設的
 */
export function getDate(input) {
	if (!input) return input
	const timestamp = Number(input)
	if (!isNaN(timestamp) && _isNumber(timestamp)) return getZonedDate(timestamp)
	for (const pattern of patterns) {
		const parsedDate = parse(input, pattern, getZonedDate())
		if (isValid(parsedDate)) {
			return parsedDate
		}
	}
	return null
}

/**
 * 將指定的時間轉換為特定時區的 Date
 * @param {number|string|Date} dateString 時間字符串
 * @param {string} [timeZone='Asia/Shanghai'] 時區，默認值為 'Asia/Shanghai'
 * @returns {Date} 解析後的 Date
 */
export function parseDate(dateString, timeZone = DEFAULT_TIME_ZONE) {
	return fromZonedTime(getDate(dateString), timeZone)
}

//取得時區的 date object
export function getZonedDate(timestamp, { timeZone = DEFAULT_TIME_ZONE } = {}) {
	const date = new Date()
	if (timestamp) date.setTime(timestamp)
	return toZonedTime(date, timeZone)
}
