import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import Cookies from 'js-cookie'
import cookie from 'cookie'

// 定義基於 Cookie 的存儲方案
const cookieStorage = {
	// 獲取存儲項目
	getItem: (key) => {
		const value = Cookies.get(key)
		return value && JSON.parse(value)
	},
	// 設定存儲項目，設置過期時間為 365 天
	setItem: (key, value) => {
		Cookies.set(key, JSON.stringify(value), { expires: 365 })
	},
	// 移除存儲項目
	removeItem: (key) => {
		Cookies.remove(key)
	},
}

export let pinia
// 此物件僅用於 .astro 文件中，請勿在其他檔案中使用，在 .astro 文件中 pinia store 還未初始化，所以無法使用
export let pageStore = {}

export function initializePinia() {
	if (!import.meta.env.SSR && pinia) return pinia

	//保留 client 和 webInfo
	const client = _get(pageStore, 'client')
	const webInfo = _get(pageStore, 'webInfo')

	// 清空 SSR 存儲
	pageStore = { client, webInfo }
	// 創建 Pinia 實例
	pinia = createPinia()

	// 使用持久化插件，並指定使用 Cookie 存儲
	pinia.use(
		createPersistedStatePlugin({
			storage: cookieStorage,
			persist: false, // 根據需要設定是否自動持久化
		})
	)
	pinia.use(saveInitialStatePlugin)

	return pinia
}

export function setupPinia() {
	// SSR 環境在 middleware updateStore 初始化
	return import.meta.env.SSR ? pinia : initializePinia()
}

// 將store初始值存入cookie，已有的值不覆蓋
export function saveInitialStatePlugin({ store, options }) {
	const persist = _get(options, 'persistedState.persist', false)

	if (!persist) return

	const key = store.$id
	let existingState = cookieStorage.getItem(key) || {}
	existingState = _isString(existingState)
		? JSON.parse(existingState)
		: existingState

	// 合併初始 state 和已有 state
	const mergedState = JSON.stringify({ ...store.$state, ...existingState })

	// 保存合併後的 state 到 Cookie
	cookieStorage.setItem(key, mergedState)
}

// 更新存儲狀態，從 Cookie 中讀取
export function updateStoreFromCookie(cookieContent) {
	// 如果沒有 Cookie 內容，則直接返回
	if (!cookieContent) return
	// 解析 Cookie 內容並更新狀態
	for (const [storeKey, encodedStoreData] of _entries(
		cookie.parse(cookieContent)
	)) {
		try {
			const storeData = JSON.parse(JSON.parse(encodedStoreData))
			for (const [stateKey, stateValue] of _entries(storeData)) {
				_set(pageStore, `${storeKey}.${stateKey}`, stateValue)
				_set(pinia.state.value, `${storeKey}.${stateKey}`, stateValue)
			}
		} catch (error) {}
	}
}
