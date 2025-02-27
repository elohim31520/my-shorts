import type { MiddlewareHandler } from 'astro'
import { pinia } from '@/stores'

const injectPiniaState: MiddlewareHandler = async (context, next) => {
	const response = await next()
	const contentType = response.headers.get('Content-Type') || ''
	if (contentType.includes('text/html')) {
		const responseClone = response.clone()
		const originalBody = await responseClone.text()
		const scriptContent = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(JSON.stringify(pinia.state.value))};</script>`
		const modifiedBody = originalBody.replace(
			'</title>',
			`</title>${scriptContent}`
		)

		const modifiedResponse = new Response(modifiedBody, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		})

		return modifiedResponse
	}
	return response
}

export default injectPiniaState
