/**
 * 1. 設置範例
 * 	沒有過期時間
 * 	sessionStore.userName = 'JohnDoe'
 * 	localStore.user_age = 30
 * 	localStore['user-address'] = 'Texas'
 * 	localStore.userDate = { name: 'Tom', age: 25 }
 *
 * 	有過期時間
 * 	sessionStore.userAddress = {
 * 		value: 'Texas',
 * 		expiry: 2000 // 2秒
 * 	localStore.userPreferences = {
 * 		value: { theme: 'dark', language: 'en' },
 * 		expiry: 2 * 24 * 60 * 60 * 1000 // 2天
 * 	}
 *
 * 2. 獲取存儲項
 * 	sessionStore.userName
 * 	localStore.user_age
 * 	localStore['user-age']
 *
 * 3. 刪除存儲項
 * 	delete sessionStore.userName
 * 	delete localStore.user_age
 *
 * 4. 檢查存儲項是否存在
 * 	'user-name' in sessionStore
 * 	'userName' in sessionStore
 * 	'user-age' in localStore
 * 	localStore.has('user_age')
 * 	localStore.has('userAge')
 *
 * 5. 獲取所有存儲鍵
 * 	_keys(localStore)
 * 	_keys(sessionStore)
 */

function isStorageAvailable(type) {
	try {
		if (typeof window === 'undefined') return false

		const storage = window[type]
		const testKey = '__storage_test__'

		storage.setItem(testKey, testKey)
		storage.removeItem(testKey)

		return true
	} catch (e) {
		return false
	}
}

class Store {
	constructor(storageType, options = { fallback: false }) {
		this.storageType = storageType
		this.options = options

		if (typeof window !== 'undefined' && isStorageAvailable(storageType)) {
			this.storage = window[storageType]
		} else if (options.fallback) {
			// TODO 目前沒有考慮新的儲存方案
			console.warn(`${storageType} 不可用，啟用內存存儲作為後備方案`)
		} else {
			return {}
		}

		return new Proxy(this, {
			get: (target, prop) => {
				if (prop in target) return target[prop]

				const key = _kebabCase(String(prop))
				const value = target.storage.getItem(key)

				if (_isNull(value)) return

				try {
					const data = JSON.parse(value)
					if (data.expiry && Date.now() > data.expiry) {
						target.storage.removeItem(key)
						return
					}
					return data.value
				} catch (error) {
					return value
				}
			},

			set: (target, prop, value) => {
				const key = _kebabCase(String(prop))
				let data

				if (
					_isObject(value) &&
					!_isNull(value) &&
					'value' in value &&
					'expiry' in value
				) {
					if (_isNumber(value.expiry) && !_isNaN(value.expiry)) {
						data = {
							value: value.value,
							expiry: Date.now() + value.expiry,
						}
					} else {
						data = {
							value: value.value,
							expiry: null,
						}
					}
				} else {
					data = {
						value: value,
						expiry: null,
					}
				}

				try {
					target.storage.setItem(key, JSON.stringify(data))
				} catch (error) {}

				return true
			},

			deleteProperty: (target, prop) => {
				const key = _kebabCase(String(prop))
				target.storage.removeItem(key)
				return true
			},

			ownKeys: (target) => {
				// if (target.storage instanceof MemoryStorage) {
				// 	return target.storage.getAllKeys()
				// } else if (target.storageType === 'none') {
				// 	return []
				// }
				return _keys(target.storage)
			},

			has: (target, prop) => {
				const key = _kebabCase(String(prop))
				return !_isNull(target.storage.getItem(key))
			},

			getOwnPropertyDescriptor: (target, prop) => {
				const key = _kebabCase(String(prop))
				if (_isNull(target.storage.getItem(key))) {
					return {
						enumerable: true,
						configurable: true,
					}
				}
				return
			},
		})
	}

	has(key) {
		const transformedKey = _kebabCase(String(key))
		return !_isNull(this.storage.getItem(transformedKey))
	}
}

export const sessionStore = new Store('sessionStorage')
export const localStore = new Store('localStorage')
