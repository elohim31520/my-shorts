<template>
	<transition name="fade">
		<div class="DouyinCode" v-if="modelValue">
			<div class="content">
				<div class="video-poster">
					<img :src="item.video.cover.url_list[0]" class="poster" />
				</div>
				<div class="desc">
					<div class="left">
						<div class="user">@{{ item.author.nickname }}</div>
						<div class="title">{{ item.desc }}</div>
					</div>
					<img
						class="code"
						src="/shorts/img/icon/components/video/douyin-code.jpg"
						alt=""
					/>
				</div>
			</div>
			<div class="toolbar">
				<div class="title">分享到</div>
				<div class="shares">
					<div class="share-to" @click="_no">
						<img src="/shorts/img/icon/components/video/toqq.webp" alt="" />
						<span>QQ好友</span>
					</div>
					<div class="share-to" @click="_no">
						<img src="/shorts/img/icon/components/video/tozone.webp" alt="" />
						<span>QQ空间</span>
					</div>
					<div class="share-to" @click="_no">
						<img
							src="/shorts/img/icon/components/video/towechatchat.webp"
							alt=""
						/>
						<span>微信好友</span>
					</div>
					<div class="share-to" @click="_no">
						<img src="/shorts/img/icon/components/video/towechat.webp" alt="" />
						<span>朋友圈</span>
					</div>
					<div class="share-to" @click="_no">
						<img
							src="/shorts/img/icon/components/video/todownload.webp"
							alt=""
						/>
						<span>保存到相册</span>
					</div>
				</div>
				<div class="cancel" @click="cancel">取消</div>
			</div>
		</div>
	</transition>
</template>
<script>
	import { useShorts } from '@/views/shorts/hooks/useShorts'

	const { _no } = useShorts()

	export default {
		name: 'DouyinCode',
		props: {
			item: {},
			modelValue: {
				type: Boolean,
				default() {
					return false
				},
			},
		},
		data() {
			return {}
		},
		computed: {},
		created() {},
		methods: {
			_no,
			cancel() {
				this.$emit('update:modelValue', false)
			},
		},
	}
</script>

<style scoped lang="scss">
	@import url('@/styles/shorts.scss');

	.DouyinCode {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		background: transparent;
		$w: 70vw;

		.content {
			background: white;
			width: $w;
			margin-bottom: 40px;
			position: relative;
			border-radius: 10px;
			overflow: hidden;

			.desc {
				display: flex;
				gap: 20px;
				padding: 10px;

				.left {
					font-size: 18px;

					.title {
						margin-top: 10px;
						font-size: 14px;
						color: var(--second-text-color);
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box; //作为弹性伸缩盒子模型显示。
						-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
						-webkit-line-clamp: 1; //显示的行
					}
				}

				.code {
					width: 60px;
				}
			}

			.video-poster {
				width: $w;
				height: $w;
				overflow: hidden;

				.poster {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}

		.toolbar {
			width: 100vw;
			background: black;
			border-radius: 10px 10px 0 0;
			color: white;

			.title {
				font-size: 12px;
				padding: 14px;
				text-align: center;
			}

			$space-width: 18px;
			$icon-width: 45px;

			.shares {
				display: flex;
				margin-bottom: $space-width;
				gap: 20px;
				padding-left: 20px;

				.share-to {
					img {
						width: $icon-width;
						height: $icon-width;
						border-radius: 50%;
						margin-bottom: 5px;
					}

					span {
						color: var(--second-text-color);
						font-size: 10px;
						display: block;
						text-align: center;
					}
				}
			}

			.cancel {
				font-size: 16px;
				background: rgb(38, 38, 38);
				color: rgba(white, 0.8);
				padding: 15px;
				text-align: center;
			}
		}
	}
</style>
