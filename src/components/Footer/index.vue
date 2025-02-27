<template>
	<div class="footer">
		<ul class="tabs">
			<li
				v-for="tab in tabItems"
				:key="tab.key"
				:class="{ 'color-primary': tab.key == currentTab }"
				class="flex items-center justify-center"
				@click="goTo(tab)"
			>
				<div>
					<div
						v-if="tab.key !== 2 || !showIcon"
						class="relative"
						:class="{ 'ml-15': tab.key === 0, 'mr-15': tab.key === 4 }"
					>
						{{ tab.name }}
						<van-badge
							v-if="tab.key == 1 && isMounted"
							class="important-absolute"
							:dot="isAnyUnread"
						/>
					</div>
					<!-- <SvgIcon v-else :name="tab.icon" size="3.125rem" /> -->
					<div v-else class="icon"></div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
	import { ref, onBeforeMount } from 'vue'
	import { storeToRefs } from 'pinia'
	import { anyUnreadMsg } from '@/api/newsList.js'
	import { checkNewResourcesApi } from '@/api/resources.js'
	import { useUserStore } from '@/stores/user.js'
	import { useNewsStore } from '@/stores/newsList.js'
	import { redirect, getOrDefault } from '@/modules/util.js'
	import { localStore } from '@/modules/storage'
	import { formatTimestamp } from '@/modules/date'

	const userStore = useUserStore()
	const { data: user } = userStore
	const newsStore = useNewsStore()
	const { isAnyUnread } = storeToRefs(newsStore)

	const props = defineProps({
		active: {
			type: Number,
			default: 0,
		},
		showIcon: {
			type: Boolean,
			default: true,
		},
	})

	const currentTab = ref(props.active)
	const showIcon = ref(props.showIcon)
	const isMounted = ref(false)
	const tabItems = [
		{ name: '首页', key: 0, icon: null, page: '/' },
		{ name: '发现', key: 1, icon: null, page: '/follow' },
		{ name: '淘料', key: 2, icon: 'white-plus', page: '/material' },
		{ name: '寻宝', key: 3, icon: null, page: '/recommend' },
		{ name: '我的', key: 4, icon: null, page: '/my' },
	]

	onBeforeMount(async () => {
		if (!user.userId) return
		const lastVisitedTime = getOrDefault(
			localStore.lastVisitedTime,
			'followedUsersContent'
		)
		const response = await checkNewResourcesApi(lastVisitedTime)
		const success = _get(response, 'success', false)
		if (success) newsStore.changeUnread(_get(response, 'data', false))
		isMounted.value = true
	})

	function goTo(tab) {
		redirect(tab.page, { ignoreSelf: true })
	}
</script>

<style lang="scss" scoped>
	.footer {
		position: fixed;
		left: 50%;
		bottom: 0;
		display: flex;
		align-items: center;
		z-index: 10;
		background-color: #fff;
		height: 3.125rem;
		max-width: 480px;
		width: 100%;
		transform: translateX(-50%);
		color: #656565;
	}
	.tabs {
		display: flex;
		align-items: center;
		flex: 1;
		text-align: center;
		line-height: 3.125rem;
		li {
			font-size: 1.125rem;
			font-weight: bold;
			position: relative;
			cursor: pointer;
			width: 20%;
		}
	}
	:deep(.van-badge--dot) {
		width: 0.3075rem;
		height: 0.3075rem;
	}
	:deep(.van-badge--top-right) {
		top: 0.9rem;
		right: -0.12rem;
	}
	.icon {
		width: 3.187rem;
		height: 2.32rem;
		background-image: url('/public-assets/images/white-plus.svg');
		background-size: cover;
		background-position: 0.1rem;
		background-repeat: no-repeat;
	}
</style>
