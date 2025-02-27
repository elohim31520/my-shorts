import type { MiddlewareHandler } from 'astro'
import { getLotteryTypesApi } from '@/api/lottery.js'
import { LRUCache } from 'lru-cache'

let cache = new LRUCache({
	max: 20,
	ttl: 10 * 60 * 1000 /*緩存10分鐘*/,
	ttlResolution: 5 * 1000,
})
const key = 'lottery-type'

const getLotteryTypes: MiddlewareHandler = async (context, next) => {
	const result = await getData()
	context.locals.lotteryTypes = result
	return next()
}

async function getData() {
	if (cache.has(key)) {
		return Promise.resolve(cache.get(key))
	}
	const res = await getLotteryTypesApi()
	const result = _get(res, 'data', [])
	cache.set(key, result)
	return result
}

export default getLotteryTypes
