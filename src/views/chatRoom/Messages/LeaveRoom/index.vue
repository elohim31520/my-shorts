<template>
	<p class="text-12 color-#AEAEB1 text-center">
		<span>”</span>
		<span class="color-#FC7E7E">{{ nickname }}</span>
		<span>” 離開聊天室</span>
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

		return nickname
	})
</script>

<style lang="scss" scoped></style>
