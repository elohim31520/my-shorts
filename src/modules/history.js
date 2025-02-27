const key = 'history'

export default {
	install: () => {
		window.addEventListener('beforeunload', historyHandler)
		const browser = _get(window._global, 'ua.browser.name', '')
		const isMobileSafari = /mobile\s+safari/i.test(browser)
		if (isMobileSafari) {
			window.addEventListener('pagehide', historyHandler)
		}
		sessionStorage.removeItem('skip')
		removeSelf()
	},
}

function historyHandler() {
	const { pathname, search } = window.location
	//控制stack size，把首頁當作原點，清空stack之前的資料
	if (pathname == '/') {
		sessionStorage.setItem(key, JSON.stringify([pathname]))
		return
	}
	const isSkip = sessionStorage.getItem('skip') == 1
	if (!isSkip) push(pathname + search)
}

export function pop() {
	const history = getHistory()
	const last = history.pop()
	sessionStorage.setItem(key, JSON.stringify(history))
	return last
}

function push(value) {
	const history = getHistory()
	if (_last(history) == value) return
	history.push(value)
	sessionStorage.setItem(key, JSON.stringify(history))
}

function getHistory() {
	try {
		return JSON.parse(sessionStorage.getItem(key)) || []
	} catch (e) {
		return []
	}
}

//按下重整，會把當前頁加到history，所以在頁面加載初始判斷移除
function removeSelf() {
	const { pathname, search } = window.location
	const history = getHistory()
	if (_last(history) == pathname + search) pop()
}
