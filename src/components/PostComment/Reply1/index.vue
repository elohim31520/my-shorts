<template>
	<div>
		<div class="header flex items-center">
			<CdnImage
				width="2rem"
				height="2rem"
				:path="data.avatar"
				round
				class="mr-8 flex-shrink-0"
				error-icon="/public-assets/images/svg/default_avatar_man.png"
				v-user="data.postUserId"
				:config="{ width: '2rem' }"
			/>
			<div class="flex flex-col">
				<p class="text-18 color-#434343 font-700" v-user="data.postUserId">
					{{ data.nickname }}
				</p>
				<p class="text-12 color-#AEAEB1 font-400">
					{{ formatTimestamp(data.postTime, 'yyyy-MM-dd HH:mm:ss') }}
				</p>
			</div>
		</div>

		<p
			class="color-#434343 font-500 text-18"
			v-html="safeHtml(data.postContent)"
		></p>

		<Attachments :list="attachments" />

		<div class="btn-list flex mt-8">
			<div
				class="bg-#F2F2F2 rounded-999px flex-center h-25 w-60 px-4"
				@click="doReply"
			>
				<SvgIcon name="message-9" size="0.9375rem" class="mr-4" />
				<span class="text-14 color-#434343 font-400">回复</span>
			</div>
			<div class="flex-center ml-8" @click="clickLike">
				<SvgIcon :name="likeIcon" size="0.9375rem" class="mr-4" />
				<span
					class="text-14 color-##656565 font-400"
					v-show="data.likeCount > 0"
				>
					{{ data.likeCount }}
				</span>
			</div>
		</div>

		<div
			class="flex items-center my-8"
			@click="getComments"
			v-if="showCommentCount && data.threadCount > 0"
		>
			<div class="h-1 w-25 bg-#AEAEB1"></div>
			<p class="text-14 font-400 color-#656565 px-8">
				{{ data.threadCount }}条回复
			</p>
			<SvgIcon name="icon_Log_arrow" size="1.375rem" />
		</div>

		<Reply2
			v-for="(vo, index) in comments2th"
			:key="index"
			:data="vo"
			class="mb-16 pl-16 mt-8"
			:isBottom="false"
			:children="childMap.get(vo.postId).comments"
			@refresh="onRefresh"
		/>
	</div>
</template>

<script setup>
	import Attachments from '@/components/Attachments/index.vue'
	import { ref, computed, watch } from 'vue'
	import { formatTimestamp } from '@/modules/date.js'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { getReplyComment } from '@/api/bbs.js'
	import Reply2 from '@/components/PostComment/Reply2/index.vue'
	import { toast } from '@/modules/util.js'
	import { usePostDetail } from '@/hooks/usePostDetail.js'
	import { useSendStore } from '@/stores/send.js'
	import safeHtml from '@/modules/safeHtml.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({
				postId: null, //這是replyId
				attachments: [],
				nickname: null,
				postTime: null,
				avatar: null,
				postContent: null,
				likeCount: 0,
				threadCount: 0,
				isLike: 'n',
			}),
		},
		postId: {
			type: String, //主帖id
		},
	})

	const emit = defineEmits(['increaseCount'])

	const postDetail = usePostDetail()
	const comments = ref([])
	const showCommentCount = ref(true)

	const sendStore = useSendStore()

	const attachments = computed(() =>
		_map(_get(props.data, 'attachments'), (vo) => vo.url)
	)

	const likeIcon = computed(() =>
		_get(props.data, 'isLike') == 'y' ? 'like_click3' : 'like_click1'
	)

	const comments2th = computed(() => {
		return _filter(comments.value, (vo) => vo.postId1 == props.data.postId)
	})

	const childMap = computed(() => {
		const map = comments2th.value.reduce((acc, cur) => {
			acc.set(cur.postId, { comments: [], ids: [cur.postId] })
			return acc
		}, new Map())
		_forEach(comments.value, (vo) => {
			if (map.has(vo.postId)) return //一級評論
			map.forEach((value, key) => {
				if (_includes(value.ids, vo.postId1)) {
					value.ids.push(vo.postId)
					value.comments.push(vo)
					return false
				}
			})
		})
		return map
	})

	watch(
		() => props.data.threadCount,
		() => emit('increaseCount', 1)
	)

	async function getComments() {
		const { postId, threadCount: size } = props.data
		const res = await getReplyComment({ postId, size })
		comments.value = _get(res, 'data.list', [])
		showCommentCount.value = false
	}

	async function clickLike() {
		postDetail.clickLike(props.data, { likeFlag: 'c', targetRef: props.postId })
	}

	function doReply() {
		sendStore.setConfig({ zIndex: 11, bottom: '3.125rem', textRequired: false })
		sendStore.doSend = async ({ text, attachments }) => {
			const res = await postDetail.doReply({
				postRef: props.postId,
				threadPostId: props.data.postId,
				content: text,
				attachments,
			})
			if (!res) return
			props.data.threadCount++
			getComments()
			sendStore.toggle()
		}
		sendStore.toggle()
	}

	function onRefresh() {
		props.data.threadCount++
		getComments()
	}
</script>

<style></style>
