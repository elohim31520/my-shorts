<template>
	<div class="mt-45">
		<Header title="修改手机号"></Header>
		<div class="pr-10 pl-10 pt-20 text-14 color-#656565">
			<div v-if="step === 1" class="pb-30 text-center">
				<p>请输入该帐号绑定的原手机号</p>
				<p>{{ user.mobile }}, 完成手机验证</p>
			</div>
			<div class="name-info shadow">
				<div
					class="pt-10 pb-10 text-14 color-#656565 flex flex-center flex-justify-between"
				>
					<span v-if="step === 1">请验证当前绑定手机号</span>
					<span v-else>请输入您想更改的手机号</span>
					<span v-if="error.otp" class="text-12 color-#FF8F28">验证码错误</span>
				</div>
				<div
					class="input-wrap mb-15 flex flex-center"
					:class="{ error: error.phone }"
				>
					<div
						class="country-code flex flex-center"
						@click="showCountryCode = true"
					>
						<span class="text-18 w-46.5">+{{ countryCode }}</span>
						<SvgIcon
							size="1.375rem"
							name="arrow_right"
							class="transform rotate-90 ml-5"
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
				<div class="flex flex-center h-40 pb-10">
					<div class="input-wrap pr-10 flex-1" :class="{ error: error.otp }">
						<van-field
							v-model="otp"
							placeholder="输入验证码"
							class="otp"
							type="number"
							clearable
							id="input-otp"
							autocomplete="off"
						/>
					</div>
					<van-button
						type="success"
						color="#34c759"
						class="btn h-40!"
						@click="getVerificationCode"
						v-if="!isPending"
						:loading="loading.otp"
					>
						{{ hasSended ? '重新获取' : '获取验证码' }}
					</van-button>
					<div v-else class="btn-pending van-button--normal h-40!">
						{{ seconds }}s
					</div>
				</div>
			</div>
			<div class="px-27.5 pt-20">
				<van-button @click="finish" class="btn-finish">
					{{ buttonText }}
				</van-button>
			</div>
			<p class="color-#ff8f28 text-14 text-align-center mt-8" v-show="message">
				{{ message }}
			</p>
		</div>
		<van-action-sheet v-model:show="showCountryCode" title="选择国际电话区号">
			<CountryCodeList @onSelect="onSelect" />
		</van-action-sheet>
	</div>
