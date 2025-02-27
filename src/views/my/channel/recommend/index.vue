<template>
	<div class="channel-follow">
		<Header />
		<DaniuList class="mt-55" />
	</div>
</template>

<script setup>
	import Header from '@/views/my/channel/TabHeader/index.vue'
	import DaniuList from '@/components/DaniuList/index.vue'
	import { provide } from 'vue'

	const props = defineProps({
		someoneUserId: {
			type: String,
		},
	})
	provide('someoneUserId', props.someoneUserId)
</script>

<style lang="scss" scoped></style>
