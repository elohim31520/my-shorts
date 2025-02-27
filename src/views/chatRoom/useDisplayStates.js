import { ref } from 'vue'

const showSetting = ref(false)
const showInvite = ref(false)
const showKick = ref(false)
const showUserList = ref(false)
const showModifier = ref(false)
const showPicture = ref(false)
const showLottery = ref(false)
const showCreation = ref(false)
const showForum = ref(false)
const showRoom = ref(false)
const showMenu = ref(false)
const showUploader = ref(false)
const showInfo = ref(false)
const showRoomClosed = ref(false)
const showDuplicateLogin = ref(false)
const showKicked = ref(false)
const showConnecting = ref(false)
const showDetail = ref(false)
const showRoomChange = ref(false)
const showUserProfile = ref(false)
const showLeaveRoom = ref(false)

export function useDisplayStates() {
	return {
		showSetting,
		showInvite,
		showKick,
		showUserList,
		showModifier,
		showPicture,
		showLottery,
		showCreation,
		showForum,
		showRoom,
		showMenu,
		showUploader,
		showInfo,
		showRoomClosed,
		showDuplicateLogin,
		showKicked,
		showConnecting,
		showDetail,
		showRoomChange,
		showUserProfile,
		showLeaveRoom,
	}
}
