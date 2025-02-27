export const isReactNative = import.meta.env.SSR
	? false
	: typeof window.ReactNativeWebView !== 'undefined'

export function sendMessageToNative(type, payload = null) {
	if (!isReactNative) return
	const message = JSON.stringify({ type, payload })
	window.ReactNativeWebView.postMessage(message)
}
