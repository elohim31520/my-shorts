<template>
	<div>
		<NormalHeader :title="title" />

		<div class="content-wrapper bg-#fafafa mt-45 pb-60">
			<ApplyTab
				class="pt-10"
				v-model="applyId"
				@onChange="addContent"
				v-if="postUserId"
			/>

			<div class="pt-10 pb-12">
				<div
					class="selected-platform font-size-18 font-600 pl-10 color-#434343 pb-12"
				>
					选择平台:
				</div>
				<LotteryTypes />
			</div>

			<div class="text-align-left pt-17 pb-4 pl-20">
				<div class="w-full overflow-x-auto">
					<van-uploader
						accept="image/*"
						v-model="form.fileList"
						:preview-size="'4.375rem'"
						:before-delete="beforeDelete"
						:max-size="isLimitSize"
						:max-count="6"
						@oversize="onOversize"
						:before-read="beforeRead"
						:after-read="afterRead"
					>
						<div class="mr-18 mb-8">
							<SvgIcon color="#FAFAFA" name="icon_Upphotos" size="4.375rem" />
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
			</div>

			<div class="form-wrapper mt-10 px-10">
				<div class="form-group bg-#fff p-10 border-radius-10 box-shadow">
					<h3>标题：</h3>
					<div class="flex gap-5 justify-between items-center">
						<div class="flex-1 h-22 color-#434343">
							<ClientOnly>
								<van-field
									v-model="form.title"
									type="text"
									placeholder="请输入标题"
									maxlength="18"
									autocomplete="off"
								/>
							</ClientOnly>
						</div>
						<div class="font-size-14 color-#aeaeb1 text-right word-count">
							<span>{{ form.title.length }}</span>
							/18
						</div>
					</div>
				</div>

				<div class="p-10 bg-#fff mt-10 border-radius-10 box-shadow h-240">
					<div class="form-group">
						<h3>内容：</h3>
						<ClientOnly>
							<van-field
								v-model="form.content"
								type="textarea"
								class="w-full"
								placeholder="请输入内容"
								rows="7"
								maxlength="300"
								autocomplete="off"
							/>
						</ClientOnly>
					</div>
					<div class="font-size-14 color-#aeaeb1 text-right mt-5 word-count">
						<span>{{ form.content.length }}</span>
						/300
					</div>
				</div>
			</div>

			<PredictButton
				class="flex-center flex-col mt-20 pb-30"
				:predictedCode="predictedCode"
				:predictionTypeText="predictionTypeText"
				@cancel="cancelPredict"
				@onClick="predictionShow = true"
				v-if="pageName === 'expertForum'"
			/>
		</div>

		<Footer
			class="footer fixed bottom-0 w-full max-w-480px bg-white h-60 flex items-center justify-center px-10"
			v-model="isSubmit"
			@formReset="resetForm"
			@formSubmit="handleSubmit"
		/>

		<!-- 選擇參賽帖 -->
		<SelectGamePost
			:predictionShow="predictionShow"
			:gameType="lotteryType"
			:predictedCode="predictedCode"
			@closeCategory="closeCategory"
			@submitPrediction="submitPrediction"
		/>
	</div>
</template>

