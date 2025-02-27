<template>
	<div class="flex items-center">
		<van-button type="primary" @click="increment">-</van-button>
		<p class="text-10 px-10">{{ count }}</p>
		<van-button type="primary" @click="increment">+</van-button>
	</div>
</template>

<script setup>
	const props = defineProps({
		count: {
			type: Number,
			required: true,
		},
		increment: {
			type: Function,
			required: true,
		},
		decrement: {
			type: Function,
			required: true,
		},
	})
</script>

<style scoped></style>
