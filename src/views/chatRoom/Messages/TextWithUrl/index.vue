<template>
	<div>
		<!-- 其他用戶發的信息 -->
		<div v-if="!userInfo.isSelf" class="flex">
			<Avatar class="w-35 h-35 mr-10" :user="userInfo" />
			<div>
				<div
					class="color-#434343 w-fit lh-19 max-w-283 break-words text-14 mt-10 mb-5 p-10 bg-#fff rounded-10 rounded-ss-none"
					@click="handleMessageClick"
					v-html="safeHtml(processedMessage)"
				></div>
				<HotChatCard
					v-for="(info, index) in roomInfos"
					:key="index"
					class="mb-5 w-180"
					:lotteryType="info.lotteryType.key"
					:data="info"
					:userImgs="info.avatars"
					@click="handleShowRoomChange(info.url)"
				/>
			</div>
		</div>

		<!-- 自己發的信息 -->
		<div v-else class="flex flex-row-reverse">
			<Avatar class="w-35 h-35 ml-10" :user="userInfo" />
			<!-- 聊天內容 -->
			<div>
				<div
					class="color-#434343 w-fit lh-19 max-w-283 break-words whitespace-pre-wrap text-14 mt-10 mb-5 p-10 bg-#B1FF95 rounded-10 rounded-se-none"
					@click="handleMessageClick"
					v-html="safeHtml(processedMessage)"
				></div>

				<HotChatCard
					v-for="(info, index) in roomInfos"
					:key="index"
					class="mb-5 w-180 ml-auto"
					:lotteryType="info.lotteryType.key"
					:data="info"
					:userImgs="info.avatars"
					@click="handleShowRoomChange(info.url)"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { reactive, computed, onMounted } from 'vue'
	import { getOrDefault, getLotteryTypeList, safeOpen } from '@/modules/util'
	import { getChatRoomInfoApi } from '@/api/chatRoom'
	import { getUserInfoBatchApi } from '@/api/user'
	import { ROOM_PATHS } from '@/constants/chat'
	import CdnImage from '@/components/CdnImage/index.vue'
	import HotChatCard from '@/components/HotChatCard/index.vue'
	import Avatar from '../../Avatar/index.vue'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'
	import safeHtml from '@/modules/safeHtml.js'

	const props = defineProps({
		message: {
			type: Object,
			default: () => ({}),
		},
	})

	const roomInfos = reactive([])

	const { roomData, redirectUrl } = useRoomData()
	const { showRoomChange } = useDisplayStates()

	const userInfo = computed(() => {
		const userId = getOrDefault(props.message, 'data.userId', '')

		return roomData.members[userId]
	})
	const content = computed(() =>
		getOrDefault(props.message, 'data.content', '')
	)
	const processedMessage = computed(() => {
		const placeholders = []
		const validUrls = getOrDefault(content.value, 'urls', [])
		let message = getOrDefault(content.value, 'message', '')

		_forEach(validUrls, (url, index) => {
			const placeholder = `__URL_PLACEHOLDER_${index}__`

			placeholders.push({ placeholder, url })
			message = message.replace(
				new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
				placeholder
			)
		})

		_forEach(placeholders, ({ placeholder, url }) => {
			const { pathname } = new URL(url)
			const [, roomPath, roomId] = _split(pathname, '/')
			const shouldOpen = !(
				(ROOM_PATHS.VOICE_ROOM === roomPath ||
					ROOM_PATHS.CHAT_ROOM === roomPath) &&
				roomId
			)

			message = message.replace(
				new RegExp(placeholder, 'g'),
				`<a style="color:#529FFD;" data-redirect-url="${url}" data-should-open="${shouldOpen}" >${url}</a>`
			)
		})

		return message
	})

	const getChatRoomInfo = async () => {
		const validUrls = getOrDefault(content.value, 'urls', [])

		for (let index = 0; index < validUrls.length; index++) {
			const validUrl = validUrls[index]
			const { pathname } = new URL(validUrl)
			const [, roomPath, roomId] = _split(pathname, '/')

			if (ROOM_PATHS.VOICE_ROOM === roomPath && roomId) {
				const roomInfoResponse = await getChatRoomInfoApi(roomId)
				const success = getOrDefault(roomInfoResponse, 'success', false)
				if (!success) continue

				const roomDetail = getOrDefault(roomInfoResponse, 'data', {})
				const userIds = getOrDefault(roomDetail, 'onlineUserList', [])
				const ownerId = getOrDefault(roomDetail, 'userId', '')
				const gameType = getOrDefault(roomDetail, 'gameType', '')
				const userInfoResponse = await getUserInfoBatchApi([
					...userIds,
					ownerId,
				])
				const avatars = _map(
					getOrDefault(userInfoResponse, 'data', []),
					'avatar',
					[]
				)
				const lotteryTypeList = getLotteryTypeList()
				const lotteryType =
					_find(
						lotteryTypeList,
						(lotteryType) => lotteryType.code == gameType
					) || {}

				roomInfos.push(
					_assign({}, roomDetail, { avatars, lotteryType, url: validUrl })
				)
			}
		}
	}

	const handleMessageClick = (event) => {
		const target = event.target

		if (target.tagName === 'A') {
			const { shouldOpen, redirectUrl } = target.dataset

			if (JSON.parse(shouldOpen)) {
				safeOpen(redirectUrl)
			} else {
				handleShowRoomChange(redirectUrl)
			}
		}
	}

	const handleShowRoomChange = (url) => {
		showRoomChange.value = true
		redirectUrl.value = url
	}

	onMounted(() => {
		getChatRoomInfo()
	})
</script>

<style lang="scss" scoped></style>
