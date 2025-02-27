<template>
	<div class="Report">
		<BaseHeader>
			<template v-slot:center>
				<span class="f16">
					<template v-if="data.mode === 'video'">视频</template>
					<template v-if="data.mode === 'music'">音乐</template>
					<template v-if="data.mode === 'chat'">私信</template>
					举报
				</span>
			</template>
		</BaseHeader>
		<div class="content">
			<div class="title">
				<span>
					你的举报将在12小时内受理，若举报成功会第一时间告知处理结果，请尽量提交完整的举报描述及材料
				</span>
			</div>
			<div class="row">
				<span>举报理由：{{ data.type }}</span>
			</div>
			<div class="l-row">
				<div class="notice">举报描述(选填)</div>
				<div class="textarea-ctn">
					<textarea
						name=""
						id=""
						cols="30"
						rows="10"
						v-model="data.desc"
						placeholder="详细描述举报理由"
					></textarea>
				</div>
				<div class="text-num">{{ data.desc.length }}/200</div>
			</div>
			<div class="upload-photo">
				<div
					class="photo-wrapper"
					:key="index"
					v-for="(item, index) in data.photos"
				>
					<img class="photo" :src="item" alt="" />
					<img
						class="close"
						src="/shorts/img/icon/components/light-close.png"
						alt=""
						@click="data.photos.pop()"
					/>
				</div>
				<div class="upload" @click="upload" v-if="data.photos.length !== 4">
					<img src="/shorts/img/icon/home/camera-gray.png" alt="" />
					<span>{{ data.photos.length }}/4</span>
				</div>
			</div>

			<dy-button type="primary" @click="_no">提交</dy-button>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { onMounted, reactive } from 'vue'
	import { _hideLoading, _no, _showLoading, _sleep } from '@/common/utils'

	defineOptions({
		name: 'SubmitReport',
	})

	const data = reactive({
		type: '色情低俗',
		mode: 'video',
		desc: '',
		photos: [],
	})

	onMounted(() => {
		data.type = ''
		data.mode = ''
	})

	async function upload() {
		_showLoading()
		await _sleep(500)
		_hideLoading()
		data.photos.push(
			new URL(`/shorts/img/poster/${data.photos.length}.jpg`, import.meta.url)
				.href
		)
	}
</script>

<style scoped lang="scss">
	@import url('@/styles/shorts.scss');

	.Report {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		overflow: auto;
		color: white;
		font-size: 14px;

		.content {
			padding-top: 60px;

			.title {
				font-size: 12px;
				padding: 10px 15px;
				color: var(--second-text-color);
				border-bottom: 1px solid #cccccc11;

				img {
					width: 10px;
					height: 10px;
					margin-right: 2px;
				}
			}

			.l-row {
				padding: 0 15px;

				.textarea-ctn {
					width: 100%;
					background: var(--active-main-bg);
					padding: 15px;
					box-sizing: border-box;
					margin-top: 10px;
					border-radius: 2px;

					textarea {
						font-family: 'Microsoft YaHei UI';
						outline: none;
						width: 100%;
						border: none;
						background: transparent;
						color: white;

						&::placeholder {
							color: var(--second-text-color);
						}
					}
				}

				.text-num {
					margin-top: 5px;
					font-size: 10px;
					color: var(--second-text-color);
					text-align: right;
				}
			}

			.upload-photo {
				margin-top: 5px;
				display: flex;
				padding: 0 15px;

				$width: calc((100vw - 3vw - 30px) / 4);

				.photo-wrapper {
					width: $width;
					height: $width;
					position: relative;
					margin-right: 1vw;

					.photo {
						object-fit: cover;
						position: absolute;
						width: 100%;
						height: 100%;
					}

					.close {
						position: absolute;
						right: 0;
						top: 0;
						background: var(--second-btn-color);
						padding: 3px;
						width: 10px;
						height: 10px;
					}
				}

				.upload {
					width: $width;
					height: $width;
					display: flex;
					flex-direction: column;
					justify-content: center;
					color: var(--second-text-color);
					font-size: 12px;
					align-items: center;
					background: var(--second-btn-color-tran);

					img {
						width: 35px;
						height: 35px;
					}
				}
			}
		}

		.button {
			position: absolute;
			left: 15px;
			right: 15px;
			bottom: 15px;
		}
	}
</style>
