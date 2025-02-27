<template>
	<div
		class="min-h-52dvh bg-#fafafa"
		:class="{ 'bg-#fafafa': !isEmptyData, 'min-h-55dvh': !isLogin() }"
		ref="postListRef"
	>
		<template v-if="isEmptyData">
			<NoContent :text="noContentText" />
			<button
				class="text-14 color-#434343 border border-#AEAEB1 rounded-25 px-12 py-4 m-[3rem_auto_0] block"
				@click="redirect('/expertForum')"
			>
				查看更多
			</button>
		</template>
		<van-list
			v-else
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
		>
			<ul class="px-10">
				<li
					v-for="(vo, key) in loadPostList"
					:key="key"
					class="mb-10 last-mb-0"
				>
					<Post :postData="vo" @toggleFollow="onToggleFollow" />
				</li>
			</ul>
		</van-list>
		<div
			v-if="!isLogin() && urlHasUserOrMy && !isSelf && loadPostList.length >= 3"
			class="px-100 -mt-150 pt-100 mb-60 relative h-100 bg-gradient-to-t from-#fafafa to-white/10 pointer-events-none"
		>
			<button
				class="color-#434343 bg-#fafafa rounded-10 text-20 py-8 w-100% flex-center"
				style="pointer-events: fill"
				@click="doLogin"
			>
				<span>查看更多</span>
				<svgIcon class="inline-block" name="read_more_arrow" size="1.875rem" />
			</button>
		</div>
	</div>
</template>

<script setup>
	import Post from '@/components/Post/index.vue'
	import { ref, computed, onMounted, inject, watch } from 'vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { isLogin, redirect } from '@/modules/util'
	import { useLoginPopupStore } from '@/stores/loginPopup.js'
	import { useUserStore } from '@/stores/user.js'
	import { useMyTabCategoryStore } from '@/stores/MyTabCategory.js'
	import { storeToRefs } from 'pinia'

	const useMyTabStore = useMyTabCategoryStore()
	const { setTotal } = useMyTabStore
	const { pageUserId, pageFollowFlag } = storeToRefs(useMyTabStore)

	const props = defineProps({
		apiFunction: {
			type: Function,
		},
		apiParams: {
			type: Object,
		},
		view: {
			type: String,
		},
	})

	const forumList = ref([])
	const isEmptyData = computed(
		() => forumList.value.length === 0 && finished.value
	)
	const noContentText = computed(() => {
		const messages = {
			follow: '关注',
			collect: '收藏',
			tempView: '最近浏览',
			write: '发布',
			like: '喜欢',
		}
		if (total > 0) {
			return ''
		} else {
			return `目前没有${messages[props.view]}的帖子,查看更多找灵感！`
		}
	})

	const loading = ref(false)
	const finished = ref(false)
	let page = 0
	const size = 10
	let total = 0
	const loadPostList = ref([])
	const urlHasUserOrMy = ref(false)
	const isSelf = ref()

	async function fetchForumList(apiFunction, params) {
		const res = await apiFunction(params)
		const resData = _get(res, 'data', {})
		forumList.value = resData.list
		total = resData.total
		setTotal('forum', total)
		loadPostList.value.push(...forumList.value)
		if (!isLogin() && urlHasUserOrMy.value && !isSelf.value) {
			loadPostList.value.splice(3)
			finished.value = loadPostList.value.length <= 3
		} else {
			finished.value = loadPostList.value.length >= Number(total)
		}
	}

	async function onLoad() {
		page++
		loading.value = true
		await fetchForumList(props.apiFunction, { ...props.apiParams, page, size })
		loading.value = false
	}

	function doLogin() {
		useLoginPopupStore().toggle()
	}

	function containsUserOrMy(path) {
		return /\/(user|my)\b/.test(path)
	}

	const useStore = useUserStore()
	const { data: userData } = useStore

	function onToggleFollow({ userId, flag }) {
		loadPostList.value.forEach((vo) => {
			if (vo.postUserId == userId) vo.isFollow = flag
		})
		useMyTabStore.setPageIsFollow(userId, flag)
	}

	watch(
		() => userData.userId,
		(newVal) => {
			if (newVal) window.location.reload()
		}
	)

	watch(
		() => pageFollowFlag.value,
		(newVal) => {
			onToggleFollow({ userId: pageUserId.value, flag: pageFollowFlag.value })
		}
	)

	onMounted(() => {
		urlHasUserOrMy.value = containsUserOrMy(window.location.pathname)
		if (!isLogin() && urlHasUserOrMy.value) isSelf.value = inject('isSelf')
	})
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
