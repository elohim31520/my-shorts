<template>
	<div class="bg-#FAFAFA">
		<div
			v-for="(vo, index) in list"
			:key="index"
			@click="redirectToRoom(vo.type, vo.roomId)"
		>
			<div
				class="flex-y-center py-8.5 px-10 m-10 relative"
				:class="{ 'b-line': index < list.length - 1 }"
			>
				<FourQuadrantAvatar
					class="w-56 h-56 min-w-56 mr-12"
					:images="getUserAvatars(index)"
					:config="{ width: '3.5rem' }"
				/>

				<div class="flex flex-col w-full">
					<div class="flex-y-center">
						<div
							class="text-16 font-600 color-#434343 tracking-3% lh-21.79 truncate max-w-175 mr-3 truncate-1-lines break-all"
						>
							{{ vo.title }}
						</div>
						<div
							class="text-16 font-600 color-#434343 tracking-3% lh-21.79 mr-5"
						>
							({{ vo.userNum }})
						</div>
					</div>
					<div
						class="color-#656565 font-400 text-12 lh-16.345 w-full max-w-100% truncate-1-lines break-all"
					>
						{{ vo.note }}
					</div>
				</div>
				<div
					class="w-60 h-25 lh-19.07 py-3 px-9 color-white text-14 rounded-12.5 whitespace-nowrap"
					:class="[ROOM_TYPES.CHAT == vo.type ? 'bg-primary' : 'bg-#529FFD']"
				>
					去聊天
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'

	import FourQuadrantAvatar from '@/components/FourQuadrantAvatar/index.vue'

	import { getChatRoomListApi } from '@/api/chatRoom'
	import { useUserStore } from '@/stores/user'
	import { useChat } from '@/hooks/useChat'
	import { ROOM_TYPES } from '@/constants/chat'

	const { data: userData } = useUserStore()
	const { updateUserAvatarMap, getUserAvatars, redirectToRoom } = useChat()

	const list = ref([])

	onMounted(async () => {
		const res = await getChatRoomListApi({
			page: 1,
			size: 2,
			userId: userData.userId,
		})
		const newData = _get(res, 'data.list', [])
		updateUserAvatarMap(newData)

		if (_isArray(newData)) {
			list.value.push(...newData)
		}
	})
</script>

<style scoped lang="scss">
	.b-line::after {
		content: '';
		background-color: #e7e7e7;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 0.3125rem);
		width: 100%;
		height: 1px;
	}
</style>
