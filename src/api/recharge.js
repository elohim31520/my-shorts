import { bizRequest } from '@/modules/service'
import { getIPInfo } from '@/api/common'
import { Base64 } from 'js-base64'

/**
 * 獲取支付配置
 *
 * @returns {Promise<Object>}
 */
export function getPaymentConfigApi() {
	return bizRequest({
		method: 'get',
		url: 'payment/getPayConfig',
	})
}

/**
 * 獲取用戶支付結果
 *
 * @param {Object} data
 * @param {number} [data.payOrderId] - TODO
 * @returns {Promise<Object>}
 */
export function getPaymentResultApi({ payOrderId } = {}) {
	return bizRequest({
		method: 'post',
		url: 'payment/payByOrderId',
		data: {
			payOrderId,
		},
	})
}

/**
 * 獲取用戶儲值紀錄
 *
 * @param {Object} data
 * @param {number} [data.page] - 頁碼，默認 1
 * @param {number} [data.size] - 每頁顯示條數，默認 10
 * @returns {Promise<Object>}
 */
export function getRechargeRecordApi({ page = 1, size = 10 } = {}) {
	return bizRequest({
		method: 'post',
		url: 'payment/payOrderList',
		data: {
			page,
			size,
		},
	})
}

/**
 * 生成用戶支付跳轉頁面所需的表單數據
 *
 * @param {Object} data
 * @param {number} [data.score] - TODO
 * @param {number} [data.payType] - TODO
 * @returns {Promise<Object>}
 */
export async function getPaymentRedirectFormApi({ score, payType = 's' } = {}) {
	const ipJson = await getIPInfo()
	const ipBase64 = Base64.encode(JSON.stringify(ipJson))

	return bizRequest({
		method: 'post',
		url: 'payment/getPayOrder',
		data: {
			score,
			payType,
			ipInfo: ipBase64,
		},
	})
}
