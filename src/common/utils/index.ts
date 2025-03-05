import SelectDialog from '../components/dialog/SelectDialog.vue'
import SimpleConfirmDialog from '../components/dialog/SimpleConfirmDialog.vue'
import ConfirmDialog from '../components/dialog/ConfirmDialog.vue'
import Loading from '../components/Loading.vue'
import NoticeDialog from '@/common/components/dialog/NoticeDialog.vue'
import SlideUser from '@/common/components/slide/SlideUser.vue'
import BaseVideo from '@/common/components/slide/BaseVideo.vue'
import { h, createApp } from 'vue'
import { toast } from '@/modules/util'

const IMG_URL = '/shorts/images/'

export function _storageSet(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}

export function _storageGet(key, defaultValue = '') {
	const res = localStorage.getItem(key)
	if (res) {
		return JSON.parse(res)
	}
	return defaultValue
}

export function _stopPropagation(e: Event) {
	e.stopImmediatePropagation()
	e.stopPropagation()
	e.preventDefault()
}

export function _stop(e: Event) {
	e.stopPropagation()
}

export function _formatNumber(num) {
	if (!num) return
	if (num > 100000000) {
		return (num / 100000000).toFixed(1) + '亿'
	} else if (num > 10000) {
		return (num / 10000).toFixed(1) + '万'
	} else {
		return num
	}
}

export function _dateFormat(val, type?): string {
	if (!val) return
	if (String(val).length === 10) {
		val = val * 1000
	}
	const d = new Date(Number(val))
	const year = d.getFullYear()
	const m = d.getMonth() + 1
	const mStr = m < 10 ? '0' + m : m
	const day = d.getDate()
	const dayStr = day < 10 ? '0' + day : day
	const h = d.getHours()
	const hStr = h < 10 ? '0' + h : h
	const min = d.getMinutes()
	const minStr = min < 10 ? '0' + min : min
	const sec = d.getSeconds()
	const secStr = sec < 10 ? '0' + sec : sec
	switch (type) {
		case 'Y':
			return year + ''
		case 'M':
			return `${year}-${mStr}`
		case 'M_D':
			return `${mStr}-${dayStr}`
		case 'M_CN':
			return `${year}年${mStr}月`
		case 'D':
			return `${year}-${mStr}-${dayStr}`
		case 'm':
			return `${year}-${mStr}-${dayStr} ${hStr}:${minStr}`
		default:
			return `${year}-${mStr}-${dayStr} ${hStr}:${minStr}:${secStr}`
	}
}

export function _time(time) {
	if (String(time).length === 10) {
		time = time * 1000
	}
	const date = new Date(Number(time))
	const now = new Date()
	const d = now.valueOf() - date.valueOf()
	let str = ''
	if (d < 1000 * 60) {
		str = '刚刚'
	} else if (d < 1000 * 60 * 60) {
		str = `${(d / (1000 * 60)).toFixed()}分钟前`
	} else if (d < 1000 * 60 * 60 * 24) {
		str = `${(d / (1000 * 60 * 60)).toFixed()}小时前`
	} else if (d < 1000 * 60 * 60 * 24 * 2) {
		str = '1天前'
	} else if (d < 1000 * 60 * 60 * 24 * 3) {
		str = '2天前'
	} else if (d < 1000 * 60 * 60 * 24 * 4) {
		str = '3天前'
	} else if (date.getFullYear() === now.getFullYear()) {
		str = _dateFormat(time, 'M_D')
	} else {
		str = _dateFormat(time, 'D')
	}
	return str
}

export function _checkImgUrl(url) {
	// console.log(url)
	if (!url) return
	//本地图片
	if (
		url.includes('assets/img') ||
		url.includes('file://') ||
		url.includes('data:image') ||
		url.includes('http') ||
		url.includes('https')
	) {
		return url
	}
	return IMG_URL + url
}

export function _duration(v) {
	if (!v) return '00:00'
	const m = Math.floor(v / 60)
	// let s = v % 60
	const s = Math.round(v % 60)
	let str: string = ''
	if (m === 0) {
		str = '00'
	} else if (m > 0 && m < 10) {
		str = '0' + m
	} else {
		str = m + ''
	}
	str += ':'
	if (s === 0) {
		str += '00'
	} else if (s > 0 && s < 10) {
		str += '0' + s
	} else {
		str += s
	}
	return str
}

export function _getUserDouyinId(item) {
	return item.author.unique_id || item.author.short_id
}

/**
 * @param {number} duration
 */
export function _sleep(duration) {
	return new Promise((resolve) => {
		setTimeout(resolve, duration)
	})
}

export function cloneDeep(val) {
	return JSON.parse(JSON.stringify(val))
}

