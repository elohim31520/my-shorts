<template>
	<div class="login-main">
		<Header title="用户登录" border-bottom-color="#e7e7e7" />
		<div class="mt-45 flex flex-center flex-col px-17.5">
			<h1 class="color-primary text-37.85 font-bold mt-33.45 mb-27.45">
				{{ getWebTitle() }}
			</h1>
			<div class="form">
				<div
					class="input-wrap mb-15 flex flex-center phone"
					:class="{ error: error.phone }"
				>
					<div
						class="country-code flex flex-center"
						@click="showCountryCode = true"
					>
						<span class="text-18">+{{ countryCode }}</span>
						<SvgIcon
							size="1.375rem"
							name="arrow_right"
							class="transform rotate-90 ml-6"
						/>
					</div>
					<van-field
						v-model="phone"
						placeholder="请输入手机号"
						type="number"
						clearable
						id="input-phone"
						autocomplete="off"
					/>
				</div>
				<div class="flex flex-center h-40">
					<div class="input-wrap pr-10 flex-1" :class="{ error: error.otp }">
						<van-field
							v-model="otp"
							placeholder="输入验证码"
							type="number"
							clearable
							id="input-otp"
							autocomplete="off"
						/>
					</div>
					<van-button
						type="success"
						color="#34c759"
						class="btn"
						@click="getOTP"
						v-if="!isPending"
						:loading="loading.otp"
					>
						{{ hasSended ? '重新获取' : '获取验证码' }}
					</van-button>
					<div v-else class="btn-pending van-button--normal">
						{{ seconds }}s
					</div>
				</div>

				<p
					class="color-#ff8f28 text-12 font-600 text-align-left mt-8"
					v-show="message"
				>
					{{ message }}
				</p>

				<div class="flex flex-center my-25">
					<div class="mr-10">
						<van-checkbox v-model="agree" checked-color="#34c759" />
					</div>
					<div class="color-#656565 text-14">
						首次登录会自动创建新帐号,且代表同意
						<a
							class="color-#ff8f28"
							href="https://ucp.ai4funs.com/user-service-agreement.html"
							target="_blank"
						>
							《用户协议》
						</a>
						和

						<a
							class="color-#ff8f28"
							href="https://ucp.ai4funs.com/user-privacy-policy.html"
							target="_blank"
						>
							《隐私协议》
						</a>
					</div>
				</div>

				<van-button
					type="success"
					color="#34c759"
					class="btn btn-login"
					@click="doLogin"
					:loading="loading.login"
					:disabled="!agree"
				>
					登录
				</van-button>

				<div class="mt-30 mb-20 relative" v-if="loginProxyUrl">
					<div
						class="w-full h-full absolute top-0 left-0 z-1"
						v-show="showMask"
						@click="toast('请勾选同意声明')"
					></div>
					<iframe
						v-if="show3PLogin"
						:src="loginProxyUrl"
						frameborder="0"
						scrolling="no"
						class="iframe-3p-login"
					/>
					<p
						v-else
						class="text-16 font-400 color-#34C759 text-center"
						@click="show3PLogin = true"
					>
						使用第三方登录
					</p>
				</div>

				<div
					class="text-16 color-#434343 font-600 mb-15"
					:class="{ 'mt-30': !loginProxyUrl }"
				>
					登录后你可以:
				</div>
			</div>
			<div class="memo">
				<van-swipe :autoplay="3000" :show-indicators="false">
					<van-swipe-item>
						<van-row class="mb-10">
							<van-col span="2" class="!flex-center">
								<SvgIcon size="1.2rem" name="icon_slogan_money" />
							</van-col>
							<van-col span="22">成为大牛分瓜500万大奖!!!</van-col>
						</van-row>
						<van-row class="mb-10">
							<van-col span="2" class="!flex-center">
								<SvgIcon size="1.2rem" name="icon_slogan_announcement" />
							</van-col>
							<van-col span="22">领取红包，可提现~</van-col>
						</van-row>
						<van-row class="mb-10">
							<van-col span="2" class="!flex-center">
								<SvgIcon size="1.2rem" name="icon_slogan_discount" />
							</van-col>
							<van-col span="22">查看大牛心水图纸，获取高中神秘图纸!</van-col>
						</van-row>
					</van-swipe-item>

					<van-swipe-item>
						<van-row class="mb-10">
							<van-col span="2" class="!flex-center">
								<SvgIcon size="1.2rem" name="icon_slogan_Gift" />
							</van-col>
							<van-col span="22">参与活动，领取积分兑换礼物~</van-col>
						</van-row>
						<van-row class="mb-10">
							<van-col span="2" class="!flex-center">
								<SvgIcon size="1.2rem" name="icon_slogan_guess" />
							</van-col>
							<van-col span="22">参与竞猜，领取猜中大礼包!</van-col>
						</van-row>
						<van-row class="mb-10">
							<van-col span="2" class="!flex-center">
								<SvgIcon size="1.2rem" name="icon_slogan_Hot" />
							</van-col>
							<van-col span="22">获得独家资讯，祝您赢大奖~</van-col>
						</van-row>
					</van-swipe-item>
				</van-swipe>
			</div>
		</div>

		<van-action-sheet v-model:show="showCountryCode" title="选择国际电话区号">
			<CountryCodeList @onSelect="onSelect" />
		</van-action-sheet>
	</div>
