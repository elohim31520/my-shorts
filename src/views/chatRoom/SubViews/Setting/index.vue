<template>
	<div
		class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full max-w-480px pt-65"
	>
		<NormalHeader
			title="聊天室设置"
			:onBack="
				() => {
					showSetting = false
				}
			"
		/>

		<!-- 房間編輯 -->
		<div class="px-10 mb-25" @click="handleShowModifier">
			<div class="p-15 bg-#fff shadow-primary rounded-10 flex-y-center">
				<FourQuadrantAvatar
					class="h-50 w-50 mr-5 shrink-0"
					:images="userAvatars"
					:config="{ width: '3.125rem' }"
				/>

				<p class="color-#434343 font-600">
					{{ roomData.title }}({{ totalText }})
				</p>

				<SvgIcon
					name="read_more_arrow"
					size="1.875rem"
					class="color-#434343 shrink-0 ml-auto"
				/>
			</div>
		</div>

		<div class="color-#434343 flex-y-center px-10 justify-between mb-26.1">
			<p class="text-18 font-600">聊天室成员 ({{ totalText }})</p>
			<div class="flex-y-center" @click="showUserList = true">
				<span class="text-14 mr-5">全部</span>
				<SvgIcon
					name="read_more_arrow"
					size="1.25rem"
					class="color-#434343 shrink-0"
				/>
			</div>
		</div>

		<!-- 房間成員列表 -->
		<ul class="px-10 grid grid-cols-5 gap-y-11.1 flex-grow mb-40">
			<li
				v-for="(user, index) in users"
				:key="index"
				class="flex-center flex-col"
			>
				<div class="relative">
					<Avatar
						class="h-50 w-50 shrink-0 mb-1"
						:class="{ 'bd-#34c759-1.5': user.isOwner }"
						:user="user"
					/>
					<div
						v-if="user.isOwner"
						class="w-30 h-15 bg-primary flex-center rounded-7.5 absolute -bottom-1 left-1/2 -translate-x-1/2"
					>
						<span class="color-#fff text-mini-10">房主</span>
					</div>
				</div>
				<span class="color-#656565 text-mini-10 truncate w-90% text-center">
					{{ user.nickname || `游客 ${user.userId}` }}
				</span>
			</li>
		</ul>

		<van-button @click="showInvite = true">邀请好友</van-button>
	</div>
</template>

<script setup>
	import { ref, reactive, watch, computed, onMounted } from 'vue'
	import { getChatRoomUsersApi } from '@/api/chatRoom'
	import { getOrDefault } from '@/modules/util'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import FourQuadrantAvatar from '@/components/FourQuadrantAvatar/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import Avatar from '../../Avatar/index.vue'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const { roomData, missingUserIds } = useRoomData()
	const {
		showInvite,
		showKick,
		showModifier,
		showUserList,
		showSetting,
		showInfo,
	} = useDisplayStates()

	const totalText = ref(0)

	const users = reactive([])

	// 只顯示前 15 位用戶
	const maxVisibleUsers = 15

	const userAvatars = computed(() => {
		// 只取前四個
		return _slice(_map(users, 'avatar'), 0, 4)
	})

	watch(
		[showInvite, showKick, showModifier, showUserList, showInfo],
		(newValues) => {
			if (_some(newValues)) showSetting.value = false
		}
	)

	const handleShowModifier = () => {
		// 房主才會顯示修改頁面
		if (roomData.isOwner) {
			showModifier.value = true
		} else {
			showInfo.value = true
		}
	}

	const getChatRoomUsers = async () => {
		const { roomId, members } = roomData

		const response = await getChatRoomUsersApi({
			roomId,
			size: maxVisibleUsers,
		})
		const list = getOrDefault(response, 'data.list', [])
		const total = getOrDefault(response, 'data.total', 0)
		const userIds = _map(list, 'userId')

		totalText.value = total
		missingUserIds.push(...userIds)
		users.push(..._values(_pick(members, userIds)))
	}

	onMounted(() => {
		getChatRoomUsers()
	})
</script>

<style lang="scss" scoped>
	.van-button {
		width: 18.75rem;
		height: 2.5rem;
		display: block;
		background-color: #34c759;
		color: #fff;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 auto;
	}
</style>
