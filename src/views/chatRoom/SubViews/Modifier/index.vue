<template>
	<div class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full-limited pt-65">
		<NormalHeader
			title="聊天室资料"
			:onBack="
				() => {
					showModifier = false
				}
			"
		></NormalHeader>

		<FourQuadrantAvatar
			class="h-100 w-100 mx-auto mb-20"
			:images="userAvatars"
		/>

		<div class="px-10">
			<!-- 聊天室名稱 -->
			<div class="shadow-[0_0_0.5rem_0_#0000001A] mb-10 rounded-10">
				<van-field
					v-model="roomTitle"
					maxlength="18"
					placeholder="请输入聊天室名称"
					show-word-limit
					label-align="top"
					autocomplete="off"
					class="rounded-10 creation-title__field"
				>
					<template #label>
						<div class="flex-y-center justify-between w-full color-#434343">
							<span class="text-16">聊天室名称:</span>
							<div class="flex-y-center" @click="generateRandomTitle">
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

			<!-- 聊天室簡介 -->
			<div class="shadow-[0_0_0.5rem_0_#0000001A] rounded-10 mb-24.5">
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

			<!-- 保存聊天室按鈕 -->
			<van-button
				class="w-full"
				:loading="loading"
				:disabled="disabled || loading"
				@click="handleUpdateRoom"
			>
				保存
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import FourQuadrantAvatar from '@/components/FourQuadrantAvatar/index.vue'
	import { getPictureSeriesApi } from '@/api/picture'
	import { getRandomChatRoomNameApi, updateChatRoomApi } from '@/api/chatRoom'
	import { getOrDefault, toast } from '@/modules/util'
	import { ROOM_TYPES } from '@/constants/chat'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const { roomData } = useRoomData()
	const { showModifier } = useDisplayStates()

	const roomTitle = ref(getOrDefault(roomData, 'title', ''))
	const roomDescription = ref(getOrDefault(roomData, 'note', ''))
	const loading = ref(false)

	const disabled = computed(() => !roomTitle.value)
	const userAvatars = computed(() => {
		// 只取前四個
		return _slice(_map(_values(roomData.earliestOnlineUsers), 'avatar'), 0, 4)
	})

	// 生成隨機房名
	async function generateRandomTitle() {
		const response = await getRandomChatRoomNameApi(ROOM_TYPES.CHAT)

		roomTitle.value = getOrDefault(response, 'data', '')
	}

	async function handleUpdateRoom() {
		loading.value = true
		const roomId = getOrDefault(roomData, 'roomId', '')
		const response = await updateChatRoomApi({
			roomId,
			title: roomTitle.value,
			note: roomDescription.value,
		})
		const success = getOrDefault(response, 'success', false)

		if (success) {
			toast('保存成功')
			loading.value = false
			showModifier.value = false
		} else {
			loading.value = true
		}
	}
</script>

<style lang="scss" scoped>
	.van-field {
		padding: 0.625rem;
	}

	.van-button {
		width: 18.75rem;
		height: 2.5rem;
		background-color: #34c759;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
		color: #fff;
		position: fixed;
		bottom: 0.625rem;
		left: 50%;
		transform: translateX(-50%);
	}

	.van-button--disabled {
		background-color: #f2f2f2;
		color: #aeaeb1;
		opacity: 1;
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
			height: 12.25rem !important;
		}
	}
</style>
