const initialize = _once(() => {
	window.addEventListener('message', (event) => {
		if (_get(event, 'data.from') != '3pl') return
		callback.forEach((cb) => cb(event.data))
	})
})

let callback = []

export function use3PLogin() {
	if (!import.meta.env.SSR) initialize()

	function onResponse(cb) {
		callback.push(cb)
	}

	return { onResponse }
}
