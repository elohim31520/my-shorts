<template>
	<from-bottom-dialog
		page-id="home-index"
		:modelValue="modelValue"
		@update:modelValue="(e) => $emit('update:modelValue', e)"
		:show-heng-gang="false"
		maskMode="dark"
		@cancel="cancel()"
		height="480px"
		mode="light"
	>
		<div class="follow-setting-dialog">
			<div class="dialog-header">
				<div class="title-wrapper">
					<span class="title">{{ currentItem.author.nickname }}</span>
					<span class="subtitle">
						抖音号：{{ _getUserDouyinId(currentItem) }}
					</span>
				</div>
				<dy-back
					mode="dark"
					img="close"
					direction="right"
					@click="cancel()"
				></dy-back>
			</div>
			<div class="options">
				<div class="option" @click="cancel((e) => $emit('showShare'))">
					<img src="/shorts/img/icon/components/follow/share.png" alt="" />
					<span>分享主页</span>
				</div>
				<div
					class="option"
					@click="cancel((e) => $router.push('/message/chat'))"
				>
					<!-- <img
						src="/shorts/img/icon/components/follow/private-chat.png"
						alt=""
					/> -->
					<span>发私信</span>
				</div>
				<div
					class="option"
					@click="cancel((e) => $router.push('/home/report', { mode: 'chat' }))"
				>
					<!-- <img
						src="/shorts/img/icon/components/follow/report.png"
						alt=""
					/> -->
					<span>举报</span>
				</div>
				<div class="option" @click="cancel((e) => $emit('showBlockDialog'))">
					<!-- <img
						src="/shorts/img/icon/components/follow/forbid.png"
						alt=""
					/> -->
					<span>拉黑</span>
				</div>
			</div>
			<div class="l-rows">
				<div class="l-row" @click="cancel((e) => $emit('showChangeNote'))">
					<div class="left">设置分组</div>
					<div class="right">
						<!-- <img
							src="/shorts/img/icon/components/follow/write.png"
							alt=""
						/> -->
					</div>
				</div>
				<div class="l-row" @click="cancel((e) => $emit('showChangeNote'))">
					<div class="left">设置备注名</div>
					<div class="right">
						<!-- <img
							src="/shorts/img/icon/components/follow/write.png"
							alt=""
						/> -->
					</div>
				</div>
				<div class="l-row">
					<div class="left">设置更新和开播通知</div>
					<div class="right">
						<dy-back mode="dark" direction="right" @click="cancel()"></dy-back>
					</div>
				</div>
				<div class="l-row">
					<div class="left">在关注列表中置顶</div>
					<div class="right">
						<!-- <switches
							v-model="switches1"
							theme="bootstrap"
							color="success"
						></switches> -->
					</div>
				</div>
				<div class="l-row">
					<div class="left">不让TA看</div>
					<div class="right">
						<!-- <switches
							v-model="switches1"
							theme="bootstrap"
							color="success"
						></switches> -->
					</div>
				</div>
				<div class="l-row" @click="cancel((e) => $emit('cancelFollow'))">
					<div class="left" style="color: red">取消关注</div>
					<div class="right">
						<!-- <img
							src="/shorts/img/icon/components/follow/reduce.png"
							alt=""
						/> -->
					</div>
				</div>
			</div>
		</div>
	</from-bottom-dialog>
</template>
<script>
	import FromBottomDialog from '@/common/components/dialog/FromBottomDialog.vue'
	// import Switches from '../../message/components/swtich/switches'
	import { DefaultUser } from '@/constants/shorts'
	import { useShorts } from '@/views/shorts/hooks/useShorts'

	const { _getUserDouyinId } = useShorts()

	export default {
		name: 'FollowSetting',
		components: {
			FromBottomDialog,
		},
		props: {
			currentItem: {
				type: Object,
				default() {
					return {
						user: DefaultUser,
						isRequest: false,
						post: [],
					}
				},
			},
			modelValue: {
				type: Boolean,
				default() {
					return false
				},
			},
		},
		data() {
			return {
				switches1: false,
				switches2: false,
			}
		},
		computed: {},
		created() {},
		methods: {
			_getUserDouyinId,
			cancel(cb) {
				this.$emit('update:modelValue', false)
				cb && cb()
			},
		},
	}
</script>

<style scoped lang="scss">
	@import url('@/styles/shorts.scss');
	.follow-setting-dialog {
		padding: 15px;
		font-size: 14px;

		.dialog-header {
			color: rgb(81, 81, 89);
			font-size: 14px;
			position: relative;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;

			.title-wrapper {
				display: flex;
				flex-direction: column;
			}

			.title {
				font-size: 18px;
			}

			.subtitle {
				margin-top: 5px;
				color: var(--second-text-color);
				font-size: 13px;
			}

			img {
				width: 14px;
				height: 14px;
				padding: 6px;
				border-radius: 50%;
				background: rgba(187, 187, 194, 0.4);
			}
		}

		.options {
			margin-top: 20px;
			display: flex;
			justify-content: space-between;

			.option {
				box-sizing: border-box;
				padding: 10px;
				display: flex;
				background: white;
				flex-direction: column;
				align-items: center;
				width: 23%;
				font-size: 12px;
				border-radius: 8px;

				img {
					margin-top: 5px;
					margin-bottom: 10px;
					$width: 20px;
					width: $width;
					height: $width;
				}
			}
		}

		.l-rows {
			margin-top: 20px;

			.l-row {
				height: 45px;
				padding: 0 20px;
				background: white;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid rgba(222, 222, 222, 0.42);

				&:first-child {
					border-radius: 10px 10px 0 0;
				}

				&:last-child {
					border-bottom: none;
					border-radius: 0 0 10px 10px;
				}

				img {
					width: 20px;
					height: 20px;
				}
			}
		}
	}
</style>
