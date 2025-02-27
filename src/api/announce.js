import { kvRequest } from '@/modules/service'
import { useWebInfo } from '@/hooks/useWebInfo.js'
import { useUserStore } from '@/stores/user.js'

export function getGlobalAnnounce() {
	return kvRequest({
		url: 'ann/global',
	})
}

export function getTeamAnnounce() {
	return kvRequest({
		url: 'ann/team',
	})
}

export function getUserAnnounce() {
	const { userId } = useUserStore().data
	if (!userId) return Promise.resolve()
	return kvRequest({
		url: `ann/user/${userId}`,
	})
}

export function getWebsiteAnnounce() {
	const websiteId = useWebInfo().getWebsiteId()
	return kvRequest({
		url: `ann/website/${websiteId}`,
	})
}

export function getDomainAnnounce() {
	const domain = import.meta.env.PUBLIC_DOMAIN_SPECIFY || location.hostname
	return kvRequest({
		url: `ann/domain/${domain}`,
	})
}

export function getAnnounce() {
	const websiteId = useWebInfo().getWebsiteId()
	const domain = import.meta.env.PUBLIC_DOMAIN_SPECIFY || location.hostname
	const keys = [
		'ann/global',
		'ann/team',
		`ann/website/${websiteId}`,
		`ann/domain/${domain}`,
	]
	const { userId } = useUserStore().data
	if (userId) keys.push(`ann/user/${userId}`)
	return kvRequest({
		keys,
	})
}
