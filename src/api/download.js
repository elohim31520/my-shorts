import { kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'

export async function getDownloadLink(type) {
	const manageSiteId = useWebInfo().getManageSiteId()
	const url = `wm/dict/params/app_download/${type}/${manageSiteId}`
	const res = await kvRequest({
		url,
	})

	return JSON.parse(_get(res, 'data.value', {}))
}
