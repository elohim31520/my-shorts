<template>
	<ul class="country-code-list">
		<li
			v-for="vo in items"
			:key="vo.value"
			@click="onSelect(vo.value)"
			:class="{ active: countryCode == vo.value }"
		>
			<span class="inline-block w-48">+{{ vo.value }}</span>
			<span>{{ vo.name }}</span>
			<SvgIcon size="1.3rem" name="icon_choose" class="inline-block mr-8" />
		</li>
	</ul>
</template>

<script setup>
	import { ref } from 'vue'
	import { useCountryCode } from '@/hooks/useCountryCode.js'

	const emit = defineEmits(['onSelect'])
	const items = ref(useCountryCode().items)
	const countryCode = ref(items.value[0].value)

	function onSelect(value) {
		countryCode.value = value
		emit('onSelect', value)
	}
</script>

<style lang="scss" scoped>
	.country-code-list {
		display: flex;
		flex-direction: column;
		border-radius: 0.625rem;
		padding: 0.5rem 1rem;
		li {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			color: #656565;
			font-size: 1rem;
			font-weight: 400;
			padding: 0.625rem;
			position: relative;
			&.active {
				background-color: #edffe9;
				border-radius: 0.625rem;
				svg {
					display: inline-block;
				}
			}
			svg {
				position: absolute;
				top: 50%;
				right: 1rem;
				transform: translateY(-50%);
				display: none;
			}
		}
	}
</style>
