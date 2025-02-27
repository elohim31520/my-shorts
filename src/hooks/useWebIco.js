import { getConfig } from '@/api/common.js'
import { getCdnUrl } from '@/modules/util.js'

export function useWebIco() {
	async function setIco() {
		const res = await getConfig()
		const icon = _get(res, 'data.icon')
		if (!icon) return
		const link = document.createElement('link')
		link.rel = 'icon'
		link.href = getCdnUrl(icon)
		document.head.appendChild(link)
	}

	return { setIco }
}
