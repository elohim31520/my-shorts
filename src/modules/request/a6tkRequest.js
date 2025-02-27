import { createService } from '../service'
import { getA6LotteryCode, getLotteryType } from '@/modules/util.js'

const defaultConfig = {
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10 * 1000,
	baseURL: import.meta.env.PUBLIC_BASE_A6TK_API_URL,
}

export default function (config) {
	const lotteryType = getLotteryCode()
	const mergeConfig = _merge(
		_cloneDeep(defaultConfig),
		{ headers: { lotteryType } },
		config
	)
	const service = createService()
	return service(mergeConfig)
}

function getLotteryCode() {
	let lotteryType = getLotteryType() || 'a6'
	return getA6LotteryCode(lotteryType)
}
