<template>
	<div class="ml-10">
		<div class="flex">
			<div class="avatar">
				<CdnImage
					width="2rem"
					height="2rem"
					:path="data.avatar"
					round
					class="mr-4"
					error-icon="/public-assets/images/svg/default_avatar_man.png"
					v-user="data.postUserId"
					:config="{ width: '2rem' }"
				/>
			</div>
			<div class="content flex-1">
				<p class="color-#656565 text-18 font-600" v-user="data.postUserId">
					{{ data.nickname }}
				</p>
				<p class="color-##434343 text-14" style="line-break: anywhere">
					<span class="text-14 color-#AEAEB1 lh-19.07">
						回复 {{ data.toNickname }}
					</span>
					{{ data.postContent }}
					<span class="ml-8 color-#AEAEB1 text-12">
						{{ getTimeDifference(data.postTime) }}
					</span>
					<span class="color-#434343 text-12 ml-8" @click="doReply">回复</span>
				</p>
			</div>
			<div class="right flex flex-col items-center" @click="clickLike">
				<SvgIcon :name="iconName" size="1.125rem" />
				<span class="text-12 color-#656565 mt-4" v-show="data.likeCount > 0">
					{{ data.likeCount }}
				</span>
			</div>
		</div>
		<Attachments :list="attachments" class="mt-4" />
	</div>
</template>

<script setup>
	import CdnImage from '@/components/CdnImage/index.vue'
	import { getTimeDifference } from '@/modules/date.js'
	import { computed, inject } from 'vue'
	import { useSendStore } from '@/stores/send.js'
	import { usePostDetail } from '../usePostDetail.js'
	import Attachments from '@/components/Attachments/index.vue'
	import { usePictureDetailStore } from '@/stores/pictureDetail'

	const { addCommentCount } = usePictureDetailStore()

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const postType = inject('postType')

	const emit = defineEmits(['refresh'])
	const sendStore = useSendStore()
	const postDetail = usePostDetail()
	const iconName = computed(() => {
		return props.data.likeStatus == 'y' ? 'like_click3' : 'like_click1'
	})
	const attachments = computed(() =>
		_map(props.data.attachments, (vo) => vo.url)
	)

	function doReply() {
		sendStore.setConfig({ zIndex: 11, bottom: '3.125rem', textRequired: true })
		sendStore.doSend = async ({ text, attachments }) => {
			const res = await postDetail.doReply({
				postContent: text,
				threadPostId: props.data.postId,
				issueId: props.data.issueId,
				attachments,
				postType,
			})
			if (!res) return
			emit('refresh')
			sendStore.toggle()
			addCommentCount(1)
		}
		sendStore.toggle()
	}

	function clickLike() {
		postDetail.clickLike(props.data, { likeFlag: 'u' })
	}
</script>

<style></style>
