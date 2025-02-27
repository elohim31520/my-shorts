import Utf8 from 'crypto-js/enc-utf8'
import AES from 'crypto-js/aes'
import Pkcs7 from 'crypto-js/pad-pkcs7'
import { LRUCache } from 'lru-cache'
import axios from 'axios'

const keyMap = new Map([
	['123451', 'kQuj0NlBZHVkYvIi'],
	['123452', 'HFe6MRf2wCMs30Bt'],
	['123453', 'xsrgf4ybfAxiGODl'],
	['123454', '6PvGeGX4GhApkdli'],
])

const key = Utf8.parse(keyMap.get(import.meta.env.PUBLIC_AES_KEY))

//不是通用的AES解密，目前只考慮給圖片解密使用
export function decrypt(text) {
	const decrypted = AES.decrypt(text, key, {
		iv: key,
		padding: Pkcs7,
	})
	return decrypted.toString(Utf8)
}

/** 
 * 不加密裁剪
/msecret-0-x-x-dev/ 

加密裁剪
/msecret-123451-120x120-dev/   

按宽等比缩放
/msecret-x-120x0-dev/

按高等比缩放
/msecret-x-0x120-dev/  

按宽高裁剪
/msecret-x-120x120-dev/
*/
export function createPath({
	path,
	encrypt = false,
	width = 0,
	height = 0,
} = {}) {
	const index = _startsWith(path, '/') ? 1 : 0
	const paths = _split(path, '/')
	const rootPath = paths[index]
	const key = encrypt ? `${import.meta.env.PUBLIC_AES_KEY}` : '0'
	const newRootPath = `msecret-${key}-${Math.ceil(width)}x${Math.ceil(height)}-${rootPath}`
	paths[index] = newRootPath
	return paths.join('/')
}

const cache = new LRUCache({
	max: _defaultTo(Number(import.meta.env.PUBLIC_CACHE_IMAGE_MAX), 30),
})

/**
 * 假設同時請求不同寬度，只取最大寬的
 * 100x0
 * 200x0
 * 300x0
 * 只需要請求 300x0 即可
 */
const widthInfo = new Map()
const heightInfo = new Map()

function zero2Max(value) {
	return value == 0 ? Number.MAX_SAFE_INTEGER : Number(value)
}

export async function getEncryptImage({
	path,
	encrypt,
	width = 0,
	height = 0,
}) {
	width = Math.ceil(width)
	height = Math.ceil(height)

	const both = width != 0 && height != 0 //同時指定寬高，不考慮等比縮放
	const original = width == 0 && height == 0 //不指定寬高，按原圖尺寸
	const fixWidth = width != 0 && height == 0 //指定寬，高按比例縮放
	const fixHeight = width == 0 && height != 0 //指定高，寬按比例縮放

	if (fixWidth || original) {
		if (!widthInfo.has(path)) widthInfo.set(path, [])
		widthInfo.get(path).push(zero2Max(width))
	}
	if (fixHeight || original) {
		if (!heightInfo.has(path)) heightInfo.set(path, [])
		heightInfo.get(path).push(zero2Max(height))
	}

	const slash = path.startsWith('/') ? '' : '/'
	const pathEncrypt =
		slash +
		createPath({
			path,
			encrypt,
			width,
			height,
		})

	if (!cache.has(pathEncrypt)) {
		const url = `${import.meta.env.PUBLIC_ENCRYPT_IMAGE_HOST}${pathEncrypt}`
		// cache.set(pathEncrypt, axios.get(url))
		cache.set(
			pathEncrypt,
			new Promise((resolve) => {
				setTimeout(() => {
					if (both || original) {
						resolve(axios.get(url))
						return
					}

					if (fixWidth) {
						let maxWidth = Math.max(...widthInfo.get(path))
						if (width < maxWidth) {
							if (maxWidth == Number.MAX_SAFE_INTEGER) maxWidth = 0
							const maxPath =
								slash +
								createPath({
									path,
									encrypt,
									width: maxWidth,
									height,
								})
							resolve(cache.has(maxPath) ? cache.get(maxPath) : axios.get(url))
						} else {
							resolve(axios.get(url))
						}
					} else if (fixHeight) {
						let maxHeight = Math.max(...heightInfo.get(path))
						if (height < maxHeight) {
							if (maxHeight == Number.MAX_SAFE_INTEGER) maxHeight = 0
							const maxPath =
								slash +
								createPath({
									path,
									encrypt,
									width,
									height: maxHeight,
								})
							resolve(cache.has(maxPath) ? cache.get(maxPath) : axios.get(url))
						} else {
							resolve(axios.get(url))
						}
					}
				}, 100)
			})
		)
	}
	const res = await cache.get(pathEncrypt)
	return encrypt ? decrypt(res.data) : res.data
}

export async function previewImage(options) {
	if (!import.meta.env.PUBLIC_ENCRYPT_IMAGE_ENABLE) {
		showImagePreview(options)
		return
	}
	const { images } = options
	const paths = images.map((url) =>
		url.replace(import.meta.env.PUBLIC_CDN_IMAGE_HOST, '')
	)
	const imagesBase64 = await Promise.all([
		...paths.map((path) => getEncryptImage({ path, encrypt: true })),
	])
	const config = _cloneDeep(options)
	config.images = imagesBase64
	showImagePreview(config)
}
