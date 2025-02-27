<template>
	<div class="fixed bottom-0 w-full z-5 max-w-480px bg-#fff">
		<!-- 表情選擇器 -->
		<EmojiPicker
			ref="emojiPickerRef"
			v-show="showEmojiPicker"
			@select="handleSelectEmoji"
			class="w-full! bt-#ddd"
		/>

		<!-- 文字輸入區域 -->
		<div class="h-60 flex-y-center justify-between px-10">
			<van-field
				id="message"
				ref="inputRef"
				v-model="message"
				placeholder="聊点什么..."
				class="mr-7.5"
				autocomplete="off"
				v-permission:keydown.enter
				@keydown.enter.prevent="handleKeyDown"
			>
				<template #right-icon>
					<div class="flex">
						<SvgIcon
							name="icon_VoiceChatRoom_Emoticons"
							size="1.875rem"
							@click="showEmojiPicker = !showEmojiPicker"
							class="mr-5"
						/>
						<div
							class="w-60 lh-30 text-center text-16 rounded-15 bg-primary color-#fff"
							v-permission
							@click="handleSend"
						>
							发送
						</div>
					</div>
				</template>
			</van-field>
			<SvgIcon
				size="1.875rem"
				name="icon_message_More"
				class="shrink-0"
				:class="[showMenu ? 'color-primary' : 'color-#434343']"
				@click="toggleShowMenu"
			/>
		</div>

		<van-uploader
			v-show="showUploader"
			v-model="fileList"
			:preview-full-image="!isDragging"
			:after-read="afterRead"
			:max-count="10"
			:before-read="beforeRead"
			multiple
		>
			<SvgIcon size="4.375rem" name="icon_Upphotos" />
			<template #preview-delete>
				<SvgIcon size="1.25rem" name="icon_Input_box_cancel" />
			</template>
		</van-uploader>

		<ul
			v-show="showMenu"
			class="flex-y-center justify-evenly px-47.375 h-50 font-600 text-14 color-#656565"
		>
			<!-- PM說相冊先不開放 -->
			<!-- <li
				class="flex-center flex-col w-50"
				:class="{ ' color-primary': showUploader }"
				v-permission
				@click="showUploader = !showUploader"
			>
				<SvgIcon
					size="1.375rem"
					name="icon_VoiceChatRoom_picture"
					class="mb-2"
				/>
				<span>相册</span>
			</li> -->
			<li
				class="flex-center flex-col w-50"
				v-permission
				@click="showCreation = true"
			>
				<SvgIcon size="1.375rem" name="icon_ruleon" class="mb-2" />
				<span>创作</span>
			</li>
			<li
				class="flex-center flex-col w-50"
				v-permission
				@click="showPicture = true"
			>
				<SvgIcon
					size="1.375rem"
					name="icon_VoiceChatRoom_explain"
					class="mb-2"
				/>
				<span>图纸</span>
			</li>
			<li
				class="flex-center flex-col w-50"
				v-permission
				@click="showLottery = true"
			>
				<SvgIcon
					size="1.375rem"
					name="icon_VoiceChatRoom_Historicallottery"
					class="mb-2"
				/>
				<span>开奖</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
	import { ref, watch, computed, onMounted, inject } from 'vue'
	import { useEventListener } from '@vueuse/core'
	import EmojiPicker from '@/components/EmojiPicker/index.vue'
	import { getOrDefault, isFileAccept } from '@/modules/util'
	import { uploadSingleFile } from '@/api/material'
	import { useWebSocket } from '@/hooks/useChatWebSocket'
	import { useDragScroll } from '@/hooks/useDragScroll'
	import { useRoomData } from '../useRoomData'
	import { useDisplayStates } from '../useDisplayStates'
	import { CLIENT_CODES, MESSAGE_TYPES } from '@/constants/chat'
	import { UPLOAD_FROM } from '@/constants/upload'
	import isURL from 'validator/lib/isURL'

	const { roomData } = useRoomData()
	const { showCreation, showPicture, showLottery, showMenu, showUploader } =
		useDisplayStates()
	const { send } = useWebSocket()
	const { isDragging } = useDragScroll('.van-uploader')

	const message = ref('')
	const fileList = ref([])
	const showEmojiPicker = ref(false)
	const inputRef = ref()
	const emojiPickerRef = ref()

	const vPermission = inject('vPermission')

	const urlRegex = /(https?:\/\/[^\s]+)/g

	watch(showUploader, (newValue) => {
		if (!newValue) fileList.value = []
	})

	// 發送消息函數
	async function handleSend() {
		const { roomId, self } = roomData

		// TODO 臨時放的，發送圖片另有按鈕？
		if (fileList.value.length) {
			while (fileList.value.length) {
				const file = fileList.value.shift()
				const response = await uploadSingleFile(
					file,
					UPLOAD_FROM.CHAT_MESSAGE_IMG
				)
				const success = getOrDefault(response, 'success', false)
				const path = getOrDefault(response, 'data.path', '')

				if (success && path) {
					const data = {
						code: CLIENT_CODES.SEND_MESSAGE,
						roomId,
						type: MESSAGE_TYPES.IMAGE,
						userId: self.userId,
						msg: path,
					}
					send(data)
				}
			}
		} else {
			if (message.value) {
				const validUrls = getValidUrls(message.value)

				if (_isEmpty(validUrls)) {
					// 一般文本
					const data = {
						code: CLIENT_CODES.SEND_MESSAGE,
						roomId,
						type: MESSAGE_TYPES.TEXT,
						userId: self.userId,
						msg: message.value,
					}
					send(data)
				} else {
					// 包含 URL 的文本
					const data = {
						code: CLIENT_CODES.SEND_MESSAGE,
						roomId,
						type: MESSAGE_TYPES.TEXT_WITH_URL,
						userId: self.userId,
						msg: {
							message: message.value,
							urls: validUrls,
						},
					}
					send(data)
				}

				message.value = ''
				inputRef.value.focus()
				showEmojiPicker.value = false
			}
		}
	}

	// 處理表情選擇
	function handleSelectEmoji(emoji) {
		message.value += emoji.i
	}

	function handleKeyDown(event) {
		if (event.isComposing) return
		handleSend()
	}

	function toggleShowMenu() {
		showMenu.value = !showMenu.value
		showUploader.value = false
	}

	function afterRead() {}

	function beforeRead(file) {
		const files = _isArray(file) ? file : [file]

		_forEach(files, ({ name }) => {
			if (!isFileAccept(name)) {
				toast('不支持此档案类型')
				return false
			}
		})
		return true
	}

	function handleClickOutside() {
		const isClickInsideTarget = (target) => {
			return (
				(inputRef.value && inputRef.value.$el.contains(target)) ||
				(emojiPickerRef.value && emojiPickerRef.value.$el.contains(target))
			)
		}

		useEventListener(document, 'click', (event) => {
			const clickedElement = event.target
			if (!isClickInsideTarget(clickedElement)) {
				showEmojiPicker.value = false
			}
		})
	}

	function getValidUrls(message) {
		const extractedUrls = message.match(urlRegex)

		return _filter(extractedUrls, (url) => isURL(url, { require_tld: false }))
	}

	onMounted(() => {
		handleClickOutside()
	})
