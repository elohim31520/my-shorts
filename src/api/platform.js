import { kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'

export function getPlatformList() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `tk/guarantee/${manageSiteId}`,
	})
}