export function sampleSize(arr, num) {
	const list = []
	const indexs = []
	while (list.length !== num) {
		const j = random(0, arr.length - 1)
		if (!indexs.includes(j)) {
			list.push(arr[j])
			indexs.push(j)
		}
	}
	return list
}

export function _showLoading() {
	const app = createApp({
		render() {
			return h(Loading)
		},
	})

	const parent = document.createElement('div')
	parent.classList.add('dialog-ctn')
	document.body.append(parent)
	app.mount(parent)
}

export function _hideLoading() {
	if (import.meta.env.SSR) return
	const parent = document.querySelector('.dialog-ctn')
	parent.remove()
}

export function _showSimpleConfirmDialog(
	title,
	okCb,
	cancelCb,
	okText,
	cancelText
) {
	if (!cancelCb) {
		cancelCb = () => {}
	}

	const remove = () => {
		const parent = document.querySelector('.dialog-ctn')
		parent.classList.replace('fade-in', 'fade-out')
		setTimeout(() => {
			parent.remove()
		}, 300)
	}

	const tempOkCb = (e) => {
		remove()
		okCb(e)
	}

	const tempCancelCb = (e) => {
		remove()
		cancelCb(e)
	}

	const app = createApp({
		render() {
			return h(SimpleConfirmDialog, {
				onCancel: tempCancelCb,
				onDismiss: remove,
				title: title,
				okText: okText,
				cancelText: cancelText,
				onOk: tempOkCb,
			})
		},
	})

	const parent = document.createElement('div')
	parent.classList.add('dialog-ctn', 'fade-in')
	document.body.append(parent)
	app.mount(parent)
}

export function _showSelectDialog(sexList, cb) {
	if (import.meta.env.SSR) return

	const remove = () => {
		const parent = document.querySelector('.dialog-ctn')
		parent.classList.replace('fade-in', 'fade-out')
		setTimeout(() => {
			parent.remove()
		}, 300)
	}

	const tempCb = (e) => {
		remove()
		cb(e)
	}

	const app = createApp({
		render() {
			return h(SelectDialog, {
				onCancel: remove,
				list: sexList,
				onOk: tempCb,
			})
		},
	})

	const parent = document.createElement('div')
	parent.classList.add('dialog-ctn', 'fade-in')
	document.body.append(parent)
	app.mount(parent)
}

export function _showConfirmDialog(
	title,
	subtitle,
	subtitleColor,
	okCb,
	cancelCb,
	okText,
	cancelText,
	cancelTextColor
) {
	const remove = () => {
		const parent = document.querySelector('.dialog-ctn')
		parent.classList.replace('fade-in', 'fade-out')
		setTimeout(() => {
			parent.remove()
		}, 300)
	}

	const tempOkCb = (e) => {
		remove()
		okCb && okCb(e)
	}

	const tempCancelCb = (e) => {
		remove()
		cancelCb && cancelCb(e)
	}

	const app = createApp({
		render() {
			return h(ConfirmDialog, {
				onCancel: tempCancelCb,
				onDismiss: remove,
				title: title,
				subtitle: subtitle,
				subtitleColor: subtitleColor,
				cancelTextColor: cancelTextColor,
				okText: okText,
				cancelText: cancelText,
				onOk: tempOkCb,
			})
		},
	})

	const parent = document.createElement('div')
	parent.classList.add('dialog-ctn', 'fade-in')
	document.body.append(parent)
	app.mount(parent)
}
export function _showNoticeDialog(
	title,
	subtitle,
	subtitleColor,
	cancelCb,
	cancelText
) {
	const remove = () => {
		const parent = document.querySelector('.dialog-ctn')
		parent.classList.replace('fade-in', 'fade-out')
		setTimeout(() => {
			parent.remove()
		}, 300)
	}

	const tempCancelCb = (e) => {
		remove()
		cancelCb(e)
	}

	const app = createApp({
		render() {
			return h(NoticeDialog, {
				onCancel: tempCancelCb,
				onDismiss: remove,
				title: title,
				subtitleColor: subtitleColor,
				cancelText: cancelText,
				subtitle: subtitle,
			})
		},
	})

	const parent = document.createElement('div')
	parent.classList.add('dialog-ctn', 'fade-in')
	document.body.append(parent)
	app.mount(parent)
}

export function _no() {
	toast('未实现')
}

export function slideItemRender(props) {
	return function render(item, index, play, uniqueId) {
		let node
		switch (item.type) {
			case 'img':
				node = h('img', {
					src: item.src,
					style: { height: '100%' },
					alt: '',
				})
				break
			case 'user':
				node = h(SlideUser, {
					...props,
				})
				break
			case 'send-video':
				node = h('video', {
					src: item.src,
					style: { height: '100%' },
				})
				break
			default:
				node = h(BaseVideo, {
					isPlay: play,
					item: item,
					index: index,
					position: { uniqueId, index },
					...props,
				})
				break
		}
		return node
	}
}
