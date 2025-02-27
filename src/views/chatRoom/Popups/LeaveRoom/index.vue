<template>
	<van-popup class="rounded-10 px-30 pt-20.135 pb-25 text-18 text-center">
		<p class="font-600 color-#434343 mb-27.5">离开聊天室</p>
		<div class="color-#656565 mb-39">
			<p v-if="roomData.self.isOwner">房主离开后，聊天室将会解散，</p>
			<p v-else>聊天室讯息将会清除，</p>
			<p>确定离开吗？</p>
		</div>

		<div class="flex justify-between">
			<van-button class="cancel-button" @click="showLeaveRoom = false">
				取消
			</van-button>
			<van-button class="leave-button" @click="handleLeaveRoom">
				确定离开
			</van-button>
		</div>
	</van-popup>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { redirect } from '@/modules/util'
	import { leaveChatRoomApi, closeChatRoomApi } from '@/api/chatRoom'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const { roomData } = useRoomData()
	const { showSetting, showLeaveRoom } = useDisplayStates()

	const handleLeaveRoom = async () => {
		const {
			roomId,
			self: { isOwner, userId },
		} = roomData

		// 房主離開房間等於關閉房間
		isOwner ? closeChatRoomApi(roomId) : leaveChatRoomApi({ roomId, userId })
		redirect('/')
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

	.van-button.leave-button {
		background-color: #fc7e7e;
		color: #fff;
	}
</style>
