<template>
	<div class="LivePage" ref="page">
		<div class="live-wrapper">
			<video
				ref="videoEl"
				src="https://www.douyin.com/aweme/v1/play/?video_id=v0d00fg10000cj1lq4jc77u0ng6s1gt0&amp;line=0&amp;file_id=bed51c00899b458cbc5d8280147c22a1&amp;sign=7749aec7bd62a3760065f60e40fc1867&amp;is_play_url=1&amp;source=PackSourceEnum_PUBLISH"
				poster="/images/jwWCPZVTIA4IKM-8WipLF.png"
				preload=""
				loop=""
				muted
				x5-video-player-type="h5-page"
				x5-video-player-fullscreen="false"
				webkit-playsinline="true"
				x5-playsinline="true"
				playsinline="true"
				fullscreen="false"
				autoplay=""
			>
				<p>您的浏览器不支持 video 标签。</p>
			</video>
		</div>
		<div class="float">
			<div class="top">
				<div class="left">
					<div class="liver">
						<img
							class="avatar"
							:src="(userinfo.avatar_168x168.url_list[0])"
							alt=""
						/>
						<div class="desc">
							<div class="desc-wrapper">
								<div class="name">{{ userinfo.nickname }}</div>
								<div class="count">2万本场点赞</div>
							</div>
							<div class="follow-btn">关注</div>
						</div>
					</div>
					<div class="left-bottom">
						<div class="tag">
							<img src="/shorts/img/icon/home/jin.webp" alt="" />
							<span>唱歌</span>
						</div>
						<div class="tag rank">
							<img src="/shorts/img/icon/home/rank-yellow.png" alt="" />
							<span>江苏第15名</span>
						</div>
					</div>
				</div>
				<div class="right">
					<div class="follower">
						<img src="/shorts/img/icon/avatar/1.png" alt="" class="round" />
						<img src="/shorts/img/icon/avatar/2.png" alt="" class="round" />
						<img src="/shorts/img/icon/avatar/3.png" alt="" class="round" />
						<div class="round count">107</div>
						<dy-back
							class="round close"
							img="close"
							mode="light"
							@click="$router.back()"
						/>
					</div>
					<div class="more">
						<div class="wrapper">
							<!--              缺个icon-->
							<span>更多同城</span>
							<dy-back
								scale=".5"
								direction="right"
								class="back"
								img="back"
								mode="light"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="bottom">
				<div class="left">
					<div class="comments" ref="comments">
						<div class="comments-wrapper" ref="comments-wrapper">
							<div class="comment notice">
								<span class="text">
									欢迎来到直播间！抖音严禁未成年人直播或打赏，直接间内严禁出现违法违规、低俗色情、吸烟酗酒等内容。如主播在直播过程中以不当方式诱导打赏、私下交易，请谨慎判断，以防人身财产损失。请大家注意财产安全，谨防网络诈骗。
								</span>
							</div>
							<div class="comment" :key="j" v-for="(i, j) in list">
								<div class="level">
									<div class="wrapper">
										<img src="/shorts/img/icon/home/level.webp" alt="" />
										<span>30</span>
									</div>
								</div>
								<span class="name">{{ i.name }}</span>
								<span class="text">{{ i.text }}</span>
							</div>
						</div>
					</div>
					<div class="options">
						<div class="input">
							<span>说点什么</span>
							<img src="/shorts/img/icon/home/voice.png" alt="" />
						</div>
						<img src="/shorts/img/icon/home/more.png" alt="" class="more" />
						<img src="/shorts/img/icon/home/love.webp" alt="" class="more" />
						<img src="/shorts/img/icon/home/gift.webp" alt="" class="gift" />
					</div>
				</div>
				<div class="right">
					<div class="avatar-wrapper" :class="{ followed: isFollowed }">
						<img src="/shorts/img/icon/avatar/2.png" alt="" class="avatar" />
						<div
							v-if="!isFollowed"
							@click.stop="attention"
							class="options"
							ref="attention-option"
						>
							<img class="no" src="/shorts/img/icon/add-light.png" alt="" />
							<img class="yes" src="/shorts/img/icon/ok-white.png" alt="" />
						</div>
						<img
							v-if="isFollowed"
							src="/shorts/img/icon/home/followed.webp"
							alt=""
							class="follow"
						/>
					</div>
				</div>
			</div>
		</div>
		<base-button @click="sendComment">点击</base-button>
	</div>
