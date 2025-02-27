<template>
	<div class="h-auto pb-60">
		<div class="max-w-480px mx-auto">
			<NormalHeader title="创建聊天室" :onBack="onBack" />

			<div class="px-10 pt-65">
				<!-- 語音房名稱 -->
				<div class="shadow-[0_0_0.5rem_0_#0000001A] mb-10 rounded-10">
					<van-field
						v-model="roomName"
						maxlength="18"
						placeholder="请输入聊天室名称"
						show-word-limit
						label-align="top"
						autocomplete="off"
						class="rounded-10 creation-title__field"
					>
						<template #label>
							<div class="flex-y-center justify-between w-full color-#434343">
								<span class="text-16 relative">
									聊天室名称:
									<span
										class="text-12 tracking-2% font-600 color-#FC7E7E absolute right--12 top--5px"
									>
										＊
									</span>
								</span>
								<div class="flex-y-center" @click="generateRandomName">
									<SvgIcon
										name="Refresh2"
										size="1.25rem"
										color="#96b5ff"
										class="mr-5"
									/>
									<span class="text-14">随机名称</span>
								</div>
							</div>
						</template>
					</van-field>
				</div>

				<!-- 語音房簡介 -->
				<div class="shadow-[0_0_0.5rem_0_#0000001A] rounded-10 mb-30">
					<van-field
						v-model="roomDescription"
						maxlength="100"
						placeholder="欢迎大家加入聊天室，畅所欲言！"
						show-word-limit
						rows="1"
						autosize
						type="textarea"
						label-align="top"
						class="rounded-10"
						autocomplete="off"
					>
						<template #label>
							<div class="flex-y-center justify-between w-full">
								<div class="text-16">聊天室简介:</div>
							</div>
						</template>
					</van-field>
				</div>

				<!-- 創建語音房按鈕 -->
				<div
					class="w-300 lh-40 bg-primary color-#fff text-center rounded-8 mx-auto mb-50"
					@click="createRoom"
				>
					创建聊天室
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { useScrollLock } from '@vueuse/core'

	import { createChatRoomApi, getRandomChatRoomNameApi } from '@/api/chatRoom'
	import { useUserStore } from '@/stores/user'
	import { redirect, toast } from '@/modules/util'
	import { ROOM_PATHS, ROOM_TYPES } from '@/constants/chat'

	const lockScroll = useScrollLock(document.body)
	const userStore = useUserStore()
	const { data: userData } = userStore

	const emits = defineEmits(['close'])

	const roomName = ref('')
	const roomDescription = ref('')
	const isPeinding = ref(false)

	// 生成隨機房名
	function generateRandomName() {
		getRandomChatRoomNameApi(ROOM_TYPES.CHAT).then((res) => {
			roomName.value = _get(res, 'data', '')
		})
	}

	const onBack = () => {
		emits('close')
	}

	async function createRoom() {
		if (isPeinding.value) return
		isPeinding.value = true

		try {
			if (!roomName.value) {
				toast(`请填写聊天室名称`)
				return
			}

			const createRoomRes = await createChatRoomApi({
				type: ROOM_TYPES.CHAT,
				userId: userData.userId,
				title: roomName.value, // 房名
				note: roomDescription.value, //简介
				nickname: userData.nickname,
			})

			if (createRoomRes.success) {
				const roomId = _get(createRoomRes, 'data')
				redirect(`/${ROOM_PATHS.CHAT_ROOM}/${roomId}`)
			}
		} finally {
			isPeinding.value = false
		}
	}

	onMounted(() => {
		lockScroll.value = true // 禁用滚动
	})

	onBeforeUnmount(() => {
		lockScroll.value = false // 恢复滚动
	})
</script>

<style lang="scss" scoped>
	.van-field {
		padding: 0.625rem;
	}

	:deep() {
		.van-field__label {
			margin-bottom: 0.625rem;
		}

		.creation-title__field .van-field__value {
			display: flex;
			justify-content: space-between;
			.van-field__body {
				flex: 1;
			}
		}

		.van-field__word-limit {
			color: #aeaeb1;
			font-size: 0.875rem;
		}

		input,
		textarea {
			font-size: 1rem;
		}

		textarea {
			height: 13.1875rem !important;
		}
	}
</style>
