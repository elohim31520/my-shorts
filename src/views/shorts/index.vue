<template>
	<div class="test-slide-wrapper" id="home-index">
		<SlideHorizontal name="first" v-model:index="state.baseIndex">
			<SlideItem class="sidebar">
				<div class="header">
					<div class="left">下午好</div>
					<div class="right" @click="redirect('/home/live')">
						<SvgIcon name="qrcode" size="2.2rem" />
						<span>扫一扫</span>
					</div>
				</div>
				<div class="card">
					<div class="header">
						<div class="left">常用小程序</div>
						<div class="right">
							<span>全部</span>
							<SvgIcon name="arrow_right" size="2.2rem" />
						</div>
					</div>
					<div class="content">
						<div class="item" @click="_no">
							<SvgIcon
								name="icon_forum_collect_hot"
								size="3.2rem"
								class="color-white"
							/>
							<span>今日头条</span>
						</div>
						<div class="item" @click="_no">
							<SvgIcon name="wechat" size="3.2rem" class="color-white" />
							<span>西瓜视频</span>
						</div>
					</div>
				</div>

				<div class="card">
					<div class="header">
						<div class="left">最近常看</div>
						<div class="right">
							<span>全部</span>
							<SvgIcon name="arrow_right" size="2.2rem" />
						</div>
					</div>
					<div class="content">
						<div class="item avatar" @click="_no" :key="i" v-for="i in 6">
							<SvgIcon
								name="icon_forum_collect_selected"
								size="2.2rem"
								class="color-white"
							/>
							<span>随机名字</span>
						</div>
					</div>
				</div>

				<div class="card">
					<div class="header">
						<div class="left">常用功能</div>
						<div class="right"></div>
					</div>
					<div class="content">
						<div class="item" @click="_no">
							<SvgIcon name="channel_money" size="2.2rem" />
							<span>我的钱包</span>
						</div>
						<div class="item" @click="_no">
							<SvgIcon name="channel_sold" size="2.2rem" />
							<span>券包</span>
						</div>
						<div class="item" @click="_no">
							<SvgIcon name="watsapp" size="2.2rem" />
							<span>小程序</span>
						</div>
						<div class="item" @click="_no">
							<SvgIcon name="button_statistics" size="2.2rem" />
							<span>观看历史</span>
						</div>
						<div class="item" @click="_no">
							<SvgIcon name="icon_love" size="2.2rem" />
							<span>内容偏好</span>
						</div>
						<div class="item" @click="_no">
							<SvgIcon name="side-bar-record" size="2.2rem" />
							<span>离线模式</span>
						</div>
						<div class="item" @click="_no">
							<SvgIcon name="channel_gear" size="2.2rem" />
							<span>设置</span>
						</div>
						<div class="item" @click="_no">
							<SvgIcon name="channel_phone" size="2.2rem" />
							<span>稍后再看</span>
						</div>
					</div>
				</div>
			</SlideItem>
			<SlideItem>
				<IndicatorHome
					v-if="!state.fullScreen"
					:loading="baseStore.loading"
					name="second"
					@showSlidebar="state.baseIndex = 0"
					v-model:index="state.navIndex"
				/>
				<SlideHorizontal
					class="first-horizontal-item"
					name="second"
					:change-active-index-use-anim="false"
					v-model:index="state.navIndex"
				>
					<MyFollow :active="state.navIndex === 0 && state.baseIndex === 1" />

					<SlideItem>
						<Community
							:active="state.navIndex === 1 && state.baseIndex === 1"
						/>
					</SlideItem>
					<Live :active="state.navIndex === 2 && state.baseIndex === 1" />
					<Slide4 :active="state.navIndex === 3 && state.baseIndex === 1" />
				</SlideHorizontal>

				<BaseMask
					v-if="state.baseIndex === 0"
					@click="state.baseIndex = 1"
					mode="white"
					style="position: absolute"
				/>
			</SlideItem>
		</SlideHorizontal>

		<Comment
			page-id="home-index"
			:video-id="state.currentItem.aweme_id"
			v-model="state.commentVisible"
			@close="closeComments"
		/>

		<Share
			v-model="state.isSharing"
			ref="share"
			page-id="home-index"
			@dislike="dislike"
			:item="state.currentItem"
			:videoId="state.recommendList[state.itemIndex]?.id"
			:canDownload="state.recommendList[state.itemIndex]?.canDownload"
			@play-feedback="state.showPlayFeedback = true"
			@shareToFriend="delayShowDialog(() => (state.shareToFriend = true))"
			@showDouyinCode="state.showDouyinCode = true"
			@download="state.shareType = 9"
		/>

		<PlayFeedback v-model="state.showPlayFeedback" />

		<DouyinCode :item="state.currentItem" v-model="state.showDouyinCode" />

		<ShareTo
			v-model:type="state.shareType"
			:videoId="state.recommendList[state.itemIndex]?.id"
			:canDownload="state.recommendList[state.itemIndex]?.canDownload"
		/>

		<FollowSetting
			v-model:currentItem="state.currentItem"
			@showChangeNote="delayShowDialog((e) => (state.showChangeNote = true))"
			@showBlockDialog="delayShowDialog((e) => (state.showBlockDialog = true))"
			@showShare="delayShowDialog((e) => (state.isSharing = true))"
			v-model="state.showFollowSetting"
		/>

		<FollowSetting2
			v-model:currentItem="state.currentItem"
			@cancelFollow="uploader.cancelFollow()"
			v-model="state.showFollowSetting2"
		/>

		<ShareToFriend v-model="state.shareToFriend" />

		<BaseMask v-if="!isMobile" @click="isMobile = true" />
		<div v-if="!isMobile" class="guide">
			<SvgIcon name="icon_Recharge_fail" size="2.2rem" />
			<SvgIcon
				name="icon_Recharge_fail"
				size="2.2rem"
				class="close"
				@click="isMobile = true"
			/>
			<div class="txt">
				<h2>切换至手机模式获取最佳体验</h2>
				<h3>1. 按 F12 调出控制台</h3>
				<h3>2. 按 Ctrl+Shift+M，或点击下面图标</h3>
			</div>
		</div>

		<Footer :active="1" />
	</div>
