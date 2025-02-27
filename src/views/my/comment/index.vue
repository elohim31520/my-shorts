<template>
	<div class="mt-55">
		<NormalHeader title="评论和@" border-bottom-color="#F2F2F2" />
		<NoContent
			v-if="commentList.length == 0"
			text="暂无讯息，多发创作可以收获更多~"
		/>
		<div v-if="commentList.length > 0" class="px-10">
			<van-list
				v-model:loading="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="onLoad"
			>
				<div
					class="mb-5"
					v-for="(item, index) in commentList"
					:key="index"
					:set="(imagePath = getFirstImage(item))"
				>
					<div class="shadow px-10 py-10 rounded-10 bg-white">
						<div class="w-1/1 flex justify-between items-center gap-5">
							<div class="w-81%">
								<div class="w-1/1 flex justify-between items-center gap-10">
									<div class="w-60 h-60 rounded-50% bg-skeleton">
										<CdnImage
											v-user="item.msgObj.userId"
											:path="item.msgObj.img"
											fit="cover"
											position="center"
											width="3.75rem"
											height="3.75rem"
											round
											error-icon="/public-assets/images/svg/default_avatar_man.png"
											:show-loading="false"
											:config="{ width: '3.75rem' }"
										/>
									</div>

									<div class="flex-1 my-8">
										<div class="flex justify-between items-center gap-5">
											<p
												v-user="item.msgObj.userId"
												class="color-#434343 font-600 text-18"
											>
												{{ item.msgObj.nickname }}
											</p>
											<div
												v-if="isMounted && item.msgObj.relationFlag != '0'"
												class="my-3 w-51 h-18 rounded-25 border border-#E0E0E0 flex-center"
											>
												<span class="text-10 font-400 color-#AEAEB1">
													你的粉丝
												</span>
											</div>
										</div>
										<div class="mt-5 color-#656565 text-12">
											<span>{{ item.title }}</span>
											<span class="ml-10">
												{{ getTimeDifference(item.msgTime) }}
											</span>
										</div>
									</div>
								</div>
							</div>

							<CdnImage
								v-if="imagePath"
								:path="imagePath"
								fit="cover"
								position="center"
								width="3.75rem"
								height="3.75rem"
								radius="0.375rem"
								@click="viewImage(item)"
								:config="{ width: '3.75rem' }"
							/>
						</div>

						<div
							class="mt-5 w-1/1 flex justify-between items-center gap-10"
							@click="viewDetail(item)"
						>
							<div class="w-60"></div>

							<div class="w-79% my-8">
								<p class="text-14 font-400 color-#656565 truncate-2-lines">
									{{ item.msgObj.content }}
								</p>
								<div class="mt-5 h-25 flex justify-start items-center">
									<div
										class="w-60 rounded-12.5 py-3 bg-#F2F2F2 flex-center"
										@click.stop="clickLike(item)"
									>
										<SvgIcon
											name="like_click3"
											size="0.9375rem"
											v-if="item.msgObj.isLike == 'y'"
										/>
										<SvgIcon name="like_click1" size="0.9375rem" v-else />
										<span
											class="ml-2.5 transform-translate-y--1 text-14 font-400 color-#434343"
										>
											喜欢
										</span>
									</div>
									<div
										class="ml-10 w-60 rounded-12.5 py-3 bg-#F2F2F2 flex-center"
										@click.stop="doReply(item)"
									>
										<SvgIcon name="message-9" size="0.9375rem" />
										<span
											class="ml-2.5 transform-translate-y--1 text-14 font-400 color-#434343"
										>
											回复
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</van-list>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { ref, computed, onMounted } from 'vue'
	import { getTimeDifference } from '@/modules/date.js'
	import { getCommentsAndMentions } from '@/api/newsList'
	import { useUserStore } from '@/stores/user.js'
	import { getCdnUrl, isNotBlank } from '@/modules/util.js'
	import { redirect } from '@/modules/util'
	import { toast } from '@/modules/util.js'
	import { toggleLike } from '@/api/common.js'
	import { useSendStore } from '@/stores/send.js'
	import { getBatchResourceFlag } from '@/api/common.js'
	import { comment as replyComment } from '@/api/picture.js'
	import { replyPost } from '@/api/bbs.js'
	import { getFollowBatch } from '@/api/daniu'
	import { previewImage } from '@/modules/imgCrypto.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const useStore = useUserStore()
	const { data: user } = useStore

	const sendStore = useSendStore()
	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const pageSize = ref(10)
	const isMounted = ref(false)
	const commentList = ref(_get(props.data, 'data.list', []))

	onMounted(async () => {
		commentList.value = await getUserRelation(commentList.value)
		commentList.value = await getBatchFlag(commentList.value)
		isMounted.value = true
	})

	const onLoad = async () => {
		if (commentList.value.length < pageSize.value) {
			finished.value = true
			return false
		}

		loading.value = true
		page.value += 1

		const data = await getCommentsAndMentions({
			userId: user.userId,
			page: page.value,
			size: pageSize.value,
		})
		let dataList = _get(data, 'data.list', [])
		dataList = await getUserRelation(dataList)
		dataList = await getBatchFlag(dataList)

		commentList.value.push(...dataList)
		loading.value = false
		if (dataList.length < pageSize.value) {
			finished.value = true
		}
	}

	function getTargetInfo(item) {
		const isPost = _get(item, 'msgObj.sourceType') == 'post'
		const msgObj = _get(item, 'msgObj', {})
		const userId = msgObj.userId
		const targetRef = isPost ? msgObj.postRef : msgObj.issueId
		const targetId = isPost ? msgObj.forumPostId : msgObj.postId
		const resourceFlag = isPost ? 'c' : 'u'
		return { userId, targetRef, targetId, resourceFlag, isPost }
	}

	async function getUserRelation(list) {
		if (!list.length) return list
		const userIdList = list.map((item) => {
			const { userId } = getTargetInfo(item)
			return userId
		})
		const relation = await getFollowBatch({
			targetUserIdList: userIdList,
			direct: '2',
		})
		const relationList = _get(relation, 'data', [])
		return list.map((item, index) => {
			return {
				...item,
				msgObj: {
					...item.msgObj,
					relationFlag: relationList[index].relationFlag,
				},
			}
		})
	}

	async function getBatchFlag(list) {
		if (!list.length) return list
		const params = list.map((item) => {
			const { targetRef, targetId, resourceFlag } = getTargetInfo(item)
			return {
				targetRef,
				targetId,
				resourceFlag,
			}
		})
		const res = await getBatchResourceFlag(params)
		const isLikeList = _get(res, 'data', []).map((item) =>
			item.isLike ? 'y' : 'n'
		)
		return list.map((item, index) => {
			return {
				...item,
				msgObj: {
					...item.msgObj,
					isLike: isLikeList[index],
				},
			}
		})
	}

	function getFirstImage(item) {
		const { isPost } = getTargetInfo(item)
		const attachments = _get(item, 'msgObj.attachments', [])
		const target = _find(attachments, (vo) =>
			isPost ? isNotBlank(vo.url) : isNotBlank(vo.attachmentUrl)
		)
		return isPost ? _get(target, 'url') : _get(target, 'attachmentUrl')
	}

	function viewImage(item) {
		const { isPost } = getTargetInfo(item)
		const attachments = _get(item, 'msgObj.attachments', [])
		const urlList = isPost
			? attachments
					.filter((vo) => isNotBlank(vo.url))
					.map((vo) => getCdnUrl(vo.url))
			: attachments
					.filter((vo) => isNotBlank(vo.attachmentUrl))
					.map((vo) => getCdnUrl(vo.attachmentUrl))
		previewImage({
			images: urlList,
			closeable: true,
		})
	}

	function viewDetail(item) {
		const sourceType = _get(item, 'msgObj.sourceType')
		const forumId = _get(item, 'msgObj.forumId', '')
		if (sourceType == 'post' && forumId == 'userPublic') {
			redirect(`/postDetail/${item.msgObj.postRef}`)
		} else if (sourceType == 'post' && forumId == 'myForum') {
			redirect(`/creationDetail/${item.msgObj.postRef}`)
		} else if (sourceType == 'post' && forumId == 'guessImg') {
			redirect('/humorVote')
		} else if (sourceType == 'post' && forumId == 'guessVideo') {
			redirect('/humorVote/video')
		} else if (sourceType == 'drawing') {
			redirect(`/pictureDetail?id=${item.msgObj.issueId}`)
		}
	}

	async function clickLike(item) {
		const isAdd = item.msgObj.isLike == 'n'
		const { targetRef, targetId, resourceFlag } = getTargetInfo(item)
		const res = await toggleLike({
			targetRef,
			targetId,
			likeFlag: resourceFlag,
		})
		if (!_get(res, 'success')) return
		toast(`${isAdd ? '' : '取消'}喜欢成功`)
		item.msgObj.isLike = isAdd ? 'y' : 'n'
	}

	function doReply(item) {
		sendStore.setConfig({ zIndex: 11, bottom: '0' })
		sendStore.doSend = async ({ text, attachments }) => {
			const { targetRef, targetId, isPost } = getTargetInfo(item)
			const doReply = isPost
				? replyPost({
						postRef: targetRef,
						threadPostId: targetId,
						content: text,
						attachments,
					})
				: replyComment({
						issueId: targetRef,
						threadPostId: targetId,
						postContent: text,
						attachments,
					})

			const res = await doReply
			if (!_get(res, 'success')) return
			toast('评论成功')
			sendStore.toggle()
		}
		sendStore.toggle()
	}
</script>
