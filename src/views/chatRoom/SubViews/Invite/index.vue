<template>
	<div class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full-limited">
		<NormalHeader
			title="邀请互关好友"
			:onBack="
				() => {
					showInvite = false
				}
			"
		/>

		<!-- 搜索框 -->
		<div
			class="h-50 fixed top-45 w-full max-w-480px flex-center z-10 bg-#fafafa px-10"
		>
			<van-field
				id="keyword"
				v-model="search"
				@input="handleInput"
				placeholder="搜寻互关的好友"
				clearable
				autocomplete="off"
			>
				<template #left-icon>
					<SvgIcon size="1.875rem" name="icon_button_Query" class="mr-6" />
				</template>
			</van-field>
		</div>

		<!-- 用戶列表 -->
		<van-list
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="handleLoad"
			class="pt-95 pb-60"
		>
			<van-checkbox-group v-model="checked">
				<div v-for="(member, index) in members" :key="index" class="relative">
					<div class="mx-20 h-59.5 flex-y-center bb-#F2F2F2">
						<van-checkbox :name="member" class="w-full">
							<template #icon="props">
								<template v-if="props.checked">
									<SvgIcon
										size="1.375rem"
										name="icon_Log_Checkbox_on"
										class="inline-block"
									/>
								</template>
								<template v-else>
									<div class="rounded-1/2 bd-#AEAEB1 w-22 h-22"></div>
								</template>
							</template>

							<!-- 用戶信息展示 -->
							<div class="flex-y-center justify-between">
								<div class="flex-y-center">
									<!-- 用戶頭像 -->
									<CdnImage
										:path="member.targetUserAvatar"
										round
										fit="cover"
										position="center"
										class="mr-10 w-30 h-30 shrink-0"
										error-icon="/public-assets/images/svg/default_avatar_man.png"
										:config="{ width: '1.875rem' }"
									/>
									<!-- 用戶名稱和等級 -->
									<span
										class="color-#434343 text-18 font-600 mr-5 truncate-1-lines"
									>
										{{ member.targetUserNickname }}
									</span>

									<LevelTag :level="member.targetUserVipLevel" />
								</div>
								<span class="text-12 color-#AEAEB1 mr-6 shrink-0">
									互相关注
								</span>
							</div>
						</van-checkbox>
					</div>

					<!-- 已被邀請的用戶遮罩 -->
					<!-- <div
						class="h-full w-full bg-#E0E0E080 absolute top-0 opacity-50"
					></div> -->
				</div>
			</van-checkbox-group>
		</van-list>

		<!-- 底部確認邀請按鈕 -->
		<div class="h-60 flex-center bg-#fff fixed bottom-0 w-full max-w-480px">
			<van-button :disabled="!checked.length" @click="handleInvite">
				邀请加入
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive, nextTick, computed, watch } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LevelTag from '@/components/LevelTag/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { getFollowFans as getFollowFansApi } from '@/api/daniu'
	import { inviteToChatRoomApi } from '@/api/chatRoom'
	import { getOrDefault, toast } from '@/modules/util'
	import { ROOM_TYPES, MESSAGE_TYPES } from '@/constants/chat'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const { roomData } = useRoomData()
	const { showInvite } = useDisplayStates()

	const search = ref('')
	const checked = ref([])
	const loading = ref(false)
	const finished = ref(false)

	const members = reactive([])

	const pageSize = 10
	let pageIndex = 1

	async function handleLoad() {
		// TODO 後端尚未提供暱稱模糊搜尋功能
		const response = await getFollowFansApi({
			businessType: window._global.clientType,
			relationFlag: 2,
			direct: 1,
			page: pageIndex,
			size: pageSize,
		})

		const list = getOrDefault(response, 'data.list', [])
		const total = getOrDefault(response, 'data.total', 0)

		members.push(...list)
		loading.value = false
		pageIndex++

		// 判斷是否已加載完所有資料
		if (members.length >= total) {
			finished.value = true
		}
	}

	async function refresh() {
		members.length = 0
		await nextTick()
		finished.value = false
		pageIndex = 1
	}

	// 處理輸入並添加防抖處理
	const handleInput = _debounce(refresh, 500)

	async function handleInvite() {
		const userIds = _map(checked.value, 'targetUserId')
		const nicknames = _map(checked.value, 'targetUserNickname')

		const { roomId, title } = roomData
		const response = await inviteToChatRoomApi({
			invitedUserIds: userIds,
			roomId,
			type: ROOM_TYPES.CHAT,
			title,
		})
		const success = getOrDefault(response, 'success', false)

		if (success) {
			toast('成功邀请')
			_forEach(nicknames, (nickname) => {
				roomData.messages.push({
					code: MESSAGE_TYPES.INVITE,
					data: { nickname },
				})
			})

			showInvite.value = false
		}
	}
</script>

<style lang="scss" scoped>
	.van-field {
		width: 100%;
		line-height: 1.875rem;
		padding: 0 0.625rem;
		background-color: #f2f2f2;
		border-radius: 0.9375rem;
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
	}

	.van-button--disabled {
		background-color: #f2f2f2;
		color: #aeaeb1;
		opacity: 1;
	}

	:deep() {
		.van-field__control {
			&::placeholder {
				color: #aeaeb1;
			}
		}

		input {
			font-size: 1rem;
		}

		.van-checkbox__label {
			margin-left: 0;
			width: 100%;
		}

		.van-checkbox__icon {
			height: auto;
			margin-right: 0.625rem;
		}
	}
</style>
