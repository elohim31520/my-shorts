import { h } from 'vue'

import SlideUser from '@/common/components/slide/SlideUser.vue'
import BaseVideo from '@/common/components/slide/BaseVideo.vue'

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
	return { slideItemRender }
}
