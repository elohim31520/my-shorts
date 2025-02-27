<template>
	<div>
		<Bar />
		<Usage />
		<Uno />
		<Image />
		<SSR />

		<LazyImage />
	</div>
</template>

<script setup>
	import Usage from './Usage/index.vue'
	import Bar from './Bar/index.vue'
	import Uno from './Uno/index.vue'
	import SSR from './SSR/index.vue'
	import LazyImage from './LazyImage/index.vue'
	import Image from './Image/index.vue'
	import { provide } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)
</script>

<style></style>
