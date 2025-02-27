<template>
	<div class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full max-w-480px">
		<NormalHeader title="选择创作" :onBack="goBack" />

		<div class="pt-45 pb-65">
			<Waterfall :apiFunction="getBBSForumPosts" :apiParams="apiParams" />
		</div>

		<div
			class="h-60 flex-y-center justify-evenly bg-#fff fixed bottom-0 w-full-limited z-6"
		>
			<van-button
				class="reset-button"
				:disabled="!selectedOptions.length"
				@click="handleReset"
			>
				重置
			</van-button>
			<van-button
				class="submit-button"
				:disabled="!selectedOptions.length"
				@click="handleSubmit"
			>
				提交
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import Waterfall from '../../common/Waterfall/index.vue'

	import { getBBSForumPosts } from '@/api/bbs'
	import { MESSAGE_TYPES, CLIENT_CODES } from '@/constants/chat'
	import { useWebSocket } from '@/hooks/useChatWebSocket'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'
	import { useUserStore } from '@/stores/user'
	import { useSelector } from '../../common/useSelector'

	const useStore = useUserStore()
	const { data: userData } = useStore
	const { send } = useWebSocket()
	const { roomData } = useRoomData()
	const { showCreation } = useDisplayStates()
	const { selectedOptions, handleReset } = useSelector({})

	const apiParams = ref({
		forumId: 'myForum',
		postUserId: userData.userId,
		userId: userData.userId,
	})

	const handleSubmit = () => {
		const { roomId, self } = roomData

		_forEach(
			selectedOptions,
			({
				forumId,
				title,
				postId,
				likeCount,
				attachments,
				nickname,
				postUserId,
				avatar,
			}) => {
				const data = {
					code: CLIENT_CODES.SEND_MESSAGE,
					roomId,
					type: MESSAGE_TYPES.CREATION,
					userId: self.userId,
					msg: {
						forumId,
						title,
						postId,
						nickname,
						avatar,
						authorId: postUserId,
						likeCount,
						attachments,
					},
				}
				send(data)
			}
		)

		showCreation.value = false
	}

	const goBack = () => {
		showCreation.value = false
		selectedOptions.splice(0, selectedOptions.length)
	}
</script>

<style lang="scss" scoped>
	.van-button {
		height: 2.5rem;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.van-button.reset-button {
		width: 8.25rem;
		background-color: #f2f2f2;
		color: #434343;
	}

	.van-button.submit-button {
		width: 13.4688rem;
		background-color: #34c759;
		color: #fff;
	}

	.van-button.van-button--disabled {
		background-color: #f2f2f2;
		color: #aeaeb1;
		opacity: 1;
	}
</style>
