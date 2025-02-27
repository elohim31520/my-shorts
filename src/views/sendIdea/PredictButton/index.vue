<template>
	<div>
		<van-button
			color="#FF8F28"
			size="large"
			class="btn btn-ranking"
			@click="handleClick"
			:disabled="predictedCode.length > 2"
		>
			<div class="flex items-center h-40">
				<div class="w-25 h-25 mr-6">
					<img
						src="/public-assets/images/take-out-material/icon_ranking_grade.png"
					/>
				</div>
				<span class="font-size-18">我要参赛</span>
			</div>
		</van-button>
		<div
			class="w-full h-22 px-20 color-#aeaeb1 flex justify-between items-center mt-10 round-competition"
		>
			<div class="flex">
				<span class="color-#ff8f28 font-600">
					本期参赛：
					{{ predictionTypeText }}
				</span>
				{{
					predictionTypeText
						? '（发布即参赛成功）'
						: '(继续完善内容发布即参赛成功)'
				}}
			</div>
			<div class="bg-#aeaeb1 rounded-full w-20 h-20" @click="handleCancel">
				<SvgIcon name="icon_button_closure" color="white" size="1.25rem" />
			</div>
		</div>
	</div>
</template>

<script setup>
	const emit = defineEmits(['cancel', 'onClick'])
	const props = defineProps({
		predictedCode: {
			type: Array,
			default: () => [],
		},
		predictionTypeText: {
			type: String,
			default: '',
		},
	})

	const handleCancel = () => {
		emit('cancel')
	}

	const handleClick = () => {
		emit('onClick')
	}
</script>

<style lang="scss" scoped>
	.btn {
		border-radius: 0.5rem;
		line-height: 2.5;
		height: 2.5rem;
		font-size: 1.125rem;
		font-weight: 600;

		&.btn-ranking {
			width: 200px;
			margin-top: 0.625rem;
			margin: 0.625rem auto;

			.join-text {
				line-height: 1;
			}
		}

		.round-competition {
			line-height: 22px;
		}
	}
</style>
