<template>
	<div>
		<van-field
			v-model="searchQuery"
			placeholder="请输入搜寻内容"
			clearable
			autocomplete="off"
		>
			<template #left-icon>
				<SvgIcon size="1.875rem" name="icon_button_Query" class="mr-6" />
			</template>
		</van-field>
	</div>
</template>

<script setup>
	const props = defineProps({
		searchQuery: {
			type: String,
			default: '',
		},
	})

	const searchQuery = defineModel()
</script>

<style lang="scss" scoped>
	.van-field {
		width: 100%;
		line-height: 1.875rem;
		padding: 0 0.625rem;
		background-color: #f2f2f2;
		border-radius: 0.9375rem;
	}

	:deep() {
		.van-field__control {
			&::placeholder {
				color: #aeaeb1;
			}
		}

		input {
			font-size: 1rem;
		}
	}
</style>
