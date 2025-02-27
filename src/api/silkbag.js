import { a6tkRequest } from '@/modules/service'

export function getListYear() {
	return a6tkRequest({
		url: 'lottery/listYear',
	})
}

export function getLatestSinkBag() {
	return a6tkRequest({
		url: 'tool/sinkBag',
	})
}

export function getSinkBagLists(
	params = { year: new Date().getFullYear() },
) {
	return a6tkRequest({
		url: 'tool/listSinkBag',
		params,
	})
}
