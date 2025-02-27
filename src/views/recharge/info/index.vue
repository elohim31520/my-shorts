<template>
	<div class="min-h-100dvh pt-45 bg-#fffbee color-#434343 flex flex-col">
		<NormalHeader title="充值" />

		<div class="flex-center flex-col h-145.5">
			<p class="font-600 mb-8">充值金额</p>
			<p class="text-30 font-600 lh-22 mb-18">
				¥{{ moneyFormat(result.amount) }}
			</p>
			<p class="text-14 font-500">
				你可在"
				<span class="color-primary">充值记录</span>
				"中查看相关讯息
			</p>
		</div>

		<div
			class="bg-#fff rounded-t-10 flex-1 shadow-[0_-0.125rem_0.75rem_0_#0000001A] px-25 pt-30"
		>
			<div class="relative mb-60">
				<p class="mb-10">
					<span class="font-bold">订单编号：</span>
					{{ result.payOrderId }}
				</p>
				<p>
					<span class="font-bold">申请时间：</span>
					{{ orderTime }}
				</p>
				<div
					class="absolute right-0 top-0 w-44 lh-27 text-center bg-#F1FEE6 text-14 bd-#34C759 rounded-5 color-primary"
					@click="handleCopy"
				>
					复制
				</div>
			</div>

			<van-button class="record" @click="handleToRecord">
				返回充值记录
			</van-button>
			<van-button class="service" @click="handleCustomerService">
				充值有问题，联系客服
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onBeforeMount } from 'vue'
	import { useClipboard } from '@vueuse/core'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { getPaymentResultApi } from '@/api/recharge'
	import { getConfig as getConfigApi } from '@/api/common'
	import {
		getOrDefault,
		toast,
		redirect,
		safeOpen,
		moneyFormat,
	} from '@/modules/util'
	import { formatTimestamp } from '@/modules/date'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const { copy, isSupported } = useClipboard()

	const result = ref({})
	const config = ref({})

	const orderTime = computed(() => {
		const time = getOrDefault(result.value, 'callbackTimeout', 0)

		if (!time) return '--'
		return formatTimestamp(time, 'yyyy-MM-dd HH:mm:ss')
	})

	const getPaymentResult = async () => {
		const orderId = getOrDefault(props.data, 'orderId', '')
		const response = await getPaymentResultApi({ payOrderId: orderId })

		result.value = getOrDefault(response, 'data', {})
	}

	const getConfig = async () => {
		const response = await getConfigApi()

		config.value = getOrDefault(response, 'data', {})
	}

	const handleCopy = async () => {
		if (!isSupported) return
		const orderId = getOrDefault(result.value, 'payOrderId', '')

		try {
			await copy(`"${orderId}"`)
			toast('复制成功')
		} catch (error) {
			toast('复制失败')
		}
	}

	const handleToRecord = () => {
		redirect(`/recharge/record`, { auth: true, skip: true })
	}

	const handleCustomerService = () => {
		const serviceUrl = _get(config.value, 'onlineServiceCode', '')

		if (serviceUrl) safeOpen(serviceUrl)
	}

	onBeforeMount(() => {
		getPaymentResult()
		getConfig()
	})
</script>

<style lang="scss" scoped>
	.van-button {
		width: 18.75rem;
		height: 2.5rem;
		display: block;
		margin: 0 auto;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
		color: #fff;
	}

	.van-button.record {
		background-color: #34c759;
		margin-bottom: 1.25rem;
	}

	.van-button.service {
		border: 0.0938rem solid #34c759;
		color: #34c759;
		background-color: #f1fee6;
	}
</style>
