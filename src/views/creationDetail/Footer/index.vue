<template>
	<ul class="footer">
		<li
			v-for="(vo, index) in items"
			:key="index"
			@click="doClick(vo)"
			:class="vo.classes"
		>
			<SvgIcon class="cursor-pointer" size="1.375rem" :name="vo.icon" />
			<span>{{ vo.text }}</span>
		</li>
	</ul>
</template>
<script setup>
	import { ref, computed, watch } from 'vue'
	import { useSendStore } from '@/stores/send.js'
	import { usePostDetail } from '../usePostDetail.js'
	import { replyPost } from '@/api/bbs.js'
	import { usePictureDetailStore } from '@/stores/pictureDetail'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({
				postId: null,
				isLike: 'n',
				isCollect: 'n',
				postUserId: null,
			}),
		},
	})

	const { previewImg, doDownload } = usePictureDetailStore()
	const sendStore = useSendStore()
	const postDetail = usePostDetail()
	const emit = defineEmits(['afterReply'])
	const isPreviewVisible = ref(false)
	const items = ref([
		{
			text: '喜欢',
			icon: 'like_click1',
			icon: computed(() =>
				props.data.isLike == 'y' ? 'like_click3' : 'like_click1'
			),
			onClick: clickLike,
		},
		{
			text: '评论',
			icon: computed(() =>
				sendStore.show ? 'Icon_Details_Comments_on' : 'message-9'
			),
			onClick: doSend,
			classes: computed(() => (sendStore.show ? 'active' : null)),
		},
		{
			text: '收藏',
			icon: computed(() =>
				props.data.isCollect == 'y' ? 'icon_collect_Click3' : 'star'
			),
			onClick: clickCollect,
		},
		{
			text: '下载',
			icon: 'download',
			onClick: () => {
				const path = _get(props.data, 'attachments[0].url', '')
				window._global.isH5 ? previewImg(path) : doDownload(path)
			},
			classes: computed(() => (isPreviewVisible.value ? 'active' : null)),
		},
	])

	function doClick(vo) {
		if (vo.onClick) vo.onClick()
	}

	async function clickLike() {
		postDetail.clickLike(props.data, {
			likeFlag: 'p',
			targetRef: props.data.forumId,
		})
	}

	async function clickCollect() {
		postDetail.clickCollect(props.data, {
			favoriteFlag: 'p',
			targetRef: props.data.forumId,
		})
	}

	function doSend() {
		sendStore.setConfig({ zIndex: 11, bottom: '3.125rem', textRequired: true })
		sendStore.doSend = async ({ text, attachments }) => {
			//一級回覆的時候 postId(postRef) 和 replyId (threadPostId) 會是同個值
			const res = await postDetail.doReply({
				postRef: props.data.postId,
				threadPostId: props.data.postId,
				content: text,
				attachments,
			})
			if (!res) return
			emit('afterReply')
			sendStore.toggle()
		}
		sendStore.toggle()
	}

	watch(
		() => sendStore.triggerFirstComment,
		(newValue) => {
			if (newValue) {
				doSend()
				sendStore.resetFirstComment()
			}
		}
	)
</script>
<style scoped lang="scss">
	.footer {
		position: fixed;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		z-index: 100;
		width: 100%;
		max-width: 480px;
		display: flex;
		height: 3.125rem;
		background-color: #fff;
		justify-content: space-evenly;
		li {
			// width: 25%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			color: #656565;
			span {
				color: #656565;
				font-size: 0.875rem;
				font-weight: 600;
			}
			&.active {
				color: $primary-color;
				span {
					color: $primary-color;
				}
			}
		}
	}
</style>
