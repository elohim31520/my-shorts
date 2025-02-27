<template>
	<div v-if="!commentList.length">
		<NoContent text="还没有评论哦" />
		<button
			class="text-18 color-#434343 border border-#AEAEB1 rounded-25 px-20 py-5 m-[5rem_auto_10rem] block"
			@click="doFirstComment"
		>
			抢首评
		</button>
	</div>
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
			:postId="post.postId"
			class="mb-16"
			@increaseCount="onIncreaseCount"
		/>
	</van-list>
</template>

<script setup>
	import Reply1 from '@/components/PostComment/Reply1/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { ref, onBeforeMount, watch } from 'vue'
	import { getPrimaryComment } from '@/api/bbs.js'
	import { useSendStore } from '@/stores/send.js'

	const props = defineProps({
		post: {
			type: Object,
			default: () => ({}),
		},
	})

	const sendStore = useSendStore()

	defineExpose({ refresh })

	const loading = ref(false)
	const finished = ref(false)
	const commentList = ref([])
	let page = 1

	onBeforeMount(() => {
		getMainComments()
	})

	watch(
		() => props.post.postId,
		(value) => {
			page = 1
			commentList.value = []
			if (value) getMainComments()
		}
	)

	async function getMainComments() {
		const res = await getPrimaryComment({
			postId: props.post.postId,
			page,
			size: 10,
		})
		const list = _get(res, 'data.list', [])
		const total = _get(res, 'data.total', 0)
		commentList.value.push(...list)
		finished.value = commentList.value.length >= total || list.length == 0
	}

	async function onLoad() {
		loading.value = true
		page++
		await getMainComments()
		loading.value = false
	}

	function refresh() {
		page = 1
		commentList.value = []
		getMainComments()
	}

	function onIncreaseCount(value) {
		//2.3級評論成功，次數更新
		props.post.threadCount = sum(props.post.threadCount, value)
	}

	function sum(a, b) {
		return Number(_defaultTo(a, 0)) + Number(_defaultTo(b, 0))
	}

	function doFirstComment() {
		sendStore.setFirstComment()
	}
</script>

<style></style>