<script setup>
	import { ref, provide, onMounted, watch } from 'vue'
	import {
		isLogin,
		toast,
		confirmDialog,
		isBlank,
		isNotBlank,
		isFileAccept,
		getCdnUrl,
		back,
		getUser,
		getLotteryCode,
		redirect,
	} from '@/modules/util'

	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import ClientOnly from '@/components/ClientOnly/index.vue'
	import ApplyTab from './ApplyTab/index.vue'
	import PredictButton from './PredictButton/index.vue'
	import Footer from './Footer/index.vue'
	import SelectGamePost from './SelectGamePost/index.vue'

	import { Base64 } from 'js-base64'
	import { getIPInfo } from '@/api/common.js'
	import { useSendIdea } from '@/hooks/useSendIdea'
	import { useLoginPopupStore } from '@/stores/loginPopup.js'
	import { getPictureDetail } from '@/api/picture'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)

	const {
		lotteryType,
		lastLotteryResult,
		getFilePath,
		createPost,
		getForumsId,
		getMyForumId,
		getLastLotteryResult,
		getLastPost,
		predictionShow,
		predictedCode,
		ipBase64,
		predictionTypeText,
		predictionId,
		predictions,
		closeCategory,
		submitPrediction,
		cancelPredict,
		getPredictedCodeHandler,
		createPredictPost,
	} = useSendIdea()

	const pageName = _get(props, 'data.pageName', '')
	const targetId = _get(props, 'data.targetId', '')
	const isLimitSize = 30 * 1024 * 1024
	const title = ref('发想法')

	const seriesCode = ref('')
	const forumId = ref('')
	const pictureDetailResult = ref(null)
	const postUserId = ref(null)
	const lastPostInfo = ref(null)

	lastLotteryResult.value = await getLastLotteryResult()

	if (pageName !== 'expertForum') {
		if (isNotBlank(targetId)) {
			const res = await getPictureDetail({ issueId: targetId })
			if (res.success) {
				pictureDetailResult.value = _get(res, 'data', {})
				seriesCode.value = pictureDetailResult.value
					? pictureDetailResult.value.seriesCode
					: ''
			}
		}
		forumId.value = await getMyForumId() // 二創、發想法：MyForum
	} else {
		title.value = '发帖子'
		forumId.value = await getForumsId() // 高手論壇：userPublic

		if (isLogin()) {
			const userInfo = await getUser()
			postUserId.value = userInfo.userId
		}
	}

	const form = ref({
		title: '',
		fileList: [],
		content: '',
	})

	const attachments = ref([])

	const beforeDelete = async (file, detail) => {
		const isDelete = await confirmDialog('您确定要删除此图片')
		if (isDelete) {
			attachments.value.splice(detail.index, 1)
			return true
		} else {
			return false
		}
	}

	const beforeRead = (file) => {
		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return false
		}

		if (!isFileAccept(file.name)) {
			toast('不支持此档案类型')
			return false
		}
		return true
	}

	const afterRead = async (file) => {
		const res = await getFilePath(file)
		if (res) {
			attachments.value.push({
				url: res,
				fileType: 'p',
			})
			return res
		} else {
			form.value.fileList.pop()
			toast('上传失败')
		}
	}

	const onOversize = () => {
		toast('文件大小不能超过 30mb')
	}

	const resetForm = () => {
		applyId.value = ''
		form.value.title = ''
		form.value.fileList = []
		form.value.content = ''
		attachments.value = []
		cancelPredict()
	}

	const isSubmit = ref(false)
	const handleSubmit = async () => {
		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return false
		}

		if (isBlank(forumId.value)) {
			toast('目前论坛发生错误，无法上传！')
			return false
		}

		if (!form.value.fileList.length) {
			toast('您尚未上传图片！')
			return false
		}

		if (isBlank(form.value.content)) {
			toast('内容为必填项目！')
			return false
		} else if (form.value.content.length < 5) {
			toast('内容最少5个字！')
			return false
		}

		if (isSubmit.value) return false

		isSubmit.value = true

		let res = null
		let sendData = {
			title: form.value.title,
			postContent: form.value.content,
			postGametypeRef: lotteryType.value,
			attachments: attachments.value,
			forumId: forumId.value,
		}

		if (predictionId.value) {
			sendData.fromIp = ipBase64.value
			sendData.predictions = predictions.value

			res = await createPredictPost(sendData)
		} else {
			sendData.postYear = lastLotteryResult.value.year
			sendData.postIssue = lastLotteryResult.value.nextIssue
			sendData.predictFlag = 'n'

			if (isNotBlank(targetId)) sendData.seriesId = seriesCode.value

			res = await createPost(sendData)
		}

		if (res.success) {
			toast('发布成功')
			if (pageName !== 'expertForm' && isNotBlank(targetId)) {
				redirect(
					'/follow',
					{},
					{ postId: res.data, attachments: attachments.value[0].url }
				)
			} else {
				back()
			}
		} else {
			toast('发布失败')
			setTimeout(() => (isSubmit.value = false), 1000)
		}
	}

	// 加載上期：內容、標題、正文
	const applyId = ref('')

	const addContent = async (val) => {
		if (applyId.value !== '' && !lastPostInfo.value) {
			toast('上一期没有发布帖子')
			return false
		}

		form.value.fileList = []
		attachments.value = []
		form.value.title = ''
		form.value.content = ''

		switch (applyId.value) {
			case 'all':
				form.value.title = lastPostInfo.value.title
				form.value.content = lastPostInfo.value.postContent
				for (let i = 0; i < lastPostInfo.value.attachments.length; i++) {
					attachments.value.push({
						url: lastPostInfo.value.attachments[i].url,
						fileType: 'p',
					})
					form.value.fileList[i] = {
						url: getCdnUrl(lastPostInfo.value.attachments[i].url),
						isImage: true,
					}
				}
				break
			case 'title':
				form.value.title = lastPostInfo.value.title
				break
			case 'content':
				form.value.content = lastPostInfo.value.postContent
				break
		}
	}

	watch(
		() => lotteryType.value,
		async () => {
			applyId.value = ''
			resetForm()
			lastLotteryResult.value = await getLastLotteryResult()
			getLastPostInfo()
			cancelPredict()
			if (isLogin()) getPredictedCodeHandler()
		}
	)

	const getLastPostInfo = async () => {
		if (!isLogin() || pageName !== 'expertForum') {
			lastPostInfo.value = null
		} else {
			const lastPost = await getLastPost({
				forumId: forumId.value,
				postGametypeRef: getLotteryCode(lotteryType.value),
			})

			lastPostInfo.value = lastPost
		}
	}

	onMounted(async () => {
		let imgPath = _get(pictureDetailResult.value, 'imgPath', '')

		if (imgPath) {
			imgPath = getCdnUrl(imgPath)
			form.value.fileList[0] = { url: imgPath, isImage: true }
			form.value.title = _get(pictureDetailResult.value, 'newspaperName', '')
			attachments.value.push({
				url: _get(pictureDetailResult.value, 'imgPath', ''),
				fileType: 'p',
			})
		}

		getLastPostInfo()

		if (isLogin()) getPredictedCodeHandler()

		getIPInfo().then((ipJson) => {
			ipBase64.value = Base64.encode(JSON.stringify(ipJson))
		})
	})
