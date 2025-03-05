import Loading from '../components/Loading.vue'
import { h, createApp } from 'vue'
import { toast } from '@/modules/util'

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

export function _getUserDouyinId(item) {
	return item.author.unique_id || item.author.short_id
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
	const parent = document.querySelector('.dialog-ctn')
	parent.remove()
}

export function _no() {
	toast('未实现')
}
