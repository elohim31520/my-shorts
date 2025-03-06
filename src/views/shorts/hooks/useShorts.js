import { h, createApp } from 'vue'
import { toast } from '@/modules/util'

import Loading from '@/views/shorts/common/Loading.vue'
import SlideUser from '@/views/shorts/common/slide/SlideUser.vue'
import BaseVideo from '@/views/shorts/common/slide/BaseVideo.vue'

export function useShorts() {
	function slideItemRender(props) {
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

	function _stopPropagation(e) {
		e.stopImmediatePropagation()
		e.stopPropagation()
		e.preventDefault()
	}

	function _stop(e) {
		e.stopPropagation()
	}

	function _formatNumber(num) {
		if (!num) return
		if (num > 100000000) {
			return (num / 100000000).toFixed(1) + '亿'
		} else if (num > 10000) {
			return (num / 10000).toFixed(1) + '万'
		} else {
			return num
		}
	}

	function _getUserDouyinId(item) {
		return item.author.unique_id || item.author.short_id
	}

	function _showLoading() {
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

	function _hideLoading() {
		const parent = document.querySelector('.dialog-ctn')
		parent.remove()
	}

	function _no() {
		toast('未实现')
	}

	return {
		slideItemRender,
		_stopPropagation,
		_stop,
		_formatNumber,
		_getUserDouyinId,
		_showLoading,
		_hideLoading,
		_no,
	}
}
