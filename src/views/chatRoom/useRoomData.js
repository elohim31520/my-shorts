import { ref, reactive } from 'vue'

const roomData = reactive({
	owner: {},
	self: {},
	members: {},
	messages: [],
	isClosed: false,
	// 最早進入聊天室的Ｎ名用戶，Ｎ是取決於後端給的onlineUserList數量
	get earliestOnlineUsers() {
		return _map(this.onlineUserList, (userId) => this.members[userId])
	},
	// 實際在房中的用戶
	get presentUsers() {
		return _filter(this.members, 'isPresent')
	},
	// 自己是否為房主
	get isOwner() {
		if (!this.userId || !this.self.userId) return false
		return this.userId === this.self.userId
	},
})
const missingUserIds = reactive([]) // 缺少信息的 userId 集合

const iframeUrl = ref('')
const redirectUrl = ref('')
const selectedUser = ref({})

export function useRoomData() {
	return {
		roomData,
		iframeUrl,
		redirectUrl,
		selectedUser,
		missingUserIds,
	}
}