</template>

<script setup lang="ts">
	import SlideHorizontal from '@/views/shorts/common/slide/SlideHorizontal.vue'
	import SlideItem from '@/views/shorts/common/slide/SlideItem.vue'
	import Comment from '@/views/shorts/common/Comment.vue'
	import Share from '@/views/shorts/common/Share.vue'
	import IndicatorHome from './components/IndicatorHome.vue'
	import SvgIcon from '@/components/SvgIcon/index.vue'
	import {
		onActivated,
		onDeactivated,
		onMounted,
		onUnmounted,
		reactive,
		ref,
		onBeforeMount,
	} from 'vue'
	import bus, { EVENT_KEY } from '@/modules/bus'
	import PlayFeedback from '@/views/shorts/components/PlayFeedback.vue'
	import ShareTo from '@/views/shorts/components/ShareTo.vue'
	import DouyinCode from '@/views/shorts/common/DouyinCode.vue'
	import FollowSetting from '@/views/shorts/components/FollowSetting.vue'
	import Search from '@/views/shorts/common/Search.vue'
	import FollowSetting2 from '@/views/shorts/components/FollowSetting2.vue'
	import ShareToFriend from '@/views/shorts/components/ShareToFriend.vue'
	// import UserPanel from '@/views/shorts/common/UserPanel.vue'
	import Community from '@/views/shorts/slide/Community.vue'
	import MyFollow from '@/views/shorts/slide/MyFollow.vue'
	import Live from '@/views/shorts/slide/Live.vue'
	import Slide4 from '@/views/shorts/slide/Slide4.vue'
	import { DefaultUser } from '@/constants/shorts'
	// import LongVideo from '@/views/shorts/slide/LongVideo.vue'
	import { useBaseStore } from '@/stores/shorts'
	import BaseMask from '@/views/shorts/common/BaseMask.vue'
	import Footer from './Footer.vue'
	import { redirect } from '@/modules/util'
	import { useShorts } from '@/views/shorts/hooks/useShorts'

	const { _no } = useShorts()

	const baseStore = useBaseStore()
	const uploader = ref()
	const isMobile = ref(/Mobi|Android|iPhone/i.test(navigator.userAgent))

	const state = reactive({
		active: true,
		baseIndex: 1,
		navIndex: 3,
		itemIndex: 0,
		test: '',
		recommendList: [],
		isSharing: false,
		canMove: true,
		shareType: -1,
		showPlayFeedback: false,
		showShareDuoshan: false,
		showShareDialog: false,
		showShare2WeChatZone: false,
		showDouyinCode: false,
		showFollowSetting: false,
		showFollowSetting2: false,
		showBlockDialog: false,
		showChangeNote: false,
		shareToFriend: false,

		commentVisible: false,
		fullScreen: false,
		currentItem: {
			aweme_id: '',
			author: DefaultUser,
			isRequest: false,
			aweme_list: [],
		},
	})

	function delayShowDialog(cb: Function) {
		setTimeout(cb, 400)
	}

	function setCurrentItem(item) {
		if (!state.active) return
		// console.log('sss',item,state.baseIndex)
		if (state.baseIndex !== 1) return
		if (state.currentItem.author?.uid !== item.author?.uid) {
			state.currentItem = {
				...item,
				isRequest: false,
				aweme_list: [],
			}
		}
		// console.log('item', item)
	}

	onBeforeMount(() => {
		//把app.ts 在做的 移到此
		window.isMoved = false
		window.isMuted = true
		window.showMutedNotice = true

		setTimeout(() => {
			bus.emit(EVENT_KEY.HIDE_MUTED_NOTICE)
			window.showMutedNotice = false
		}, 2000)
		bus.on(EVENT_KEY.REMOVE_MUTED, () => {
			window.isMuted = false
		})
	})

	onMounted(() => {
		baseStore.bodyHeight = document.documentElement.clientHeight
		baseStore.bodyWidth = document.documentElement.clientWidth

		bus.on(EVENT_KEY.ENTER_FULLSCREEN, () => {
			if (!state.active) return
			state.fullScreen = true
		})
		bus.on(EVENT_KEY.EXIT_FULLSCREEN, () => {
			if (!state.active) return
			state.fullScreen = false
		})
		bus.on(EVENT_KEY.OPEN_COMMENTS, () => {
			if (!state.active) return
			bus.emit(EVENT_KEY.ENTER_FULLSCREEN)
			state.commentVisible = true
		})
		bus.on(EVENT_KEY.CLOSE_COMMENTS, () => {
			if (!state.active) return
			bus.emit(EVENT_KEY.EXIT_FULLSCREEN)
			state.commentVisible = false
		})
		bus.on(EVENT_KEY.SHOW_SHARE, () => {
			if (!state.active) return
			state.isSharing = true
		})
		bus.on(EVENT_KEY.NAV, ({ path, query }) => {
			if (!state.active) return
			redirect(path, query)
		})
		bus.on(EVENT_KEY.GO_USERINFO, () => {
			if (!state.active) return
			// state.baseIndex = 2
		})
		bus.on(EVENT_KEY.CURRENT_ITEM, setCurrentItem)
	})

	onUnmounted(() => {
		bus.offAll()
	})

	onActivated(() => {
		state.active = true
		bus.emit(EVENT_KEY.TOGGLE_CURRENT_VIDEO)
	})

	onDeactivated(() => {
		state.active = false
		bus.emit(EVENT_KEY.TOGGLE_CURRENT_VIDEO)
	})

	function closeComments() {
		bus.emit(EVENT_KEY.CLOSE_COMMENTS)
	}

	function dislike() {
		// listRef.value.dislike(state.list[1])
		// state.list[state.index] = state.list[1]
		// _notice('操作成功，将减少此类视频的推荐')
	}
