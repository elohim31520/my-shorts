<template>
	<div
		class="min-h-100dvh pt-105 bg-#fafafa color-#434343 flex flex-col flex-y-center"
	>
		<NormalHeader title="订单结果" />

		<SvgIcon
			size="3.75rem"
			:name="isSuccess ? 'icon_Recharge_success' : 'icon_Recharge_fail'"
			class="mb-10"
		/>
		<p class="font-600 mb-10">{{ isSuccess ? '支付成功' : '支付失败' }}</p>
		<p class="font-600 text-30 lh-22">¥{{ amount }}</p>

		<a
			v-redirect.auth="'/recharge/record'"
			class="w-300 lh-40 bg-#34C759 color-#fff text-center text-18 font-600 rounded-8 fixed bottom-20 left-1/2 -translate-x-1/2 cursor-pointer"
		>
			完成
		</a>
	</div>
</template>

<script setup>
	import { ref, onBeforeMount } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { getPaymentResultApi } from '@/api/recharge'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const isSuccess = ref(true)
	const amount = ref(0)

	const getPaymentResult = async () => {
		const orderId = _get(props.data, 'orderId', '')
		const response = await getPaymentResultApi({ payOrderId: orderId })

		amount.value = _get(response, 'data.amount', 0)
		isSuccess.value = !_get(response, 'data.state', 0)
	}

	onBeforeMount(() => {
		getPaymentResult()
	})
</script>

<style lang="scss" scoped></style>