</template>
<script>
	import BaseButton from '../../components/BaseButton'
	import Dom from '../../utils/dom'
	import { nextTick } from 'vue'
	import { mapState } from 'pinia'
	import { useBaseStore } from '@/stores/shorts'

	const Mock = {
		mock: () => '',
	}

	export default {
		name: 'LivePage',
		components: { BaseButton },
		props: {},
		data() {
			return {
				timer1: -1,
				timer2: -1,
				timer3: -1,
				isFollowed: false,
				list: [],
				barrage: [],
				barrageTemplate: () => {
					let name = Mock.mock('@cname')
					let a = Mock.mock('@csentence')
					return `
        <div class="barrage">
          <div class="type">${name}</div>
          <div class="text">${a}</div>
        </div>
        `
				},
				userJoinedTemplate: () => {
					let src = '/images/icon/love.webp'
					let name = Mock.mock('@cname')
					return `
        <div class="user-joined">
          <div class="level">
            <div class="wrapper">
              <img src="${src}" alt="">
              <span>30</span>
            </div>
          </div>
          <span class="name">${name}</span>
          <span class="text">加入了直播间</span>
        </div>
        `
				},
				sendGiftTemplate: () => {
					let avatarList = [
						'/images/EPsQ7u4sNnrHC-ix-a9yQ.png',
						'/images/Xex2IhY-Zm338cNlcGuNW.png',
						'/images/gddHyRZrdk0Em3RRgVa9g.png',
						'/images/LJ-8p2jF3HydBD5j28PgQ.png',
						'/images/KwJ9N7yFjYylfwYeThWjx.png',
						'/images/EKkC06GI4yXC2mNHMrm46.png',
						'/images/rlkpmpGPdhYZRJl3J4Xl7.png',
						'/images/Ge4mMWQoICdpyTyixk3Sf.png',
					]
					let avatar = avatarList[_random(0, avatarList.length - 1)]
					let gift = '/images/icon/love.webp'
					let name = Mock.mock('@cname')
					let name2 = Mock.mock('@cname')
					let num = Mock.mock('@integer(60,400)')
					return `
        <div class="send-gift">
          <div class="left">
            <img src="${avatar}" alt="" class="avatar">
            <div class="desc">
              <div class="name">${name}</div>
              <div class="sendto">
                <span class="send">送</span>
                <span class="to">${name2}</span>
              </div>
            </div>
            <div class="gift-wrapper">
              <img src="${gift}" alt="" class="gift-icon">
            </div>
          </div>
          <div class="right">
            x${num}
          </div>
        </div>
        `
				},
				page: null,
			}
		},
		computed: {
			...mapState(useBaseStore, ['friends', 'userinfo']),
		},
		activated() {
			this.page = this.$refs.page
			this.timer1 = setInterval(async () => {
				this.sendGift()
				_delay(() => {
					this.sendGift()
					this.joinUser()
				}, 300)
			}, 1000)
			this.timer2 = setInterval(async () => {
				this.sendBarrage()
			}, 1500)
			this.timer3 = setInterval(async () => {
				this.sendComment()
			}, 700)
			this.$refs.videoEl.play()
		},
		deactivated() {
			clearInterval(this.timer1)
			clearInterval(this.timer2)
			clearInterval(this.timer3)
		},
		methods: {
			sendGift() {
				if (import.meta.env.SSR) return
				let page = new Dom(this.page)
				let sendGift = new Dom().create(this.sendGiftTemplate())
				sendGift.on('animationend', () => {
					sendGift.remove()
				})
				let oldSendGift = new Dom('.send-gift')
				let top = document.body.clientHeight * 0.6
				if (oldSendGift.els.length !== 0) {
					top = sendGift.removePx(oldSendGift.css('top')) - 70
				}
				if (top < 100) {
					top = document.body.clientHeight * 0.6
				}
				console.log('top', top)
				sendGift.css('top', top)
				page.append(sendGift)
			},
			joinUser() {
				let page = new Dom(this.page)
				let user = new Dom().create(this.userJoinedTemplate())
				user.on('animationend', () => {
					user.remove()
				})
				page.append(user)
			},
			sendBarrage() {
				let page = new Dom(this.page)
				let barrage = new Dom().create(this.barrageTemplate())
				barrage.on('animationend', () => {
					barrage.remove()
				})
				let oldBarrages = new Dom('.barrage')
				let top = document.body.clientHeight * 0.35
				if (oldBarrages.els.length !== 0) {
					top = barrage.removePx(oldBarrages.css('top')) + 20
				}
				if (top > document.body.clientHeight * 0.5) {
					top = document.body.clientHeight * 0.35
				}
				barrage.css('top', top)
				page.append(barrage)
			},
			sendComment() {
				this.list.push({
					name: Mock.mock('@cname'),
					text: Mock.mock('@csentence'),
				})
				nextTick(() => {
					let comments = this.$refs['comments']
					comments.scrollTo({
						top: comments.scrollHeight - comments.clientHeight,
						behavior: 'smooth',
					})
					// comments.scrollTop = comments.scrollHeight - comments.clientHeight
				})
			},
			attention() {
				let option = this.$refs['attention-option']
				option.classList.toggle('attention')
				setTimeout(() => {
					this.isFollowed = true
				}, 1000)
			},
		},
	}
