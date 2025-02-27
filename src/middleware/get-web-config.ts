import type { MiddlewareHandler } from 'astro'
import { getConfig } from '@/api/common.js'

const setWebConfig: MiddlewareHandler = async (context, next) => {
	const res = await getConfig(new URL(context.request.url).hostname)
	context.locals.webTitle = _get(res, 'data.websiteTitle', '')
	context.locals.icon = _get(res, 'data.icon')
	return next()
}

export default setWebConfig
