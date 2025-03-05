import ConfirmDialog from '../components/dialog/ConfirmDialog.vue'
import Loading from '../components/Loading.vue'
import NoticeDialog from '@/common/components/dialog/NoticeDialog.vue'
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
