<template>
	<div class="bg-#fafafa pt-45 min-h-100dvh pb-50">
		<NormalHeader :title="post.title || '详情'" title-width="calc(100% - 4rem)">
			<SvgIcon
				name="icon_More2"
				size="1.25rem"
				style="fill: #434343"
				class="mr-8"
				@click="showPopup = true"
			/>
		</NormalHeader>
		<LotteryResult
			:isSimple="true"
			:enableHumorCount="false"
			class="mt-5"
			:query="{
				year: post.postYear,
				issue: post.postIssue,
				lotteryType: post.gameTypeName,
			}"
		/>
		<div class="mx-10 pt-10">
			<UserProfile
				:user-id="post.postUserId"
				:time="post.postTime"
				:show-view-self="false"
			/>

			<Ranking :userId="post.postUserId" />

			<div
				class="bg-#ffffff w-full rounded-10 p-10 mb-20 mt-10 shadow-[0_0_4px_0_rgba(0,0,0,0.1)]"
			>
				<div class="flex items-center">
					<p class="color-#434343 text-18 truncate-2-lines flex-1">
						<span class="tag bg-#DCF3FF color-#6DA8FF!" v-if="post.postIssue">
							第{{ post.shortIssue }}期
						</span>
						{{ formatTitle(post.title) }}
						<span class="tag bg-#A2B1FF" v-if="post.predictFlag === 'y'">
							参赛帖
						</span>
						<span class="tag bg-#FFBC7F" v-if="post.isTop === 'y'">顶</span>
						<span class="tag bg-#FF92C1" v-if="post.isSelected === 'y'">
							精
						</span>
					</p>
					<p></p>
				</div>
				<div
					class="mt-10 text-14 color-#434343 font-400 pb-10 break-all"
					v-html="safeHtml(post.postContent)"
				></div>

				<Attachments :list="attachments" />
				<PredictionDetail
					v-if="post.predictFlag === 'y' && post.postPredictions"
					:data="post"
				></PredictionDetail>
				<CountInfo :data="post" />
			</div>
		</div>

		<RecommendImg
			:list="recommendPictures"
			v-if="recommendPictures.length > 0"
		/>

		<div v-if="daniuList.length > 0">
			<div class="mt-12 pl-10 text-18 font-700 lh-24.515 color-#434343">
				推荐大牛
			</div>
			<RecommendUser :list="daniuList" />
		</div>

		<div class="mt-12 pl-10">
			<div class="text-18 font-700 lh-24.515 color-#434343">网址大全</div>
		</div>

		<LotteryTypes />
		<WebsiteList :data="webListFilter" :rows="3" />

		<div class="mt-12 px-10">
			<div class="text-18 font-700 lh-24.515 color-#434343 mb-8">热门评论</div>
			<PostComment :post="post" ref="refPostComment" />
		</div>
		<Footer :data="post" @afterReply="onReply" />

		<ActionSheet v-model:show="showPopup" :user-id="post.postUserId" />
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryResult from '@/components/LotteryResult/index.vue'
	import Footer from '@/components/PostFooter/index.vue'
	import ActionSheet from './ActionSheet/index.vue'
	import RecommendImg from '@/components/RecommendImg/index.vue'
	import UserProfile from '@/components/UserProfile/index.vue'
	import Attachments from '@/components/Attachments/index.vue'
	import CountInfo from '@/components/CountInfo/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import WebsiteList from '@/components/WebsiteList/index.vue'
	import Ranking from '@/components/Ranking/index.vue'
	import RecommendUser from '@/components/RecommendUser/index.vue'
	import PostComment from '@/components/PostComment/index.vue'
	import PredictionDetail from '@/components/PredictionDetail/index.vue'

	import {
		provide,
		ref,
		computed,
		onBeforeMount,
		watch,
		onMounted,
		watchEffect,
	} from 'vue'
	import { storeToRefs } from 'pinia'
	import { getRecommendGallery } from '@/api/picture'
	import { useLotteryStore } from '@/stores/lottery.js'
	import { getDaniuListKV } from '@/api/daniu'
	import { getWebsiteList } from '@/api/website'
	import { addVisitLogApi } from '@/api/user'
	import { getResourceFlag } from '@/api/common.js'
	import { usePostDetail } from '@/hooks/usePostDetail.js'
	import { getLotteryTypeList } from '@/modules/util.js'
	import safeHtml from '@/modules/safeHtml.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)

	const { formatTitle } = usePostDetail()
	const { lotteryType } = storeToRefs(useLotteryStore())
	const showPopup = ref(false)
	const post = ref(_get(props.data, 'postDetail.data', {}))
	const lotteryTypes = getLotteryTypeList()
	const recommendPictures = ref([])
	const daniuList = ref([])
	const webList = ref([])
	const refPostComment = ref(null)

	watch(lotteryType, getRecommendPictures)

	const attachments = computed(() =>
		_map(_get(props.data, 'postDetail.data.attachments'), (vo) => vo.url)
	)

	const webListFilter = computed(() => {
		const target = _find(lotteryTypes, (vo) => vo.key == lotteryType.value)
		if (!target) return []
		return _filter(webList.value, (vo) =>
			_includes(vo.focusGameType, String(target.code))
		)
	})

	onBeforeMount(() => {
		getRecommendPictures()
		getDaniuList()
		gteWebs()
		getFlag()
	})

	onMounted(visited)

	function sum(num1, num2) {
		return _defaultTo(Number(num1), 0) + _defaultTo(Number(num2), 0)
	}

	async function getRecommendPictures() {
		const res = await getRecommendGallery({ lotteryType: lotteryType.value })
		recommendPictures.value = _get(res, 'data.issueList')
	}

	async function getDaniuList() {
		const res = await getDaniuListKV()
		daniuList.value = _get(res, 'data')
	}

	async function gteWebs() {
		const res = await getWebsiteList()
		webList.value = _get(res, 'data')
	}

	function onReply() {
		post.value.isComment = 'y'
		post.value.threadCount++
		refPostComment.value.refresh()
	}

	async function getFlag() {
		const res = await getResourceFlag({
			targetId: post.value.postId,
			resourceFlag: 'p',
		})
		post.value.isLike = _get(res, 'data.isLike') ? 'y' : 'n'
		post.value.isCollect = _get(res, 'data.isFavorite') ? 'y' : 'n'
		post.value.isComment = _get(res, 'data.isComment') ? 'y' : 'n'
	}

	async function visited() {
		const res = await addVisitLogApi({
			viewType: 'p',
			targetId: post.value.postId,
			targetRef: post.value.forumId,
		})
		if (!_get(res, 'success')) return
		post.value.readCount++
	}
</script>

<style lang="scss" scoped>
	.divider {
		position: relative;
		padding-right: 1.4rem;
		&:after {
			content: '';
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 0.7rem;
			width: 2px;
			height: 1rem;
			background: #ccc;
		}
	}
	h1 {
		color: #434343;
		font-size: 1.125rem;
		font-weight: 700;
	}
	.tag {
		display: inline-block;
		border-radius: 0.3125rem;
		color: #fff;
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.1875rem;
		height: 1.1875rem;
		line-height: 1.1875rem;
		padding: 0 0.3125rem;
		margin-right: 0.25rem;
		white-space: nowrap;
	}
</style>
