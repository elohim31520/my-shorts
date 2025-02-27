<template>
	<div class="pt-45">
		<NormalHeader :title="props.data.title" />
		<div class="px-10 py-10" v-if="!isUserMode">
			<SearchBar v-model="keyword" placeholder="搜寻作者或标题" />
		</div>
		<!-- <NotFound text="暂无数据..." v-if="isEmpty" /> -->
		<NoContent v-if="isEmpty && !loading" text="暂无数据" />
		<van-list
			v-else
			v-model:loading="loading"
			:finished="finished"
			@load="onLoad"
			:immediate-check="false"
			finished-text="没有更多了"
			class="mt-10"
		>
			<ul class="px-10">
				<li v-for="(vo, key) in postsFilter" :key="key" class="not-last-mb-10">
					<Post :postData="vo" @toggleFollow="onToggleFollow" />
				</li>
			</ul>
		</van-list>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import Post from '@/components/Post/index.vue'
	import { provide, ref, onBeforeMount, computed } from 'vue'
	import { getBBSForumPosts } from '@/api/bbs.js'
	// import NotFound from '@/components/NotFound/index.vue'
	import { isBlank, isNotBlank } from '@/modules/util.js'
	import SearchBar from '@/components/SearchBar/index.vue'
	import NoContent from '@/components/NoContent/index.vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => {},
		},
	})

	const posts = _get(props.data, 'posts.data.list', [])
	const total = _get(props.data, 'posts.data.total', 0)
	const loading = ref(false)
	const finished = ref(total <= 10)
	const keyword = ref('')
	const postList = ref(posts)
	const isEmpty = computed(() => postList.value.length == 0)
	const isUserMode = isNotBlank(_get(props.data, 'userId'))

	let page = 1 //前10筆(page 1) 在 astro 中取

	provide('data', props.data)

	const postsFilter = computed(() => {
		if (isBlank(keyword.value)) return postList.value
		return _filter(postList.value, (vo) => {
			return (
				includesIgnoreCase(vo.nickname, keyword.value) ||
				includesIgnoreCase(vo.title, keyword.value)
			)
		})
	})

	async function getPostList() {
		const res = await getBBSForumPosts({
			forumId: props.data.forumId,
			postUserId: props.data.userId,
			page,
		})
		const list = _get(res, 'data.list', [])
		postList.value.push(...list)
		finished.value =
			postList.value.length >= _get(res, 'data.total') || list.length == 0
	}

	async function onLoad() {
		page++
		loading.value = true
		await getPostList()
		loading.value = false
	}

	function includesIgnoreCase(target, value) {
		return _includes(_toLower(target), _toLower(value))
	}

	function onToggleFollow({ userId, flag }) {
		postList.value.forEach((vo) => {
			if (vo.postUserId == userId) vo.isFollow = flag
		})
	}
</script>
