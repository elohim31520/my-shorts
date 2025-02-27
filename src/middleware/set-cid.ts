import type { MiddlewareHandler } from 'astro'
import { getCidApi, registerCidApi } from '@/api/user'
import { getDevice, getUser, isNotBlank, delay } from '@/modules/util'
import { inject } from '@/modules/service'

const cidPools: {
	[domain: string]: Array<{ cid: string }>
} = {}
// 防止併發填充
const isFillingPools: { [domain: string]: boolean } = {}

// 默認的 pool 大小
const DEFAULT_POOL_SIZE = 10

// 每個域名的 pool 大小配置，未指定的域名將使用 DEFAULT_POOL_SIZE
const domainPoolSizes: { [domain: string]: number } = {
	'demo.pwtk.cc': 20,
	// 'example.com': 15,
	// 未指定的域名將使用 DEFAULT_POOL_SIZE
}

// 是否開發模式
const isDevelopment = process.env.NODE_ENV === 'development'

// 填充指定域名的 cidPool
async function fillCidPool(domain: string) {
	if (isFillingPools[domain]) return
	isFillingPools[domain] = true

	const poolSize = domainPoolSizes[domain] || DEFAULT_POOL_SIZE
	if (!cidPools[domain]) cidPools[domain] = []
	for (let i = 0; i < poolSize; i++) {
		await delay(1)
		const response = await getCidApi()
		const cid = _get(response, 'data.cid', '')
		if (cid) {
			cidPools[domain].push({ cid })
		}
	}
	isFillingPools[domain] = false
}

// 在非開發模式下，在服務器啟動時為已知域名填充 cidPool
if (!isDevelopment && !process.env.IS_BUILD) {
	_forEach(_keys(domainPoolSizes), fillCidPool)
}

const setCid: MiddlewareHandler = async (context, next) => {
	inject(context.locals)
	const cidCookie = context.cookies.get('client')
	const userAgent = context.request.headers.get('user-agent')
	const webInfo = (() => {
		const value = context.cookies.get('webInfo')?.value

		if (!_isString(value)) return
		try {
			return JSON.parse(JSON.parse(value))
		} catch (error) {}
	})()
	const manageSiteId = _get(webInfo, 'manageSiteId', '')
	const { isH5 } = getDevice(userAgent)
	const clientType = isH5 ? 'C_H5' : 'C_WEB'
	const clientFlag = isH5 ? 'h' : 'w'
	context.locals._global = {
		isH5,
		clientType,
		clientFlag,
		isLogin: isNotBlank(_get(getUser(), 'token')),
	}

	// cookie 中不存在 cid 才會獲取並註冊
	if (!cidCookie) {
		const [domain] = _split(context.request.headers.get('host'), ':')
		let cidData: { cid: string }

		if (isDevelopment) {
			// 開發模式，直接獲取 cid 不使用 pool
			const response = await getCidApi()

			cidData = {
				cid: _get(response, 'data.cid', ''),
			}
		} else {
			if (!cidPools[domain]) cidPools[domain] = []

			if (cidPools[domain].length) {
				// 從對應域名的 pool 中獲取 cid
				cidData = cidPools[domain].shift()!

				// 如果 pool 中的 cid 數量低於設置的一半，重新填充 pool
				const poolSize = domainPoolSizes[domain] || DEFAULT_POOL_SIZE
				if (cidPools[domain].length < poolSize / 2) fillCidPool(domain)
			} else {
				// 如果 pool 為空，獲取 cid
				const response = await getCidApi()

				cidData = {
					cid: _get(response, 'data.cid', ''),
				}

				// 填充 pool
				fillCidPool(domain)
			}
		}

		const { cid } = cidData
		if (cid) {
			context.cookies.set('client', JSON.stringify(JSON.stringify({ cid })), {
				path: '/',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 365, // 1 year
			})

			//context.cookies.set cookie原有的webInfo會遺失，所以重新寫入
			context.cookies.set('webInfo', JSON.stringify(JSON.stringify(webInfo)), {
				path: '/',
			})

			registerCidApi({
				cid,
				manageSiteId,
				clientType,
				clientFlag,
			})
		}
	}

	return next()
}

export default setCid
