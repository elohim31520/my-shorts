<template>
	<div
		id="UserPanel"
		@scroll="scroll"
		@dragstart="(e) => _stopPropagation(e)"
		ref="page"
	>
		<div ref="float" class="float" :class="state.floatFixed ? 'fixed' : ''">
			<div class="left">
				<Icon
					@click="emit('back')"
					class="icon"
					icon="eva:arrow-ios-back-fill"
				/>
				<transition name="fade">
					<div class="float-user" v-if="state.floatFixed">
						<img
							v-lazy="props.currentItem.author.avatar_168x168.url_list[0]"
							class="avatar"
						/>
						<!-- <img
							v-if="!props.currentItem.author.follow_status"
							src="@/assets/img/icon/add-light.png"
							alt=""
							class="add"
						/> -->
						<span @click="followButton">
							{{ props.currentItem.author.follow_status ? '私信' : '关注' }}
						</span>
					</div>
				</transition>
			</div>
			<div class="right">
				<transition name="fade">
					<div
						class="request"
						v-if="!state.floatFixed && props.currentItem.author.is_follow"
					>
						<!-- <img
							@click="$nav('/me/request-update')"
							src="@/assets/img/icon/me/finger-right.png"
							alt=""
						/> -->
						<span>求更新</span>
					</div>
				</transition>
				<Icon class="icon" icon="ion:search" @click.stop="_no" />
				<Icon
					class="icon"
					icon="ri:more-line"
					@click.stop="emit('showFollowSetting')"
				/>
			</div>
		</div>
		<div
			class="main"
			ref="main"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
		>
			<!--   src="@/assets/img/header-bg.png"   -->
			<header>
				<img
					:style="{
						opacity: props.currentItem.author.cover_url[0].url_list.length
							? 1
							: 0,
					}"
					ref="cover"
					:src="props.currentItem.author.cover_url[0].url_list[0]"
					@click="
						state.previewImg = props.currentItem.author.cover_url[0].url_list[0]
					"
					alt=""
					class="cover"
				/>
				<div class="avatar-wrapper">
					<img
						v-lazy="props.currentItem.author.avatar_168x168.url_list[0]"
						class="avatar"
						@click="
							state.previewImg =
								props.currentItem.author.avatar_300x300.url_list[0]
						"
					/>
					<div class="description">
						<div class="name f22">{{ props.currentItem.author.nickname }}</div>
						<div
							class="certification"
							v-if="props.currentItem.author.certification"
						>
							<!-- <img src="@/assets/img/icon/me/certification.webp" /> -->
							{{ props.currentItem.author.certification }}
						</div>
						<div class="number" v-else>
							<span>抖音号：{{ _getUserDouyinId(props.currentItem) }}</span>
						</div>
					</div>
				</div>
			</header>
			<div class="info">
				<div class="heat">
					<div class="text">
						<span class="num">
							{{ _formatNumber(props.currentItem.author.total_favorited) }}
						</span>
						<span>获赞</span>
					</div>
					<div class="text">
						<span class="num">
							{{ _formatNumber(props.currentItem.author.following_count) }}
						</span>
						<span>关注</span>
					</div>
					<div class="text">
						<span class="num">
							{{
								_formatNumber(
									props.currentItem.author.mplatform_followers_count
								)
							}}
						</span>
						<span>粉丝</span>
					</div>
				</div>

				<div class="signature f12" v-if="props.currentItem.author.signature">
					<div class="text" v-html="props.currentItem.author.signature"></div>
				</div>
				<div class="more">
					<div class="age item" v-if="props.currentItem.author.user_age !== -1">
						<!-- <img
							v-if="props.currentItem.author.gender == 1"
							src="@/assets/img/icon/me/man.png"
							alt=""
						/> -->
						<!-- <img
							v-if="props.currentItem.author.gender == 2"
							src="@/assets/img/icon/me/woman.png"
							alt=""
						/> -->
						<span>{{ props.currentItem.author.user_age }}岁</span>
					</div>
					<div class="item" v-if="props.currentItem.author.ip_location">
						{{ props.currentItem.author.ip_location }}
					</div>
					<div
						class="item"
						v-if="
							props.currentItem.author.province || props.currentItem.author.city
						"
					>
						{{ props.currentItem.author.province }}
						<template
							v-if="
								props.currentItem.author.province &&
								props.currentItem.author.city
							"
						>
							·
						</template>
						{{ props.currentItem.author.city }}
					</div>
					<div class="item" v-if="props.currentItem.author.school?.name">
						{{ props.currentItem.author.school?.name }}
					</div>
				</div>
			</div>
			<div class="other">
				<div class="scroll-x" @touchmove="stop">
					<div
						class="item"
						:key="i"
						v-for="(item, i) in props.currentItem.author.card_entries"
					>
						<img :src="item.icon_dark.url_list[0]" alt="" />
						<div class="right">
							<div class="top">{{ item.title }}</div>
							<div class="bottom">{{ item.sub_title }}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="my-buttons">
				<div class="follow-display">
					<div
						class="follow-wrapper"
						:class="
							props.currentItem.author.follow_status
								? 'follow-wrapper-followed'
								: ''
						"
					>
						<!--            eslint-disable-next-line vue/no-mutating-props-->
						<div
							class="no-follow"
							@click="props.currentItem.author.follow_status = 1"
						>
							<!-- <img src="@/assets/img/icon/add-white.png" alt="" /> -->
							<span>关注</span>
						</div>
						<div class="followed">
							<div class="l-button" @click="emit('showFollowSetting2')">
								<span>已关注</span>
								<Icon icon="bxs:down-arrow" class="arrow" />
							</div>
							<div class="l-button" @click="$nav('/message/chat')">
								<span>私信</span>
							</div>
						</div>
					</div>
				</div>
				<div
					class="option"
					:class="state.isShowRecommend ? 'option-recommend' : ''"
					@click="state.isShowRecommend = !state.isShowRecommend"
				>
					<!-- <img
						v-if="state.loadings.showRecommend"
						class="loading"
						src="@/assets/img/icon/loading-gray.png"
						alt=""
					/>
					<Icon icon="bxs:down-arrow" v-else class="arrow" /> -->
				</div>
			</div>

			<div class="recommend" :class="{ hidden: !state.isShowRecommend }">
				<div class="title">
					<span>你可能感兴趣</span>
					<!-- <img src="@/assets/img/icon/about-gray.png" /> -->
				</div>
				<div class="friends" @touchmove="stop">
					<div
						class="friend"
						:key="i"
						v-for="(item, i) in baseStore.friends.all"
					>
						<img
							:style="item.select ? 'opacity: .5;' : ''"
							class="avatar"
							:src="item.avatar"
							alt=""
						/>
						<span class="name">{{ item.name }}</span>
						<span class="tips">可能感兴趣的人</span>
						<dy-button type="primary">关注</dy-button>
						<div class="close">
							<dy-back img="close" scale=".6"></dy-back>
						</div>
					</div>
					<div class="more" @click="$nav('/people/find-acquaintance')">
						<div class="notice">
							<div>点击查看</div>
							<div>更多好友</div>
						</div>
					</div>
				</div>
			</div>

			<div class="total" ref="total">
				作品 {{ props.currentItem.author.aweme_count }}
				<!-- <img class="arrow" src="@/assets/img/icon/arrow-up-white.png" alt="" /> -->
			</div>
			<div class="videos">
				<Posters
					v-if="props.currentItem.aweme_list.length"
					:list="props.currentItem.aweme_list"
				></Posters>
				<Loading :isFullScreen="false" v-else />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, watch } from 'vue'
	import Posters from '@/views/shorts/common/Posters.vue'
	import { DefaultUser } from '@/constants/shorts'
	import Loading from '@/views/shorts/common/Loading.vue'
	import { useBaseStore } from '@/stores/shorts'
	import { userVideoList } from '@/api/shorts'
	import { useShorts } from '@/views/shorts/hooks/useShorts'

	const { _formatNumber, _getUserDouyinId, _no, _stopPropagation } = useShorts()

	const $nav = useNav()
	const baseStore = useBaseStore()
	const emit = defineEmits<{
		'update:currentItem': [val: any]
		back: []
		showFollowSetting: []
		showFollowSetting2: []
	}>()

	const props = defineProps({
		currentItem: {
			type: Object,
			default() {
				return {
					author: DefaultUser,
					aweme_list: [],
				}
			},
		},
		active: {
			type: Boolean,
			default() {
				return false
			},
		},
	})
	const main = ref(null)
	const page = ref(null)
	const cover = ref(null)
	const total = ref(null)

	const state = reactive({
		isShowRecommend: false, //是否显示推荐
		previewImg: '',
		floatFixed: false,
		showFollowSetting: false,
		floatHeight: 52,
		loadings: {
			showRecommend: false,
		},
		acceleration: 1.2,
		start: { x: 0, y: 0, time: 0 },
		move: { x: 0, y: 0 },
		isTop: false,
		coverHeight: 220,
		//能移动的高度
		canMoveMaxHeight: document && document.body.clientHeight / 4,
		//是否自动放大Cover
		isAutoScaleCover: false,
		uid: null,
	})

	watch(
		() => props.active,
		async (newVal) => {
			if (newVal && !props.currentItem.aweme_list.length) {
				// console.log('props.currentItem',props.currentItem)
				let id = _getUserDouyinId(props.currentItem)
				let r: any = await userVideoList({ id })
				if (r.success) {
					setTimeout(() => {
						r.data = r.data.map((a) => {
							a.author = props.currentItem.author
							return a
						})
						emit(
							'update:currentItem',
							Object.assign(props.currentItem, { aweme_list: r.data })
						)
					}, 300)
				}
			}
		}
	)

	watch(
		() => props.currentItem.author.uid,
		async () => {
			if (props.currentItem.author.uid !== state.uid) {
				state.uid = props.currentItem.author.uid
				emit(
					'update:currentItem',
					Object.assign(props.currentItem, { aweme_list: [] })
				)
			}
		}
	)

	function stop(e) {
		e.stopPropagation()
	}

	function followButton() {}

	function cancelFollow() {}

	defineExpose({ cancelFollow })

	function scroll() {
		// console.log('scroll', page.value.scrollTop)
		let scrollTop = page.value.scrollTop
		let totalY = total.value.getBoundingClientRect().y
		state.floatFixed = totalY <= state.floatHeight
		let isTop = scrollTop === 0
		if (isTop && state.isAutoScaleCover) {
			cover.value.style.transition = 'all .1s'
			cover.value.style.height = `calc(${state.coverHeight}px + ${state.canMoveMaxHeight}px)`
			setTimeout(() => {
				cover.value.style.transition = 'all .4s'
				cover.value.style.height = `calc(${state.coverHeight}px)`
				state.isAutoScaleCover = false
			}, 200)
		}
	}

	function touchStart(e: TouchEvent) {
		state.start.x = e.touches[0].pageX
		state.start.y = e.touches[0].pageY
		state.start.time = Date.now()
		state.isTop = page.value.scrollTop === 0
		if (state.isTop) {
			cover.value.style.transition = 'none'
		}
		// console.log('touchStart', page.value.scrollTop)
	}

	function touchMove(e: TouchEvent) {
		state.move.x = e.touches[0].pageX - state.start.x
		state.move.y = e.touches[0].pageY - state.start.y
		let isNext = state.move.y < 0

		// console.log('touchMove', page.value.scrollTop)
		//todo 有空了加个，越滑越紧的效果
		if (
			state.isTop &&
			!isNext &&
			document.body.clientHeight / 4 > state.move.y
		) {
			// if (state.isTop && !isNext) {
			let scrollHeight = state.move.y
			cover.value.style.height = `calc(${state.coverHeight}px + ${scrollHeight}px)`
		}
	}

	function touchEnd() {
		if (state.isTop) {
			state.isTop = false
			cover.value.style.transition = 'all .3s'
			cover.value.style.height = `calc(${state.coverHeight}px)`
		}
		let endTime = Date.now()
		state.isAutoScaleCover = endTime - state.start.time < 100
		// console.log('touchEnd')
	}
