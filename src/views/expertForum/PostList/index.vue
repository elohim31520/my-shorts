<template>
	<div class="bg-#fafafa min-h-100dvh" ref="postListRef">
		<NoContent v-if="isEmpty && !loading" text="暂无数据" />
		<van-list
			v-else
			v-model:loading="loading"
			:finished="finished"
			@load="onLoad"
			v-if="isMounted"
		>
			<ul class="px-10">
				<li v-for="(vo, key) in posts" :key="key" class="mb-10">
					<Post :postData="vo" />
				</li>
			</ul>
		</van-list>
	</div>
</template>

<script setup>
	import Post from '@/components/Post/index.vue'
	import { inject, ref, toRef, watch, onMounted } from 'vue'
	import { getBBSForumPosts } from '@/api/bbs.js'
	import NotFound from '@/components/NotFound/index.vue'
	import NoContent from '@/components/NoContent/index.vue'

	const props = defineProps({
		filterType: {
			type: String,
			default: '',
		},
	})

	const loading = ref(false)
	const finished = ref(false)
	const posts = ref([])
	const isMounted = ref(false)
	const isEmpty = ref(false)
	const filterTypeRef = toRef(props, 'filterType')
	let page = 1
	let size = 10

	const data = inject('data')
	const { headerRef, stickyRef } = inject('domRef')
	const forumId = _get(data.userPublic, 'data[0].forumList[0].forumId', '')
	const postListRef = ref(null)

	onMounted(() => {
		isMounted.value = true
		window.scrollTo(0, 0)
	})

	watch(filterTypeRef, (value) => {
		window.scrollTo(
			0,
			postListRef.value.offsetTop -
				(headerRef.value.offsetHeight + stickyRef.value.offsetHeight)
		)
		page = 1
		posts.value = []
		finished.value = false
		onLoad()
	})

	async function getPosts() {
		const res = await getBBSForumPosts({
			page,
			size,
			forumId,
			[props.filterType]: 'y',
		})
		const postRes = _get(res, 'data.list', [])
		posts.value.push(...postRes)
		page++
		loading.value = false
		if (postRes.length < size) finished.value = true
		if (posts.value.length == 0) isEmpty.value = true
	}

	async function onLoad() {
		loading.value = true
		await getPosts()
	}
</script>

<style lang="scss" scoped>
	.search-bar {
		position: relative;
		--van-cell-background: #fafafa;
		i.search {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 1.5rem;
			z-index: 2;
			color: #434343;
		}
		:deep(.van-icon-clear) {
			right: 0.5rem;
		}
		:deep(.van-field__body) {
			height: 1.875rem;
		}
		:deep(.van-field__value) {
			background-color: #f2f2f2;
			border-radius: 999px;
		}
		:deep(.van-field__control) {
			font-size: 1rem;
			padding: 0.5rem;
			padding-left: 2.5rem;
		}
		:deep(.van-cell) {
			--van-cell-horizontal-padding: 0.625rem;
		}
	}
</style>
