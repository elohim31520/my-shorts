<template>
	<div class="fixed top-0 z-20 w-full bg-#fff h-45 max-w-480px">
		<div class="relative py-10">
			<ul class="flex-center text-20 color-#aeaeb1">
				<li
					v-for="(item, index) in computedTabList"
					:key="index"
					:class="[
						'px-15',
						{
							active: item.path === activeTab,
						},
					]"
					@click="handleTabClick(item)"
				>
					{{ item.title }}
				</li>
			</ul>
			<div
				class="absolute left-10 top-10"
				href="javascript:void(0)"
				@click="doBack"
			>
				<SvgIcon name="arrow_left" size="1.875rem" class="color-#434343" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { back, redirect } from '@/modules/util.js'
	import { ref, onMounted, inject, computed } from 'vue'

	const activeTab = ref('')
	const someoneUserId = inject('someoneUserId')

	const tabList = ref([
		{
			title: '关注',
			type: 'follow',
			path: '/my/channel/follow',
		},
		{
			title: '粉丝',
			type: 'fans',
			path: '/my/channel/fans',
		},
		{
			title: '推荐',
			type: 'recommend',
			path: '/my/channel/recommend',
		},
	])

	const computedTabList = computed(() =>
		tabList.value.map((tab, index) => ({
			...tab,
			path: activeTab.value.includes('/user')
				? `/user/${tab.type}/${someoneUserId}`
				: tab.path,
		}))
	)

	function handleTabClick(item) {
		if (item.path) redirect(item.path, { skip: true })
	}

	function doBack(event) {
		event.preventDefault()
		back()
	}

	onMounted(() => {
		activeTab.value = window.location.pathname
	})
</script>

<style lang="scss" scoped>
	.active {
		color: #434343;
		font-weight: 600;
		&::after {
			content: '';
			display: block;
			width: 80%;
			height: 0.125rem;
			border-radius: 0.3125rem;
			background-color: $primary-color;
			margin: auto;
		}
	}
</style>
