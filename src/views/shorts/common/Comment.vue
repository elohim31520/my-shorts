<template>
	<from-bottom-dialog
		:page-id="pageId"
		:modelValue="modelValue"
		@update:modelValue="(e) => $emit('update:modelValue', e)"
		@cancel="cancel"
		:show-heng-gang="false"
		maskMode="light"
		:height="height"
		tag="comment"
		mode="white"
	>
		<template v-slot:header>
			<div class="title">
				<div class="num">{{ _formatNumber(comments.length) }}条评论</div>
				<div class="right">
					<SvgIcon
						name="icon_Input_box_cancel"
						size="1.875rem"
						@click="cancel"
					/>
				</div>
			</div>
		</template>
		<div class="comment">
			<div class="wrapper" v-if="comments.length">
				<div class="items">
					<div class="item" :key="i" v-for="(item, i) in comments">
						<div class="main">
							<div class="content">
								<img :src="item.avatar" alt="" class="head-image" />
								<div class="comment-container">
									<div class="name">{{ item.nickname }}</div>
									<div class="detail" :class="item.user_buried && 'gray'">
										{{ item.user_buried ? '该评论已折叠' : item.content }}
									</div>
									<div class="time-wrapper">
										<div class="left">
											<div class="time">
												{{ getTimeDifference(item.create_time)
												}}{{ item.ip_location && ` · ${item.ip_location}` }}
											</div>
											<div class="reply-text">回复</div>
										</div>
										<div class="right d-flex" style="gap: 10px">
											<div
												class="love"
												:class="item.user_digged && 'loved'"
												@click="loved(item)"
											>
												<SvgIcon
													:name="
														item.user_digged ? 'like_click3' : 'like_click1'
													"
													size="0.9375rem"
													class="mr-4"
												/>

												<span v-if="item.digg_count">
													{{ _formatNumber(item.digg_count) }}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="replies" v-if="Number(item.sub_comment_count)">
							<template v-if="item.showChildren">
								<div class="reply" :key="i" v-for="(child, i) in item.children">
									<div class="content">
										<img :src="child.avatar" alt="" class="head-image" />
										<div class="comment-container">
											<div class="name">
												{{ child.nickname }}
												<div class="reply-user" v-if="child.replay"></div>
												{{ child.replay }}
											</div>
											<div class="detail">{{ child.content }}</div>
											<div class="time-wrapper">
												<div class="left">
													<div class="time">
														{{ getTimeDifference(child.create_time)
														}}{{
															child.ip_location && ` · ${item.ip_location}`
														}}
													</div>
													<div class="reply-text">回复</div>
												</div>
												<div
													class="love"
													:class="child.user_digged && 'loved'"
													@click="loved(item)"
												>
													<SvgIcon
														:name="
															child.user_digged ? 'like_click3' : 'like_click1'
														"
														size="0.9375rem"
														class="mr-4"
													/>
													<span>{{ _formatNumber(child.digg_count) }}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<Loading
								v-if="loadChildren && loadChildrenItemCId === item.comment_id"
								:type="'small'"
								:is-full-screen="false"
							/>
							<div class="more" v-else @click="handShowChildren(item)">
								<div class="gang"></div>
								<span>
									展开{{
										item.showChildren ? '更多' : `${item.sub_comment_count}条`
									}}回复
								</span>
								<SvgIcon name="icon_Log_arrow" size="1.375rem" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<Loading v-else style="position: absolute" />
			<transition name="fade">
				<BaseMask v-if="isCall" mode="lightgray" @click="isCall = false" />
			</transition>
			<div class="input-toolbar">
				<transition name="fade">
					<div class="call-friend" v-if="isCall">
						<div
							class="friend"
							:key="i"
							v-for="(item, i) in friends.all"
							@click="toggleCall(item)"
						>
							<img
								:style="item.select ? 'opacity: .5;' : ''"
								class="avatar"
								:src="item.avatar"
								alt=""
							/>
							<span>{{ item.name }}</span>
							<img
								v-if="item.select"
								class="checked"
								src="/shorts/img/icon/components/check/check-red-share.png"
							/>
						</div>
					</div>
				</transition>

				<div class="toolbar">
					<div class="input-wrapper">
						<AutoInput
							v-model="comment"
							placeholder="善语结善缘，恶言伤人心"
						></AutoInput>
						<div class="right">
							<img
								src="/shorts/img/icon/message/call.png"
								@click="isCall = !isCall"
							/>
							<img
								src="/shorts/img/icon/message/emoji-black.png"
								@click="_no"
							/>
						</div>
					</div>
					<img
						v-if="comment"
						src="/shorts/img/icon/message/up.png"
						@click="send"
					/>
				</div>
			</div>
		</div>
	</from-bottom-dialog>
