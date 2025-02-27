<template>
	<div>
		<van-action-sheet v-model:show="show" position="bottom" title="输入金额">
			<div class="px-37.5 pt-30 pb-20">
				<div class="flex-y-center mb-10">
					<span class="color-#656565 text-14 lh-0">积分数量：</span>

					<SvgIcon name="score" size="1.25rem" class="mr-1"></SvgIcon>
					<span class="font-600 text-20 lh-0">{{ moneyFormat(score) }}</span>
				</div>

				<van-field
					v-model="amount"
					placeholder="请输入充值金额"
					type="number"
					class="mb-5"
					:class="{ invalid: !isAmountValid && amount }"
					autocomplete="off"
				>
					<template #extra>元</template>
				</van-field>

				<p
					class="text-14 text-left color-#AEAEB1 mb-38"
					:class="{ 'color-#FF8F28': !isAmountValid && amount }"
				>
					最低可输入{{ moneyFormat(minAmount) }}元, 最高可输入{{
						moneyFormat(maxAmount)
					}}元
				</p>

				<van-button
					class="w-full"
					:disabled="!isAmountValid"
					@click="handleRecharge"
				>
					充值
				</van-button>
			</div>
		</van-action-sheet>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { moneyFormat, safeOpen } from '@/modules/util'
	import { useRecharge } from '../useRecharge'

	const props = defineProps({
		minAmount: {
			type: Number,
			default: 0,
		},
		maxAmount: {
			type: Number,
			default: 0,
		},
		rate: {
			type: Number,
			default: 1,
		},
	})

	const show = defineModel()

	const amount = ref('')

	const { recharge } = useRecharge()

	const isAmountValid = computed(() => {
		const value = +amount.value
		return (
			!_isNaN(value) && value >= props.minAmount && value <= props.maxAmount
		)
	})

	const score = computed(() => +amount.value * props.rate)

	function handleRecharge() {
		if (isAmountValid.value) {
			recharge(score.value)
		}
	}
</script>

<style lang="scss" scoped>
	.van-field {
		width: 100%;
		line-height: 2.5rem;
		padding: 0 1.25rem;
		background-color: #f2f2f2;
		border-radius: 1.25rem;
		font-size: 1.125rem;

		&.invalid {
			background-color: #ffecec;
		}
	}

	.van-button {
		height: 2.5rem;
		background-color: #ff8f28;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
		color: #fff;
	}

	.van-button--disabled {
		background-color: #f2f2f2;
		color: #aeaeb1;
		opacity: 1;
	}

	:deep() {
		.van-action-sheet__header {
			line-height: 2.5rem;
			font-size: 1.25rem;
			border: 0.0625rem solid #e7e7e7;
		}

		.van-action-sheet__close {
			color: #434343;
		}

		.van-field__control {
			&::placeholder {
				color: #aeaeb1;
			}
		}

		input {
			font-size: 1.125rem;
		}
	}
</style>