</template>

<script setup>
	import Header from '@/components/NormalHeader/index.vue'
	import CountryCodeList from './CountryCodeList/index.vue'
	import { ref, onMounted, computed, watch } from 'vue'
	import {
		isBlank,
		toast,
		notify,
		redirect,
		getWebTitle,
	} from '@/modules/util.js'
	import { sendOTPCode, loginWithOTP } from '@/api/login.js'
	import { differenceInSeconds } from 'date-fns'
	import { useUserStore } from '@/stores/user.js'
	import { getUserInfo } from '@/api/user.js'
	import { useCountryCode } from '@/hooks/useCountryCode.js'
	import { use3PLogin } from '@/hooks/use3PLogin.js'

	const phoneLength = new Map([[]])
	const userStore = useUserStore()
	const PENDING_TIME = 60
	// const phone = ref('911727356')
	const phone = ref('')
	const otp = ref('')
	const agree = ref(false)
	const message = ref('')
	const hasSended = ref(false)
	const error = ref({
		phone: false,
		otp: false,
	})
	const showCountryCode = ref(false)
	const countryCode = ref(86)
	const loading = ref({
		otp: false,
		login: false,
	})
	const seconds = ref(0)
	const isPending = computed(() => seconds.value > 0)
	let timer = null
	let otpInfo = import.meta.env.SSR
		? null
		: sessionStorage.getItem('otp-info') || '{}'

	const show3PLogin = ref(false)
	const loginProxyUrl = import.meta.env.PUBLIC_3P_LOGIN_URL
	const showMask = computed(() => {
		return show3PLogin.value && !agree.value
	})

	use3PLogin().onResponse((res) => {
		console.log(res)
	})

	async function getUser() {
		const res = await getUserInfo()
		if (!_get(res, 'success')) return
		const data = _get(res, 'data', {})
		userStore.setUser(data)
	}

	watch(seconds, (value) => {
		if (value > 0) {
			countdown()
		} else {
			if (timer) clearTimeout(timer)
		}
	})

	watch(countryCode, (value) => {
		phone.value = ''
	})

	function onSelect(value) {
		countryCode.value = value
		showCountryCode.value = false
	}

	function validPhone() {
		const { items } = useCountryCode()
		const target = _find(items, (vo) => vo.value == countryCode.value)
		return new RegExp(String.raw`^\d{${target.min},${target.max}}$`).test(
			phone.value
		)
	}

	async function getOTP() {
		clear()
		if (!validPhone()) {
			message.value = '手机格式错误'
			error.value.phone = true
			return
		}
		loading.value.otp = true
		const res = await sendOTPCode({
			mobile: phone.value,
			mobileCountryCode: countryCode.value,
		}).finally(() => {
			loading.value.otp = false
		})
		if (!_get(res, 'success')) return
		hasSended.value = true
		seconds.value = PENDING_TIME
		const otpToken = _get(res, 'data.token')
		otpInfo = { [countryCode.value + phone.value]: otpToken }
		sessionStorage.setItem('otp-info', JSON.stringify(otpInfo))
		notify('验证码发送成功')
	}

	function countdown() {
		timer = setTimeout(() => {
			seconds.value--
		}, 1000)
	}

	function clear() {
		message.value = ''
		_forEach(error.value, (_, key) => {
			error.value[key] = false
		})
	}

	async function doLogin() {
		clear()
		if (!agree.value) {
			message.value = '请勾选同意协议'
			return
		}
		let text = ''
		if (!validPhone()) {
			error.value.phone = true
			text = '手机格式'
		}
		if (!/^\d{4,8}$/.test(otp.value)) {
			error.value.otp = true
			let or = text ? '或' : ''
			text += `${or}验证码`
		}
		if (text) text += '错误'
		if (text) {
			message.value = text
			return
		}
		const otpToken = otpInfo[countryCode.value + phone.value]

		if (isBlank(otpToken)) {
			toast('请先获取验证码')
			return
		}

		loading.value.login = true
		const res = await loginWithOTP({
			authCode: otp.value,
			token: otpToken,
			quiet: true,
		}).finally(() => {
			loading.value.login = false
		})

		const success = _get(res, 'success')
		if (!success) {
			error.value.otp = true
			message.value = _get(res, 'errMessage')
			return
		}
		const { accessToken: token, refreshToken, userId } = _get(res, 'data', {})
		userStore.setUser({ token, refreshToken, userId })
		notify('登录成功')
		setTimeout(async () => {
			//pinia的持久化 同步取不到數據
			await getUser()
			redirect('/', { skip: true })
		}, 300)
	}
</script>

<style lang="scss">
	@import url('@/styles/login.scss');
	.login-main {
		.memo {
			width: 100%;
			border-radius: 0.625rem;
			border: solid 2px $primary-color;
			padding: 1.25rem 1rem;
		}
	}
	.iframe-3p-login {
		width: 100%;
		height: 40px;
		@media screen and (min-width: 480px) {
			width: 70%;
			transform: scale(1.4);
			margin-left: 15%;
		}
	}
</style>
