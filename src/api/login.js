import { bizRequest } from '@/modules/service.js'
import Cookies from 'js-cookie'
import { getIPInfo } from '@/api/common.js'
import { Base64 } from 'js-base64'

export async function sendOTPCode({ mobileCountryCode, mobile }) {
	const ip = await getIPInfo()
	const ipInfo = Base64.encode(JSON.stringify(ip))
	return bizRequest({
		method: 'POST',
		url: 'login/mobileLoginSendCode',
		data: {
			clientType: window._global.clientType,
			mobileCountryCode,
			mobile,
			ipInfo,
		},
	})
}

export function loginWithOTP({ authCode, token, quiet = false }) {
	const regPromotionCode = sessionStorage.getItem('inviter')
	return bizRequest({
		method: 'POST',
		url: 'login/mobileLoginVerify',
		quiet,
		data: {
			clientType: window._global.clientType,
			authCode,
			token,
			regPromotionCode,
		},
	})
}

export function logout() {
	return bizRequest({
		method: 'POST',
		url: 'login/exit',
		quiet: true,
	}).then((res) => {
		Cookies.remove('user')
		return res
	})
}

//根据刷新令牌，申请访问令牌 https://dev-torna.pwtk.cc/#/view/nzdK05Xj
export function applyToken(refreshToken) {
	return bizRequest({
		method: 'POST',
		url: 'login/applyAccessToken',
		quiet: true,
		data: {
			clientType: window._global.clientType,
			refreshToken,
		},
	})
}
