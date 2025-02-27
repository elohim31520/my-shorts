import { createService } from '../service'
import { getCid, getUser } from '@/modules/util'

const defaultConfig = {
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10 * 1000,
	baseURL: import.meta.env.PUBLIC_BASE_RENDER_API_URL,
}

export default function (config) {
	const headers = {
		cid: getCid(),
		token: _get(getUser(), 'token'),
	}
	const mergeConfig = _merge(_cloneDeep(defaultConfig), { headers }, config)
	const service = createService()
	return service(mergeConfig)
}
