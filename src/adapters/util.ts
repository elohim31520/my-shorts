import { padStart as _padStart, map as _map } from 'lodash-es'
import lunisolar, { type DateConfigType } from 'lunisolar'
import { getZonedDate } from '@/modules/date'

// 號碼對應的球色
const ballColorMap = {
	'01': 'red',
	'02': 'red',
	'07': 'red',
	'08': 'red',
	'12': 'red',
	'13': 'red',
	'18': 'red',
	'19': 'red',
	'23': 'red',
	'24': 'red',
	'29': 'red',
	'30': 'red',
	'34': 'red',
	'35': 'red',
	'40': 'red',
	'45': 'red',
	'46': 'red',
	'03': 'blue',
	'04': 'blue',
	'09': 'blue',
	'10': 'blue',
	'14': 'blue',
	'15': 'blue',
	'20': 'blue',
	'25': 'blue',
	'26': 'blue',
	'31': 'blue',
	'36': 'blue',
	'37': 'blue',
	'41': 'blue',
	'42': 'blue',
	'47': 'blue',
	'48': 'blue',
	'05': 'green',
	'06': 'green',
	'11': 'green',
	'16': 'green',
	'17': 'green',
	'21': 'green',
	'22': 'green',
	'27': 'green',
	'28': 'green',
	'32': 'green',
	'33': 'green',
	'38': 'green',
	'39': 'green',
	'43': 'green',
	'44': 'green',
	'49': 'green',
}

type BallColorKey = keyof typeof ballColorMap

// 五行列表
const wxsx = [
	'金',
	'金',
	'火',
	'火',
	'木',
	'木',
	'土',
	'土',
	'金',
	'金',
	'火',
	'火',
	'水',
	'水',
	'土',
	'土',
	'金',
	'金',
	'木',
	'木',
	'水',
	'水',
	'土',
	'土',
	'火',
	'火',
	'木',
	'木',
	'水',
	'水',
]

// 12生肖
export const zodiacs = [
	'鼠',
	'牛',
	'虎',
	'兔',
	'龙',
	'蛇',
	'马',
	'羊',
	'猴',
	'鸡',
	'狗',
	'猪',
]

/**
 * 根據公曆日期取得農曆日期
 * @param {DateConfigType} [date=getZonedDate()] 公曆日期，默認為當前日期
 * @returns {{ year: number; month: number; day: number }} 農曆日期資訊
 */
export function getLunarDate(date: DateConfigType = getZonedDate()): {
	year: number
	month: number
	day: number
} {
	const [year, month, day] = lunisolar(date)
		.format('lYn-lMn-lDn')
		.split('-')
		.map(Number)

	return {
		year,
		month,
		day,
	}
}

/**
 * 根據年份獲取對應的生肖
 * @param {number} year 農曆年份
 * @returns {string} 對應的生肖
 */
export function getYearPet(year: number): string {
	const startYear = 1900 // 起始年份
	const zodiacIndex = (year - startYear) % zodiacs.length
	return zodiacs[zodiacIndex]
}

/**
 * 根據年份和號碼獲取對應的五行屬性
 * @param {string} number 號碼
 * @param {number} year 農曆年份
 * @returns {{ value: string; ws: string }} 號碼和五行對應關係
 */
export function getWuhang(
	number: string,
	year: number
): { value: string; ws: string } {
	const startYear = 1983 // 起始年份
	const cycle = 30 // 五行循環週期
	const index = (cycle + year - startYear - +number) % cycle

	return { value: number, ws: wxsx[index >= 0 ? index : cycle + index] }
}

/**
 * 根據年份和號碼獲取對應的生肖
 * @param {string} number 號碼
 * @param {number} year 農曆年份
 * @returns {{ value: string; pet: string }} 號碼和生肖對應關係
 */
export function getNumberPet(
	number: string,
	year: number
): { value: string; pet: string } {
	const yearPet = getYearPet(year)
	const [beforeSplit, afterSplit] = zodiacs.join('').split(yearPet)
	const pets = [
		yearPet,
		...beforeSplit.split('').reverse(),
		...afterSplit.split('').reverse(),
	]
	const pet = pets[(+number % zodiacs.length || zodiacs.length) - 1]

	return { value: number, pet }
}

