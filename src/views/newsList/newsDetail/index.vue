<template>
	<div class="information">
		<NormalHeader title=" 查看更多" border-bottom-color="#ebedf0" />
		<div class="news-info">
			<div class="context">
				<div class="flex items-center justify-between font-semibold">
					<span class="title">{{ news.title }}</span>
					<span class="time color-#BDBDBF">
						{{ formatTime(news.msgTime) }}
					</span>
				</div>
				<div class="flex justify-between items-end">
					<HtmlRenderer :htmlContent="news.content" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { onMounted, ref } from 'vue'
	import { useNewsList } from '../useNewsList.js'
	import { readMsg } from '@/api/newsList'
	import { storeToRefs } from 'pinia'
	import { useUserStore } from '@/stores/user.js'
	import { localStore } from '@/modules/storage.js'
	import HtmlRenderer from '@/components/HtmlRenderer/index.vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => {},
		},
	})

	const news = _get(props, 'data', {})
	const { formatTime } = useNewsList()
	const useStore = useUserStore()
	const { data: user, isLogin } = storeToRefs(useStore)

	onMounted(() => {
		makeRead()
	})

	async function makeRead() {
		if (isLogin.value) {
			await readMsg({
				type: news.type,
				userId: user.value.userId,
				ids: [news.msgId],
			})
		} else {
			const readIds = new Set(localStore.readIds || [])
			readIds.add(news.msgId)
			localStore.readIds = Array.from(readIds)
		}
	}
</script>

<style lang="scss" scoped>
	.news-info {
		margin: 2.8125rem 0;
		background-color: #fafafa;
		min-height: calc(100dvh - 5.938rem);
		.context {
			height: auto;
			padding: 1.3rem 0.8rem 0.75rem 1.26rem;
			word-break: break-all;
			.content {
				color: #656565;
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
		}
	}
</style>
