import { createService, locals } from '../service'
import { getCid, getUser } from '@/modules/util'

const defaultConfig = {
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10 * 1000,
	baseURL: import.meta.env.PUBLIC_BASE_BIZ_API_URL,
}

export default function (config) {
	const clientType = import.meta.env.SSR
		? locals._global.clientType
		: window._global.clientType

	const headers = {
		cid: getCid(),
		businessType: 'XTK',
		clientType,
		token: _get(getUser(), 'token'),
	}

	const mergeConfig = _merge(_cloneDeep(defaultConfig), { headers }, config)
	const service = createService()
	return service(mergeConfig)
}