</template>

<script lang="ts">
	import AutoInput from './AutoInput.vue'
	import { mapState } from 'pinia'
	import FromBottomDialog from '@/views/shorts/common/dialog/FromBottomDialog.vue'
	import Loading from '@/views/shorts/common/Loading.vue'
	import Search from './Search.vue'
	import { getTimeDifference } from '@/modules/date'
	import { useBaseStore } from '@/stores/shorts'
	import { videoCommentsApi } from '@/api/shorts'
	import BaseMask from '@/views/shorts/common/BaseMask.vue'
	import { useShorts } from '@/views/shorts/hooks/useShorts'

	const { _formatNumber, _no } = useShorts()

	export default {
		name: 'Comment',
		components: {
			AutoInput,
			FromBottomDialog,
			Loading,
			Search,
		},
		props: {
			modelValue: {
				type: Boolean,
				default() {
					return false
				},
			},
			videoId: {
				type: String,
				default: null,
			},
			pageId: {
				type: String,
				default: 'home-index',
			},
			height: {
				type: String,
				default: 'calc(var(--vh, 1vh) * 70)',
			},
		},
		computed: {
			...mapState(useBaseStore, ['friends']),
		},
		watch: {
			modelValue(newVale) {
				if (newVale) {
					this.getData()
				} else {
					this.comments = []
				}
			},
		},
		data() {
			return {
				comment: '',
				test: '',
				comments: [],
				options: [
					{ id: 1, name: '私信回复' },
					{ id: 2, name: '复制' },
					{ id: 3, name: '搜一搜' },
					{ id: 4, name: '举报' },
				],
				selectRow: {},
				isInput: false,
				isCall: false,
				loadChildren: false,
				loadChildrenItemCId: -1,
			}
		},
		mounted() {},
		methods: {
			getTimeDifference,
			_no,
			_formatNumber,
			sampleSize(arr, num) {
				const list = []
				const indexs = []
				while (list.length !== num) {
					const j = _random(0, arr.length - 1)
					if (!indexs.includes(j)) {
						list.push(arr[j])
						indexs.push(j)
					}
				}
				return list
			},
			// 评论发送成功后调用此方法
			resetSelectStatus() {
				this.friends.all.forEach((item) => {
					item.select = false // 重置选中状态
				})
			},
			async handShowChildren(item) {
				this.loadChildrenItemCId = item.comment_id
				this.loadChildren = true
				_delay(() => {
					this.loadChildren = false
					if (item.showChildren) {
						item.children = item.children.concat(
							this.sampleSize(this.comments, 10)
						)
					} else {
						item.children = this.sampleSize(this.comments, 3)
						item.showChildren = true
					}
				}, 500)
			},
			send() {
				if (!this.comment.trim()) {
					return // 如果评论内容为空，直接返回
				}
				const baseStore = useBaseStore()
				const commentData = {
					ip_location: baseStore.userinfo.ip_location,
					aweme_id: this.videoId,
					content: this.comment,
					create_time: Date.now(),
					uid: String(baseStore.userinfo.uid),
					short_id: String(baseStore.userinfo.short_id),
					unique_id: baseStore.userinfo.unique_id,
					signature: baseStore.userinfo.signature,
					nickname: baseStore.userinfo.nickname,
					avatar: baseStore.userinfo.avatar_168x168['url_list'][0],
					// 其他必要的字段可以根据你的需求添加
				}
				// this.$props.item.statistics.comment_count++
				// _updateItem(this.$props, 'isLoved', !props.item.isLoved)
				this.comments.unshift(commentData)
				this.comment = ''
				this.isCall = false
				this.resetSelectStatus()
			},
			async getData() {
				let res: any = await videoCommentsApi({ id: this.videoId })
				if (res.success) {
					const list = _get(res, 'data.list', []).map((vo) => {
						return { ...vo, showChildren: false, digg_count: +vo.digg_count }
					})
					this.comments = [...list]
				}
			},
			cancel() {
				this.$emit('update:modelValue', false)
				this.$emit('close')
			},
			toggleCall(item) {
				item.select = !item.select
				let name = item.name
				if (this.comment.includes('@' + name)) {
					this.comment = this.comment.replace(`@${name} `, '')
				} else {
					this.comment += `@${name} `
				}
			},
			loved(row) {
				if (row.isLoved) {
					row.digg_count--
				} else {
					row.digg_count++
				}
				row.user_digged = !row.user_digged
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import url('@/styles/shorts.scss');

	.title {
		box-sizing: border-box;
		width: 100%;
		height: 40px;
		padding: 0 15px;
		background: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 10px 10px 0 0;

		.num {
			width: 100%;
			position: absolute;
			font-size: 12px;
			font-weight: bold;
			text-align: center;
		}

		.right {
			display: flex;
			gap: 12px;
			position: relative;
			z-index: 9;
			margin-left: auto;

			svg {
				color: #000;
				background: rgb(242, 242, 242);
				padding: 4px;
				font-size: 16px;
				border-radius: 50%;
			}
		}
	}

	.gray {
		color: var(--second-text-color);
	}

	.comment {
		color: #000;
		width: 100%;
		background: #fff;
		z-index: 5;

		.wrapper {
			width: 100%;
			position: relative;
			padding-bottom: 60px;
		}

		.items {
			width: 100%;

			.item {
				width: 100%;
				margin-bottom: 15px;

				.main {
					width: 100%;
					padding: 5px 0;
					display: flex;

					&:active {
						background: #53535321;
					}

					.head-image {
						margin-left: 15px;
						margin-right: 10px;
						width: 37px;
						height: 37px;
						border-radius: 50%;
					}
				}

				.replies {
					padding-left: 55px;

					.reply {
						padding: 5px 0 5px 5px;
						display: flex;

						&:active {
							background: #53535321;
						}

						.head-image {
							margin-right: 10px;
							width: 20px;
							height: 20px;
							border-radius: 50%;
						}
					}

					.more {
						font-size: 13px;
						margin: 5px;
						display: flex;
						align-items: center;
						color: gray;

						.gang {
							background: #d5d5d5;
							width: 20px;
							margin-right: 10px;
							height: 1px;
						}

						span {
							margin-right: 5px;
						}

						svg {
							font-size: 10px;
						}
					}
				}

				.content {
					width: 100%;
					display: flex;
					font-size: 14px;

					.comment-container {
						flex: 1;
						margin-right: 20px;

						.name {
							color: var(--second-text-color);
							margin-bottom: 5px;
							display: flex;
							align-items: center;

							.reply-user {
								margin-left: 5px;
								width: 0;
								height: 0;
								border: 5px solid transparent;
								border-left: 6px solid gray;
							}
						}

						.detail {
							margin-bottom: 5px;
						}

						.time-wrapper {
							display: flex;
							align-items: center;
							justify-content: space-between;
							font-size: 13px;

							.left {
								display: flex;

								.time {
									color: #c4c3c3;
									margin-right: 10px;
								}

								.reply-text {
									color: var(--second-text-color);
								}
							}

							.love {
								color: gray;
								display: flex;
								align-items: center;

								&.loved {
									color: rgb(231, 58, 87);
								}

								.love-image {
									font-size: 17px;
									margin-right: 4px;
								}

								span {
									word-break: keep-all;
								}
							}
						}
					}
				}
			}
		}

		$normal-bg-color: rgb(35, 38, 47);
		$chat-bg-color: rgb(105, 143, 244);

		.input-toolbar {
			border-radius: 10px 10px 0 0;
			background: white;
			position: fixed;
			width: 100%;
			bottom: 0;
			z-index: 3;

			$space-width: 18px;
			$icon-width: 48px;

			.call-friend {
				padding-top: 30px;
				overflow-x: scroll;
				display: flex;
				padding-right: $space-width;

				.friend {
					width: $icon-width;
					position: relative;
					margin-left: $space-width;
					margin-bottom: $space-width;
					font-size: 10px;
					display: flex;
					flex-direction: column;
					align-items: center;

					.avatar {
						width: $icon-width;
						height: $icon-width;
						border-radius: 50%;
					}

					span {
						margin-top: 5px;
						text-align: center;
						width: $icon-width;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.checked {
						position: absolute;
						top: $icon-width - 1.5;
						right: -2px;
						width: 20px;
						height: 20px;
						border-radius: 50%;
					}
				}
			}

			.toolbar {
				$icon-width: 25px;
				display: flex;
				align-items: center;
				padding: 10px 15px;
				border-top: 1px solid #e2e1e1;

				.input-wrapper {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
					padding: 5px 10px;
					background: #eee;
					border-radius: 20px;

					.right {
						display: flex;
						align-items: center;
					}

					.auto-input {
						width: calc(100% - 160px);
					}
				}

				img {
					width: $icon-width;
					height: $icon-width;
					border-radius: 50%;
					margin-left: 15px;
				}
			}
		}
	}

	.comment-enter-active,
	.comment-leave-active {
		transition: all 0.15s ease;
	}

	.comment-enter-from,
	.comment-leave-to {
		transform: translateY(60vh);
	}
</style>
