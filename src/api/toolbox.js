import { a6tkRequest } from '@/modules/service'

export async function getPrizeWheel() {
	const jpushId = 20072

	const res = await a6tkRequest({
		url: `tool/prizeWheel?jpushId=${jpushId}`,
	})
	return res
}

export async function getShakeResult(index, jpushId = 20072) {
	const params = {
		jpushId,
		create: index,
	}

	const res = await a6tkRequest({
		url: 'tool/shake',
		params,
	})
	return res
}

/**
 *
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function getConsultationApi({ year, queryType, value } = {}) {
	return a6tkRequest({
		url: `query/doQuery`,
		method: 'get',
		params: { year, queryType, value },
	})
}
