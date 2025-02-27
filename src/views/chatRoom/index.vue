<template>
	<div class="h-0 min-h-100dvh bg-#fafafa">
		<!-- <State /> -->

		<Header />

		<!-- 聊天內容 -->
		<Messages ref="messageRef" />

		<!-- 輸入區 -->
		<Input />

		<!-- 各種子頁面 -->
		<SubViews />

		<!-- 各種彈窗 -->
		<Popups />
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		watch,
		computed,
		onMounted,
		onBeforeUnmount,
		provide,
		useTemplateRef,
	} from 'vue'
	import { useEventListener } from '@vueuse/core'
	import SubViews from './SubViews/index.vue'
	import Popups from './Popups/index.vue'
	import Header from './Header/index.vue'
	import Messages from './Messages/index.vue'
	import Input from './Input/index.vue'
	import State from './State/index.vue'
	import {
		CLIENT_CODES,
		SERVER_CODES,
		API_CODES,
		ERROR_MESSAGES,
	} from '@/constants/chat'
	import { RELATIONSHIP_STATUS } from '@/constants/user'
	import {
		joinChatRoomApi,
		getChatRoomInfoApi,
		getAnonymousTokenApi,
		leaveChatRoomApi,
	} from '@/api/chatRoom'
	import { getUserInfoBatchApi } from '@/api/user'
	import {
		getOrDefault,
		redirect,
		dialog,
		toast,
		isLogin,
	} from '@/modules/util'
	import { useUserStore } from '@/stores/user'
	import { useLoginPopupStore } from '@/stores/loginPopup'
	import { useWebSocket } from '@/hooks/useChatWebSocket'
	import { useRoomData } from './useRoomData'
	import { useDisplayStates } from './useDisplayStates'
	import { useAutoScrollToBottom } from '@/hooks/useAutoScrollToBottom'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const messageRef = useTemplateRef('messageRef')

	const { data: userData, setUser } = useUserStore()
	const { roomData, missingUserIds } = useRoomData()
	const { ws, connect, send, setOnMessage, isConnected } = useWebSocket()
	const { showRoomClosed, showKicked, showDuplicateLogin, showConnecting } =
		useDisplayStates()

	const messageScrollController = reactive({})

	const roomId = getOrDefault(props.data, 'roomId', '')
	// 定義消息處理函數映射
	const messageHandlers = {
		[CLIENT_CODES.HEARTBEAT]: handleHeartbeat,
		[SERVER_CODES.USER_ENTER_ROOM]: handleUserEnterRoom,
		[SERVER_CODES.KICK_USER]: handleKickUser,
		[SERVER_CODES.USER_LEAVE_ROOM]: handleLeaveRoom,
		[SERVER_CODES.CLOSE_ROOM]: handleCloseRoom,
		[SERVER_CODES.DUPLICATE_LOGIN]: handleDuplicateLogin,
		[SERVER_CODES.USER_MESSAGE]: handleUserMessage,
		[SERVER_CODES.HEAT_UPDATE]: handleHeatUpdate,
		[SERVER_CODES.UPDATE_ROOM]: handleUpdateRoom,
	}
	const vPermission = {
		mounted(el, binding) {
			const eventType = getOrDefault(binding, 'arg', 'click')
			let keyToCheck = null

			if (eventType === 'keydown') {
				if (binding.modifiers.enter) {
					keyToCheck = 'Enter'
				}
			}

			const handler = (event) => {
				if (keyToCheck && event.key !== keyToCheck) return
				if (isLogin()) return

				event.preventDefault()
				event.stopImmediatePropagation()
				useLoginPopupStore().toggle()
			}

			useEventListener(el, eventType, handler, true)
		},
	}
	let heartbeatInterval = null // 心跳定時器

	provide('data', props.data)
	provide('messageScrollController', messageScrollController)
	provide('vPermission', vPermission)

	watch(isConnected, (newValue) => {
		// 只要連上ws就調用join，包括斷線重連
		if (newValue) joinChatRoom()
		showConnecting.value = !newValue && !roomData.isClosed
	})

	// 監聽缺少的 userId，獲取用戶信息
	watch(missingUserIds, (newValue) => {
		if (!newValue.length) return
		updateUserInfo([...newValue])
		missingUserIds.length = 0
	})

	watch(
		() => userData.token,
		async (newValue) => {
			if (!newValue) return

			const {
				roomId,
				self: { isGuest, userId, anonymousToken },
			} = roomData

			if (isGuest) {
				leaveChatRoomApi(
					{ roomId, userId },
					{ token: '', 'anonymous-token': anonymousToken }
				)
				handleCleanupRoomConnections()
				setUser({ anonymousToken: null })
				init()
			}
		}
	)

	// 獲取用戶信息
	async function updateUserInfo(userIds) {
		_forEach(userIds, (userId) => {
			if (!roomData.members[userId]) {
				roomData.members[userId] = {
					userId,
					nickname: userId,
				}
			}
		})

		const response = await getUserInfoBatchApi(userIds)
		const users = getOrDefault(response, 'data', [])
		const userId = getOrDefault(userData, 'userId', '')
		const anonymousToken = getOrDefault(userData, 'anonymousToken', '')

		_forEach(users, (user) => {
			const {
				userId: uid,
				nickname,
				avatar,
				vipLevel,
				relationship,
				fans,
				likeAndCollectCount,
			} = user

			if (uid) {
				// TODO 暫無判別遊客的字段
				const isGuest = !nickname
				const isOwner = roomData.userId === uid
				const isSelf = userId === uid
				const isFollow =
					relationship == RELATIONSHIP_STATUS.FOLLOWING ||
					relationship == RELATIONSHIP_STATUS.MUTUAL

				const memberInfo = {
					userId: uid,
					nickname,
					avatar,
					level: vipLevel,
					fansCount: fans,
					likeAndCollectCount,
					isSelf,
					isOwner,
					isFollow,
					isPresent: true,
					isGuest,
				}

				roomData.members[uid] = memberInfo
				if (isOwner) roomData.owner = { ...memberInfo }
				if (isSelf) roomData.self = { ...memberInfo, anonymousToken }
			}
		})
	}

	function handleUserEnterRoom({ userId }) {
		// 用戶進入房間
		const member = roomData.members[userId]

		if (member) {
			member.isPresent = true
		}

		roomData.messages.push({
			code: SERVER_CODES.USER_ENTER_ROOM,
			data: { userId },
		})
		getChatRoomInfo()
	}

	function handleKickUser({ userId }) {
		// 踢出用戶
		const { self } = roomData

		roomData.members[userId].isPresent = false

		if (self.userId === userId) {
			roomData.isClosed = true
			showKicked.value = true
			handleCleanupRoomConnections()
		}
		getChatRoomInfo()
	}

	function handleLeaveRoom({ userId }) {
		// 離開房間
		roomData.members[userId].isPresent = false
		getChatRoomInfo()
	}

	// 房主關閉房間
	function handleCloseRoom() {
		// 房主不會顯示
		if (!roomData.isOwner) {
			handleCleanupRoomConnections()
			showRoomClosed.value = true
		}
		roomData.isClosed = true
	}

	function handleDuplicateLogin() {
		// 異地登錄
		roomData.isClosed = true
		showDuplicateLogin.value = true
		handleCleanupRoomConnections()
	}

	function handleUserMessage({ userId, type, msg }) {
		// 收到用戶發送的文字消息
		let content

		try {
			content = _isNaN(+msg) ? JSON.parse(msg) : String(msg)
		} catch (error) {
			content = msg
		}

		roomData.messages.push({
			code: type,
			data: { userId, content },
		})
	}

	function handleHeatUpdate() {
		// 熱度值更新
	}

	function handleUpdateRoom(data) {
		// toast('房间更新')
		getChatRoomInfo()
	}

	function handleHeartbeat() {
		if (heartbeatInterval) return
		// 啟用心跳
		sendHeartbeat()
		heartbeatInterval = setInterval(sendHeartbeat, 60 * 1000)
	}

	function sendHeartbeat() {
		const data = { code: CLIENT_CODES.HEARTBEAT }

		send(data)
	}

	function stopHeartbeat() {
		if (heartbeatInterval) {
			clearInterval(heartbeatInterval)
			heartbeatInterval = null
		}
	}

	// 設置 WebSocket 的消息處理函數
	setOnMessage((event) => {
		const data = JSON.parse(event.data)
		const body = JSON.parse(getOrDefault(data, 'body', '{}'))
		const userId = getOrDefault(body, 'userId', '')
		const handler = messageHandlers[data.code]

		if (userId && !roomData.members[userId]) missingUserIds.push(userId)

		if (handler) {
			handler(body)
		} else {
			console.error(`未處理的消息代碼: ${data.code}`)
		}
	})

	// 獲取聊天室信息
	async function getChatRoomInfo() {
		const userId = getOrDefault(userData, 'userId', '')
		const response = await getChatRoomInfoApi(roomId)
		const success = getOrDefault(response, 'success', false)
		const errMessage = getOrDefault(
			response,
			'errMessage',
			ERROR_MESSAGES.UNKNOWN_ERROR
		)

		if (success) {
			_assign(roomData, getOrDefault(response, 'data', {}))
			const onlineUserList = getOrDefault(roomData, 'onlineUserList', [])

			roomData.self.userId = userId
			roomData.owner.userId = roomData.userId
			missingUserIds.push(
				...new Set([roomData.userId, ...onlineUserList, userId])
			)
		} else {
			dialog(errMessage).then(() => redirect('/'))
			return Promise.reject(errMessage)
		}
	}

	// 加入聊天室
	async function joinChatRoom(retryCount = 0) {
		const maxRetries = 5
		const nickname = getOrDefault(userData, 'nickname', '')
		const anonymousToken = getOrDefault(userData, 'anonymousToken', '')

		const response = await joinChatRoomApi({ roomId, nickname })
		const success = getOrDefault(response, 'success', false)
		const errCode = getOrDefault(response, 'errCode', '')
		const errMessage = (() => {
			if (API_CODES.ROOM_ACCESS_DENIED == errCode)
				return ERROR_MESSAGES.ROOM_ACCESS_DENIED
			if (API_CODES.ROOM_CLOSED == errCode)
				return ERROR_MESSAGES.CHAT_ROOM_CLOSED
			return getOrDefault(response, 'errMessage', ERROR_MESSAGES.UNKNOWN_ERROR)
		})()

		if (success) {
			_assign(roomData, getOrDefault(response, 'data', {}))
		} else {
			// 遊客 token 過期重新獲取
			if (
				API_CODES.ANONYMOUS_TOKEN_EXPIRED == errCode &&
				retryCount < maxRetries &&
				anonymousToken
			) {
				setUser({ anonymousToken: null, userId: null })
				dialog(ERROR_MESSAGES.ANONYMOUS_TOKEN_EXPIRED)
				await getAnonymousToken()
				return joinChatRoom(retryCount + 1)
			}
			dialog(errMessage).then(() => redirect('/'))
			return Promise.reject(errMessage)
		}
	}

	function handleCleanupRoomConnections() {
		stopHeartbeat()
		// send({ code: CLIENT_CODES.USER_LEAVE_ROOM })
		ws.value.close()
	}

	async function getAnonymousToken() {
		const token = getOrDefault(userData, 'token', '')
		const anonymousToken = getOrDefault(userData, 'anonymousToken', '')

		if (token || anonymousToken) return

		const response = await getAnonymousTokenApi()
		setUser({
			anonymousToken: getOrDefault(response, 'data.token', ''),
			userId: getOrDefault(response, 'data.userId', ''),
		})
	}

	async function init() {
		useEventListener(window, 'beforeunload', () => {
			roomData.isClosed = true
			handleCleanupRoomConnections()
		})
		_assign(
			messageScrollController,
			useAutoScrollToBottom(
				messageRef.value.scrollContainerRef,
				roomData.messages
			)
		)
		try {
			await getAnonymousToken()
			await joinChatRoom()
			await getChatRoomInfo()
			connect()
		} catch (error) {
			console.error(error)
		}
	}

	onMounted(() => {
		init()
		window.roomData = roomData
	})
</script>

<style lang="scss" scoped></style>
