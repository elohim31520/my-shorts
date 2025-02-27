import { createService } from '../service'

let cache = null
let subscriber = null
let locale = null

export function inject(value) {
	locale = value
}

if (import.meta.env.SSR) {
	const res = await Promise.all([import('../cache.js'), import('../redis.js')])
	cache = res[0].default
	subscriber = res[1].subscriber
	if (cache.isActive) {
		subscriber.subscribe('__keyevent@0__:expired')
		subscriber.on('message', (channel, key) => {
			console.log(`redis key 過期: ${key}`)
			kvRequest({ url: key })
		})
	}
}

const defaultConfig = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
	method: 'get',
	timeout: 10 * 1000,
	baseURL: import.meta.env.PUBLIC_BASE_KV_API_URL,
}

export default async function kvRequest(config) {
	//config.keys 代表批量查詢(?key=key1,key2,...)，不做緩存
	if (import.meta.env.SSR && cache.isActive && !config.keys) {
		const key = config.url
		let res = await cache.get(key)
		if (res) {
			if (!locale.logs) locale.logs = []
			locale.logs.push({ url: key, method: 'cache' })
			try {
				res = JSON.parse(res)
			} catch (e) {
				console.warn(`${key}: 緩存資料不是JSON格式!`)
			}
			console.log(`get data from cache with key : ${key}`)
			return Promise.resolve(res)
		}
	}
	const mergeConfig = _merge(_cloneDeep(defaultConfig), config)
	if (config.keys) {
		mergeConfig.baseURL = _trimEnd(mergeConfig.baseURL, '/')
		const keys = _isArray(config.keys) ? config.keys.join(',') : config.keys
		mergeConfig.params = { keys }
	}
	const service = createService()

	service.interceptors.response.use((response) => {
		const data = _get(response, 'data')
		if (import.meta.env.SSR && cache.isActive && data) {
			cache.set(config.url, JSON.stringify(response), cache.defaultExpire)
		}
		return response
	})

	return service(mergeConfig)
}
