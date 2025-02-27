<template>
	<!-- 頭部標題欄 -->
	<div
		class="fixed top-0 w-full z-10 h-45 bg-#fff px-10 flex-y-center justify-between max-w-480px"
	>
		<div class="flex-y-center">
			<SvgIcon
				name="arrow_left"
				size="1.875rem"
				class="mr-4"
				@click="showLeaveRoom = true"
			/>
			<FourQuadrantAvatar
				class="w-32 h-32 mr-5"
				:images="userAvatars"
				:config="{ width: '2rem' }"
			/>
			<p class="font-600 color-#434343 truncate max-w-200">
				{{ roomData.title }}
			</p>
			<span class="font-600 color-#434343">({{ roomData.userNum }})</span>
		</div>

		<div class="flex-y-center">
			<SvgIcon name="icon_More2" size="1.875rem" @click="showSetting = true" />
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import FourQuadrantAvatar from '@/components/FourQuadrantAvatar/index.vue'
	import { redirect, getOrDefault } from '@/modules/util'
	import { CLIENT_CODES } from '@/constants/chat'
	import { useWebSocket } from '@/hooks/useChatWebSocket'
	import { useDisplayStates } from '../useDisplayStates'
	import { useRoomData } from '../useRoomData'

	const { send } = useWebSocket()
	const { showSetting, showLeaveRoom } = useDisplayStates()
	const { roomData } = useRoomData()

	const userAvatars = computed(() => {
		// 只取前四個
		return _slice(_map(_values(roomData.earliestOnlineUsers), 'avatar'), 0, 4)
	})
</script>

<style lang="scss" scoped></style>
