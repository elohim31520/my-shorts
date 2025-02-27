<template>
	<div
		class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full-limited color-#434343 pt-65"
	>
		<NormalHeader
			title="聊天室详情"
			:onBack="
				() => {
					redirect('/')
				}
			"
		/>

		<div class="flex-center flex-col mb-30">
			<p class="font-600 text-18 mb-10">当前聊天室已结束</p>
			<CdnImage
				:path="roomData.owner.avatar"
				round
				fit="cover"
				position="center"
				class="w-58 h-58 mb-10"
				error-icon="/public-assets/images/svg/default_avatar_man.png"
			/>
			<p class="font-600 text-18 mb-10 truncate-1-lines px-8.75">
				{{ roomData.owner.nickname }}
			</p>

			<FollowButton
				class="mb-20"
				:isFollowing="roomData.owner.isFollow"
				@toggleFollow="toggleFollow"
			/>

			<van-button @click="redirect('/')">返回首页</van-button>
		</div>

		<p class="font-600 text-18 px-10 mb-15">更多聊天室</p>

		<ChatRooms class="pt-5" />
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import ChatRooms from '@/components/ChatRooms/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import FollowButton from '@/components/FollowButton/index.vue'
	import { redirect, getOrDefault, toast } from '@/modules/util'
	import { addFollow, delFollow } from '@/api/daniu'
	import { useRoomData } from '../../useRoomData'

	const { roomData } = useRoomData()

	const toggleFollow = async () => {
		const { userId, isFollow } = roomData.owner

		if (isFollow) {
			const response = await delFollow({
				toUserId: userId,
			})
			const success = getOrDefault(response, 'success', false)
			if (success) {
				roomData.owner.fansCount--
				roomData.owner.isFollow = false
				toast('取消关注成功')
			}
		} else {
			const response = await addFollow({
				toUserId: userId,
			})
			const success = getOrDefault(response, 'success', false)
			if (success) {
				roomData.owner.fansCount++
				roomData.owner.isFollow = true
				toast('关注成功')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.van-button {
		width: 18.75rem;
		height: 2.5rem;
		background-color: #34c759;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
		color: #fff;
	}
</style>
