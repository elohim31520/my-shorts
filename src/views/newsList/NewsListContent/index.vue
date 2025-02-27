<template>
	<div class="news-list">
		<NormalHeader :title="'系统消息'">
			<div
				@click="allRead"
				class="all-read pr-10 mt-5 color-#434343 font-light cursor-pointer"
			>
				全部已读
			</div>
		</NormalHeader>
		<div class="news-info">
			<van-list
				v-model:loading="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="onLoad"
			>
				<div v-for="(news, index) in newsList" :key="index">
					<div class="context" :class="{ last: index == newsList.length - 1 }">
						<div class="flex items-center justify-between font-semibold">
							<span class="title relative pr-8 pt-4">
								{{ news.title }}
								<i
									class="w-5 h-5 absolute bg-#FF3B3B rounded-full top-0 right-0"
									v-if="isUnRead(news)"
								></i>
							</span>

							<span class="time color-#BDBDBF">
								{{ formatTime(news.msgTime) }}
							</span>
						</div>
						<div class="flex justify-between items-end">
							<div class="mb-9.6 mt-9 truncate-3-lines">
								<HtmlRenderer :htmlContent="news.content" />
							</div>
						</div>
						<div
							class="show-detail pt-5 color-#434343 cursor-pointer"
							@click="goTo(news, index)"
						>
							查看更多
							<van-icon class="arrow" name="arrow" />
						</div>
					</div>
				</div>
			</van-list>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import HtmlRenderer from '@/components/HtmlRenderer/index.vue'

	import { ref, reactive, onBeforeMount, inject } from 'vue'
	import { confirmDialog, notify, back } from '@/modules/util'
	import { getNewsList, readMsg } from '@/api/newsList'
	import { useUserStore } from '@/stores/user.js'
	import { useNewsStore } from '@/stores/newsList.js'
	import { redirect, getRelativeDayDescription } from '@/modules/util.js'
	import { formatTimestamp } from '@/modules/date.js'
	import { storeToRefs } from 'pinia'
	import { localStore } from '@/modules/storage.js'
	import { useNewsList } from '../useNewsList.js'

	const params = _defaultTo(inject('params'), {})
	const useStore = useUserStore()
	const newsStore = useNewsStore()
	const { data: user, isLogin } = storeToRefs(useStore)
	const loading = ref(false)
	const finished = ref(false)
	const page = ref(0)
	const pageSize = ref(10)
	const readIds = reactive(new Set(localStore.readIds || []))
	const { formatTime, makeRead } = useNewsList()

	const onLoad = async () => {
		page.value += 1
		getData()
	}

	const newsList = ref([])

	function allRead() {
		if (_isEmpty(newsList.value)) {
			notify('至少要有一笔消息', { type: 'danger' })
			return
		}
		const ids = newsList.value.map((vo) => vo.msgId)

		confirmDialog('是否要将全部消息设定为已读？', { title: '温馨提示' })
			.then(async () => {
				if (isLogin.value) {
					const res = await readMsg({
						type: params.type,
						userId: user.value.userId,
						ids,
					})
					if (!_get(res, 'success')) return
					newsList.value.forEach((vo) => (vo.isRead = true))
				} else {
					ids.forEach((id) => readIds.add(id))
					localStore.readIds = Array.from(readIds)
				}
				notify('操作成功')
			})
			.catch(() => {})
	}

	function goTo(vo, index) {
		if (vo.type == 't') {
			//聊天室跟語音房
			const path =
				_get(vo, 'msgObj.type', '') == 'VOICE' ? 'voiceRoom' : 'chatRoom'
			makeRead({
				type: vo.type,
				userId: vo.userId,
				msgId: [vo.msgId],
			})
			redirect(`/${path}/${vo.roomId}`)
			return
		}
		redirect(`newsList/newsDetail?index=${index}&type=${vo.type}`)
	}

	async function getData() {
		loading.value = true
		const res = await getNewsList({
			userId: user.userId,
			page: page.value,
			size: pageSize.value,
			type: params.type, // s系统消息 I点赞 c收藏, i关注, d评论 a安特 v活动 r聊天室
		})
		const dataList = _get(res, 'data.list', [])
		const total = _get(res, 'data.total')
		newsList.value.push(...dataList)
		loading.value = false
		finished.value = newsList.value.length >= total
	}

	function isUnRead(vo) {
		if (isLogin.value) return !vo.isRead
		return !readIds.has(vo.msgId)
	}
</script>

<style lang="scss" scoped>
	.news-info {
		padding-top: 3.4375rem;
		background-color: #fafafa;
		min-height: calc(100dvh - 2.8125rem);
		margin: 0 0.6rem;
		.context {
			border: 1px solid #e0e0e0;
			border-radius: 0.4rem;
			padding: 0.75rem 0.8rem 0 1.26rem;
			background-color: #fff;
			margin-bottom: 0.6rem;
			&.last {
				margin-bottom: 0;
			}
			.title {
				max-width: 82%;
				font-size: 1.125rem;
				line-height: 1.125rem;
			}
			.time {
				font-size: 0.75rem;
				line-height: 0.906rem;
			}
			.show-detail {
				font-size: 1rem;
				padding: 0.6rem 0;
				border-top: 2px solid #e0e0e0;
			}
		}
	}
</style>
