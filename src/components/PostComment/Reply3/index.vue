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
				<p class="color-##434343 text-14 font-400" style="line-break: anywhere">
					<span class="text-14 color-#AEAEB1 font-400">
						回复 {{ data.nickname1 }}
					</span>
					{{ data.postContent }}
					<span class="ml-8 color-#AEAEB1 text-12 font-400">
						{{ getTimeDifference(data.postTime) }}
					</span>
					<span class="color-#434343 text-12 font-400 ml-8" @click="doReply">
						回复
					</span>
				</p>
			</div>
			<div class="right flex flex-col items-center" @click="clickLike">
				<SvgIcon :name="iconName" size="1.125rem" />
				<span
					class="text-12 color-#656565 font-400 mt-4"
					v-show="data.likeCount > 0"
				>
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
	import { usePostDetail } from '@/hooks/usePostDetail.js'
	import Attachments from '@/components/Attachments/index.vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({
				postId: null,
				nickname: null,
				nickname1: null,
				avatar: null,
				postContent: null,
				likeCount: 0,
				threadCount: 0,
				postTime: null,
				isLike: null,
			}),
		},
	})

	const emit = defineEmits(['refresh'])
	const postId = _get(inject('data'), 'postId') //主帖id
	const sendStore = useSendStore()
	const postDetail = usePostDetail()
	const iconName = computed(() => {
		return props.data.isLike == 'y' ? 'like_click3' : 'like_click1'
	})
	const attachments = computed(() =>
		_map(props.data.attachments, (vo) => vo.url)
	)

	function doReply() {
		sendStore.setConfig({ zIndex: 11, bottom: '3.125rem', textRequired: false })
		sendStore.doSend = async ({ text, attachments }) => {
			const res = await postDetail.doReply({
				postRef: postId,
				threadPostId: props.data.postId,
				content: text,
				attachments,
			})
			if (!res) return
			emit('refresh')
			sendStore.toggle()
		}
		sendStore.toggle()
	}

	function clickLike() {
		postDetail.clickLike(props.data, { likeFlag: 'c', targetRef: postId })
	}
</script>

<style></style>
