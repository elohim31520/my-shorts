<template>
	<p class="text-12 color-#AEAEB1 text-center">
		<span>”</span>
		<span class="color-primary">{{ nickname }}</span>
		<span>” 加入聊天室</span>
	</p>
</template>

<script setup>
	import { computed } from 'vue'
	import { getOrDefault } from '@/modules/util'
	import { useRoomData } from '../../useRoomData'

	const props = defineProps({
		message: {
			type: Object,
			default: () => ({}),
		},
	})

	const { roomData } = useRoomData()

	const nickname = computed(() => {
		const userId = getOrDefault(props.message, 'data.userId', '')
		const nickname = getOrDefault(roomData.members[userId], 'nickname', '')

		return nickname || `游客 ${userId}`
	})
</script>

<style lang="scss" scoped></style>
