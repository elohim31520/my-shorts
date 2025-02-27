<template>
	<div class="bg-#fafafa min-h-100dvh">
		<NormalHeader title="谁看过我" />
		<List />
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import List from './List/index.vue'
	import { provide, ref } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)
</script>

<style lang="scss" scoped></style>
