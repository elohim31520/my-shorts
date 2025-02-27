<template>
	<div
		class="fixed left-50% -translate-x-50% bottom-0 max-w-480px w-full bg-white z-99 px-9"
	>
		<div
			class="flex-y-center justify-between text-14 font-600 color-[#434343] w-full h-50"
		>
			<div class="flex-y-center flex-col w-50" @click="handleLikeClick">
				<SvgIcon
					class="mb-3"
					size="1.375rem"
					:name="detailData.likeStatus === 'y' ? 'like_click3' : 'like_click1'"
				/>
				喜欢
			</div>
			<div
				class="flex-center flex-col w-50"
				@click="doComment"
				:class="{ 'color-primary': sendStore.show }"
			>
				<SvgIcon
					class="mb-3"
					size="1.375rem"
					:name="sendStore.show ? 'Icon_Details_Comments_on' : 'message-9'"
				/>
				评论
			</div>
			<div class="flex-center flex-col w-50" @click="doFavorite">
				<SvgIcon
					class="mb-3"
					size="1.375rem"
					:name="favoriteStatus == 'y' ? 'icon_collect_Click3' : 'star'"
				/>
				收藏
			</div>
			<div
				class="flex-center flex-col w-50 whitespace-nowrap"
				@click="showStory = !showStory"
				:class="{ 'color-primary': showStory }"
			>
				<SvgIcon class="mb-3" size="1.375rem" name="screenshot" />
				查看图解
			</div>
			<div
				class="flex-center flex-col w-50"
				:class="{ 'color-primary': isPreviewVisible }"
				@click="clickDownload(detailData.imgPath)"
			>
				<SvgIcon class="mb-3" size="1.375rem" name="download" />
				下载
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref, watch } from 'vue'
	import { storeToRefs } from 'pinia'
	import { usePictureDetailStore } from '@/stores/pictureDetail'
	import { toast } from '@/modules/util'
	import { toggleCollect } from '@/api/common'
	import { useUserStore } from '@/stores/user'
	import { useSendStore } from '@/stores/send.js'
	import { comment } from '@/api/picture'
	import { usePostDetail } from '../CommentList/usePostDetail'

	const props = defineProps({
		detailData: {
			type: Object,
			default: () => ({}),
		},
		postType: { type: String, default: 'p' },
	})

	const issueId = computed(() => props.detailData?.issueId)

	const emit = defineEmits(['afterReply', 'likeSuccess'])

	const { showStory, isPreviewVisible } = storeToRefs(usePictureDetailStore())
	const { previewImg, doLike, doDownload, addCommentCount } =
		usePictureDetailStore()
	const { data: userData } = useUserStore()
	const sendStore = useSendStore()
	const postDetail = usePostDetail()

	const favoriteStatus = ref(props.detailData.favoriteStatus || 'n')

	const doFavorite = () => {
		if (!issueId.value) {
			toast('当前暂无数据')
			return
		}
		toggleCollect({
			targetId: issueId.value,
			targetRef: _get(props.detailData, 'newspaperCode', ''),
			favoriteFlag: 't',
		}).then((res) => {
			if (!res.success) return
			let msg = ''

			if (favoriteStatus.value == 'y') {
				favoriteStatus.value = 'n'
				props.detailData.favoriteCount -= 1
				msg = '取消收藏成功'
			} else {
				favoriteStatus.value = 'y'
				props.detailData.favoriteCount += 1
				msg = '收藏成功'
			}

			toast(msg)
		})
	}

	const handleLikeClick = async () => {
		await doLike(props.detailData, {
			targetIdKey: 'issueId',
			targetRefKey: 'newspaperCode',
			statusKey: 'likeStatus',
			likeFlag: 't',
		})

		// like picture 後要連動 like series, cancel like picture 則無須連動；後端已經有連動所以不需要再打一次 api，但是狀態需自行改變
		emit('likeSuccess')
	}

	function doComment() {
		const issueId = _get(props.detailData, 'issueId')
		if (!issueId) {
			toast('当前暂无数据')
			return
		}
		sendStore.setConfig({ zIndex: 11, bottom: '3.125rem', textRequired: true })
		sendStore.doSend = async ({ text, attachments }) => {
			const res = await comment({
				postContent: text,
				attachments: attachments,
				postYear: _get(props.detailData, 'year', ''),
				postIssue: _get(props.detailData, 'issue', ''),
				issueId: _get(props.detailData, 'issueId', ''),
				selectedUserId: userData.userId,
				postType: props.postType,
				threadPostId: postDetail.getImgExplainIdParam(props.postType), //圖解一級評論要傳imageExplainId
			})
			if (!res) return
			if (res.success) toast('评论成功')
			emit('afterReply')
			sendStore.toggle()
			addCommentCount(1)
		}
		sendStore.toggle()
	}

	function clickDownload(path) {
		if (!path) {
			toast('当前暂无图纸')
			return
		}
		window._global.isH5 ? previewImg(path) : doDownload(path)
	}

	watch(
		() => props.detailData,
		(newDetailData) => {
			favoriteStatus.value = newDetailData?.favoriteStatus || 'n'
		}
	)

	watch(
		() => sendStore.triggerFirstComment,
		(newValue) => {
			if (newValue) {
				doComment()
				sendStore.resetFirstComment()
			}
		}
	)
</script>