</script>

<style lang="scss">
	@import url('@/styles/shorts.scss');

	.send-gift {
		position: fixed;
		top: 63vh;
		left: 15px;
		display: flex;
		align-items: flex-end;
		animation: send-gift-anim 2s linear;

		@keyframes send-gift-anim {
			from {
				opacity: 0;
				transform: translateX(-100%);
			}
			10% {
				opacity: 1;
				transform: translateX(0);
			}
			80% {
				opacity: 1;
				transform: translateX(0);
			}
			to {
				opacity: 0;
				transform: translateX(0);
			}
		}

		.left {
			background: linear-gradient(
				to right,
				var(--primary-btn-color),
				rgba(252, 47, 86, 0.2)
			);
			padding: 5px;
			border-radius: 50px;
			display: flex;
			align-items: center;

			.avatar {
				margin-right: 5px;
				width: 40px;
				height: 40px;
				object-fit: cover;
				border-radius: 50%;
			}

			.desc {
				width: 20vw;

				.name,
				.sendto {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.name {
					font-size: 14px;
				}

				.sendto {
					font-size: 12px;
					color: yellow;
				}

				.to {
					color: yellow;
				}
			}

			.gift-icon {
				width: 40px;
			}
		}

		.right {
			font-size: 23px;
			font-weight: bold;
			font-style: oblique;
		}
	}

	.barrage {
		position: fixed;
		top: 50%;
		transform: translateX(100%);
		display: flex;
		align-items: center;
		font-size: 12px;
		animation: anim 5s linear;

		@keyframes anim {
			from {
				transform: translateX(100%);
			}
			to {
				transform: translateX(-100%);
			}
		}

		.type {
			padding: 1px 6px;
			border: 1px solid white;
			border-radius: 20px;
			margin-right: 5px;
		}
	}

	.user-joined {
		@tag-bg: rgba(58, 58, 70, 0.3);
		font-size: 12px;
		position: absolute;
		top: 70vh;
		left: 15px;
		padding: 4px 8px;
		border-radius: 20px;
		background: rgba(115, 114, 181, 0.7);
		margin-bottom: 5px;
		animation: user-joined-anim 3s linear;

		@keyframes user-joined-anim {
			from {
				opacity: 0;
				transform: translateX(100%);
			}
			10% {
				opacity: 1;
				transform: translateX(30px);
			}
			90% {
				opacity: 1;
				transform: translateX(0);
			}
			to {
				opacity: 1;
				transform: translateX(-100%);
			}
		}

		$text-color: rgb(164, 234, 253);

		.level {
			display: inline-block;

			.wrapper {
				display: flex;
				@color: rgb(130, 133, 185);
				align-items: center;
				font-size: 10px;
				border-radius: 10px;
				margin-right: 5px;
				padding: 0 6px;
				background: @color;

				img {
					margin-right: 3px;
					width: 12px;
				}
			}
		}

		.name {
			margin-right: 5px;
			font-size: 13px;
			color: $text-color;
		}

		.text {
			word-break: break-all;
		}
	}
</style>
<style scoped lang="scss">
	@import url('@/styles/shorts.scss');

	.LivePage {
		width: 100%;
		height: calc(var(--vh, 1vh) * 100);
		color: white;
		font-size: 14px;
		position: relative;

		.live-wrapper {
			width: 100%;
			height: calc(var(--vh, 1vh) * 100);
			background: black;
			display: flex;
			align-items: center;
			justify-content: center;

			video {
				width: 100%;
				object-fit: cover;
			}

			img {
				width: 100%;
				height: calc(var(--vh, 1vh) * 100);
				color: rgb(229, 229, 229);
			}
		}

		.float {
			position: absolute;
			top: 0;
			width: 100%;
			height: calc(var(--vh, 1vh) * 100);

			@tag-bg: rgba(58, 58, 70, 0.3);

			.top {
				display: flex;
				justify-content: space-between;
				margin-top: 10px;

				.left {
					margin-left: var(--page-padding);

					.liver {
						box-sizing: border-box;
						background: var(--second-btn-color-tran);
						display: flex;
						padding: 3px 4px 3px 2px;
						align-items: center;
						border-radius: 20px;

						.avatar {
							border-radius: 50%;
							width: 30px;
							height: 30px;
							margin-right: 4px;
						}

						.desc {
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: space-between;

							.desc-wrapper {
								width: 80px;

								.name {
									font-size: 12px;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
								}

								.count {
									color: gainsboro;
									font-size: 10px;
								}
							}

							.follow-btn {
								height: 30px;
								width: 45px;
								background: var(--primary-btn-color);
								border-radius: 30px;
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 12px;
							}
						}
					}

					.left-bottom {
						margin-top: calc(var(--page-padding) / 2);
						display: flex;
						font-size: 12px;

						.tag {
							display: flex;
							align-items: center;
							padding: 4px 10px;
							background: @tag-bg;
							border-radius: 20px;
							margin-right: 10px;

							img {
								margin-right: 5px;
								width: 10px;
								height: 10px;
							}
						}
					}
				}

				.right {
					margin-top: 3px;
					display: flex;
					flex-direction: column;

					.follower {
						$width: 30px;
						display: flex;

						.round {
							width: $width;
							height: $width;
							border-radius: 50%;
							margin-right: 3px;
						}

						.count {
							font-size: 12px;
							background: var(--second-btn-color-tran);
							display: flex;
							align-items: center;
							justify-content: center;
						}

						.close {
							margin-right: 10px;
							margin-left: 5px;
							padding: 6px;
							width: calc($width - 12px);
							height: calc($width - 12px);
						}
					}

					.more {
						display: flex;
						justify-content: flex-end;

						.wrapper {
							border-radius: 13px 0 0 13px;
							padding: 2px 0 2px 10px;
							margin-top: 15px;
							background: @tag-bg;
							display: flex;
							align-items: center;
							font-size: 10px;
						}
					}
				}
			}

			.bottom {
				position: absolute;
				bottom: 0;
				width: 100%;
				box-sizing: border-box;
				padding: var(--page-padding);
				padding-bottom: 10px;
				display: flex;

				.left {
					width: 87%;

					.comments {
						margin-bottom: 10px;
						overflow: auto;
						height: 20vh;

						.comments-wrapper {
							min-height: 20vh;
							display: flex;
							flex-direction: column;
							justify-content: flex-end;
						}

						.comment {
							padding: 4px 5px;
							border-radius: 10px;
							background: @tag-bg;
							margin-bottom: 5px;

							$text-color: rgb(164, 234, 253);

							&.notice {
								.text {
									color: $text-color;
								}
							}

							.level {
								display: inline-block;

								.wrapper {
									display: flex;
									@color: rgb(130, 133, 185);
									align-items: center;
									font-size: 10px;
									border-radius: 10px;
									margin-right: 5px;
									padding: 0 6px;
									background: @color;

									img {
										margin-right: 3px;
										width: 12px;
									}
								}
							}

							.name {
								margin-right: 5px;
								font-size: 13px;
								color: $text-color;
							}

							.text {
								word-break: break-all;
							}
						}
					}

					.options {
						display: flex;
						align-items: center;

						.input {
							flex: 1;
							color: #a2a2a2;
							font-size: 12px;
							border-radius: 15px;
							padding: 4px 10px;
							background: @tag-bg;
							display: flex;
							align-items: center;
							justify-content: space-between;

							img {
								width: 20px;
							}
						}

						.more {
							margin-left: 10px;
							width: 20px;
							height: 20px;
							padding: 5px;
							background: @tag-bg;
							border-radius: 50%;
						}

						.gift {
							margin-left: 10px;
							width: 31px;
						}
					}
				}

				.right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: flex-end;

					$width: 35px;

					.avatar-wrapper {
						background: linear-gradient(
							to bottom,
							#000000,
							var(--primary-btn-color)
						);
						border-radius: 20px;
						width: calc($width + 2px);
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						&.followed {
							background: linear-gradient(
								to bottom,
								rgba(240, 183, 31, 0.2),
								rgb(240, 183, 31)
							);
						}

						.avatar {
							width: $width;
							border-radius: 50%;
							background: white;
							padding: 1.5px;
						}

						.follow {
							width: 32px;
							margin-top: 5px;
							margin-bottom: 5px;
						}

						.options {
							margin-top: 8px;
							margin-bottom: 5px;
							display: flex;
							width: 20px;
							height: 20px;
							justify-content: center;
							align-items: center;

							img {
								position: absolute;
								width: 18px;
								transition: all 0.8s;
							}

							.yes {
								opacity: 0;
								transform: rotate(-180deg);
							}

							&.attention {
								.no {
									opacity: 0;
									transform: rotate(180deg);
								}

								.yes {
									opacity: 1;
									transform: rotate(0deg);
								}
							}
						}
					}
				}
			}
		}
	}
</style>
