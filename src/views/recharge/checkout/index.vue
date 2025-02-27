<template>
	<div class="min-h-100dvh pt-45 bg-#fffbee color-#434343 flex flex-col">
		<NormalHeader title="收银台" />

		<div class="flex-center flex-col h-145.5">
			<p class="font-600">订单总金额</p>
			<p class="font-600 text-30">¥{{ amount }}</p>
			<span class="color-#FF8F28">{{ countdownTime || '--:--' }}</span>
		</div>

		<div
			class="bg-#fff rounded-t-10 flex-1 shadow-[0_-0.125rem_0.75rem_0_#0000001A] px-40 py-30"
		>
			<p class="font-bold text-18 mb-40">选择支付方式</p>
			<ul>
				<li
					v-for="(method, index) in paymentMethods"
					:key="index"
					class="flex-y-center mb-30"
					@click="selectPayment(method)"
				>
					<SvgIcon size="1.375rem" :name="method.icon" class="mr-10" />
					<span>{{ method.name }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue'
	import { addMinutes } from 'date-fns'

	import NormalHeader from '@/components/NormalHeader/index.vue'

	import { Countdown } from '@/modules/date'

	const amount = ref(60)
	const countdownTime = ref('')
	const timer = ref(0)

	const paymentMethods = ref([
		{ name: '招商一网通', icon: 'icon_China_Merchants_Bank' },
		{ name: '支付宝', icon: 'icon_Alipay' },
		{ name: '微信支付', icon: 'icon_WeChat' },
		{ name: '数字人民币APP', icon: 'icon_number' },
		{ name: '信用卡/储蓄卡支付', icon: 'icon_credit_card' },
	])

	const selectPayment = (method) => {
		console.log('选择的支付方式:', method.name)
	}

	const setupTimer = () => {
		const countdown = new Countdown(addMinutes(new Date(), 5), {
			showDay: false,
			showTotalHours: true,
			hideZeroHours: true,
		}) // 建立倒數計時器例項，不顯示天數

		if (timer.value) clearInterval(timer.value)

		timer.value = setInterval(() => {
			countdownTime.value = countdown.get() // 更新倒數計時顯示
			if (!countdownTime.value) {
				clearInterval(timer.value) // 如果時間到了，停止計時
			}
		}, 1000)
	}

	onMounted(() => {
		setupTimer()
	})

	onUnmounted(() => {
		if (timer.value) clearInterval(timer.value)
	})
</script>

<style lang="scss" scoped></style>
