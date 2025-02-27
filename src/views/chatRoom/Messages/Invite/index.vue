<template>
	<p class="text-12 color-#AEAEB1 text-center">
		<span>你邀请 ”</span>
		<span class="color-#656565">{{ nickname }}</span>
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

	const nickname = computed(() =>
		getOrDefault(props.message, 'data.nickname', '')
	)
</script>

<style lang="scss" scoped></style>
