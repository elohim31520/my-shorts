<template>
	<!-- 這邊管理的都是覆蓋整個房間主頁的子頁面，不要放其他組件到這 -->
	<div>
		<!-- 房間設置 -->
		<Setting v-if="showSetting" />
		<!-- 邀請成員 -->
		<Invite v-if="showInvite" />
		<!-- 踢出成員 -->
		<Kick v-if="showKick" />
		<!-- 房內成員 -->
		<UserList v-if="showUserList" />
		<!-- 房間修改 -->
		<Modifier v-if="showModifier" />
		<!-- 房間信息 -->
		<Info v-if="showInfo" />
		<!-- 圖紙選擇 -->
		<Picture v-if="showPicture" />
		<!-- 歷史開獎選擇 -->
		<Lottery v-if="showLottery" />
		<!-- 創作帖子選擇 -->
		<Creation v-if="showCreation" />
		<!-- 房主關閉房間後其他用戶顯示的結束畫面 -->
		<RoomClosed v-if="showRoomClosed" />
		<!-- 圖紙、開獎、創作、用戶詳情 -->
		<Detail v-if="showDetail" />
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import Setting from './Setting/index.vue'
	import Invite from './Invite/index.vue'
	import Kick from './Kick/index.vue'
	import UserList from './UserList/index.vue'
	import Modifier from './Modifier/index.vue'
	import Info from './Info/index.vue'
	import Picture from './Picture/index.vue'
	import Lottery from './Lottery/index.vue'
	import Creation from './Creation/index.vue'
	import RoomClosed from './RoomClosed/index.vue'
	import Detail from './Detail/index.vue'
	import { useDisplayStates } from '../useDisplayStates'

	const {
		showSetting,
		showInvite,
		showKick,
		showUserList,
		showModifier,
		showInfo,
		showPicture,
		showLottery,
		showCreation,
		showRoomClosed,
		showDetail,
	} = useDisplayStates()
</script>
