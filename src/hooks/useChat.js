import { ref } from 'vue'
import { getUserInfoBatchApi } from '@/api/user'
import { ROOM_TYPES, ROOM_PATHS } from '@/constants/chat'
import { redirect } from '@/modules/util'

export function useChat() {
	const userIdsMap = ref(new Map())
	const userImgMap = ref({})

	const updateUserAvatarMap = (newData) => {
		const userIds = _map(newData, (vo, idx) => {
			const users4 = vo.onlineUserList ? vo.onlineUserList : []
			userIdsMap.value.set(idx, users4)
			return users4
		}).flat()

		if (_isArray(userIds) && userIds.length) {
			getUserInfoBatchApi(userIds).then((res) => {
				const data = _get(res, 'data', [])
				data.forEach((vo) => {
					userImgMap.value[vo.userId] = vo.avatar
				})
			})
		}
	}

	const getUserAvatars = (idx) => {
		const userIds = userIdsMap.value.get(idx)
		return userIds ? userIds.map((userId) => userImgMap.value[userId]) : []
	}

	const redirectToRoom = (chatType, roomId) => {
		const path =
			chatType == ROOM_TYPES.CHAT ? ROOM_PATHS.CHAT_ROOM : ROOM_PATHS.VOICE_ROOM
		redirect(`/${path}/${roomId}`)
	}

	return {
		updateUserAvatarMap,
		getUserAvatars,
		redirectToRoom,
	}
}
