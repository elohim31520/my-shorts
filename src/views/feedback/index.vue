<template>
	<div>
		<NormalHeader title="意见反馈" />

		<div class="content-wrapper bg-#fafafa mt-45 pb-80">
			<div class="form-wrapper pt-20 px-10">
				<div class="form-group bg-#fff p-10 border-radius-10 shadow-primary">
					<h3>标题：</h3>
					<input
						type="text"
						placeholder="請输入您反馈的标题"
						v-model="form.title"
						autocomplete="off"
					/>
				</div>

				<div class="pt-30 px-10 bg-#fff mt-10 border-radius-10 shadow-primary">
					<div class="form-group">
						<h3>内容：</h3>
						<textarea
							ref="ta"
							v-model="form.content"
							maxlength="300"
							class="w-full"
							placeholder="请输入您反馈的内容或著建议"
						></textarea>
					</div>

					<div class="py-20 text-center">
						<van-uploader
							accept="image/*"
							v-model="form.fileList"
							:preview-size="'6.25rem'"
							:before-delete="beforeDelete"
							:max-size="30 * 1024 * 1024"
							:max-count="1"
							@oversize="onOversize"
						>
							<div>
								<SvgIcon color="#FAFAFA" name="icon_Upphotos" size="6.25rem" />
							</div>
							<template #preview-delete>
								<div
									class="preview-cover van-ellipsis w-20 h-20 bg-#9e9e9e color-#fff rounded-full font-size-12 flex items-center justify-center absolute top-0 right--5"
								>
									X
								</div>
							</template>
						</van-uploader>
					</div>

					<div class="font-size-14 color-#aeaeb1 text-right word-count">
						<span>{{ form.content.length }}</span>
						/300
					</div>
				</div>
			</div>

			<div class="send-feedback mt-30 w-80% mx-auto">
				<van-button
					color="#34c759"
					size="large"
					class="btn-send"
					@click="handleSubmit"
				>
					<div class="flex items-center font-600 font-size-18">传送</div>
				</van-button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, provide } from 'vue'
	import {
		isLogin,
		toast,
		confirmDialog,
		isBlank,
		isNotBlank,
	} from '@/modules/util'

	import NormalHeader from '@/components/NormalHeader/index.vue'

	import { useLoginPopupStore } from '@/stores/loginPopup.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)

	const form = ref({
		title: '',
		fileList: [],
		content: '',
	})

	const beforeDelete = async (file) => {
		return confirmDialog('您确定要删除此图片')
	}

	const onOversize = () => {
		toast('文件大小不能超过 30mb')
	}

	// const resetForm = () => {
	// 	form.value.title = ''
	// 	form.value.fileList = []
	// 	form.value.content = ''
	// 	predictFlag.value = false
	// }

	// const afterRead = (file) => {
	// 	console.log(file)
	// }

	// const previewSize = computed(() =>
	// 	form.value.fileList.length ? '17.625rem' : 80
	// )

	const isSubmit = ref(false)
	const handleSubmit = async () => {
		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return false
		}

		if (!form.value.fileList.length) {
			toast('您尚未上传图片')
			return false
		}

		if (isBlank(form.value.content)) {
			toast('内容为必填项目')
			return false
		}

		if (isSubmit.value) return false

		isSubmit.value = true

		let uploadFunc = []
		let attachments = []
		let fileIndex = 0

		if (_get(form.value.fileList, `[0].url`, '') !== '') {
			attachments.push({
				url: _get(pictureDetailResult.value, 'imgPath', ''),
				fileType: 'p',
			})
			fileIndex++
		}

		for (let i = fileIndex; i < form.value.fileList.length; i++) {
			uploadFunc[i] = getFilePath(form.value.fileList[i])
		}

		const allFilePaths = await Promise.all(uploadFunc)

		allFilePaths.map((item) => {
			if (isNotBlank(item)) {
				attachments.push({
					url: item,
					fileType: 'p',
				})
			}
		})

		if (!attachments.length) {
			toast('上传失败')
			isSubmit.value = false
			return false
		}

		const lotteryResult = await getLotteryResult()
		let sendData = {
			title: form.value.title,
			postContent: form.value.content,
			postYear: lotteryResult.year,
			postIssue: lotteryResult.issue,
			attachments,
			predictFlag: predictFlag.value ? 'y' : 'n',
		}

		if (isNotBlank(targetId)) {
			sendData = Object.assign(sendData, { seriesId: seriesCode.value })
		}

		const res = await createPost(sendData)
		if (res) {
			toast('发布成功')
			resetForm()
		} else {
			toast('发布失败')
		}
		isSubmit.value = false
	}
</script>

<style lang="scss" scoped>
	.border-radius-10 {
		border-radius: 0.625rem;
	}

	.border-radius-8 {
		border-radius: 0.5rem;
	}

	.content-wrapper {
		min-height: calc(100vh - 2.8125rem);

		.selected-platform {
			line-height: 1.5625rem;
		}

		.form-wrapper {
			.form-group {
				line-height: 1.375;
				letter-spacing: 0.02rem;
				h3 {
					color: #434343;
					margin-bottom: 0.625rem;
					font-family: Noto Sans;
				}
				input,
				textarea {
					background-color: transparent;
					border: 0;
					width: 100%;
					border: 0;
					color: #434343;
					&::placeholder {
						color: #aeaeb1;
						opacity: 1;
					}
				}

				textarea {
					min-height: 9.375rem;
				}
			}
			.word-count {
				letter-spacing: 0.0175rem;
				line-height: 1.375rem;
			}
		}

		.btn-send {
			border-radius: 0.5rem;
			line-height: 2.5;
			height: 2.5rem;
			flex: 1;
			border: 1px solid $primary-color !important;
			border-radius: 0.5rem;
		}
	}
</style>
