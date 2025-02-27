import { kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'

export function getWebsiteList() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `tk/websiteList/${manageSiteId}`,
	})
}

let domainList = null

export function getDomainList() {
	if (domainList) return Promise.resolve(domainList)
	const websiteId = useWebInfo().getWebsiteId()
	return kvRequest({
		url: `wm/website/domainList/${websiteId}`,
	}).then((res) => {
		if (!import.meta.env.SSR) domainList = res
		return res
	})
}

export function getMailContact() {
	const websiteId = useWebInfo().getWebsiteId()
	return kvRequest({
		url: `wm/website/${websiteId}`,
	})
}

export function getAboutUs() {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `wm/dict/params/about_us/about_us/${manageSiteId}`,
	})
}
