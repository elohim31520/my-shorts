<template>
	<div class="information">
		<NewsListContent />
	</div>
</template>

<script setup>
	import { provide } from 'vue'
	import NewsListContent from './NewsListContent/index.vue'
	const props = defineProps({
		params: {
			type: Object,
			default: () => {},
		},
	})
	provide('params', props.params)
</script>

<style lang="scss" scoped></style>
