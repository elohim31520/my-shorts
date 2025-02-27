<template>
	<div :style="{ 'min-height': minHeightRem }">
		<van-list
			:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			:immediate-check="false"
			@load="onLoad"
		>
			<NoContent v-show="!list.length" />

			<ul>
				<li class="not-last-mb-10" v-for="(item, index) in list" :key="index">
					<Picture v-if="isPicture" :pictureData="item" />
					<Post v-else :postData="item" @toggleFollow="onToggleFollow" />
				</li>
			</ul>
		</van-list>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		watch,
		onMounted,
		inject,
		computed,
		nextTick,
	} from 'vue'
	import { storeToRefs } from 'pinia'

	import Post from '@/components/Post/index.vue'
	import Picture from '../Picture/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { getBBSForumPosts } from '@/api/bbs'
	import { getNewspaperPost } from '@/api/expertForum'
	import { useForumListStore } from '@/stores/forumList.js'
	import { getLotteryCode } from '@/modules/util'
	import { useLotteryStore } from '@/stores/lottery'

	const { lotteryType } = storeToRefs(useLotteryStore())
	const { top, minHeight } = storeToRefs(useForumListStore())

	const list = reactive([])
	const loading = ref(false)
	const finished = ref(false)
	const total = ref(0)
	const page = ref(1)
	const size = 10
	const minHeightRem = computed(() => `${minHeight.value / 16}rem`)

	const props = defineProps({
		filterType: {
			type: Object,
			default: () => ({}),
		},
	})

	const isPicture = computed(() => {
		return props.filterType?.topic === 'picture'
	})

	const forumId = _get(inject('data'), 'forumId', '')
	const bbsPosts = _get(inject('data'), 'bBSForumPosts', [])

	const reset = () => {
		list.length = 0
		page.value = 1
		total.value = 0
		finished.value = false
	}

	const scrollToTop = () => {
		window.scrollTo(0, Math.min(top.value, window.scrollY))
	}

	const getParams = () => {
		const params = {
			forumId,
			page: page.value,
			size,
		}

		const { type, topic } = props.filterType
		if (type) params[type] = 'y'
		if (topic === 'predictFlag') params[topic] = 'y'
		if (isPicture.value) params.gameType = getLotteryCode(lotteryType.value)
		else params.gameType = lotteryType.value

		return params
	}

	async function onLoad() {
		if (loading.value) return
		loading.value = true
		const { topic } = props.filterType
		const apiFunction =
			topic === 'picture' ? getNewspaperPost : getBBSForumPosts
		const params = getParams()

		const res = await apiFunction(params)
		const newData = _get(res, 'data.list', [])
		total.value = +_get(res, 'data.total', 0)
		list.push(...newData)
		page.value += 1

		if (list.length >= total.value || newData.length < size) {
			finished.value = true
		}
		loading.value = false
		await nextTick()
	}

	function onToggleFollow({ userId, flag }) {
		_forEach(list.value, (vo) => {
			if (vo.postUserId == userId) vo.isFollow = flag
		})
	}

	onMounted(async () => {
		if (!bbsPosts.length) return onLoad()

		list.push(...bbsPosts)
		page.value += 1

		if (bbsPosts.length < size) {
			finished.value = true
		} else {
			await nextTick()
			onLoad()
		}
	})

	watch(
		() => [props.filterType, lotteryType.value],
		async () => {
			scrollToTop()
			reset()
			await nextTick()
			onLoad()
		}
	)
</script>

<style lang="scss" scoped>
	:deep(.van-list__finished-text) {
		font-size: 1rem;
		font-weight: 500;
		color: #aeaeb1;
		padding-bottom: 3rem;
	}
</style>
