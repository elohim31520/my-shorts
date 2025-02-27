import type { MiddlewareHandler } from 'astro'
import { getUser, isAuthRequired } from '@/modules/util.js'

const auth: MiddlewareHandler = async (context, next) => {
	if (isAuthRequired(context.url.pathname)) {
		const token = _get(getUser(), 'token')
		if (!token) {
			return context.rewrite('/unAuth')
		}
	}
	return next()
}

export default auth
