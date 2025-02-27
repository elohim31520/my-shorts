<template>
	<van-popup v-model:show="show" position="bottom" class="login-popup">
		<div class="login-main">
			<div class="header">
				<span>还差最后一步完成操作</span>
				<SvgIcon
					name="closure"
					size="1.875rem"
					class="color-#434343"
					@click="toggle"
				/>
			</div>
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

				<van-button
					type="success"
					color="#34c759"
					class="btn btn-login mt-20!"
					@click="doLogin"
					:loading="loading.login"
				>
					下一步
				</van-button>
				<p
					class="color-#ff8f28 text-14 text-align-center mt-8"
					v-show="message"
				>
					{{ message }}
				</p>

				<div class="text-14 color-#434343 flex-center my-16" v-redirect="'/cs'">
					<SvgIcon
						name="side-bar-service"
						size="1.375rem"
						class="color-#434343 mr-4"
					/>
					<span>联系客服</span>
				</div>
			</div>
		</div>
	</van-popup>

	<van-action-sheet v-model:show="showCountryCode" title="选择国际电话区号">
		<CountryCodeList @onSelect="onSelect" />
	</van-action-sheet>
</template>
<script setup>
	import { ref, onMounted, computed, watch } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useLoginPopupStore } from '@/stores/loginPopup.js'
	import { differenceInSeconds } from 'date-fns'
	import CountryCodeList from '@/views/login/CountryCodeList/index.vue'
	import { useUserStore } from '@/stores/user.js'
	import { getUserInfo } from '@/api/user.js'
	import { isBlank, toast, notify, redirect } from '@/modules/util.js'
	import { sendOTPCode, loginWithOTP } from '@/api/login.js'
	import { useCountryCode } from '@/hooks/useCountryCode.js'

	const userStore = useUserStore()
	const PENDING_TIME = 60
	const loginPopupStore = useLoginPopupStore()
	const { toggle } = loginPopupStore
	const { show } = storeToRefs(loginPopupStore)
	const hasSended = ref(false)
	const phone = ref('')
	const otp = ref('')
	const message = ref('')
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
		: JSON.parse(sessionStorage.getItem('otp-info') || '{}')

	watch(seconds, (value) => {
		if (value > 0) {
			countdown()
		} else {
			if (timer) clearTimeout(timer)
		}
	})

	watch(show, (value) => {
		if (!value) {
			clear()
			phone.value = ''
			otp.value = ''
			countryCode.value = 86
		}
	})

	async function getUser() {
		const res = await getUserInfo()
		if (!_get(res, 'success')) return
		const data = _get(res, 'data', {})
		userStore.setUser(data)
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

	async function getOTP() {
		clear()
		if (!validPhone()) return
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

	async function doLogin() {
		clear()

		if (!validPhone()) return

		if (isBlank(otp.value)) {
			message.value = '请输入验证码'
			error.value.otp = true
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
			await getUser()
			toggle()
		}, 300)
	}

	function onSelect(value) {
		countryCode.value = value
		showCountryCode.value = false
	}

	function validPhone() {
		if (isBlank(phone.value)) {
			error.value.phone = true
			message.value = '请输入手机号'
			return
		}
		const { items } = useCountryCode()
		const target = _find(items, (vo) => vo.value == countryCode.value)
		if (
			!new RegExp(String.raw`^\d{${target.min},${target.max}}$`).test(
				phone.value
			)
		) {
			message.value = '手机格式错误'
			error.value.phone = true
			return
		}
		return true
	}
</script>

<style lang="scss">
	@import url('@/styles/login.scss');
	.login-popup {
		border-top-left-radius: 0.625rem;
		border-top-right-radius: 0.625rem;
	}
	.login-main {
		.header {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			height: 2.5rem;
			font-size: 1.25rem;
			font-weight: 600;
			margin-bottom: 1rem;
			svg {
				position: absolute;
				right: 0.5rem;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
</style>
