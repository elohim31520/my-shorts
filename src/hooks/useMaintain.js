import { getMaintain } from '@/api/maintain.js'
import { storeToRefs } from 'pinia'
import { useWebInfoStore } from '@/stores/webInfo.js'
import { getSiteProfile } from '@/api/common.js'
import { isBlank, redirect } from '@/modules/util.js'
import { isBetween } from '@/modules/date.js'
import { useMaintainStore } from '@/stores/maintain.js'

export function useMaintain() {
	function findKey(keys, pattern) {
		return _find(keys, (key) => _startsWith(key, pattern))
	}

	function filter(items, filterExt) {
		return _filter(items, (vo) => baseFilter(vo, filterExt))
	}

	function baseFilter(vo, filterExt) {
		let satisfied = true
		if (filterExt) satisfied = filterExt(vo)
		if (!satisfied) return false

		const device = window._global.isH5 ? 'h' : 'p' //端点P,PC;H,H5;A,APP;I,iOS;G,android
		let isDeviceFit = true
		if (vo.mtTargets && vo.mtTargets.length > 0) {
			isDeviceFit = _includes(vo.mtTargets, device)
		}
		if (!isDeviceFit) return false

		const isStatusY = vo.planStatus == 'y'
		if (!isStatusY) return false

		const isTimeValid = isBetween(vo.startTime, vo.endTime)
		if (!isTimeValid) return false

		return true
	}

	async function check() {
		const { userId } = storeToRefs(useWebInfoStore())
		const res = await Promise.all([
			getMaintain(),
			getSiteProfile({ userId: userId.value }),
		])

		const data = _get(res, '0.data')
		const domain = _defaultTo(_get(data, `${findKey('mt/domain')}.data`), [])
		const website = _defaultTo(_get(data, `${findKey('mt/website')}.data`), [])
		const user = _defaultTo(_get(data, `${findKey('mt/user')}.data`), [])
		const team = _defaultTo(_get(data, `mt/team.data`), [])
		const global = _defaultTo(_get(data, `mt/global.data`), [])
		const siteProfile = _defaultTo(_get(res, '1.data'), [])
		const userPath = _map(_get(siteProfile, 'userPath', []), (value) =>
			String(value)
		)

		const domainFilter = filter(domain)
		const websiteFilter = filter(website)
		const userFilter = filter(user)
		const teamFilter = filter(team, (vo) => {
			//团队要另外根据用户信息里面的 userPath 过滤
			if (isBlank(vo.mtTeamUserId)) return true
			return _includes(userPath, String(vo.anTeamUserId))
		})
		const globalFilter = filter(global)
		const maintains = [
			...domainFilter,
			...websiteFilter,
			...userFilter,
			...teamFilter,
			...globalFilter,
		]

		const { pathname } = window.location
		if (maintains.length > 0) {
			useMaintainStore().setItems(maintains)
			redirect('/maintain', { ignoreSelf: true })
		} else {
			if (pathname == '/maintain') redirect('/')
		}
	}

	return { check }
}
