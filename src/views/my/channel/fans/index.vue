<template>
	<div class="channel-follow">
		<Header />
		<FollowFansList :isFans="true" class="mt-55" />
	</div>
</template>

<script setup>
	import Header from '@/views/my/channel/TabHeader/index.vue'
	import FollowFansList from '@/views/my/channel/FollowFansList/index.vue'
	import { ref, provide } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
		someoneUserId: {
			type: String,
		},
		isSelf: {
			type: Boolean,
			default: true,
		},
	})

	provide('data', props.data)
	provide('someoneUserId', props.someoneUserId)
	provide('isSelf', props.isSelf)
</script>

<style lang="scss" scoped></style>
