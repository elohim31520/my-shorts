<template>
	<div class="bg-#fafafa pt-45 min-h-100dvh pb-50">
		<NormalHeader :title="post.title" />
		<LotteryResult
			:isSimple="true"
			:enableHumorCount="false"
			class="mt-5 mb-10"
			:query="{
				year: post.postYear,
				issue: post.postIssue,
				lotteryType: post.gameTypeName,
			}"
		/>
		<div class="mx-10 rounded-10 bg-#fff shadow-primary overflow-hidden mb-20">
			<div
				v-if="mainImage"
				class="w-full"
				:class="{ 'min-h-240 bg-skeleton': !isLoad }"
			>
				<CdnImage
					:path="mainImage"
					class="w-full"
					:config="{ width: imageWidth }"
					@load="isLoad = true"
					:show-loading="false"
				/>
			</div>

			<div v-else class="h-200 flex-center">
				<img src="/public-assets/images/no_picture.png" class="w-150" />
			</div>
			<UserProfile
				class="pb-0"
				:user-id="post.postUserId"
				:time="post.postTime"
				:show-history="false"
				:show-view-self="false"
			/>
			<div class="bg-#ffffff w-full p-10">
				<div
					class="mt-10 text-16 color-#434343 font-400 pb-10 break-all"
					v-html="safeHtml(post.postContent)"
				></div>

				<Attachments :list="attachments" class="mb-10" />
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

		<div class="mt-12 px-10">
			<div class="text-18 font-700 lh-24.515 color-#434343 mb-8">热门评论</div>
			<template v-if="!commentList.length">
				<NoContent text="还没有评论哦" />
				<button
					class="text-18 color-#434343 border border-#AEAEB1 rounded-25 px-20 py-5 m-[5rem_auto_10rem] block"
					@click="doFirstComment"
				>
					抢首评
				</button>
			</template>
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
				/>
			</van-list>
		</div>
		<Footer :data="post" @afterReply="onReply" />
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import LotteryResult from '@/components/LotteryResult/index.vue'
	import { provide, ref, computed, onBeforeMount, watch, onMounted } from 'vue'
	import Footer from './Footer/index.vue'
	import RecommendImg from '@/components/RecommendImg/index.vue'
	import { getRecommendGallery } from '@/api/picture'
	import { useLotteryStore } from '@/stores/lottery.js'
	import { storeToRefs } from 'pinia'
	import RecommendUser from '@/components/RecommendUser/index.vue'
	import { getDaniuListKV } from '@/api/daniu'
	import UserProfile from '@/components/UserProfile/index.vue'
	import Attachments from '@/components/Attachments/index.vue'
	import CountInfo from '@/components/CountInfo/index.vue'
	import Reply1 from './Reply1/index.vue'
	import { getPrimaryComment } from '@/api/bbs.js'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { getCdnUrl, rem2Px } from '@/modules/util.js'
	import { addVisitLogApi } from '@/api/user'
	import safeHtml from '@/modules/safeHtml.js'
	import NoContent from '@/components/NoContent/index.vue'
	import { useSendStore } from '@/stores/send.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)

	const sendStore = useSendStore()
	const { lotteryType } = storeToRefs(useLotteryStore())
	const post = ref(_get(props.data, 'postDetail.data', {}))
	const recommendPictures = ref([])
	const daniuList = ref([])
	const commentList = ref([])
	const loading = ref(false)
	const finished = ref(false)
	const imageWidth = ref(0)
	const isLoad = ref(false)

	let page = 1

	watch(lotteryType, getRecommendPictures)

	const attachments = computed(() =>
		_map(_get(props.data, 'postDetail.data.attachments'), (vo) => vo.url)
	)

	const mainImage = _get(attachments.value, '[0]', '')

	onBeforeMount(() => {
		getRecommendPictures()
		getDaniuList()
		getMainComments()
		calImageWidth()
	})

	function calImageWidth() {
		imageWidth.value = Math.ceil(window.innerWidth - rem2Px(1.25))
	}

	async function getRecommendPictures() {
		const res = await getRecommendGallery({ lotteryType: lotteryType.value })
		recommendPictures.value = _get(res, 'data.issueList')
	}

	async function getDaniuList() {
		const res = await getDaniuListKV()
		daniuList.value = _get(res, 'data')
	}

	async function getMainComments() {
		const res = await getPrimaryComment({
			postId: post.value.postId,
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

	function onReply() {
		page = 1
		commentList.value = []
		getMainComments()
	}

	function doFirstComment() {
		sendStore.setFirstComment()
	}

	onMounted(() => {
		addVisitLogApi({
			viewType: 'p',
			targetId: post.value.postId,
			targetRef: post.value.forumId,
		})
	})
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

	:deep() {
		.van-image__img {
			display: inline-block;
			border-top-left-radius: 0.625rem;
			border-top-right-radius: 0.625rem;
		}
	}
</style>
