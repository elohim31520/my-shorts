import { kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'

export function getCorpus() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `bbs/${manageSiteId}/corpus/detail`,
	})
}
