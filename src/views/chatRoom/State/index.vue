<template>
	<div class="fixed left-1 -top-12 z-20000">
		<span
			class="mr-1 text-mini-8 lh-0"
			:class="isWsConnected ? 'color-#34C759' : 'color-#fc7e7e'"
		>
			ws
		</span>
	</div>
</template>

<script setup>
	import { useWebSocket } from '@/hooks/useChatWebSocket'

	const { isConnected: isWsConnected } = useWebSocket()
</script>

<style lang="scss" scoped></style>
