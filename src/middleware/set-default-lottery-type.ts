import type { MiddlewareHandler } from 'astro'

import { pageStore, pinia } from '@/stores'

const setDefaultLotteryType: MiddlewareHandler = async (context, next) => {
	const lotteryType = context.url.searchParams.get('lt')
	if (!lotteryType) return next()
	context.cookies.set(
		'lottery',
		JSON.stringify(JSON.stringify({ lotteryType }))
	)
	_set(pageStore, `lottery.lotteryType`, lotteryType)
	_set(pinia.state.value, `lottery.lotteryType`, lotteryType)
	return next()
}

export default setDefaultLotteryType
