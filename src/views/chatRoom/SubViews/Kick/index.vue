<template>
	<div class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full max-w-480px">
		<NormalHeader
			title="移出本聊天室"
			:onBack="
				() => {
					showKick = false
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
				@input="handleInput"
				placeholder="搜寻成员"
				clearable
				autocomplete="off"
			>
				<template #left-icon>
					<SvgIcon size="1.875rem" name="icon_button_Query" class="mr-6" />
				</template>
			</van-field>
		</div>

		<!-- 用戶列表 -->
		<van-list finished finished-text="没有更多了" class="pt-95 pb-60">
			<van-checkbox-group v-model="checked">
				<div
					v-for="(member, index) in filteredMembers"
					:key="index"
					class="relative"
				>
					<div class="mx-20 h-59.5 flex-y-center bb-#F2F2F2">
						<van-checkbox :name="member" class="w-full">
							<template #icon="props">
								<template v-if="props.checked">
									<SvgIcon
										size="1.375rem"
										name="icon_choose_rad"
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
										:path="member.avatar"
										round
										width="1.875rem"
										height="1.875rem"
										fit="cover"
										position="center"
										class="mr-10"
										error-icon="/public-assets/images/svg/default_avatar_man.png"
									/>
									<!-- 用戶名稱和等級 -->
									<span class="color-#434343 text-18 font-600 mr-5">
										{{ member.nickname }}
									</span>

									<LevelTag :level="member.level" />
								</div>
							</div>
						</van-checkbox>
					</div>
				</div>
			</van-checkbox-group>
		</van-list>

		<!-- 底部確認移出按鈕 -->
		<div class="h-60 flex-center bg-#fff fixed bottom-0 w-full max-w-480px">
			<van-button :disabled="!checked.length" @click="handleKick">
				移出聊天室
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, watch, onMounted } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LevelTag from '@/components/LevelTag/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { getOrDefault } from '@/modules/util'
	import { kickUserApi } from '@/api/chatRoom'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const { roomData } = useRoomData()
	const { showKick } = useDisplayStates()

	const checked = ref([])
	const searchQuery = ref('')
	const debouncedSearchQuery = ref('')

	// 依據搜索條件篩選出的用戶列表
	const filteredMembers = computed(() => {
		// 排除房主
		const members = _filter(
			getOrDefault(roomData, 'presentUsers', {}),
			(member) => member.userId !== roomData.owner.userId
		)

		return _filter(members, (item) =>
			_includes(item.nickname, debouncedSearchQuery.value)
		)
	})

	// 處理輸入並添加防抖處理
	const handleInput = _debounce(() => {
		debouncedSearchQuery.value = searchQuery.value
	}, 300)

	async function handleKick() {
		// TODO 後端尚未提供批量踢除
		const userIds = _map(checked.value, 'userId')
		const { roomId } = roomData

		for (let index = 0; index < userIds.length; index++) {
			const userId = userIds[index]
			const response = await kickUserApi({ roomId, userId })
		}

		showKick.value = false
	}

	onMounted(() => {})
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
		background-color: #fc7e7e;
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
