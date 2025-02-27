import { a6tkRequest } from '@/modules/service'

export function getListYear(year) {
	return a6tkRequest({
		url: 'lottery/listYear',
	})
}
export function getTailBigSmall(year) {
	return a6tkRequest({
		url: 'stat/tailBigSmall',
		params: { year },
	})
}

export function getAnimalAnalyze(year) {
	return a6tkRequest({
		url: 'stat/animalAnalyze',
		params: { year },
	})
}

export function getConsecutiveStat(year, type) {
	return a6tkRequest({
		url: 'stat/consecutiveStat',
		params: { year, type },
	})
}

export function getNumberAnalyze({ type, period }) {
	return a6tkRequest({
		url: 'stat/numberAnalyze',
		method: 'get',
		params: {
			type,
			period,
		},
	})
}

export function getAttribute() {
	return a6tkRequest({
		url: 'stat/attrConstant',
	})
}

export function getNumberStat({ type, period }) {
	return a6tkRequest({
		url: 'stat/numberStat',
		method: 'get',
		params: {
			type,
			period,
		},
	})
}

export function getAnimalStat({ type, period }) {
	return a6tkRequest({
		url: 'stat/animalStat',
		method: 'get',
		params: {
			type,
			period,
		},
	})
}

export function getColorStat({ type, period }) {
	return a6tkRequest({
		url: 'stat/colorStat',
		method: 'get',
		params: {
			type,
			period,
		},
	})
}

export function getTailStat({ type, period }) {
	return a6tkRequest({
		url: 'stat/tailStat',
		method: 'get',
		params: {
			type,
			period,
		},
	})
}

export function getNumberRange({ period }) {
	return a6tkRequest({
		url: 'stat/numberRange',
		method: 'get',
		params: {
			period,
		},
	})
}

export function getStatSummery(period = 100) {
	return a6tkRequest({
		url: `stat/summary?period=${period}`,
	})
}
