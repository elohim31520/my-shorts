import { kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'
import { useUserStore } from '@/stores/user.js'

export function getGlobalMaintain() {
	return kvRequest({
		url: 'mt/global',
	})
}

export function getTeamMaintain() {
	return kvRequest({
		url: 'mt/team',
	})
}

export function getUserMaintain() {
	const { userId } = useUserStore().data
	if (!userId) return Promise.resolve()
	return kvRequest({
		url: `mt/user/${userId}`,
	})
}

export function getWebsiteMaintain() {
	const websiteId = useWebInfo().getWebsiteId()
	return kvRequest({
		url: `mt/website/${websiteId}`,
	})
}

export function getDomainMaintain() {
	const domain = import.meta.env.PUBLIC_DOMAIN_SPECIFY || location.hostname
	return kvRequest({
		url: `mt/domain/${domain}`,
	})
}

export function getMaintain() {
	const websiteId = useWebInfo().getWebsiteId()
	const domain = import.meta.env.PUBLIC_DOMAIN_SPECIFY || location.hostname
	const keys = [
		'mt/global',
		'mt/team',
		`mt/website/${websiteId}`,
		`mt/domain/${domain}`,
	]
	const { userId } = useUserStore().data
	if (userId) keys.push(`mt/user/${userId}`)
	return kvRequest({
		keys,
	})
}
