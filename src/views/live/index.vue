<template>
	<div class="pt-45">
		<HomeHeader :active="2" />
		<div class="relative z-10 bg-#fafafa">
			<LotteryTypes class="block mb-2" ref="target" />

			<!-- 開獎Player佔位 -->
			<van-sticky :offset-top="top" v-if="isMounted && isDrawing">
				<div
					id="live-video"
					:style="{ 'min-height': `${minHeight}px` }"
					class="z-10 w-full bg-#3a3a3a"
				></div>

				<!-- 直播開獎時用websocket的 資料-->
				<LotteryResultLive
					:lotteryResult="liveLotteryResult"
					v-if="isDrawing && liveLotteryResult"
					ref="lotteryRef"
					:participantCount="participantCount"
				/>
			</van-sticky>
			<!-- 預告開獎區塊 -->
			<div class="bg-#3a3a3a h-78 mb-10" v-if="hasLiveVideo && !isDrawing">
				<div
					class="text-16 w-full h-100% text-white flex-y-center flex-col justify-center"
				>
					<p>{{ fullLotteryName }}搅珠直播开播时间为开奖日晚上</p>
					<p>
						<span class="color-#FF8F28">
							{{ liveTime.start }}-{{ liveTime.end }}
						</span>
						（北京时间），敬请查看
					</p>
				</div>
			</div>

			<!-- 非開獎時間用一般資料 -->
			<LotteryResult class="mb-10" v-if="!isDrawing || !liveLotteryResult" />

			<div v-show="hasLiveVideo">
				<div
					class="flex-y-center justify-between mt-14 mb-7.93 mx-16.5 color-#434343"
					v-show="showReplayEntry"
				>
					<div class="font-600 text-18 lh-24.52">开奖回放</div>
					<a href="/live/list">
						<div class="flex-y-center">
							<span class="text-16">查看更多</span>
							<SvgIcon size="1.25rem" name="icon_VoiceChat_Enter" />
						</div>
					</a>
				</div>

				<!-- 固定兩個影片 -->
				<ul class="grid grid-cols-2 gap-10 mb-16 px-10">
					<li
						v-for="(vo, index) in videoList"
						:key="index"
						class="w-full flex-y-center justify-center"
					>
						<a :href="`/live/replay/?id=${vo.id}`">
							<div
								class="w-172.5 flex flex-col items-center justify-center rounded-9.855 shadow-1 bg-#fff overflow-hidden"
							>
								<div class="relative w-full">
									<img class="w-full h-98.57" :src="backgroundImage" alt="" />

									<SvgIcon
										name="play"
										size="1.5625rem"
										class="absolute left-50% top-50% transform translate--50%"
									/>
								</div>

								<div
									class="w-full h-30 text-13 lh-19.07 color-#434343 flex-y-center justify-center"
								>
									第{{ formatPeriod(vo.id) }}期开奖视频
								</div>
							</div>
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- 下滑才會出現的svgIcon區塊 -->
		<div
			class="fixed top-44 z-8 w-full h-25 flex-center bg-#fafafa max-w-480px"
			:style="{ 'z-index': gap != 0 ? 10 : 8 }"
		>
			<span class="color-#E0E0E0 text-12">
				{{ lotteryName }}
			</span>
		</div>

		<!-- 三個Tabs -->
		<ul
			ref="refForShowIcon"
			class="w-full flex-center justify-evenly bg-#fff color-#aeaeb1 max-w-480px shadow-1 py-6 text-16 font-500 sticky z-10 rounded-t-10"
			:style="{
				top: isDrawing
					? `calc(${pxToRem(heights.header + gap + heights.drawInfo)} + ${heights.player}px)`
					: pxToRem(heights.header + gap),
			}"
		>
			<li
				v-for="(vo, index) in tabs"
				:key="index"
				:class="{ active: vo.view == view }"
				@click="view = vo.view"
			>
				{{ vo.title }}
			</li>
		</ul>

		<div v-if="view == 1">
			<RecommendChatUsers :users="chatUsers" class="pb-80" />
		</div>
		<div v-else-if="view == 2" class="pt-10 pb-130">
			<!-- <TabSelector
				class="sticky z-10"
				:style="{
					top: isDrawing
						? pxToRem(
								heights.header +
									heights.player +
									heights.ballList +
									heights.iconBlock +
									heights.tabs
							)
						: pxToRem(heights.header + heights.iconBlock + heights.tabs),
				}"
			/> -->

			<HotChatList class="mb-10 px-10" :lotteryType="lotteryType" />
			<LotteryRecommend class="-mt-10" />
		</div>
		<div v-else-if="view == 3" class="pt-5 pb-130">
			<ChatRooms />
		</div>

		<SideBar />
		<Footer :active="0" :showIcon="true" />

		<DynamicFixedElement
			:position="{ bottom: 0 }"
			:moveRange="49"
			:directions="['up']"
			class="z-9"
		>
			<LotteryTypes sync />
		</DynamicFixedElement>

		<!-- 創建房間類型選擇 -->
		<van-action-sheet v-model:show="showPanel" title="创建直播">
			<ul class="p-37.5 pt-40 text-18 text-center color-#434343">
				<li
					v-for="(vo, index) in actionSheets"
					:key="index"
					:class="[vo.value == ROOM_TYPES.CHAT ? 'btn_chat' : 'btn_voice']"
					class="lh-40 [&:not(:last-child)]:mb-20 rounded-8 btn color-white"
					@click="handleSheetSelect(vo)"
				>
					{{ vo.text }}
				</li>
			</ul>
		</van-action-sheet>

		<UnclosedRoomPrompt
			v-model="showWaringPrompt"
			@checkMyRoom="redirectToRoom(selectedChatType, myRoomId)"
		/>
	</div>

	<!-- 創建房間頁 -->
	<div
		class="bg-#fafafa fixed top-0 left-0 z-99 w-full h-100vh overflow-y-auto"
		v-if="showCreatePage"
	>
		<CreateChatRoom
			@close="showCreatePage = false"
			v-if="selectedChatType == ROOM_TYPES.CHAT"
		/>
		<CreateVoiceRoom v-else @close="showCreatePage = false" />
	</div>
	<!-- 創建房間按鈕 -->
	<div
		class="z-19 fixed right-10 bottom-90 pc:right-[calc(50%-240px+10px)]"
		@click="showCreateRoomPanel"
	>
		<div
			class="flex-y-center flex-col justify-center w-40 h-40 rounded-full bg-primary shadow-[0px_4px_6px_0px_#00000066] color-white"
		>
			<div class="font-600 text-12 lh-14">创建</div>
			<div class="font-600 text-12 lh-14">直播</div>
		</div>
	</div>

	<!-- <van-dialog
		v-model:show="showPasswordDialog"
		title="房间密码"
		show-cancel-button
		@confirm="submit"
	>
		<van-field
			v-model="password"
			type="password"
			name="密码"
			label="密码"
			placeholder="请输入房间密码"
			clearable
			:rules="[{ required: true, message: '请填写密码' }]"
			autocomplete="off"
		/>
	</van-dialog> -->
