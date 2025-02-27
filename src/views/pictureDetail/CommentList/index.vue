<template>
	<div class="px-10">
		<div class="text-18 font-700 lh-24.515 color-#434343 mb-8">热门评论</div>
		<template v-if="!commentList.length">
			<NoContent text="还没有评论哦" />
			<button
				class="text-18 color-#434343 border border-#AEAEB1 rounded-25 px-20 py-5 m-[5rem_auto_10rem] block"
				@click="doFirstComment"
			>
				抢首评
			</button>
		</template>
		<van-list
			v-else
			v-model:loading="loading"
			:finished="finished"
			@load="onLoad"
			:immediate-check="false"
		>
			<Reply1
				v-for="(vo, index) in commentList"
				:key="index"
				:data="vo"
				:postId="vo.postId"
				class="mb-16 ml-7.5"
				:isUseKV="isUseKV"
			/>
		</van-list>
	</div>
</template>

<script setup>
	import { ref, onBeforeMount, nextTick, provide } from 'vue'
	import Reply1 from './Reply1/index.vue'
	import { getCommentList } from '@/api/picture'
	import NoContent from '@/components/NoContent/index.vue'
	import { usePictureDetailStore } from '@/stores/pictureDetail'
	import { usePostDetail } from './usePostDetail'
	import { useSendStore } from '@/stores/send.js'

	const { postsKV } = usePictureDetailStore()
	const { getImgExplainIdParam } = usePostDetail()
	const sendStore = useSendStore()

	const loading = ref(false)
	const finished = ref(false)
	const commentList = ref([])
	let page = 1

	const emit = defineEmits(['update:shouldResetComments'])

	const props = defineProps({
		issueId: { type: [Number, String] },
		shouldResetComments: { type: Boolean, default: false },
		isUseKV: { type: Boolean, default: false },
		postType: { type: String },
	})

	provide('postType', props.postType)

	async function getMainComments() {
		if (props.isUseKV) {
			// 加childrenSize
			postsKV.forEach((post) => {
				// 當 postThreadSeq 為 1 或 2 時，尋找對應的父帖
				if (post.postThreadSeq >= 1) {
					const parentPost = postsKV.find((p) => p.postId == post.threadPostId)
					if (parentPost) {
						// 增加 childrenSize
						parentPost.childrenSize = (parentPost.childrenSize || 0) + 1
					}
				}
			})

			const list1th = _filter(postsKV, (vo) => vo.postThreadSeq == 0)
			commentList.value.push(...list1th)
			finished.value = true
			return
		}
		if (!props.issueId) {
			finished.value = true
			return
		}

		const commonParams = {
			page,
			size: 10,
			issueId: props.issueId,
		}
		const params =
			props.postType == 'c'
				? {
						...commonParams,
						postType: 'a',
						imageExplainId: getImgExplainIdParam(props.postType),
					}
				: { ...commonParams }

		const res = await getCommentList(params)

		const list = _map(_get(res, 'data.replies', []), (vo) => {
			vo.level = 1
			return vo
		})
		const total = _get(res, 'data.childrenSize', 0)
		commentList.value.push(...list)
		finished.value = commentList.value.length >= total || list.length == 0
	}

	async function onLoad() {
		loading.value = true
		page++
		await getMainComments()
		loading.value = false
	}

	async function reset() {
		await nextTick()
		page = 1
		commentList.value = []
		getMainComments()
	}

	function doFirstComment() {
		sendStore.setFirstComment()
	}

	onBeforeMount(() => {
		getMainComments()
	})

	defineExpose({ reset })
</script>
