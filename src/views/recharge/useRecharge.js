import { getPaymentRedirectFormApi } from '@/api/recharge'
import { safeOpen, redirect } from '@/modules/util'

export function useRecharge() {
	const recharge = async (score) => {
		const response = await getPaymentRedirectFormApi({ score })
		const orderId = _get(response, 'data.bizOrderNo', '')
		const params = { ...response.data }
		delete params.payUrl
		const queryString = String(new URLSearchParams(params))
		const paymentWindow = safeOpen(`${response.data.payUrl}?${queryString}`)

		redirect(`/recharge/info/${orderId}`, { auth: true, skip: true })
	}

	return {
		recharge,
	}
}