</script>

<style lang="scss" scoped>
	.border-radius-10 {
		border-radius: 0.625rem;
	}

	.border-radius-8 {
		border-radius: 0.5rem;
	}
	.border-radius-6 {
		border-radius: 0.38125rem;
	}

	.box-shadow {
		box-shadow: 0 0 0.25rem 0 rgba(0, 0, 0, 0.1);
	}

	.van-uploader {
		:deep(.van-uploader__wrapper) {
			flex-wrap: nowrap !important;
			.van-uploader__input-wrapper,
			.van-uploader__preview {
				padding-top: 5px;
				margin-right: 0.875rem;
			}

			.van-uploader__preview-image {
				img {
					border-radius: 0.5rem;
				}
			}
		}
	}

	.content-wrapper {
		min-height: calc(100vh - 2.8125rem);

		.selected-platform {
			line-height: 1.53125rem;
		}

		.form-wrapper {
			.form-group {
				line-height: 1.375;
				letter-spacing: 0.02rem;
				h3 {
					color: #434343;
					margin-bottom: 0.625rem;
				}

				:deep(.van-field) {
					padding: 0;
					input,
					textarea {
						font-size: 1rem;
						&::placeholder {
							color: #aeaeb1;
							font-size: 1rem;
						}
					}
				}
			}
			.word-count {
				letter-spacing: 0.0175rem;
				line-height: 1.375rem;
			}
		}
	}

	.footer {
		left: 50%;
		transform: translateX(-50%);
	}

	.van-popup--center {
		border-radius: 0.5rem;
	}
</style>
