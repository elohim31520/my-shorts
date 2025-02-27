<template>
	<div
		class="messages h-full flex flex-col justify-between overflow-y-scroll px-15 pb-65 relative"
		:class="dynamicClasses"
		ref="scrollContainerRef"
	>
		<div
			v-if="roomData.isOwner"
			class="w-330 bg-#fff py-38.5 mx-auto text-center"
		>
			<p class="color-#656565 font-600 mb-5">群聊创建成功</p>
			<p class="color-#AEAEB1 font-500 text-14 mb-40">
				恭喜你建群成功，点击下方按钮邀请更多好友入群
			</p>
			<div class="flex justify-evenly text-center font-600 text-18">
				<div
					class="w-120 lh-40 bd-#34C759 bg-#F1FEE6 rounded-8 color-#34C759"
					@click="showInvite = true"
				>
					邀请好友
				</div>
				<div
					class="w-120 lh-40 bg-#34C759 rounded-8 color-#fff"
					@click="handleIncreaseChatRoomHeat"
				>
					热门推荐
				</div>
			</div>
		</div>
		<div v-else></div>
		<ul>
			<li
				v-for="(message, index) in processedMessage"
				:key="index"
				class="mt-15"
			>
				<component :is="messageMap[message.code]" :message="message" />
			</li>
		</ul>
	</div>
</template>

<script setup>
	import {
		ref,
		computed,
		watch,
		onMounted,
		nextTick,
		inject,
		defineExpose,
		useTemplateRef,
	} from 'vue'
	import EnterRoom from './EnterRoom/index.vue'
	import Text from './Text/index.vue'
	import Image from './Image/index.vue'
	import Picture from './Picture/index.vue'
	import Lottery from './Lottery/index.vue'
	import Creation from './Creation/index.vue'
	import TextWithUrl from './TextWithUrl/index.vue'
	import Invite from './Invite/index.vue'
	import { increaseChatRoomHeatApi } from '@/api/chatRoom'
	import { toast, getOrDefault, delay } from '@/modules/util'
	import { SERVER_CODES, MESSAGE_TYPES } from '@/constants/chat'
	import { useRoomData } from '../useRoomData'
	import { useDisplayStates } from '../useDisplayStates'

	const scrollContainerRef = useTemplateRef('scrollContainerRef')

	const messageScrollController = inject('messageScrollController')

	const processedMessage = computed(() =>
		_filter(roomData.messages, (message) => messageKeys.includes(message.code))
	)

	const { roomData } = useRoomData()
	const { showMenu, showUploader, showInvite } = useDisplayStates()

	const dynamicClasses = computed(() => {
		if (showUploader.value && showMenu.value) return 'bottom-150 pt-205'
		if (showMenu.value) return 'bottom-50 pt-105'
		return 'pt-55'
	})

	watch([showMenu, showUploader], async () => {
		const { scrollToBottom, scrollTopFromBottom } = messageScrollController

		await nextTick()
		scrollToBottom(true, scrollTopFromBottom)
	})

	const messageMap = {
		[SERVER_CODES.USER_ENTER_ROOM]: EnterRoom,
		[MESSAGE_TYPES.TEXT]: Text,
		[MESSAGE_TYPES.IMAGE]: Image,
		[MESSAGE_TYPES.PICTURE]: Picture,
		[MESSAGE_TYPES.LOTTERY]: Lottery,
		[MESSAGE_TYPES.CREATION]: Creation,
		[MESSAGE_TYPES.TEXT_WITH_URL]: TextWithUrl,
		[MESSAGE_TYPES.INVITE]: Invite,
	}

	const messageKeys = _map(_keys(messageMap), Number)

	const handleIncreaseChatRoomHeat = async () => {
		const { roomId } = roomData
		const response = await increaseChatRoomHeatApi({ roomId })
		const success = getOrDefault(response, 'success', false)

		if (success) toast('以推荐此聊天室，30分钟后才能在上热门推荐')
	}

	defineExpose({
		scrollContainerRef,
	})
</script>

<style lang="scss" scoped>
	.messages {
		@include scrollbar-hidden;
	}
</style>
