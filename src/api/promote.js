import { bizRequest } from '@/modules/service'

/**
 * 我的一级邀请用户数 https://dev-torna.pwtk.cc/#/view/a85Eko18
 * @returns
 */
export function getMyCustomerCount() {
	return bizRequest({
		url: 'user/myCustomerCnt',
		method: 'GET',
	})
}

/**
 * 我的二级邀请用户数 https://dev-torna.pwtk.cc/#/view/V2J0mPaX
 */
export function getOtherCustomerCount() {
	return bizRequest({
		url: 'user/otherCustomerCnt',
		method: 'GET',
	})
}

/**
 * 我的客户（一级客户）一览 https://dev-torna.pwtk.cc/#/view/kXOQJrL2
 */
export function getMyCustomerList({
	page = 1,
	size = 10,
	sortName = '',
	nickname = '',
} = {}) {
	return bizRequest({
		method: 'POST',
		url: 'user/myCustomerList',
		data: {
			page,
			size,
			sortName,
			nickname,
		},
	})
}

/**
 * 我的客户（二级客户）一览 https://dev-torna.pwtk.cc/#/view/xXapPvv8
 */
export function getOtherCustomerList({
	page = 1,
	size = 10,
	sortName = '',
	nickname = '',
} = {}) {
	return bizRequest({
		method: 'POST',
		url: 'user/otherCustomerList',
		data: {
			page,
			size,
			sortName,
			nickname,
		},
	})
}
