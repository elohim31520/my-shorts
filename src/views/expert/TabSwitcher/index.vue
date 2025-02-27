<template>
	<div class="shadow-[0_-1px_6px_0_rgba(0,0,0,0.1)] rounded-t-10 bg-white">
		<ul class="px-98 flex justify-around border-b-1px border-#E7E7E7 gap-50">
			<li
				v-for="(item, index) in menuItems"
				:key="index"
				class="lh-35 flex-center flex-1 cursor-pointer color-#aeaeb1"
				:class="{ active: item.value == activeValue }"
				@click="changeActive(item.value)"
			>
				<span class="whitespace-nowrap">{{ item.label }}</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
	const props = defineProps({
		activeValue: {
			type: String,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	})

	const emit = defineEmits(['update:activeValue'])

	const menuItems = [
		{ label: '本期推荐', value: 'current' },
		{ label: '历史推荐', value: 'history' },
	]

	function changeActive(value) {
		if (!props.loading) {
			emit('update:activeValue', value)
		}
	}
</script>

<style lang="scss" scoped>
	.active span {
		position: relative;
		color: #434343;
		font-weight: 600;
		&::after {
			content: '';
			display: block;
			height: 2px;
			width: 80%;
			background-color: $primary-color;
			position: absolute;
			bottom: 3px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
