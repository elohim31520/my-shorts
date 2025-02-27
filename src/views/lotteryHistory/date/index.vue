<template>
	<div>
		<NormalHeader title="历史开奖" />
		<Menu class="fixed top-45 z-10 w-full px-10" />
		<LotteryDate class="pt-100" />
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryDate from '@/components/LotteryDate/index.vue'

	import Menu from '../Menu/index.vue'
	import { ref, provide } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)
</script>

<style lang="scss" scoped></style>
