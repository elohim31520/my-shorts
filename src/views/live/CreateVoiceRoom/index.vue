<template>
	<div class="h-auto pb-60">
		<div class="max-w-480px mx-auto">
			<NormalHeader title="创建语音房" :onBack="onBack" />
			<p class="pt-65 px-10 font-600 text-18 mb-12 color-#434343">
				<span class="relative">
					选择平台:
					<span
						class="text-12 tracking-2% font-600 color-#FC7E7E absolute right--12"
					>
						＊
					</span>
				</span>
			</p>
			<LotteryTypes class="mb-12" />

			<div class="px-10">
				<!-- 語音房系列 -->
				<div
					class="mb-10 flex-y-center text-16 shadow-[0_0_0.5rem_0_#0000001A] rounded-10 p-10 bg-#fff"
					@click="showSeriesSelector = true"
				>
					<span class="color-#434343 mr-5 relative">
						语音房关联系列:
						<span
							class="text-12 tracking-2% font-600 color-#FC7E7E absolute right--12 top--5px"
						>
							＊
						</span>
					</span>
					<span
						class="color-primary mr-5 ml-auto font-600"
						v-if="selectedSeries"
					>
						{{ selectedSeries.seriesName }}
					</span>
					<SvgIcon name="arrow_right" size="1.5625rem" />
				</div>

				<!-- 选择图纸 -->
				<div
					class="mb-10 flex-y-center text-16 shadow-[0_0_0.5rem_0_#0000001A] rounded-10 p-10 bg-#fff"
					@click="showPictureSelector = true"
				>
					<span class="color-#434343 mr-5">选择图纸:</span>
					<span
						class="color-primary mr-5 ml-auto font-600"
						v-if="selectedPicture"
					>
						{{ selectedPicture.newspaperName }}
					</span>
					<span class="color-#AEAEB1 mr-5 ml-auto" v-else>请选择</span>
					<SvgIcon name="arrow_right" size="1.5625rem" />
				</div>

				<div
					class="font-600 text-12 lh-16 color-#FC7E7E mb-10 text-right pr-10"
					v-if="selectedPicture.newspaperName"
					@click="clearPicture"
				>
					清除
				</div>

				<!-- 語音房名稱 -->
				<div class="shadow-[0_0_0.5rem_0_#0000001A] mb-10 rounded-10">
					<van-field
						v-model="roomName"
						maxlength="18"
						:placeholder="'请输入语音房名称'"
						show-word-limit
						label-align="top"
						autocomplete="off"
						class="rounded-10 creation-title__field"
					>
						<template #label>
							<div class="flex-y-center justify-between w-full color-#434343">
								<span class="text-16 relative">
									语音房名称:
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

				<!-- 語音房密碼: 暫時關閉 -->
				<div
					class="shadow-[0_0_0.5rem_0_#0000001A] mb-10 rounded-10"
					v-if="false"
				>
					<van-field
						v-model="roomPassword"
						maxlength="18"
						placeholder="请输入房间密码"
						show-word-limit
						label-align="top"
						class="rounded-10 creation-title__field"
						autocomplete="off"
					>
						<template #label>
							<div class="flex-y-center justify-between w-full color-#434343">
								<span class="text-16">语音房密码:</span>
							</div>
						</template>
					</van-field>
				</div>

				<!-- 語音房簡介 -->
				<div class="shadow-[0_0_0.5rem_0_#0000001A] rounded-10 mb-30">
					<van-field
						v-model="roomDescription"
						maxlength="100"
						placeholder="欢迎大家加入语音房，多多交流！"
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
								<div class="text-16">语音房简介:</div>
							</div>
						</template>
					</van-field>
				</div>

				<!-- 創建語音房按鈕 -->
				<div
					class="w-300 lh-40 bg-primary color-#fff text-center rounded-8 mx-auto mb-50"
					@click="createRoom"
				>
					创建语音房
				</div>
			</div>

			<PictureSeriesSelector
				v-model="showSeriesSelector"
				:lotteryType="lotteryType"
				@confirmSelection="confirmSeriesSelection"
			/>

			<PictureSelector
				v-model:show="showPictureSelector"
				@pictureSelected="updateSelectedPicture"
				:picture="selectedPicture"
				:initialSeriesCode="selectedSeries.seriesCode"
			/>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount, watch, onBeforeMount } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useScrollLock } from '@vueuse/core'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import PictureSeriesSelector from '@/components/PictureSeriesSelector/index.vue'
	import PictureSelector from '@/components/PictureSelector/index.vue'

	import { useLotteryStore } from '@/stores/lottery'
	import { createChatRoomApi, getRandomChatRoomNameApi } from '@/api/chatRoom'
	import { useUserStore } from '@/stores/user'
	import { redirect, toast, getLotteryCode } from '@/modules/util'
	import { useSelector } from '@/components/PictureSelector/useSelector'
	import { usePictureSeries } from '@/hooks/usePictureSeries'
	import { ROOM_PATHS, ROOM_TYPES } from '@/constants/chat'

	const lockScroll = useScrollLock(document.body)
	const { lotteryType } = storeToRefs(useLotteryStore())
	const { setLotteryType } = useLotteryStore()
	const userStore = useUserStore()
	const { data: userData } = userStore
	const { selectedPicture: selectedPic } = useSelector()
	const { cacheSeries, fetchSeries } = usePictureSeries()

	const emits = defineEmits(['close'])

	const roomName = ref('')
	const roomPassword = ref('')
	const roomDescription = ref('')

	const showSeriesSelector = ref(false)
	const isPeinding = ref(false)
	const showPictureSelector = ref(false)
	const selectedPicture = ref({})
	const selectedSeries = ref({})
	const noRefresh = ref(false)

	// 生成隨機房名
	function generateRandomName() {
		getRandomChatRoomNameApi(ROOM_TYPES.VOICE).then((res) => {
			roomName.value = _get(res, 'data', '')
		})
	}

	const onBack = () => {
		emits('close')
	}

	const updateSelectedPicture = (data) => {
		selectedPicture.value = data.picture
		selectedSeries.value = data.series
		noRefresh.value = true
		setLotteryType(data.lotteryType)
		_delay(() => {
			noRefresh.value = false
		}, 50)
	}

	async function createRoom() {
		if (isPeinding.value) return
		isPeinding.value = true

		try {
			if (!selectedSeries.value.seriesCode) {
				toast('请选择系列')
				return
			}
			if (!roomName.value) {
				toast('请填写语音房名称')
				return
			}
			const picture = selectedPicture.value

			//圖片帶上選擇的圖紙
			const backgroundImg = _get(picture, 'imgSrc', '')

			const createRoomRes = await createChatRoomApi({
				type: ROOM_TYPES.VOICE,
				userId: userData.userId,
				title: roomName.value, // 房名
				note: roomDescription.value, //简介
				secret: roomPassword.value, // 密钥
				backgroundImg,
				gameType:
					_get(picture, 'gameType') || getLotteryCode(lotteryType.value),
				gameSerialNo: _get(selectedSeries.value, 'seriesCode'),
				issueId: _get(picture, 'issueId'),
				nickname: userData.nickname,
				// serialPeriodNo: 326,
			})

			if (createRoomRes.success) {
				const roomId = _get(createRoomRes, 'data')
				redirect(`/${ROOM_PATHS.VOICE_ROOM}/${roomId}`)
			}
		} finally {
			isPeinding.value = false
		}
	}

	const initSeries = async () => {
		await cacheSeries(lotteryType.value)
		selectedSeries.value = _get(fetchSeries(lotteryType.value), '[0]')
	}

	const confirmSeriesSelection = (val) => {
		selectedSeries.value = val
		selectedPicture.value = {}
	}

	const clearPicture = () => {
		selectedPicture.value = {}
		selectedPic.value = {}
	}

	watch(
		() => lotteryType.value,
		() => {
			if (!noRefresh.value) {
				initSeries()
				clearPicture()
			}
		}
	)

	onBeforeMount(() => {
		initSeries()
	})

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