</script>

<style lang="scss">
	@import url('@/styles/shorts.scss');
	.test-slide-wrapper {
		font-size: 14px;
		width: 100%;
		height: 100%;
		background: black;
		overflow: hidden;

		.sidebar {
			touch-action: pan-y;
			width: 80%;
			height: calc(var(--vh, 1vh) * 100);
			overflow: auto;
			background: rgb(22, 22, 22);
			padding: 10px;
			padding-bottom: 20px;
			box-sizing: border-box;

			& > .header {
				font-size: 16px;
				display: flex;
				color: white;
				justify-content: space-between;
				align-items: center;

				.right {
					border-radius: 20px;
					padding: 8px 15px;
					background: rgb(36, 36, 36);
					display: flex;
					align-items: center;
					font-size: 14px;
					gap: 10px;

					svg {
						font-size: 18px;
					}
				}
			}

			.card {
				margin-top: 10px;
				border-radius: 12px;
				padding: 15px;
				background: rgb(29, 29, 29);

				.header {
					margin-bottom: 8px;
					font-size: 14px;
					display: flex;
					color: white;
					justify-content: space-between;
					align-items: center;

					.right {
						display: flex;
						align-items: center;
						font-size: 12px;
						gap: 4px;
						color: gray;

						svg {
							font-size: 16px;
						}
					}
				}

				.content {
					color: white;
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;

					.item {
						min-height: 20vw;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						font-size: 14px;
						gap: 8px;

						svg {
							font-size: 28px;
						}

						.xcx {
							border-radius: 12px;
							width: 50px;
							height: 50px;
						}
					}

					.avatar {
						height: 25vw;

						img {
							border-radius: 50%;
							width: 50px;
						}
					}
				}
			}
		}

		.slide-content {
			width: 100%;
			height: 100%;
		}
	}

	.first-horizontal-item {
		//width: 90vw;
		//height: 80vh;
		width: 100%;
		height: calc(var(--vh, 1vh) * 100 - var(--footer-height)) !important;
		overflow: hidden;
		border-radius: 10px;
	}

	.guide {
		color: white;
		z-index: 999;
		background: var(--active-main-bg);
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border-radius: 16px;
		overflow: hidden;
		text-align: center;

		.danger {
			margin-top: 10px;
			font-size: 40px;
			color: red;
		}

		.close {
			cursor: pointer;
			font-size: 18px;
			color: white;
			position: absolute;
			right: 15px;
			top: 15px;
		}

		.txt {
			text-align: left;
			padding: 0 24px;
		}

		img {
			display: block;
			width: 350px;
		}
	}
</style>