/**
 * 根據號碼獲取相應的球色
 * @param {BallColorKey} number - 號碼
 * @returns {string} 對應的顏色
 */
export function getBallColor(number: BallColorKey): string {
	if (!ballColorMap[number]) return 'red'
	return ballColorMap[number]
}

/**
 * 根據號碼獲取其單雙屬性
 * @param {string｜number} number 號碼
 * @returns {'单' | '双'} 號碼為單數則返回 '單'，否則返回 '雙'
 */
export function getParity(number: string | number): '单' | '双' {
	return +number % 2 ? '单' : '双'
}

/**
 * 根據號碼獲取其大小屬性
 * @param {string｜number} number 號碼
 * @returns {'大' | '小'} 號碼大於等於 25 則返回 '大'，否則返回 '小'
 */
export function getSize(number: string | number): '大' | '小' {
	return +number >= 25 ? '大' : '小'
}

/**
 * 根據號碼獲取其尾數大小屬性
 * @param {string | number} number 號碼
 * @returns {'尾大' | '尾小'} 尾數大於等於 5 則返回 '尾大'，否則返回 '尾小'
 */
export function getTailSize(number: string | number): '尾大' | '尾小' {
	const lastDigit = +String(number).slice(-1)
	return lastDigit >= 5 ? '尾大' : '尾小'
}

/**
 * 根據號碼列表獲取合單或合雙
 * @param {string | number} number 號碼
 * @returns {'合单' | '合双'} 總和為單數則返回 '合單'，否則返回 '合雙'
 */
export function getCombinedParity(number: string | number): '合单' | '合双' {
	return _sum(_map(_split(String(number), ''), Number)) % 2 ? '合单' : '合双'
}

/**
 * 根據號碼列表的總和獲取其單雙屬性
 * @param {string[]} numbers 號碼列表
 * @returns {'单' | '双'} 總和為單數則返回 '單'，否則返回 '雙'
 */
export function getTotalParity(numbers: string[]): '单' | '双' {
	const total = _sum(_map(numbers, Number))
	return total % 2 ? '单' : '双'
}

/**
 * 根據號碼列表的總和獲取其大小屬性
 * @param {string[]} numbers 號碼列表
 * @returns {'大' | '小'} 總和大於等於 175 則返回 '大'，否則返回 '小'
 */
export function getTotalSize(numbers: string[]): '大' | '小' {
	const total = _sum(_map(numbers, Number))
	return total >= 175 ? '大' : '小'
}

interface OpenCode {
	value: string
	pet: string
	ws: string
	color: string
	parity: '单' | '双'
	combinedParity: '合单' | '合双'
	size: '大' | '小'
	tailSize: '尾大' | '尾小'
}

interface BallNumberData {
	openCode: OpenCode[]
	totalParity: '单' | '双'
	totalSize: '大' | '小'
}

/**
 * 根據號碼列表獲取所有相關屬性
 * @param {string[]} numbers 號碼列表
 * @param {DateConfigType} [date] 日期（可選）
 * @returns {object[]} 每個號碼的相關屬性，包括生肖、五行、波色、單雙、大小、尾數大小
 */
export function getBallNumberData(
	numbers: string[],
	date?: DateConfigType
): BallNumberData {
	const lunarYear = getLunarDate(date).year
	const totalParity = getTotalParity(numbers)
	const totalSize = getTotalSize(numbers)

	return {
		openCode: _map(numbers, (number) => {
			const paddedNumber = _padStart(String(number), 2, '0') as BallColorKey
			const { pet } = getNumberPet(paddedNumber, lunarYear)
			const { ws } = getWuhang(paddedNumber, lunarYear)
			const color = getBallColor(paddedNumber)
			const parity = getParity(paddedNumber)
			const combinedParity = getCombinedParity(paddedNumber)
			const size = getSize(paddedNumber)
			const tailSize = getTailSize(paddedNumber)

			return {
				value: paddedNumber,
				pet,
				ws,
				color,
				parity,
				combinedParity,
				size,
				tailSize,
			}
		}),
		totalParity,
		totalSize,
	}
}