</template>

<script setup>
	import {
		provide,
		ref,
		computed,
		watch,
		onMounted,
		onBeforeUnmount,
		onBeforeMount,
	} from 'vue'
	import { storeToRefs } from 'pinia'

	import HomeHeader from '@/components/HomeHeader/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import LotteryResult from '@/components/LotteryResult/index.vue'
	import Footer from '@/components/Footer/index.vue'
	import HotChatList from '@/components/HotChatList/index.vue'
	import RecommendChatUsers from '@/components/RecommendChatUsers/index.vue'
	import SideBar from '@/components/SideBar/index.vue'
	import ChatRooms from '@/components/ChatRooms/index.vue'
	import LotteryResultLive from '@/components/LotteryResult/Normal/index.vue'
	import LotteryRecommend from './Recommend/index.vue'
	import CreateChatRoom from '@/views/live/CreateChatRoom/index.vue'
	import CreateVoiceRoom from '@/views/live/CreateVoiceRoom/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import UnclosedRoomPrompt from '@/components/UnclosedRoomPrompt/index.vue'

	import {
		getLotteryRecord,
		getLotteryVideoList,
		getNextLotteryInfoApi,
	} from '@/api/lottery'
	import { useLotteryStore } from '@/stores/lottery'
	import { useLotteryWebSocket } from '@/hooks/useLotteryWebSocket'
	import {
		getA6LotteryCode,
		redirect,
		moneyFormat,
		getLotteryTypeList,
		isLogin,
	} from '@/modules/util'
	import { getDaniuListKV } from '@/api/daniu'
	import { useElementBounding } from '@vueuse/core'
	import { getHumorParticipantCountApi } from '@/api/humor.js'
	import { getExpertChatRoomsApi, checkRoomExistApi } from '@/api/chatRoom'
	import { useLoginPopupStore } from '@/stores/loginPopup'
	import { ROOM_TYPES } from '@/constants/chat'
	import { useUserStore } from '@/stores/user'
	import { useChat } from '@/hooks/useChat'
	import { useLive } from '@/hooks/useLive.js'

	const { redirectToRoom } = useChat()
	const { data: userData } = useUserStore()
	const { lotteryType } = storeToRefs(useLotteryStore())
	const lotteryTypeList = getLotteryTypeList()

	let wsDataMap = null

	if (!import.meta.env.SSR) {
		//避免ssr階段就定義，因為server端不做ws連接
		const lotteryWebSocket = useLotteryWebSocket()
		lotteryWebSocket.connect()
		wsDataMap = lotteryWebSocket.wsDataMap
	}

	const isMounted = ref(false)
	const isDrawing = ref(false) //是否正在開獎
	const heights = ref({
		//高度管理，因為scroll要把一些區塊變sticky
		player: 0, //播放器高度
		header: 45,
		tabs: 35, //三個子頁的tabs
		series: 35, //系列選擇棄
		iconBlock: 24,
		drawInfo: 140, //開獎結果
	})
	const view = ref(1)
	const tabs = [
		{ title: '推荐牛人', view: 1 },
		{ title: '热聊语音房', view: 2 },
		{ title: '聊天室', view: 3 },
	]

	const selectedChatType = ref()
	const actionSheets = [
		{ text: '聊天室', value: ROOM_TYPES.CHAT },
		{ text: '语音房', value: ROOM_TYPES.VOICE },
	]
	const myRoomId = ref()
	const showPanel = ref(false)
	const showCreatePage = ref(false)
	// const showPasswordDialog = ref(false)
	// const password = ref('')
	const showWaringPrompt = ref(false)

	const minHeight = ref(0)
	const target = ref(null)

	const { bottom } = useElementBounding(target)
	const top = ref(0)
	const gap = ref(0)
	const participantCount = ref(0)
	const nextLotteryIssue = ref()
	const { backgroundImage } = useLive()

	watch(
		() => bottom.value,
		(value) => {
			const headerHeight = document.getElementById('home-header').offsetHeight
			if (value > headerHeight) {
				top.value = headerHeight
				gap.value = 0
			} else {
				top.value = headerHeight + heights.value.iconBlock
				gap.value = heights.value.iconBlock
			}
		}
	)

	const liveTime = computed(() => {
		if (!liveTimeMap.has(lotteryType.value)) {
			return { start: '00:00', end: '00:00' }
		}
		return liveTimeMap.get(lotteryType.value)
	})

	const liveTimeMap = new Map([
		['hk6', { start: '21:30', end: '21:38' }],
		['a6', { start: '21:32', end: '21:38' }],
	])

	const videoPlayer = ref(null)
	const recommendationList = ref([])

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)

	const hasLiveVideo = computed(() => {
		return _includes(['hk6', 'a6'], lotteryType.value)
	})

	const lotteryName = computed(() => {
		return _find(lotteryTypeList, { key: lotteryType.value })?.name
	})

	const fullLotteryName = computed(
		() => _find(lotteryTypeList, { key: lotteryType.value })?.fullName
	)

	const liveLotteryResult = computed(() => {
		if (!wsDataMap) return null
		const { openCode, issue, nextIssue, nextTime } = _cloneDeep(
			_get(wsDataMap.value, lotteryCode.value, {})
		)
		const result = {
			issue,
			nextIssue,
			nextTime,
			processedOpenCode: openCode.map((vo) => {
				vo.isValid = true
				return vo
			}),
		}
		return result
	})

	const lotteryCode = computed(() => {
		return getA6LotteryCode(lotteryType.value)
	})

	const videoList = ref([])
	const chatUsers = ref([])
	const aspectRatio = 368 / 640 //寬高比沿用 舊專案的這個比例

	const showReplayEntry = computed(() => {
		return _isArray(videoList.value) && videoList.value.length > 0
	})

	const destroyVideoPlayer = () => {
		if (!videoPlayer.value) return
		videoPlayer.value.stop()
		videoPlayer.value = null
	}

	const fetchRecommendations = async () => {
		const res = await getLotteryRecord({
			lotteryType: lotteryCode.value,
		})

		// 切換彩種時，要判斷該彩種是否正在直播，創建或銷毀player
		// 這裡要主動做，因為watch websocket資料開關是被動的
		isDrawing.value = _get(
			wsDataMap.value,
			`${lotteryCode.value}.isDrawing`,
			false
		)

		// 是否開獎中
		if (isDrawing.value) {
			// 開獎的開關，1的時候創建player
			initializeVideoPlayer()
		} else {
			destroyVideoPlayer()
		}

		recommendationList.value = _get(res, 'data.recommendList', [])
	}

	const loadVideoLibrary = () => {
		return new Promise((resolve) => {
			if (window.bgv) return resolve()

			const scriptElement = document.createElement('script')
			scriptElement.async = false
			scriptElement.src = import.meta.env.PUBLIC_BGV_JS_URL
			scriptElement.onload = () => {
				console.log('bgv library loaded.')
				resolve()
			}
			document.body.appendChild(scriptElement)
		})
	}

	const initializeVideoPlayer = async () => {
		await loadVideoLibrary()

		if (!videoPlayer.value) {
			createVideoPlayer()
		}

		const videoName = lotteryType.value == 'a6' ? '2032' : 'hk'
		videoPlayer.value.play(videoName)
	}

	const adjustVideoSize = () => {
		// 使用窗口的宽度
		const width = document.querySelector('.main-wrap').offsetWidth
		// 根据宽高比计算高度
		heights.value.player = width * aspectRatio
		// 调整视频大小
		videoPlayer.value.setSize(width, heights.value.player)
	}

	const createVideoPlayer = () => {
		videoPlayer.value = bgv.createPlayer({
			noMse: true,
			noWork: false,
			noWebgl: false,
		})

		if (!videoPlayer.value) {
			return console.log('播放器不支持当前浏览器！')
		}

		const videoElement = document.getElementById('live-video')
		if (videoElement) {
			videoElement.appendChild(videoPlayer.value.videoBox)
		}

		adjustVideoSize()

		videoPlayer.value.addEventListener(
			bgv.Event.META_DATA_EVENT,
			adjustVideoSize
		)
	}

	const getVideoList = async ({ pageNum = 1, pageSize = 2 } = {}) => {
		const res = await getLotteryVideoList({
			pageNum,
			pageSize,
			lotteryType: lotteryCode.value,
			quiet: true, //開獎時 a6tk api會超時，不提示錯誤信息
		})
		videoList.value = _get(res, 'data', [])
	}

	const lotteryRef = ref(null)
	const refForShowIcon = ref(null)
	const thresholdHeight = ref(0)

	const pxToRem = (px) => {
		return +(px / 16) + 'rem'
	}

	// const submit = () => {}

	//a6返回的回放列表，期數會多一碼
	const formatPeriod = (period) => {
		return String(period).slice(0, -1)
	}

	const showCreateRoomPanel = () => {
		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return
		}
		showPanel.value = true
	}

	const getParticipantCount = async () => {
		const res = await getNextLotteryInfoApi(lotteryType.value)
		//下一期年份 期數
		const nextLotteryYear = _get(res, 'data.nextIssueYear')
		const nextIssue = _get(res, 'data.nextIssue')

		// 參與人數
		const resp = await getHumorParticipantCountApi({
			year: nextLotteryYear,
			issue: nextIssue,
			lotteryType: lotteryType.value,
		})
		participantCount.value = moneyFormat(_get(resp, 'data.number', 0))
	}

	const handleSheetSelect = async (vo) => {
		selectedChatType.value = vo.value
		showPanel.value = false

		//檢查是否已有創建
		const userId = userData.userId
		const resp = await checkRoomExistApi({
			userId,
			type: selectedChatType.value,
		})

		myRoomId.value = _get(resp, 'data')
		if (!_isEmpty(myRoomId.value)) {
			showWaringPrompt.value = true
			return
		}

		showCreatePage.value = true
	}

	watch(
		() => lotteryType.value,
		(val) => {
			//切換彩種，重取資料判斷當前是否有直播，如果沒有會銷毀player
			fetchRecommendations()
			getVideoList()
		}
	)

	watch(
		() => wsDataMap.value,
		(val) => {
			const data = _get(wsDataMap.value, `${lotteryCode.value}`)
			// 取來自websocket的 display開關判斷是否正在開獎中
			isDrawing.value = _get(data, 'isDrawing', false)
			nextLotteryIssue.value = _get(data, 'nextIssue') //變動時重取參與人數
			if (isDrawing.value) {
				initializeVideoPlayer()
			} else {
				destroyVideoPlayer()
			}
		},
		{ deep: true }
	)

	watch(
		() => nextLotteryIssue.value,
		async (newVal) => {
			getParticipantCount()
		}
	)

	onBeforeMount(() => {
		minHeight.value =
			document.querySelector('.main-wrap').offsetWidth * aspectRatio

		getDaniuListKV().then((res) => {
			const list = _get(res, 'data', [])
			const userIds = _map(list, (vo) => vo.userId)

			getExpertChatRoomsApi(userIds).then((resp) => {
				const chatRooms = _get(resp, 'data', [])

				const chatRoomsMap = {}
				_forEach(chatRooms, (room) => {
					if (!_isEmpty(room.roomId)) {
						chatRoomsMap[room.userId] = room
					}
				})

				chatUsers.value = _map(
					_filter(list, (vo) => chatRoomsMap[vo.userId]),
					(vo) => {
						return {
							...vo,
							type: chatRoomsMap[vo.userId]?.type,
							roomId: chatRoomsMap[vo.userId]?.roomId,
							note: chatRoomsMap[vo.userId]?.note,
						}
					}
				)
			})
		})

		getVideoList()
	})

	onMounted(() => {
		isMounted.value = true
		fetchRecommendations()
		thresholdHeight.value = refForShowIcon.value?.offsetTop
	})

	onBeforeUnmount(() => {
		destroyVideoPlayer()
	})
</script>

<style lang="scss" scoped>
	.active {
		color: #434343;
		font-weight: 600;
		position: relative;

		&::after {
			content: '';
			display: block;
			position: absolute;
			left: 50%;
			bottom: -0.1875rem;
			transform: translateX(-50%);
			height: 0.125rem;
			width: 80%;
			background-color: $primary-color;
		}
	}
	.shadow-1 {
		box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	:deep(.van-action-sheet__header) {
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: 2%;
		color: #434343;
	}

	.btn {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		&.btn_voice {
			background-image: url('/public-assets/images/svg/btn_create_voice.svg');
		}
		&.btn_chat {
			background-image: url('/public-assets/images/svg/btn_create_chat.svg');
		}
	}
</style>
