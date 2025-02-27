<template>
	<van-popup
		:show="show"
		position="bottom"
		@click-overlay="toggle"
		class="send-popup"
		:class="config.classNames"
		:z-index="config.zIndex"
		@open="onOpen"
	>
		<EmojiPicker v-show="showEmoji" class="w-full!" @select="selectEmoji" />
		<div class="flex-center p-10">
			<div class="bg-#F2F2F2 rounded-999 flex-center h-40 px-10 flex-1">
				<input
					type="text"
					v-model="text"
					class="color-#434343 pl-10 bg-#F2F2F2 flex-1"
					autocomplete="off"
				/>
				<SvgIcon
					class="cursor-pointer"
					size="1.875rem"
					name="icon_VoiceChatRoom_Emoticons"
					@click="showEmoji = !showEmoji"
				/>
				<div
					class="w-60 h-30 lh-30 text-16 color-#fff bg-#34C759 rounded-999 text-center ml-4 flex-center"
					@click="doSend"
				>
					<van-loading
						type="spinner"
						color="#fff"
						size=".9rem"
						v-if="loading"
					/>
					<span v-else>发送</span>
				</div>
			</div>
			<!-- <SvgIcon
				class="cursor-pointer ml-4"
				size="1.875rem"
				name="icon_VoiceChatRoom_picture"
				@click="showFiles = !showFiles"
				v-show="config.showAttach"
			/> -->
		</div>

		<van-uploader
			:after-read="afterRead"
			class="p-10"
			v-show="showFiles"
			v-model="fileList"
			:max-count="1"
			:before-read="beforeRead"
		/>
	</van-popup>
</template>

<script setup>
	import { useSendStore } from '@/stores/send.js'
	import { storeToRefs } from 'pinia'
	import EmojiPicker from '@/components/EmojiPicker/index.vue'
	import { ref, watch, nextTick } from 'vue'
	import { isBlank, toast, isLogin, isFileAccept } from '@/modules/util.js'
	import { replyPost } from '@/api/bbs.js'
	import { useLoginPopupStore } from '@/stores/loginPopup.js'
	import { uploadSingleFile } from '@/api/material.js'

	const sendStore = useSendStore()
	const { toggle } = sendStore
	const { show, config } = storeToRefs(sendStore)
	const showEmoji = ref(false)
	const text = ref('')
	const showFiles = ref(false)
	const fileList = ref([])
	const loading = ref(false)

	watch(show, (value) => {
		if (!value) reset()
	})

	watch(showEmoji, async (value) => {
		if (value) {
			await nextTick()
			try {
				document
					.querySelector('.v3-body-inner')
					.scroll({ top: 0, behavior: 'instant' })
			} catch (e) {}
		}
	})

	function selectEmoji({ i }) {
		text.value += i
	}

	function reset() {
		text.value = ''
		setTimeout(() => {
			showEmoji.value = false
			fileList.value = []
			showFiles.value = false
		}, 300)
	}

	function afterRead() {}

	async function doSend() {
		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return
		}

		if (isBlank(text.value)) {
			toast('请输入评论内容')
			return
		}

		// if (sendStore.config.textRequired) {
		// 	if (isBlank(text.value)) {
		// 		toast('请输入评论内容')
		// 		return
		// 	}
		// }

		// if (isBlank(text.value) && fileList.value.length == 0) {
		// 	toast('请输入评论内容或上传图片')
		// 	return
		// }

		loading.value = true
		let path = null
		if (fileList.value.length > 0) {
			const res = await uploadSingleFile(fileList.value[0])
			if (!_get(res, 'success')) {
				loading.value = false
				return
			}
			path = _get(res, 'data.path')
		}

		const attachments = []
		if (path) attachments.push({ fileType: 'p', url: path })
		await sendStore
			.doSend({
				text: text.value,
				attachments,
			})
			.finally(() => (loading.value = false))
	}

	async function onOpen() {
		await nextTick()
		document.querySelector('.send-popup').style.bottom = config.value.bottom
	}

	function beforeRead({ name }) {
		if (!isFileAccept(name)) {
			toast('不支持此档案类型')
			return false
		}
		return true
	}
</script>

<style lang="scss" scoped>
	.send-popup {
		:deep(.van-uploader__preview-delete) {
			width: 1.25rem;
			height: 1.25rem;
			background-color: #aeaeb1;
			border-radius: 50%;
			top: -0.3rem;
			right: -0.3rem;
		}
		:deep(.van-uploader__preview-delete-icon) {
			font-size: 0.9rem;
			top: 50%;
			left: 50%;
			right: unset;
			transform: translate(-50%, -50%);
		}
	}
</style>
