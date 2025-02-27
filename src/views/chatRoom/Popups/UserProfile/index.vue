<template>
	<van-action-sheet title="&nbsp;">
		<div class="p-10 pt-0 flex-center flex-col">
			<CdnImage
				:path="selectedUser.avatar"
				round
				fit="cover"
				position="center"
				error-icon="/public-assets/images/svg/default_avatar_man.png"
				class="w-58 h-58 mb-5"
				:config="{ width: '3.625rem' }"
			/>
			<p class="font-600 text-18 mb-5 text-center truncate-1-lines">
				{{ selectedUser.nickname }}
			</p>
			<div class="flex-y-center lh-22 mb-5">
				<span class="font-600 color-#434343 mr-2">
					{{ digitalConversion(selectedUser.fansCount) }}
				</span>
				<span class="mr-10 text-12 color-#656565">粉丝</span>
				<div class="h-10 bl-1.5-#656565 mr-10 opacity-20"></div>
				<span class="font-600 color-#434343 mr-2">
					{{ digitalConversion(selectedUser.likeAndCollectCount) }}
				</span>
				<span class="text-12 color-#656565">喜欢与收藏</span>
			</div>
			<div class="mb-30">
				<FollowButton
					v-if="!selectedUser.isSelf"
					:isFollowing="selectedUser.isFollow"
					@toggleFollow="toggleFollow"
				/>
			</div>
			<van-button @click="handleShowDetail">查看主页</van-button>
		</div>
	</van-action-sheet>
</template>

<script setup>
	import { ref } from 'vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import FollowButton from '@/components/FollowButton/index.vue'
	import { addFollow, delFollow } from '@/api/daniu'
	import { digitalConversion, getOrDefault, toast } from '@/modules/util'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const { roomData, selectedUser, iframeUrl } = useRoomData()
	const { showDetail, showUserProfile } = useDisplayStates()

	const toggleFollow = async () => {
		const { userId, isFollow } = selectedUser.value

		if (isFollow) {
			const response = await delFollow({
				toUserId: userId,
			})
			const success = getOrDefault(response, 'success', false)
			if (success) {
				selectedUser.value.fansCount--
				selectedUser.value.isFollow = false
				toast('取消关注成功')
			}
		} else {
			const response = await addFollow({
				toUserId: userId,
			})
			const success = getOrDefault(response, 'success', false)
			if (success) {
				selectedUser.value.fansCount++
				selectedUser.value.isFollow = true
				toast('关注成功')
			}
		}
	}

	const handleShowDetail = () => {
		const userId = getOrDefault(selectedUser.value, 'userId', '')

		iframeUrl.value = `${location.origin}/user/${userId}`
		showDetail.value = true
		showUserProfile.value = false
	}
</script>

<style lang="scss" scoped>
	.van-button {
		width: 100%;
		height: 2.5rem;
		background-color: #f4ffe8;
		border-radius: 0.5rem;
		border: solid 0.0625rem #34c759;
		font-size: 1.125rem;
		font-weight: 600;
		color: #34c759;
	}
</style>