</script>

<style scoped lang="scss">
	.fade1-enter-active,
	.fade1-leave-active {
		transition: all 0.3s ease;
	}

	.fade1-enter-from,
	.fade1-leave-to {
		transform: translateY(10px);
		opacity: 0;
	}

	.FromBottomDialog {
		left: inherit;
	}

	#UserPanel {
		touch-action: pan-y;
		position: fixed;
		background: var(--color-user);
		height: 100%;
		width: 100%;
		overflow: auto;
		font-size: 14px;

		.preview-img {
			z-index: 3;
			position: fixed;
			bottom: 0;
			top: 0;
			background: black;
			display: flex;
			align-items: center;
			justify-content: center;

			.resource {
				width: 100%;
				max-height: 100%;
			}

			.download {
				position: absolute;
				bottom: 20px;
				right: 20px;
				padding: 3px;
				background: var(--second-btn-color-tran);
				width: 20px;
			}
		}

		.mask {
			background: #0000004f;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: calc(var(--vh, 1vh) * 100);
			z-index: 3;
		}

		.main {
			.notice {
				font-size: 12px;
				height: 40px;
				color: var(--second-text-color);
				display: flex;
				justify-content: center;
				align-items: center;

				img {
					height: 12px;
					margin-right: 5px;
				}
			}

			.collect {
				padding: 7px;

				.video {
					background: var(--active-main-bg);
					border-radius: 5px;
					padding: 10px;
					margin-bottom: 7px;

					.top {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 10px;

						.left {
							display: flex;
							align-items: center;
							color: gainsboro;

							img {
								height: 20px;
								margin-right: 5px;
							}
						}

						.right {
							display: flex;
							align-items: center;
							color: var(--second-text-color);
						}
					}

					.list {
						display: grid;
						grid-template-columns: 33.33% 33.33% 33.33%;

						.item {
							height: calc(33.33% * 1.3);
							padding: 2px;
							overflow: hidden;
							position: relative;

							.poster {
								border-radius: 4px;
								width: 100%;
								height: 100%;
								display: block;
							}

							.num {
								color: white;
								position: absolute;
								bottom: 5px;
								left: 5px;
								display: flex;
								align-items: center;
								font-size: 14px;

								.love {
									width: 14px;
									height: 14px;
									margin-right: 5px;
								}
							}
						}
					}
				}

				.audio {
					background: var(--active-main-bg);
					border-radius: 5px;
					padding: 10px;

					.top {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 10px;

						.left {
							display: flex;
							align-items: center;
							color: gainsboro;

							img {
								height: 15px;
								margin-right: 5px;
							}
						}

						.right {
							display: flex;
							align-items: center;
							color: var(--second-text-color);
						}
					}

					.list {
						display: grid;
						grid-template-columns: 33.33% 33.33% 33.33%;

						.item {
							padding: 2px;
							overflow: hidden;
							position: relative;

							.poster {
								border-radius: 4px;
								width: 100%;
								height: calc((100% - 34px) / 3);
								display: block;
							}

							.title {
								margin-top: 5px;
								color: var(--second-text-color);
							}
						}
					}
				}
			}

			header {
				position: relative;
				color: white;

				.cover {
					height: 220px;
					object-fit: cover;
					width: 100%;
					//transition: height .3s;
				}

				.avatar-wrapper {
					display: flex;
					align-items: center;
					box-sizing: border-box;
					position: absolute;
					bottom: 35px;
					left: 20px;
					//margin-top: -20px;
					//transform: translateY(-20px);

					.avatar {
						background: white;
						padding: 2.5px;
						border-radius: 50%;
						$w: 100px;
						width: $w;
						height: $w;
					}

					.description {
						font-size: 12px;
						color: white;
						margin-left: 15px;

						.number,
						.certification {
							display: flex;
							align-items: center;

							img {
								width: 12px;
								margin-left: 5px;
							}
						}

						.number {
							color: var(--second-text-color);

							img {
								margin-left: 5px;
							}
						}

						.certification {
							img {
								width: 14px;
								margin-right: 5px;
							}
						}
					}
				}
			}

			.info {
				position: relative;
				z-index: 1;
				background: var(--main-bg);
				padding: 0 20px;
				border-radius: 10px 10px 0 0;
				margin-top: -20px;

				.heat {
					padding: 15px 0;
					color: var(--second-text-color);
					display: flex;
					align-items: center;

					.text {
						font-size: 12px;
						margin-right: 18px;
						display: flex;
						align-items: center;

						.num {
							color: white;
							font-size: 16px;
							font-weight: bold;
							margin-right: 5px;
						}
					}
				}

				.signature {
					color: white;
					display: flex;
					align-items: center;
					margin-bottom: 5px;

					img {
						height: 12px;
						margin-left: 6px;
					}

					.text {
						white-space: pre-wrap;
					}
				}

				.more {
					margin-top: 10px;
					margin-bottom: 20px;
					color: var(--second-text-color);
					display: flex;

					.item {
						padding: 2px 5px;
						border-radius: 2px;
						background: var(--second-btn-color-tran);
						font-size: 10px;
						display: flex;
						align-items: center;
						margin-right: 5px;

						img {
							height: 10px;
							margin-right: 2px;
						}
					}
				}
			}

			.other {
				display: flex;
				margin-bottom: 20px;
				overflow: hidden;

				.scroll-x {
					padding-left: 20px;
					display: flex;
					overflow-x: scroll;
				}

				.item {
					margin-right: 25px;
					display: flex;
					flex-shrink: 0;

					img {
						margin-right: 8px;
						border-radius: 4px;
						height: 40px;
					}

					.right {
						display: flex;
						justify-content: space-between;
						flex-direction: column;

						.top {
							color: white;
							font-size: 14px;
						}

						.bottom {
							color: var(--second-text-color);
							font-size: 12px;
						}
					}
				}
			}

			.my-buttons {
				margin: 20px;
				overflow: hidden;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				$width: 36px;
				$gap: 6px;
				gap: $gap;

				.follow-display {
					flex: 1;
					overflow: hidden;

					.follow-wrapper {
						width: 200%;
						display: flex;
						flex-wrap: nowrap;
						transition: all 0.3s ease;

						&.follow-wrapper-followed {
							transform: translate3d(-50%, 0, 0);
						}

						.no-follow {
							width: calc(100% - 5px);
							color: white;
							border-radius: 4px;
							background: var(--primary-btn-color);
							height: $width;
							display: flex;
							align-items: center;
							justify-content: center;
							box-sizing: border-box;

							span {
								margin-left: 2px;
							}
						}

						.followed {
							width: 100%;
							display: flex;
							justify-content: space-around;
							align-items: center;
							gap: $gap;

							.l-button {
								color: white;
								border-radius: 5px;
								background: var(--second-btn-color);
								height: $width;
								width: 50%;
								box-sizing: border-box;
								display: flex;
								align-items: center;
								justify-content: center;
								gap: $gap;
							}
						}
					}

					img {
						$width: 14px;
						width: $width;
						height: $width;
					}
				}

				.option {
					position: relative;
					width: $width;
					height: $width;
					font-size: 12px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 4px;
					background: var(--second-btn-color);
					color: white;

					&.option-recommend {
						.arrow {
							transform: rotate(180deg);
						}
					}
				}

				.loading {
					$width: 12px;
					width: $width;
					height: $width;
					animation: rotate 0.6s linear infinite;

					@keyframes rotate {
						from {
							transform: rotate(0deg);
						}
						to {
							transform: rotate(360deg);
						}
					}
				}

				.arrow {
					transition: transform 0.3s ease;
					font-size: 13px;
				}
			}

			.recommend {
				transition: all 0.3s ease;
				height: 250px;
				overflow: hidden;

				&.hidden {
					height: 0;
				}

				.title {
					padding-left: 20px;
					font-size: 12px;
					color: var(--second-text-color);
					display: flex;
					align-items: center;

					img {
						margin-left: 3px;
						width: 13px;
						height: 13px;
					}
				}

				.friends {
					padding-left: 20px;
					margin-top: 10px;
					display: flex;
					overflow-x: scroll;
					margin-bottom: 20px;

					.friend {
						position: relative;
						background: var(--second-btn-color-tran);
						margin-right: 10px;
						padding: 10px;
						display: flex;
						flex-direction: column;
						align-items: center;
						border-radius: 10px;

						.avatar {
							$width: 100px;
							border-radius: 50%;
							width: $width;
							height: $width;
						}

						.name {
							margin-top: 10px;
							font-size: 12px;
							color: white;
						}

						.tips {
							margin-top: 5px;
							font-size: 12px;
							color: var(--second-text-color);
						}

						.button {
							margin-top: 10px;
							width: 150px;
							height: 26px;
							font-size: 12px;
						}

						.close {
							position: absolute;
							top: 2px;
							right: 2px;
						}
					}

					.more {
						.notice {
							width: 100px;
							height: 100%;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							color: var(--second-text-color);
						}
					}
				}
			}

			.total {
				background: var(--main-bg);
				color: white;
				display: flex;
				align-items: center;
				padding: 15px 20px;
				padding-top: 0px;
				position: sticky;
				top: 52px;
				z-index: 2;

				img {
					transform: rotate(180deg);
					margin-left: 5px;
					width: 12px;
					height: 12px;
				}
			}
		}

		.float {
			position: fixed;
			box-sizing: border-box;
			width: 100%;
			z-index: 2;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 52px;
			padding: 0 15px;
			background: transparent;
			transition: all 0.2s;

			&.fixed {
				background: var(--main-bg);

				img {
					background: var(--main-bg) !important;
				}
			}

			.icon {
				color: white;
				border-radius: 50%;
				background: rgba(82, 80, 80, 0.5);
				padding: 6px;
				font-size: 18px;
			}

			.left {
				display: flex;
				align-items: center;

				.float-user {
					display: inline-flex;
					margin-left: 22px;
					color: white;
					font-size: 12px;
					align-items: center;
					background: var(--second-btn-color-tran);
					height: 22px;
					border-radius: 40px;
					padding: 1px 10px 1px 1px;

					.add {
						width: 12px;
						margin-right: 2px;
					}

					.avatar {
						width: 20px;
						border-radius: 50%;
						margin-right: 5px;
					}
				}
			}

			.right {
				display: flex;
				color: white;
				align-items: center;
				position: relative;
				gap: 15px;

				.request {
					font-size: 12px;
					height: 26px;
					display: flex;
					padding-right: 13px;
					padding-left: 5px;
					align-items: center;
					border-radius: 20px;
					background: rgba(82, 80, 80, 0.5);

					img {
						padding: 6px;
						width: 18px;
					}
				}
			}
		}
	}
</style>
