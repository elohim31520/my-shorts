import { bizRequest, kvRequest } from '@/modules/service.js'
import { getIPInfo } from '@/api/common.js'
import { Base64 } from 'js-base64'
import { useWebInfo } from '@/hooks/useWebInfo.js'
import { loseWeight } from '@/modules/util.js'

// 換一批才用這個不然一律用下方的KV
export function getDaniuList({ userId, isFollowed, anotherBatch, page, size }) {
	return bizRequest({
		method: 'POST',
		url: 'relationship/talents',
		data: {
			userId,
			isFollowed,
			anotherBatch,
			page,
			size,
		},
	})
}

export async function addFollow({ toUserId }) {
	const ipJson = await getIPInfo()
	const ipBase64 = Base64.encode(JSON.stringify(ipJson))

	return bizRequest({
		method: 'POST',
		url: 'relationship/add',
		headers: {
			businessType: window._global.clientType,
		},
		data: {
			toUserId,
			ipInfo: ipBase64,
		},
	})
}

export async function delFollow({ toUserId }) {
	const ipJson = await getIPInfo()
	const ipBase64 = Base64.encode(JSON.stringify(ipJson))

	return bizRequest({
		method: 'POST',
		url: 'relationship/del',
		headers: {
			businessType: window._global.clientType,
		},
		data: {
			toUserId,
			ipInfo: ipBase64,
		},
	})
}

/**
 * https://dev-torna.pwtk.cc/#/view/d2qRKAr8
targetUserId: 对方用户ID
direct:
1：（我关注对方）我的关注
2：（对方关注我）我的粉丝
 */
export async function getFollow({ targetUserId, direct }) {
	return bizRequest({
		method: 'POST',
		url: 'relationship/get',
		headers: {
			businessType: window._global.clientType,
		},
		data: {
			targetUserId,
			direct,
		},
	})
}

/* 
https://dev-torna.pwtk.cc/#/view/e24yaMo8
*/
export async function getFollowBatch({ targetUserIdList, direct }) {
	return bizRequest({
		method: 'POST',
		url: 'relationship/batch-get',
		data: {
			targetUserIdList,
			direct,
		},
	})
}

export function getFollowFans({
	businessType,
	page,
	size,
	relationFlag,
	direct,
}) {
	return bizRequest({
		method: 'POST',
		url: 'relationship/list',
		headers: {
			businessType,
		},
		data: {
			page,
			size,
			relationFlag,
			direct,
		},
	})
}

export async function getSomeoneFollow({ page, size, targetUserId, direct }) {
	return bizRequest({
		method: 'POST',
		url: 'relationship/other-list',
		data: {
			page,
			size,
			targetUserId,
			direct,
		},
	})
}

/**
 * 獲取大牛列表 (KV)
 * @returns {Promise<Object>}
 */
const baseFields = ['avatar', 'userId', 'nickname']

export function getDaniuListKV(fields) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `user/${manageSiteId}/talents/recommend`,
	}).then((res) => {
		_forEach(_get(res, 'data', []), (vo) => delete vo.medalList) //medalList 改成 biz/userMedal/batch-get 獲取
		if (fields) {
			loseWeight(res, [...baseFields, ...fields])
		}
		return res
	})
}
