<template>
	<div class="bg-#fef8e7">
		<Header v-if="isLogin()" />
		<NormalHeader v-if="!isSelf" title="" class="header-other">
			<SvgIcon name="share" size="2rem" class="mr-8" @click="doShare" />
		</NormalHeader>

		<Info v-if="isLogin() || !isSelf" class="mt-40" ref="infoRef" />
		<div v-else class="px-21.7 pt-28 pb-35 bg">
			<LoginBlock class="mt-20" />
		</div>

		<Transition name="small-avatar-transition">
			<div
				class="sticky top-39 z-10 bg-#fdfcf0 flex justify-center w-full"
				v-show="showAvatar"
			>
				<CdnImage
					:path="user.avatar"
					fit="cover"
					position="center"
					width="1.875rem"
					height="1.875rem"
					error-icon="/public-assets/images/svg/default_avatar_man.png"
					class="user-avatar"
					round
					:config="{ width: '1.875rem' }"
				/>
			</div>
		</Transition>

		<div class="btn-box sticky z-8" :class="{ 'top-65': isLogin() || !isSelf }">
			<div class="flex flex-center b-b-1px pb-8 main-category">
				<div
					v-for="(v, k) in category"
					:key="k"
					class="btn"
					:class="{ active: view == k }"
					@click="changeTab(k)"
				>
					{{ v }}
				</div>
			</div>
			<div class="flex items-center pt-8 pl-10 text-14">
				<div
					v-for="(v, k) in subCategory"
					:key="k"
					class="btn btn-sub"
					:class="{ active: subView == k }"
					@click="subView = k"
				>
					{{ v }}
					<span class="inline-block min-w-20">{{ categoryNum[k] || 0 }}</span>
				</div>
			</div>
		</div>
		<div :style="{ minHeight: `${minHeight}px` }" class="bg-#fafafa">
			<PictureListWaterfall
				v-if="subView === 'picture'"
				:apiFunction="waterfallApiFunction"
				:apiParams="waterfallApiParams"
				:view="view"
				class="pb-50"
			/>
			<PostList
				v-else-if="subView === 'forum'"
				:apiFunction="forumApiFunction"
				:apiParams="forumApiParams"
				:view="view"
				:key="view"
				class="mb-50 pt-10"
			/>
			<UnLoginFollow v-else-if="subView === 'user' && !isLogin() && isSelf" />
		</div>
		<Footer v-if="isSelf" :active="4" />
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onBeforeMount,
		nextTick,
		onUnmounted,
		computed,
		provide,
		watch,
	} from 'vue'
	import {
		isLogin,
		clipboard,
		toast,
		updateURLParameter,
		useFontSize,
	} from '@/modules/util'
	import { getFollowFans } from '@/api/daniu'
	import { addVisitorLogApi } from '@/api/user'
	import { useUserStore } from '@/stores/user.js'
	import Header from './Header/index.vue'
	import Info from './Info/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import LoginBlock from '@/components/LoginBlock/index.vue'
	import Footer from '@/components/Footer/index.vue'
	import PostList from './PostList/index.vue'
	import PictureListWaterfall from './PictureListWaterfall/index.vue'
	import UnLoginFollow from './UnLoginFollow/index.vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { useMyCategory } from '@/hooks/useMyCategory.js'
	import { useMyTabCategoryStore } from '@/stores/myTabCategory.js'
	import { storeToRefs } from 'pinia'
	import { useWindowSize } from '@vueuse/core'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
		isSelf: {
			type: Boolean,
			default: false,
		},
	})
	const isSelf = props.isSelf
	const useStore = useUserStore()
	const { data: userData } = useStore
	const { setApiFunction } = useMyCategory()
	const useMyTabStore = useMyTabCategoryStore()
	const { pictureTotal, forumTotal } = storeToRefs(useMyTabStore)

	provide('isSelf', isSelf)
	provide('data', props.data)

	const someone = _get(props.data, 'someone.data')
	const user = computed(() => _defaultTo(someone, userData))
	const infoRef = ref(null)
	const showAvatar = ref(false)
	const view = ref('')
	const subView = ref('forum')
	const waterfallApiFunction = ref(null)
	const waterfallApiParams = ref(null)
	const forumApiFunction = ref(null)
	const forumApiParams = ref(null)

	const { height: windowHeight } = useWindowSize()
	const minHeight = ref(0)
	const calMinHeight = () => {
		const gap = isLogin() ? useFontSize(40 + 24 + 78).value : 0
		minHeight.value = windowHeight.value - gap
	}

	watch(() => windowHeight.value, calMinHeight)

	const handleScroll = (v) => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop
		const infoHeight = infoRef.value?.$el.offsetHeight - 25
		showAvatar.value = scrollTop > infoHeight
	}

	const category = ref({})
	const subCategory = computed(() => {
		if (view.value === 'follow') {
			return {
				forum: '帖子',
				picture: '想法',
				user: '用户',
			}
		}
		return {
			forum: '帖子',
			picture: '想法',
		}
	})

	const categoryNum = ref({
		forum: '',
		picture: '',
	})

	initialTab()

	function changeTab(type, subType) {
		const userId = user.value.userId ? user.value.userId : null
		view.value = type
		subView.value = subType ?? 'forum'
		const data = setApiFunction(type, userId)
		waterfallApiFunction.value = data.waterfallApiFunction.value
		waterfallApiParams.value = data.waterfallApiParams.value
		forumApiFunction.value = data.forumApiFunction.value
		forumApiParams.value = data.forumApiParams.value
		getTotal()
	}

	async function getTotal() {
		if (subView.value == 'picture' || view.value == 'follow') {
			//抓取論壇分類總數
			const forumParams = { page: 1, size: 1 }
			let forumRes = await forumApiFunction.value({
				...forumApiParams.value,
				...forumParams,
			})
			categoryNum.value.forum = _get(forumRes.data, 'total', 0)
		}

		if (subView.value == 'forum' || view.value == 'follow') {
			//抓取圖紙分類總數
			const pictureParams = { page: 1, size: 1 }
			let pictureRes = await waterfallApiFunction.value({
				...waterfallApiParams.value,
				...pictureParams,
			})
			categoryNum.value.picture = _get(pictureRes.data, 'total', 0)
		}

		if (view.value == 'follow') {
			//抓取未登錄用戶分類總數
			const userData = await getFollowFans({
				businessType: window._global.clientType,
				page: 1,
				size: 10,
				direct: '1',
			})
			categoryNum.value.user = _get(userData, 'data.total', 0)
		}
	}

	function initialTab() {
		if (isLogin() || !isSelf) {
			category.value = {
				write: '创作',
				collect: '收藏',
				like: '喜欢',
			}
		} else {
			category.value = {
				follow: '关注',
				collect: '收藏',
				tempView: '最近浏览',
			}
		}
	}

	function addVisitorLog() {
		if (isSelf || !user.value.userId) return
		addVisitorLogApi(user.value.userId)
	}

	function getUrlParams() {
		const params = new URL(window.location.href).searchParams
		const saveView =
			Array.from(params.keys())[0] ?? Object.keys(category.value)[0]
		const saveSubView = params.get(saveView) ?? 'forum'
		useMyTabStore.setView(saveView, saveSubView)
		updateURLParameter(saveView, saveSubView)
		changeTab(saveView, saveSubView)
	}

	onMounted(async () => {
		getUrlParams()
		addVisitorLog()
		await nextTick()
		window.addEventListener('scroll', handleScroll)
		calMinHeight()
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
	})

	function doShare() {
		clipboard(window.location.href, {
			onSuccess() {
				toast('已拷贝此页网址')
			},
		})
	}

	watch(
		() => [view.value, subView.value],
		(newVal) => {
			const height = _get(infoRef.value, '$el.offsetHeight', 0)
			if (height > 0) window.scroll(0, Math.min(window.scrollY, height))
			useMyTabStore.setView(view.value, subView.value)
			updateURLParameter(view.value, subView.value)
		}
	)

	watch(
		() => [pictureTotal.value, forumTotal.value],
		([pictureTotal, forumTotal]) => {
			if (subView.value == 'picture') {
				categoryNum.value.picture = pictureTotal
			} else if (subView.value == 'forum') {
				categoryNum.value.forum = forumTotal
			}
		}
	)
</script>
<style scoped lang="scss">
	.btn-box {
		padding: 0.5rem;
		box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.1);
		background-color: #fff;
		border-radius: 20px 20px 0 0;
		.main-category {
			.btn {
				font-size: 1rem;
				&.active::after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: -0.125rem;
					transform: translateX(-50%);
					display: block;
					width: 80%;
					height: 0.125rem;
					border-radius: 0.3125rem;
					background-color: #34c759;
				}
			}
		}
		.btn {
			position: relative;
			font-size: 0.875rem;
			color: #aeaeb1;
			margin: 0 1.5rem;
			&.disable {
				font-size: 0.875rem;
				font-weight: 500;
				text-align: center;
				color: #aeaeb1;
			}
		}
		.btn-sub {
			margin: 0 0.625rem;
		}
		.active {
			color: #434343;
			font-weight: 600;
		}
	}
	.bg {
		background-size: cover;
		background-position: 0 0;
		background-repeat: no-repeat;
	}
	.header-other {
		background-color: #fdfcf0;
	}
	.small-avatar-transition-enter-active {
		transition: opacity 0.4s ease;
	}

	.small-avatar-transition-enter-from {
		opacity: 0;
	}
</style>
