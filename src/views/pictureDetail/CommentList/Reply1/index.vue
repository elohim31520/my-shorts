<template>
	<div>
		<div class="header flex items-center mb-10">
			<div class="min-w-32 mr-8">
				<CdnImage
					width="2rem"
					height="2rem"
					:path="data.avatar"
					round
					error-icon="/public-assets/images/svg/default_avatar_man.png"
					v-user="data.postUserId"
					:config="{ width: '2rem' }"
				/>
			</div>
			<div class="flex flex-col">
				<p
					class="text-18 color-#434343 font-700 lh-24.515"
					v-user="data.postUserId"
				>
					{{ data.nickname }}
				</p>
				<p class="text-12 color-#AEAEB1 font-400 lh-16.345">
					{{ formatTimestamp(data.postTime, 'yyyy-MM-dd HH:mm:ss') }}
				</p>
			</div>
		</div>

		<p class="color-#434343 text-18 lh-24" style="line-break: anywhere">
			{{ data.postContent }}
		</p>

		<Attachments :list="attachments" />

		<div class="btn-list flex mt-8">
			<div
				class="bg-#F2F2F2 rounded-999px flex-center h-25 w-60 px-4"
				@click="doReply"
			>
				<SvgIcon name="message-9" size="0.9375rem" class="mr-4" />
				<span class="text-14 color-#434343">回复</span>
			</div>
			<div class="flex-center ml-8" @click="clickLike">
				<SvgIcon :name="likeIcon" size="0.9375rem" class="mr-4" />
				<span
					class="text-14 color-##656565 font-400"
					v-show="+data.likeCount > 0"
				>
					{{ data.likeCount }}
				</span>
			</div>
		</div>

		<div
			class="flex items-center my-8"
			@click="getComments"
			v-if="showCommentCount && data.childrenSize > 0"
		>
			<div class="h-1 w-25 bg-#AEAEB1"></div>
			<p class="text-14 font-400 color-#656565 px-8">
				展开 {{ data.childrenSize }}条回复
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
	import { ref, computed, inject } from 'vue'
	import { formatTimestamp } from '@/modules/date'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { getCommentList } from '@/api/picture'
	import Reply2 from '../Reply2/index.vue'
	import { usePostDetail } from '../usePostDetail'
	import { useSendStore } from '@/stores/send'
	import { usePictureDetailStore } from '@/stores/pictureDetail'

	const { postsKV, addCommentCount } = usePictureDetailStore()

	const postType = inject('postType')

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
		postId: {
			type: String, //主帖id
		},
		isUseKV: {
			type: Boolean,
		},
	})

	const postDetail = usePostDetail()
	const comments = ref([])
	const showCommentCount = ref(true)

	const sendStore = useSendStore()

	const attachments = computed(() =>
		_map(_get(props.data, 'attachments'), (vo) => vo.url)
	)

	const likeIcon = computed(() =>
		_get(props.data, 'likeStatus') == 'y' ? 'like_click3' : 'like_click1'
	)

	const comments2th = computed(() => {
		return _filter(comments.value, (vo) => vo.level == 2)
	})

	const childMap = computed(() => {
		const map = new Map()

		// postId 到評論的映射
		const allCommentsMap = new Map()

		// 將所有二級評論添加到 map 和 allCommentsMap 中
		comments2th.value.forEach((comment) => {
			if (comment.level == 2) {
				map.set(comment.postId, { comments: [] })
				allCommentsMap.set(comment.postId, comment)
			}
		})

		// 將所有其他評論（包括三級及更深層級）添加到 allCommentsMap 中
		comments.value.forEach((comment) => {
			allCommentsMap.set(comment.postId, comment)
		})

		// 輔助函數，用於找到二級評論的 postId，四級以後層級的評論指向的 threadPostId 並不是歸屬的那個二級的
		function findAncestorSecondLevel(postId) {
			let currentId = postId
			let comment = allCommentsMap.get(currentId)

			while (comment && comment.level != 2) {
				currentId = comment.threadPostId
				comment = allCommentsMap.get(currentId)
			}

			if (comment && comment.level == 2) {
				return currentId
			}

			return null // 未找到對應的二級評論
		}

		// 遍歷所有評論，將三級及更深層級的評論歸類到對應的二級評論
		comments.value.forEach((vo) => {
			if (vo.level == 2) {
				// 如果有一些評論的 level 仍為2，但不在 comments2th.value 中，可以選擇添加到 map
				if (!map.has(vo.postId)) {
					map.set(vo.postId, { comments: [] })
					allCommentsMap.set(vo.postId, vo)
				}
				return
			}

			// 找到對應的二級評論的 postId
			const ancestorId = findAncestorSecondLevel(vo.threadPostId)

			if (ancestorId && map.has(ancestorId)) {
				map.get(ancestorId).comments.push(vo)
			}
		})

		return map
	})

	async function getComments() {
		if (props.isUseKV) {
			comments.value = postsKV.filter(
				(vo) => vo.threadPostId == props.data.postId
			)
			showCommentCount.value = false
			return
		}
		const { postId, childrenSize: size, issueId } = props.data

		const params = {
			postId,
			size,
			issueId,
			...(postType == 'c'
				? {
						imageExplainId: postDetail.getImgExplainIdParam(postType),
						postType: 'a',
					}
				: {}),
		}

		const res = await getCommentList(params)
		const replies = _get(res, 'data.replies', [])
		comments.value = _map(replies, (vo) => {
			if (vo.threadPostId == props.data.postId) {
				vo.level = 2
			} else {
				vo.level = 3
			}
			return vo
		})
		showCommentCount.value = false
	}

	async function clickLike() {
		postDetail.clickLike(props.data, { likeFlag: 'u' })
	}

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
			props.data.childrenSize++
			getComments()
			addCommentCount(1)
			sendStore.toggle()
		}
		sendStore.toggle()
	}

	function onRefresh() {
		props.data.childrenSize++
		getComments()
	}
</script>

<style></style>
