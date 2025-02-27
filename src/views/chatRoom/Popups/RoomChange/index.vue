<template>
	<van-popup class="rounded-10 px-30 pt-20.135 pb-25 text-18 text-center">
		<p class="font-600 color-#434343 mb-27.5">即将切换到另一个房间</p>
		<div class="color-#656565 mb-39">
			<p v-if="roomData.self.isOwner">房主离开后，聊天室将会解散，</p>
			<p v-else>当前房间的所有讯息将消失，</p>
			<p>确认切换吗？</p>
		</div>

		<div class="flex justify-between">
			<van-button class="cancel-button" @click="showRoomChange = false">
				取消
			</van-button>
			<van-button class="confirm-button" @click="handleChangeRoom">
				确认切换
			</van-button>
		</div>
	</van-popup>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { redirect, getOrDefault } from '@/modules/util'
	import { CLIENT_CODES } from '@/constants/chat'
	import { leaveChatRoomApi, closeChatRoomApi } from '@/api/chatRoom'
	import { useWebSocket } from '@/hooks/useChatWebSocket'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const { roomData, redirectUrl } = useRoomData()
	const { showRoomChange } = useDisplayStates()
	const { send } = useWebSocket()

	const handleChangeRoom = async () => {
		const {
			roomId,
			self: { isOwner, userId },
		} = roomData

		// 房主離開房間等於關閉房間
		isOwner ? closeChatRoomApi(roomId) : leaveChatRoomApi({ roomId, userId })
		redirect(redirectUrl.value, { skip: true })
	}
</script>

<style lang="scss" scoped>
	.van-button {
		width: 7.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.van-button.cancel-button {
		background-color: #f2f2f2;
		color: #434343;
	}

	.van-button.confirm-button {
		background-color: #34c759;
		color: #fff;
	}
</style>
