import axios from 'axios'
import logger from '@/modules/log.js'
import { processApiResponse } from '@/adapters'
import { dialog, inject as injectUtil } from '@/modules/util'
import a6tkRequest from './request/a6tkRequest'
import bizRequest from './request/bizRequest'
import clientRequest from './request/clientRequest'
import kvRequest, { inject as injectKV } from './request/kvRequest'
import renderRequest from './request/renderRequest'
import uploadRequest from './request/uploadRequest'
import chatRequest, { chatRequestOnUnload } from './request/chatRequest'

export {
	a6tkRequest,
	bizRequest,
	clientRequest,
	kvRequest,
	renderRequest,
	uploadRequest,
	chatRequest,
	chatRequestOnUnload,
}

export let locals = null

export function inject(value) {
	locals = value
	injectKV(value)
	injectUtil(value)
}

export function createService() {
	const id = String(Math.random()).slice(-6)
	const service = axios.create()
	// 請求攔截
	service.interceptors.request.use(
		(config) => {
			const { baseURL, url, method, params, data } = config
			logger.debug(
				`[${id}] [${method.toUpperCase()}] URL: ${baseURL}${url} , 參數：${JSON.stringify(params || data || '')}`
			)

			if (import.meta.env.CLIENT_DEBUG && import.meta.env.SSR) {
				if (!locals.logs) locals.logs = []
				locals.logs.push({ url: `${baseURL}${url}`, method, params, data })
			}
			return config
		},
		(error) => Promise.reject(error)
	)

	// 響應攔截
	service.interceptors.response.use(
		async (response) => {
			// 返回的資料
			const responseData = await processApiResponse(response)
			const apiPath = _get(response, 'config.url', '')

			responseData.apiPath = apiPath

			// 二進位制資料則直接返回
			const responseType = response.request?.responseType
			if (responseType === 'blob' || responseType === 'arraybuffer')
				return responseData

			const success = _get(responseData, 'success', false)
			let isQuiet = _get(response, 'config.quiet', false) //boolean true: 不自動彈窗顯示錯誤信息 或者 array[錯誤代碼]
			const baseURL = _get(response, 'config.baseURL')
			const errCode = _get(responseData, 'errCode')
			if (_isArray(isQuiet)) {
				isQuiet = _includes(isQuiet, errCode)
			}

			const isKV = baseURL == import.meta.env.PUBLIC_BASE_KV_API_URL
			//kv的不紀錄回應，資料量太大
			const responseDetail =
				success && isKV ? '成功，省略...' : JSON.stringify(responseData)

			logger.debug(`[${id}] 回應：${responseDetail}`)

			if (!success && !isQuiet) {
				if (!import.meta.env.SSR) {
					const message = _get(responseData, 'errMessage')
					dialog(`[${errCode}]:${message}`)
				} else {
					if (!locals.errors) locals.errors = []
					const { config } = response
					const info = {
						code: errCode,
						errno: _get(responseData, 'errMessage'),
						baseURL,
						pathname: _get(config, 'url'),
						method: _get(config, 'method'),
					}
					locals.errors.push(info)
				}
			}
			return responseData
		},
		(error) => {
			// status 是 HTTP 狀態碼
			const status = _get(error, 'response.status')
			switch (status) {
				case 400:
					error.message = '请求错误'
					break
				case 403:
					error.message = '拒绝访问'
					break
				case 404:
					error.message = '请求地址出错'
					break
				case 500:
					error.message = '伺服器内部错误'
					break
				default:
					break
			}

			const isQuiet = _get(error, 'config.quiet', false)
			if (!import.meta.env.SSR) {
				const message = _get(error, 'message')
				const code = _get(error, 'code')
				if (!isQuiet) dialog(`[${code}]:${message}`)
			} else {
				if (!locals.errors) locals.errors = []
				const { hostname, syscall, code, errno, config } = error
				const info = {
					hostname,
					syscall,
					code,
					errno,
					baseURL: _get(config, 'baseURL'),
					pathname: _get(config, 'url'),
					method: _get(config, 'method'),
				}
				if (!isQuiet) locals.errors.push(info)
				logger.debug(`[${id}] 發生錯誤：${errno}, ${code}, ${syscall}`)
			}
			// 直接返回 resolve，相關錯誤在攔截器處理
			return Promise.resolve()
		}
	)
	return service
}

/**
 * 通用：在「頁面卸載」時用 `fetch + keepalive` 送請求
 *
 * @param {object} config
 * @returns {Promise}
 */
export function requestOnUnload(config = {}) {
	const {
		method = 'get',
		url = '',
		baseURL = '',
		params = {},
		data = null,
		headers = {},
	} = config

	const finalMethod = _toUpper(method)
	let finalUrl = baseURL
		? baseURL.replace(/\/$/, '') + '/' + url.replace(/^\/?/, '')
		: url

	const fetchOptions = {
		method: finalMethod,
		keepalive: true,
		headers: { ...headers },
	}

	if (finalMethod === 'GET' || finalMethod === 'HEAD') {
		if (params && _keys(params).length > 0) {
			const qs = new URLSearchParams(params).toString()
			if (qs) {
				const urlObj = new URL(finalUrl, location.origin)
				urlObj.search = qs
				finalUrl = urlObj.toString()
			}
		}
	} else {
		if (!_isNull(data)) {
			if (_isObject(data)) {
				fetchOptions.body = JSON.stringify(data)
				fetchOptions.headers['Content-Type'] = 'application/json'
			} else {
				fetchOptions.body = data
			}
		}

		if (params && _keys(params).length > 0) {
			const qs = new URLSearchParams(params).toString()
			if (qs) {
				const urlObj = new URL(finalUrl, location.origin)
				urlObj.search = qs
				finalUrl = urlObj.toString()
			}
		}
	}

	return fetch(finalUrl, fetchOptions).catch((err) => {
		console.error('[requestOnUnload] fetch failed:', err)
	})
}
