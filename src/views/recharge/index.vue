<template>
	<div class="min-h-100dvh bg-#fafafa pt-75 text-center color-#434343">
		<NormalHeader title="充值中心" />

		<p class="font-600 mb-10">当前积分余额</p>

		<p class="font-600 text-30 lh-22 mb-20">{{ moneyFormat(balance) }}</p>

		<div class="grid grid-cols-3 gap-10 px-12.5 mb-40">
			<div
				v-for="(option, index) in rechargeOptions"
				:key="index"
				class="h-85 flex-center flex-col bg-#F2F2F2 rounded-10 cursor-pointer"
				:class="{
					'bg-#FFFBEE bd-#FF8F28 color-#FF8F28': selectOptionIndex === index,
				}"
				@click="selectOptionIndex = index"
			>
				<p class="font-600 text-18 mb-5">{{ moneyFormat(option.score) }}</p>
				<p class="text-14">{{ moneyFormat(option.amount) }}元</p>
			</div>

			<div
				class="h-85 flex-center flex-col bg-#F2F2F2 rounded-10 cursor-pointer"
				@click="showAmountInput = true"
			>
				<p class="text-18 mb-5">输入金额</p>
				<p class="text-14 color-#AEAEB1">最低{{ minAmount }}元</p>
			</div>
		</div>

		<div
			class="bg-[url('/public-assets/images/but_topup.png')] bg-cover bg-no-repeat bg-center w-300 h-50 mx-auto mb-22.5 flex-center cursor-pointer"
			@click="handleRecharge"
		>
			<SvgIcon name="icon_topup2" size="1.375rem" class="mr-2.5"></SvgIcon>
			<span class="text-#fff relative font-600 text-18 lh-0">充值</span>
		</div>

		<a v-redirect.auth="'/recharge/record'" class="flex-center cursor-pointer">
			<span class="text-14 lh-0">充值记录</span>
			<SvgIcon name="icon_VoiceChat_Enter" size="1.25rem"></SvgIcon>
		</a>

		<AmountInput
			v-model="showAmountInput"
			:minAmount="minAmount"
			:maxAmount="maxAmount"
			:rate="rate"
		/>
	</div>
</template>

<script setup>
	import { ref, reactive, onMounted, onBeforeMount } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import AmountInput from './AmountInput/index.vue'
	import { moneyFormat } from '@/modules/util'
	import { getBalance as getBalanceApi } from '@/api/user'
	import { getPaymentConfigApi } from '@/api/recharge'
	import { useRecharge } from './useRecharge'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const balance = ref(0)
	const showAmountInput = ref(false)
	const rechargeOptions = reactive([])
	const minAmount = ref(0)
	const maxAmount = ref(0)
	const rate = ref(0)
	const selectOptionIndex = ref(0)

	const { recharge } = useRecharge()

	const getBalance = async () => {
		const response = await getBalanceApi()
		const score = _get(response, 'data.score', 0)

		balance.value = score
	}

	const getPaymentConfig = async () => {
		const paymentConfig = _get(props.data, 'paymentConfig', {})
		const amountSelectedList = _get(
			paymentConfig,
			'data.amountSelectedList',
			[]
		)

		maxAmount.value = _get(paymentConfig, 'data.maxAmount', 0)
		minAmount.value = _get(paymentConfig, 'data.minAmount', 0)
		rate.value = _get(paymentConfig, 'data.rate', 1)

		rechargeOptions.push(
			..._map(amountSelectedList, (amount) => ({
				score: amount * rate.value,
				amount,
			}))
		)
	}

	const handleRecharge = async () => {
		const { score } = rechargeOptions[selectOptionIndex.value]

		recharge(score)
	}

	getPaymentConfig()

	onBeforeMount(() => {
		getBalance()
	})
</script>

<style lang="scss" scoped></style>
