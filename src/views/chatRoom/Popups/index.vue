<template>
	<!-- 這邊管理的是彈窗類型的，不要放其他組件到這 -->
	<div>
		<!-- 異地登入 -->
		<DuplicateLogin v-model:show="showDuplicateLogin" />
		<!-- 用戶被房主踢出後顯示的畫面 -->
		<Kicked v-model:show="showKicked" />
		<!-- ws 斷線重連 -->
		<Connecting v-model:show="showConnecting" />
		<!-- 換房 -->
		<RoomChange v-model:show="showRoomChange" />
		<!-- 用戶簡介 -->
		<UserProfile v-model:show="showUserProfile" />
		<!-- 離開房間 -->
		<LeaveRoom v-model:show="showLeaveRoom" />
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import DuplicateLogin from './DuplicateLogin/index.vue'
	import Kicked from './Kicked/index.vue'
	import Connecting from './Connecting/index.vue'
	import RoomChange from './RoomChange/index.vue'
	import UserProfile from './UserProfile/index.vue'
	import LeaveRoom from './LeaveRoom/index.vue'
	import { useDisplayStates } from '../useDisplayStates'

	const {
		showDuplicateLogin,
		showKicked,
		showConnecting,
		showRoomChange,
		showUserProfile,
		showLeaveRoom,
	} = useDisplayStates()
</script>

<style lang="scss" scoped>
	:deep() {
		.van-popup {
			width: 20.625rem;
		}

		.van-action-sheet__header {
			font-size: 1.25rem;
			border-bottom: 0.0625rem solid #f2f2f2;
		}
		.van-action-sheet__content {
			@include scrollbar-hidden;
		}

		.van-action-sheet__close {
			font-size: 1.375rem;
			color: #434343;
		}

		.van-action-sheet__header {
			border-bottom: 0;
		}
	}
</style>
