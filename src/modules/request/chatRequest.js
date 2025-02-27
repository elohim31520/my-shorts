import { createService, requestOnUnload } from '../service'
import { getCid, getUser } from '@/modules/util'
import { useWebInfo } from '@/hooks/useWebInfo'

const defaultConfig = {
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10 * 1000,
	baseURL: import.meta.env.PUBLIC_BASE_CHAT_URL,
}

export default function (config) {
	const siteId = useWebInfo().getManageSiteId()
	const { anonymousToken, token } = getUser()
	const headers = {
		cid: getCid(),
		manage_set_id: siteId,
		...(token ? { token } : { 'anonymous-token': anonymousToken }),
	}

	const mergeConfig = _merge(_cloneDeep(defaultConfig), { headers }, config)
	const service = createService()
	return service(mergeConfig)
}

export function chatRequestOnUnload(config) {
	const siteId = useWebInfo().getManageSiteId()
	const { anonymousToken, token } = getUser()
	const headers = {
		cid: getCid(),
		manage_set_id: siteId,
		...(token ? { token } : { 'anonymous-token': anonymousToken }),
	}

	const mergeConfig = _merge(_cloneDeep(defaultConfig), { headers }, config)

	return requestOnUnload(mergeConfig)
}
