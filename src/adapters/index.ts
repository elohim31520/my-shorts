import type { AxiosResponse } from 'axios'
import { AdapterFactory } from './factory'
import type { StandardApiResponse } from './type'
import {
	LastLotteryResultAdapterA6,
	LastLotteryResultAdapterHK6,
	LastLotteryResultAdapterTW6,
	LastLotteryResultAdapterSG6,
	LastLotteryResultAdapterXA6,
} from './lastLotteryResult'
import {
	LotteryHistoryAdapter,
	LotteryHistoryAdapter2023,
} from './lotteryHistory'
import { LotteryResultAdapter } from './lotteryResult'
import { CommonAdapter } from './common'
import { A6tkAdapter } from './a6tk'
import { LotteryTypeAdapter } from './lotteryType'

import { split as _split } from 'lodash-es'

// 響應處理
export async function processApiResponse(
	response: AxiosResponse
): Promise<StandardApiResponse> {
	const [pathname] = _split(response.config.url, '?')
	const fullUrl = `${response.config.baseURL}${pathname}`
	const adapter = AdapterFactory.getAdapter(fullUrl)
	if (!adapter) return response.data
	try {
		return await adapter.adapt(response.data)
	} catch (error) {
		throw error
	}
}

/**
 * 註冊適配器
 * 注意：適配器註冊需按順序，匹配過程從上到下執行，先匹配到的適配器將被使用。
 */
// 舊的後端 API
AdapterFactory.registerAdapter('*//a6tk59.com/*', new A6tkAdapter())

// 最後一期開獎結果
AdapterFactory.registerAdapter(
	'*/a6/issue/currentInfo',
	new LastLotteryResultAdapterA6()
)
AdapterFactory.registerAdapter(
	'*/hk6/issue/currentInfo',
	new LastLotteryResultAdapterHK6()
)
AdapterFactory.registerAdapter(
	'*/tw6/issue/currentInfo',
	new LastLotteryResultAdapterTW6()
)
AdapterFactory.registerAdapter(
	'*/sg6/issue/currentInfo',
	new LastLotteryResultAdapterSG6()
)
AdapterFactory.registerAdapter(
	'*/xa6/issue/currentInfo',
	new LastLotteryResultAdapterXA6()
)

// 開獎歷史
// AdapterFactory.registerAdapter(
// 	'*/gr/hk6/history/2023',
// 	new LotteryHistoryAdapter2023()
// )
// AdapterFactory.registerAdapter(
// 	'*/gr/sg6/history/2023',
// 	new LotteryHistoryAdapter2023()
// )
AdapterFactory.registerAdapter('*/gr/*/history/*', new LotteryHistoryAdapter())

// 取下一期的資訊（期數、年份等），這個路由會匹配到下面那個，因此需要先註冊
AdapterFactory.registerAdapter('*/gr/*/issue/info', new CommonAdapter())

// 開獎結果
AdapterFactory.registerAdapter('*/gr/*/issue/*', new LotteryResultAdapter())

//彩種類表
AdapterFactory.registerAdapter('*/gr/gameType/list/*', new LotteryTypeAdapter())

// 通用
AdapterFactory.registerAdapter('*/pwtk/?*', new CommonAdapter())
