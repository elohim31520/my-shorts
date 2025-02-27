import { bizRequest, kvRequest } from '@/modules/service.js'

export async function expertApply() {
	return bizRequest({
		method: 'POST',
		url: 'sense/expertApply',
	})
}
export async function isCanApply() {
	return bizRequest({
		method: 'POST',
		url: 'sense/canApply',
	})
}
