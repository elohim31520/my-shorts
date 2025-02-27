import { getBallColor } from '@/modules/util.js'

export function usePredictDetail() {
	const colorMap = new Map([
		['B', 'blue'],
		['R', 'red'],
		['G', 'green'],
		['蓝', 'blue'],
		['红', 'red'],
		['绿', 'green'],
	])

	const sizeMap = new Map([
		['b', '大'],
		['s', '小'],
	])
	const parityMap = new Map([
		['o', '单'],
		['e', '双'],
	])

	function formatIssue(issue) {
		return _slice(issue, -3).join('')
	}

	function formatNumber(value) {
		if (!isNumber(value)) return value
		return _trimStart(value, '0')
	}

	function formatColor(c) {
		return colorMap.get(c) || 'black'
	}

	function formatSize(s) {
		return sizeMap.get(s)
	}

	function formatSize(s) {
		return sizeMap.get(s)
	}

	function formatParity(p) {
		return parityMap.get(p)
	}

	function getColor({ value, isHit }) {
		if (!isHit) return 'black'
		if ('红蓝绿'.includes(value)) return colorMap.get(value)
		if (isNumber(value)) return getBallColor(value)
		return 'green'
	}

	function isNumber(value) {
		return /\d+$/.test(value)
	}

	return {
		formatIssue,
		formatNumber,
		formatColor,
		formatSize,
		formatParity,
		getColor,
	}
}
