import { bizRequest, kvRequest } from '@/modules/service'
import { getIPInfo } from '@/api/common.js'
import { Base64 } from 'js-base64'
const ip = await getIPInfo()
const ipInfo = Base64.encode(JSON.stringify(ip))
export function editName(nickname) {
	return bizRequest({
		url: `user/updateNickname`,
		data: { nickname },
		method: 'POST',
	})
}

export function editHead(avatar) {
	return bizRequest({
		url: 'user/updateAvatar',
		data: { avatar },
		method: 'POST',
	})
}
export async function currentMobileSendCode({ mobileCountryCode, mobile }) {
	return bizRequest({
		url: 'user/currentMobileSendCode',
		method: 'POST',
		data: {
			clientType: window._global.clientType,
			mobileCountryCode,
			mobile,
			ipInfo,
		},
	})
}
export async function currentMobileVerify({ token, authCode }) {
	return bizRequest({
		url: 'user/currentMobileVerify',
		method: 'POST',
		quiet: true,
		data: {
			clientType: window._global.clientType,
			token,
			authCode,
			ipInfo,
		},
	})
}

export async function changeMobileSendCode({
	mobileCountryCode,
	mobile,
	token,
}) {
	return bizRequest({
		url: 'user/changeMobileSendCode',
		method: 'POST',
		data: {
			clientType: window._global.clientType,
			mobileCountryCode,
			mobile,
			ipInfo,
			token,
		},
	})
}
export function changeMobile({ token, authCode }) {
	return bizRequest({
		url: 'user/changeMobileVerify',
		method: 'POST',
		data: {
			clientType: window._global.clientType,
			token,
			authCode,
		},
		quiet: true,
	})
}

export function getDefaultHeadList() {
	return kvRequest({
		url: 'user/pre-avatar-list',
		method: 'GET',
	})
}
export function updateMemo(memo) {
	return bizRequest({
		url: 'user/updateMemo',
		method: 'POST',
		data: { memo },
	})
}

export function checkInviter() {
	return bizRequest({
		url: 'user/myPromoter',
		method: 'GET',
	})
}

export function searchInviter(promotionCode) {
	return bizRequest({
		url: 'user/searchUserByPromotionCode',
		method: 'POST',
		data: { promotionCode },
	})
}

// 10004：用户不存在
// 10015：用户上下级关系异常
// 10091：已有邀请人
// 10092：填写的邀请码不正确
export function bindInviter({ promoterUserId, promotionCode }) {
	return bizRequest({
		url: 'user/bindPromoter',
		quiet: true,
		// quiet: ['10004', '10015', '10091', '10092'],
		method: 'POST',
		data: { promoterUserId, promotionCode },
	})
}
