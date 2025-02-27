<template>
	<div>
		<van-button
			color="#f2f2f2"
			size="large"
			class="btn btn-reset"
			:disabled="modelValue"
			@click="handleReset"
		>
			重置
		</van-button>
		<van-button
			color="#34c759"
			size="large"
			class="btn btn-publish"
			:loading="modelValue"
			loading-text="发布中..."
			@click="handleSubmit"
		>
			<div class="flex items-center">
				<div
					class="btn-plus w-20 h-20 rounded-full bg-white flex items-center justify-center color-primary mr-6"
				>
					<van-icon name="plus" size="0.75rem" />
				</div>
				发布
			</div>
		</van-button>
	</div>
</template>

<script setup>
	const emit = defineEmits(['formReset', 'formSubmit'])
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false,
		},
	})

	const handleReset = () => {
		emit('formReset')
	}

	const handleSubmit = () => {
		emit('formSubmit')
	}
</script>

<style lang="scss" scoped>
	.btn {
		border-radius: 0.5rem;
		line-height: 2.5;
		height: 2.5rem;
		font-size: 1.125rem;
		font-weight: 600;

		&.btn-reset {
			width: 36.056%;
			margin-right: 0.5rem;
			:deep(.van-button__text) {
				color: #434343;
			}
		}

		&.btn-publish {
			flex: 1;
			border: 1px solid $primary-color !important;
		}
	}

	.btn-plus {
		i {
			font-weight: 700;
		}
	}
</style>
