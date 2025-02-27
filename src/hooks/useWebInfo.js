import { useWebInfoStore } from '@/stores/webInfo.js'
import { pageStore } from '@/stores'

export function useWebInfo() {
	function getManageSiteId() {
		return getWebInfo('manageSiteId')
	}

	function getWebsiteId() {
		return getWebInfo('websiteId')
	}

	function getWebInfo(key) {
		if (import.meta.env.SSR) return pageStore.webInfo[key]
		return useWebInfoStore()[key]
	}

	return { getManageSiteId, getWebsiteId }
}
