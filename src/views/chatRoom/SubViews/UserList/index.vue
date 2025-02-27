<template>
	<div class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full max-w-480px">
		<NormalHeader
			:title="`聊天室成员(${totalText})`"
			:onBack="
				() => {
					showUserList = false
				}
			"
		/>

		<!-- 搜索框 -->
		<div
			class="h-50 fixed top-45 w-full max-w-480px flex-center z-10 bg-#fafafa px-10"
		>
			<van-field
				id="keyword"
				v-model="searchQuery"
				placeholder="搜寻聊天室成员"
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
			class="pt-95 pb-60"
			@load="handleLoad"
		>
			<div v-for="(user, index) in users" :key="index" class="relative">
				<div
					class="mx-20 h-59.5 flex-y-center bb-#F2F2F2 relative"
					v-if="user.isPresent"
				>
					<!-- 用戶信息展示 -->
					<div class="flex-y-center justify-between w-full">
						<div class="flex-y-center w-full">
							<!-- 用戶頭像 -->
							<div class="relative">
								<Avatar class="w-30 h-30 mr-10" :user="user" />
								<div
									v-if="user.isOwner"
									class="w-30 h-15 flex-center bg-primary color-#fff rounded-7.5 absolute -bottom-10"
								>
									<span class="text-mini-10">房主</span>
								</div>
							</div>
							<!-- 用戶名稱和等級 -->
							<span
								class="color-#434343 text-18 font-600 mr-5 truncate-1-lines"
							>
								{{ user.nickname || `游客 ${user.userId}` }}
							</span>

							<LevelTag :level="user.level" />

							<!-- 僅房主會顯示踢出的操作 -->
							<template v-if="roomData.isOwner">
								<div
									v-if="!user.isOwner"
									class="w-48 lh-25 text-14 bg-#FC7E7E color-#fff rounded-12.5 text-center shrink-0 ml-a"
									@click="handleKick(user)"
								>
									踢出
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>
		</van-list>

		<div class="fixed bottom-0 flex-center h-60 w-full-limited">
			<van-button
				@click="
					() => {
						showInvite = true
						showUserList = false
					}
				"
			>
				邀请好友
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive, computed, watch, onMounted } from 'vue'
	import { getChatRoomUsersApi, kickUserApi } from '@/api/chatRoom'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LevelTag from '@/components/LevelTag/index.vue'
	import Avatar from '../../Avatar/index.vue'
	import { getOrDefault, toast, confirmDialog } from '@/modules/util'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const { roomData, missingUserIds } = useRoomData()
	const { showUserList, showInvite } = useDisplayStates()

	const loading = ref(false)
	const finished = ref(false)
	const searchQuery = ref('')
	const totalText = ref(0)

	const users = reactive([])

	const pageSize = 20
	let pageIndex = 1

	watch(
		searchQuery,
		_debounce((newValue) => {
			users.length = 0
			pageIndex = 1
			finished.value = false
		}, 600)
	)

	async function handleKick(user) {
		await confirmDialog('请确认将此用户移出')

		const { userId } = user
		const { roomId } = roomData
		const response = await kickUserApi({ roomId, userIds: [userId] })
		const success = getOrDefault(response, 'success', false)

		if (success) {
			user.isPresent = false
			toast('操作成功')
		}
	}

	const handleLoad = async () => {
		const { roomId, members } = roomData
		// 獲取房間內用戶ID
		const response = await getChatRoomUsersApi({
			roomId,
			nickname: searchQuery.value,
			page: pageIndex,
			size: pageSize,
		})
		const list = getOrDefault(response, 'data.list', [])
		const total = getOrDefault(response, 'data.total', 0)
		const userIds = _map(list, 'userId')

		totalText.value = total
		missingUserIds.push(...userIds)
		users.push(..._values(_pick(members, userIds)))
		loading.value = false
		pageIndex++

		// 判斷是否已加載完所有資料
		if (users.length >= total) {
			finished.value = true
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
		color: #fff;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
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
