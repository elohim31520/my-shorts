import Dom from '@/modules/dom'
import bus, { EVENT_KEY } from '@/modules/bus'

export default {
	mounted: function (el, binding) {
		let isDbClick = false
		let clickTimer = null
		let dbClickTimer = null
		let lastClickTime = null
		let isDown = false
		let isMove = false
		const checkTime = 200
		const dbCheckCancelTime = 500

		const dbClick = (e) => {
			// console.log('dbClick')
			const id = 'a' + Date.now()
			const elWidth = 80
			const rotate = _random(0, 1)
			const template = `<img class="${rotate ? 'left love-dbclick' : 'right love-dbclick'}" id="${id}" src="${new URL('/shorts/img/icon/loved.svg', import.meta.url).href}">`
			const el = new Dom().create(template)
			el.css({ top: e.y - elWidth - 40, left: e.x - elWidth / 2 })
			new Dom(`#${binding.value}`).append(el)
			setTimeout(() => {
				new Dom(`#${id}`).remove()
			}, 1000)
		}

		const check = (e) => {
			if (isDbClick) {
				clearTimeout(dbClickTimer)
				dbClick(e)
				dbClickTimer = setTimeout(() => (isDbClick = false), dbCheckCancelTime)
				return
			}
			const nowTime = new Date().getTime()
			if (nowTime - lastClickTime < checkTime) {
				clearTimeout(clickTimer)
				dbClick(e)
				isDbClick = true
				dbClickTimer = setTimeout(() => (isDbClick = false), dbCheckCancelTime)
			} else {
				clickTimer = setTimeout(() => {
					// console.log('单击', binding.value)
					bus.emit(EVENT_KEY.SINGLE_CLICK, binding.value)
				}, checkTime)
			}
			lastClickTime = nowTime
		}

		const up = (e) => {
			if (!isDown) return
			if (!isMove && !window.isMoved) check(e)
			isMove = isDown = false
		}

		el.addEventListener('pointerdown', () => (isDown = true))
		el.addEventListener('pointermove', () => isDown && (isMove = true))
		el.addEventListener('pointerup', up)
	},
}
