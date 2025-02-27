import type { MiddlewareHandler } from 'astro'
import { updateStoreFromCookie, initializePinia } from '@/stores'

const isPagePath = (path: string): boolean => /^\/[a-zA-Z0-9\/]*$/.test(path)

const updateStore: MiddlewareHandler = async (context, next) => {
	if (!isPagePath(context.url.pathname)) return next()
	initializePinia()
	updateStoreFromCookie(context.request.headers.get('cookie'))
	return next()
}

export default updateStore