</template>
<script setup>
	import CountryCodeList from '@/views/login/CountryCodeList/index.vue'
	import Header from '@/components/NormalHeader/index.vue'
	import { isBlank, toast, notify, back } from '@/modules/util.js'
	import { ref, computed, watch, onMounted } from 'vue'
	import {
		changeMobileSendCode,
		changeMobile,
		currentMobileSendCode,
		currentMobileVerify,
	} from '@/api/setting'
	import { useUserStore } from '@/stores/user.js'
	import { useCountryCode } from '@/hooks/useCountryCode.js'
	import { storeToRefs } from 'pinia'
	const { data: user } = storeToRefs(useUserStore())
	const { setUser } = useUserStore()
	const countryCode = ref('86')
	const phone = ref('')
	const showCountryCode = ref(false)
	const seconds = ref(0)
	const PENDING_TIME = 60
	const message = ref('')
	const hasSended = ref(false)
	let timer = null
	const otp = ref('')
	const isPending = computed(() => seconds.value > 0)
	const step = ref(1)
	const step2Token = ref('')
	const buttonText = computed(() => (step.value === 1 ? '下一步' : '完成'))
	const error = ref({
		phone: false,
		otp: false,
	})
	const loading = ref({
		otp: false,
		login: false,
	})
	let otpToken = import.meta.env.SSR
		? null
		: sessionStorage.getItem('change-token')
	function onSelect(value) {
		countryCode.value = value
		showCountryCode.value = false
	}
	const getVerificationCode = async () => {
		const getCodeApi = new Map([
			[1, { method: currentMobileSendCode }],
			[2, { method: changeMobileSendCode }],
		])
		if (!validPhone()) return false
		loading.value.opt = true
		const api = getCodeApi.get(step.value)
		if (api) {
			const res = await api
				.method({
					mobile: phone.value,
					mobileCountryCode: countryCode.value,
					token: step.value === 2 ? step2Token.value : null,
				})
				.finally(() => {
					loading.value.opt = false
				})
			if (!_get(res, 'success')) return
			hasSended.value = true
			seconds.value = PENDING_TIME
			notify('验证码发送成功')
			otpToken = _get(res, 'data.token')
			sessionStorage.setItem('change-token', otpToken)
		}
	}
	function validPhone() {
		error.value.phone = false
		message.value = ''
		if (isBlank(phone.value)) {
			error.value.phone = true
			message.value = '请输入手机号'
			return
		}
		const { items } = useCountryCode()
		const target = _find(items, (vo) => vo.value == countryCode.value)
		const isValid = new RegExp(
			String.raw`^\d{${target.min},${target.max}}$`
		).test(phone.value)
		if (!isValid) {
			message.value = '手机号格式有误'
			error.value.phone = true
			return
		}
		return true
	}
	watch(seconds, (value) => {
		if (value > 0) {
			timer = setTimeout(() => {
				seconds.value--
			}, 1000)
		} else {
			if (timer) clearTimeout(timer)
		}
	})
	watch(countryCode, (value) => {
		phone.value = ''
	})

	const finish = async () => {
		if (!validPhone()) return false
		if (isBlank(otp.value)) {
			message.value = '请输入验证码'
			error.value.otp = true
			return
		}
		if (isBlank(otpToken)) {
			toast('请先获取验证码')
			return
		}
		const verifyCodeApi = new Map([
			[1, { method: currentMobileVerify }],
			[2, { method: changeMobile }],
		])
		const api = verifyCodeApi.get(step.value)
		const res = await api
			.method({
				token: otpToken,
				authCode: otp.value,
			})
			.finally(() => {
				loading.value.login = false
			})
		const success = _get(res, 'success')
		if (!success) {
			error.value.otp = true
			return
		}
		clear()
		if (step.value === 1) {
			step.value = 2
			step2Token.value = _get(res, 'data.token', '')
		} else {
			notify('修改成功')
			const data = _get(res, 'data', {})
			setUser(data)
			setTimeout(() => {
				back()
			}, 250)
		}
	}
	onMounted(() => {
		clear()
	})
	function clear() {
		hasSended.value = false
		phone.value = ''
		otp.value = ''
		sessionStorage.removeItem('change-time')
		sessionStorage.removeItem('change-token')
		seconds.value = 0
		error.value.phone = false
		error.value.otp = false
	}
</script>
<style lang="scss">
	.input-wrap {
		width: 100%;

		.van-cell {
			border-radius: 0 1.25rem 1.25rem 0;
			background-color: #fafafa;
			height: 100%;
			padding: 0;
			align-items: center;
			padding-left: 1rem;
			padding-right: 0.5rem;
			height: 2.5rem;
		}
		&.phone {
			.van-cell {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
		}
		input[type='text'] {
			font-size: 1.125rem;
		}
		.otp {
			border-radius: 1.25rem;
		}
	}
	.country-code {
		line-height: 2.5rem;
		background-color: #fafafa;
		border-top-left-radius: 1.25rem;
		border-bottom-left-radius: 1.25rem;
		padding-left: 1rem;
		position: relative;
		&:after {
			content: '';
			position: absolute;
			right: -0.5rem;
			top: 20%;
			width: 1px;
			height: 60%;
			background-color: #aeaeb1;
			z-index: 1;
		}
	}
	.error {
		.country-code,
		.van-cell {
			background-color: #ffecec;
		}
	}
	.name-info {
		background: #fff;
		border-radius: 10px;
		padding: 0.625rem 1.71875rem;
	}
	.btn-finish {
		width: 100%;
		border-radius: 10px;
		font-size: 1rem;
		color: white;
		background-color: $primary-color;
	}
	.change-count {
		color: $primary-color;
	}
	.phone-content {
		border-radius: 20px;
	}
	.btn {
		--van-button-radius: 1.25rem;
		height: 100%;
		width: 6.875rem;
		font-size: 1rem;
		height: 100%;
		white-space: nowrap;
	}
	.shadow {
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	}
	.btn-pending {
		border: solid 2px #e0e0e0;
		border-radius: 1.25rem;
		width: 6.875rem;
		font-size: 1rem;
		color: #aeaeb1;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		white-space: nowrap;
	}
</style>
