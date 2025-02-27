<template>
	<div>
		<ul
			class="w-full flex-y-center color-#aeaeb1 max-w-480px px-20 pb-12 text-16 font-500"
		>
			<li
				v-for="(vo, index) in tabs"
				:key="index"
				class="mr-30"
				:class="{ active: vo.value == type }"
				@click="type = vo.value"
			>
				{{ vo.title }}
			</li>
		</ul>

		<van-list
			v-model:loading="loading"
			:finished="finished"
			:finished-text="list.length ? '没有更多了' : ''"
			:immediate-check="false"
			@load="onLoad"
		>
			<Gallery
				:list="list"
				v-if="[SearchType.ALL, SearchType.PICTURE].includes(type)"
			/>
			<div
				v-else
				class="w-full px-10 py-2.5 bg-#FAFAFA"
				v-for="(vo, idx) in list"
				:key="vo.id"
			>
				<component
					:is="componentMap[type]"
					:[dynamicProp]="vo"
					@update:relationFlag="updateRelationFlag(idx)"
				/>
			</div>
		</van-list>
		<NotFound
			v-show="finished && !list.length"
			text="未搜到相关的内容，请重新输入"
		/>
	</div>
</template>

<script setup>
	import { ref, reactive, computed, watch, nextTick } from 'vue'
	import { storeToRefs } from 'pinia'

	import Gallery from '../Gallery/index.vue'
	import Post from '@/components/Post/index.vue'
	import FollowUser from '@/components/FollowUser/index.vue'
	import NotFound from '@/components/NotFound/index.vue'

	import {
		queryAllApi,
		queryIssueApi,
		queryPostApi,
		queryUserApi,
	} from '@/api/search'
	import { getUserPublic } from '@/api/expertForum'
	import { useLotteryStore } from '@/stores/lottery'
	import { useGallery } from '@/hooks/useGallery'
	import { useUserStore } from '@/stores/user'
	import { getLotteryCode } from '@/modules/util'

	const { formatGalleryData } = useGallery()
	const { lotteryType } = storeToRefs(useLotteryStore())
	const { data: userData } = useUserStore()

	const props = defineProps({
		keyword: {
			type: String,
		},
		year: {
			type: Number,
		},
		color: {
			type: [Number, null],
		},
	})

	const SearchType = {
		ALL: 'all',
		PICTURE: 'picture',
		POST: 'post',
		USER: 'user',
	}

	const type = ref(SearchType.ALL)

	const tabs = [
		{ title: '全部', value: SearchType.ALL },
		{ title: '图纸', value: SearchType.PICTURE },
		{ title: '论坛', value: SearchType.POST },
		{ title: '用户', value: SearchType.USER },
	]

	const propsMap = {
		[SearchType.ALL]: 'data',
		[SearchType.PICTURE]: 'data',
		[SearchType.POST]: 'postData',
		[SearchType.USER]: 'userData',
	}

	const apiFunctionMap = {
		[SearchType.ALL]: queryAllApi,
		[SearchType.PICTURE]: queryIssueApi,
		[SearchType.POST]: queryPostApi,
		[SearchType.USER]: queryUserApi,
	}

	const transformDataFunctionMap = {
		[SearchType.ALL]: transformAllData,
		[SearchType.PICTURE]: formatGalleryData,
		[SearchType.POST]: (vo) => vo,
		[SearchType.USER]: transformUserData,
	}

	const componentMap = {
		// [SearchType.ALL]: Drawing,
		// [SearchType.PICTURE]: Drawing,
		[SearchType.POST]: Post,
		[SearchType.USER]: FollowUser,
	}

	const list = reactive([])
	const loading = ref(false)
	const finished = ref(false)
	const size = 10
	const page = ref(1)
	const total = ref(0)

	const forumId = ref()

	const dynamicProp = computed(() => propsMap[type.value])
	const dynamicApi = computed(() => apiFunctionMap[type.value])

	const getParams = () => {
		switch (type.value) {
			case SearchType.ALL:
				return {
					gameTypeCode: lotteryType.value,
					text: props.keyword,
					isColorful: props.color,
					year: props.year,
				}
			case SearchType.POST:
				return {
					forumId: forumId.value,
					gameType: lotteryType.value,
					text: props.keyword,
					year: props.year,
				}
			case SearchType.USER:
				return { userId: userData.userId, nickname: props.keyword }
			case SearchType.PICTURE:
				return {
					gameType: getLotteryCode(lotteryType.value),
					text: props.keyword,
					isColorful: props.color,
					year: props.year,
				}
			default:
				return {}
		}
	}

	const onLoad = async () => {
		if (finished.value) return

		loading.value = true

		const apiFunction = dynamicApi.value
		const transformDataFunction = transformDataFunctionMap[type.value]
		const params = {
			page: page.value,
			size,
			...getParams(),
		}

		const res = await apiFunction(params)
		const newData = _get(res, 'data.list', [])
		const apiPath = _get(res, 'apiPath', '')
		total.value = +_get(res, 'data.total', 0)

		if (!newData.length) finished.value = true

		list.push(..._map(newData, (data) => transformDataFunction(data, apiPath)))
		finished.value = list.length >= total.value

		page.value += 1
		loading.value = false
	}

	const reset = () => {
		list.splice(0, list.length)
		page.value = 1
		loading.value = true
		finished.value = false
		total.value = 0
	}

	const updateRelationFlag = (index) => {
		const flag = _get(list[index], 'msgObj.relationFlag') == 1 ? 2 : 1
		list[index].msgObj.relationFlag = flag
	}

	const getForumId = async () => {
		const userPublic = await getUserPublic()
		forumId.value = _get(userPublic, 'data[0].forumList[0].forumId', '')
	}

	function transformUserData(vo) {
		const transformedData = {
			msgObj: {
				followerUserId: vo.userId,
				img: vo.avatar,
				nickname: vo.nickname,
				vipLevel: vo.vipLevel,
			},
			title: vo.userMemo,
		}

		return transformedData
	}

	function transformAllData(vo) {
		const { id, type, data = {} } = vo

		const transformedData = {
			...data,
			id,
			type,
			title: data.title,
		}

		if (type === 'p') {
			//帖子
			transformedData.imgSrc = data.imagePath || ''
			transformedData.content = data.postContent || ''
		} else if (type === 't') {
			//圖紙
			transformedData.imgSrc = data.imgPath || ''
		}

		return transformedData
	}

	function triggerSearch() {
		reset()
		nextTick(() => {
			onLoad()
		})
	}

	watch(
		() => type.value,
		async (newVal) => {
			if (newVal == SearchType.POST && !forumId.value) {
				await getForumId()
			}
			reset()
			await nextTick()
			onLoad()
		},
		{
			immediate: true,
		}
	)

	// watch(
	// 	() => props.keyword,
	// 	_debounce((newValue, oldValue) => {
	// 		if (!newValue) return
	// 		reset()
	// 		nextTick(() => {
	// 			onLoad()
	// 		})
	// 	}, 300)
	// )

	defineExpose({
		triggerSearch,
	})
</script>

<style lang="scss" scoped>
	.active {
		color: #434343;
		font-weight: 600;
		position: relative;

		&::after {
			content: '';
			display: block;
			position: absolute;
			left: 50%;
			bottom: -0.1875rem;
			transform: translateX(-50%);
			height: 0.125rem;
			width: 80%;
			background-color: $primary-color;
		}
	}
</style>