</script>

<style lang="scss" scoped>
	.van-field {
		width: 100%;
		line-height: 2.5rem;
		padding: 0 0.625rem;
		background-color: #f2f2f2;
		border-radius: 1.25rem;
	}

	:deep() {
		.van-field__control {
			font-size: 1rem;

			&::placeholder {
				font-size: 1rem;
				color: #aeaeb1;
			}
		}

		.van-action-sheet__header {
			font-size: 1.25rem;
			border-bottom: 0.0625rem solid #f2f2f2;
		}

		.van-action-sheet__close {
			font-size: 1.375rem;
			color: #434343;
		}

		.van-uploader {
			height: 6.25rem;
			width: 100%;
			max-width: 480px;
			padding: 0 0.9375rem;
			display: flex;
			align-items: center;
			overflow-x: scroll;
			@include scrollbar-hidden;
		}

		.van-uploader__wrapper {
			flex-wrap: nowrap;
		}

		.van-uploader__preview {
			width: 4.375rem;
			height: 4.375rem;
			margin: 0;
			margin-right: 0.9375rem;
		}

		.van-uploader__preview-image {
			width: 4.375rem;
			height: 4.375rem;
			border-radius: 0.5rem;

			img {
				-webkit-user-drag: none;
			}
		}

		.van-uploader__preview-delete {
			top: -0.3125rem;
			right: -0.3125rem;
		}
	}
</style>
