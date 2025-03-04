import { setupPinia } from '@/stores'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { loadDirectives } from '@/directives'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/vue'
// import 'vant/lib/index.css' //手動引入vant樣式，自動引入有問題 https://github.com/unplugin/unplugin-vue-components/issues/327
import './vantStyleImport'
import '@vant/touch-emulator'
import lscache from 'lscache'
import historyPlugin from './history'
import globalPlugin from './global'
import { once } from 'lodash-es'
import { getUserInfo } from '@/api/user'
import {
	getUser,
	dialog,
	isTokenInvalid,
	updateURLParameter,
	toast,
} from '@/modules/util.js'
import Cookies from 'js-cookie'
import { useUserStore } from '@/stores/user.js'
import { Lazyload } from 'vant'
import { useMaintain } from '@/hooks/useMaintain.js'
import { applyToken } from '@/api/login.js'

export default (app) => {
	app.use(setupPinia())
	app.component('Swiper', Swiper)
	app.component('SwiperSlide', SwiperSlide)
	app.component('SvgIcon', SvgIcon)
	app.use(Lazyload)
	loadDirectives(app)
	if (!import.meta.env.SSR) onlyOnce(app)
}

//astro island 導致多個vue instance
const onlyOnce = once((app) => {
	lscache.setExpiryMilliseconds(1000)
	app.use(globalPlugin)
	app.use(historyPlugin)
	inviterHandler()
	updateURLParameter('lt', null, true) //url有指定彩種，移除這個參數
	tokenValidate()
	if (import.meta.env.PUBLIC_ENABLE_MAINTAIN) useMaintain().check()
})

async function tokenValidate() {
	const token = _get(getUser(), 'token')
	if (!token) return
	const res = await getUserInfo({ quiet: true })
	if (_get(res, 'success')) {
		useUserStore().setUser(res.data)
		_set(window, '_global.isLogin', true)
		return
	}

	if (!isTokenInvalid(res)) return

	//refresh token
	const { refreshToken } = useUserStore().data
	const res2 = await applyToken(refreshToken)
	if (isTokenInvalid(res2)) {
		Cookies.remove('user')
		dialog('会话失效，请重新登录').then(() => {
			location.href = '/'
		})
	} else {
		if (_get(res2, 'success')) {
			useUserStore().setUser({ token: res2.data.accessToken })
			toast('正在重新登录...')
			setTimeout(() => {
				window.location.reload()
			}, 1200)
		}
	}
}

function inviterHandler() {
	const inviter = new URLSearchParams(window.location.search).get('inviter')
	if (inviter) sessionStorage.setItem('inviter', inviter)
}
