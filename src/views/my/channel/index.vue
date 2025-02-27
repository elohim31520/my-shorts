<template>
	<NormalHeader
		title="我的频道"
		class="bg-gradient-to-r from-[#fdf8e9] to-[#fbfdf9]"
	/>
	<MyInfo class="mt-40" />

	<div class="color-#656565 px-20 pt-20 bg-#fff mb-20">
		<div class="text-18 color-#434343 mb-10 font-600">我的频道</div>
		<div class="grid grid-cols-4 gap-4">
			<template v-for="(item, index) in channelItems" :key="index">
				<div
					v-if="
						item.src != '/my/sell' || (item.src == '/my/sell' && item.isExpert)
					"
					class="flex flex-col items-center h-70"
					@click="clickPlatform(item)"
				>
					<svgIcon :name="item.icon" size="1.5625rem" />
					<span class="mt-8 text-16 font-400 color-#434343 lh-21.79">
						{{ item.label }}
					</span>
				</div>
			</template>
		</div>
	</div>

	<div class="color-#656565 px-20 bg-#fff mb-20">
		<div class="text-18 color-#434343 mb-10 font-600">排行榜</div>
		<div class="grid grid-cols-4 gap-4">
			<div
				v-for="(item, index) in rankingItems"
				:key="index"
				class="flex flex-col items-center h-70"
				@click="clickChannel(item)"
			>
				<svgIcon :name="item.icon" size="1.5625rem" />
				<span class="mt-8 text-16 font-400 color-#434343 lh-21.79">
					{{ item.label }}
				</span>
			</div>
		</div>
	</div>

	<div class="color-#656565 px-20 bg-#fff">
		<div class="text-18 color-#434343 mb-10 font-600">平台信息</div>
		<div class="grid grid-cols-4 gap-8">
			<div
				v-for="(item, index) in infoItems"
				:key="index"
				class="flex flex-col items-center h-70"
				@click="clickPlatform(item)"
			>
				<svgIcon :name="item.icon" size="1.5625rem" />
				<span class="mt-8 text-16 font-400 color-#434343 lh-21.79">
					{{ item.label }}
				</span>
			</div>
		</div>
	</div>

	<!-- <div class="px-20 pt-30 pb-10 bg-#fff">
		<div class="text-18 color-#434343 mb-23.68 font-600">必要工具</div>
		<div class="grid grid-cols-2 gap-4">
			<div
				v-for="(tool, index) in tools"
				:key="index"
				class="relative flex flex-col items-center p-4 border shadow-sm rounded-8"
			>
				<div class="flex items-center">
					<div class="relative">
						<svgIcon :name="tool.icon" size="3rem" />
						<div
							v-if="tool.badge"
							class="absolute top-0 right-0 translate-x-3 translate-y--3 text-12 bg-primary px-1 text-white rounded-full flex items-center justify-center"
						>
							{{ tool.badge }}
						</div>
					</div>

					<div class="flex flex-col items-center">
						<div class="text-20 font-600 color-#434343">{{ tool.title }}</div>
						<div class="text-12 color-#656565">{{ tool.description }}</div>
					</div>
				</div>
			</div>
		</div>
	</div> -->
</template>

<script setup>
	import { provide } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	// import Header from './Header/index.vue'
	import MyInfo from './MyInfo/index.vue'
	import { redirect } from '@/modules/util.js'
	import { useUserStore } from '@/stores/user.js'
	import { storeToRefs } from 'pinia'

	const props = defineProps({
		isSelf: {
			type: Boolean,
		},
	})

	provide('isSelf', props.isSelf)

	const { isExpert } = storeToRefs(useUserStore())
	const channelItems = [
		{
			icon: 'channel_chat',
			label: '我的评论',
			src: '/my/review/gallery',
		},
		{
			icon: 'channel_level',
			label: '我的等级',
			src: '/my/level',
		},
		{
			icon: 'channel_medal',
			label: '我的勋章',
			src: '/my/medal',
		},
		{
			icon: 'channel_friends',
			label: '邀请好友',
			src: '/my/invite',
		},
		{ icon: 'channel_buy', label: '我的买料', src: '/my/buy' },
		{
			icon: 'channel_sold',
			label: '我的卖料',
			src: '/my/sell',
			isExpert,
		},
		{ icon: 'channel_send', label: '我的推广', src: '/my/promote' },
		{ icon: 'channel_money', label: '我的账户', src: '/my/account' },
		// { icon: 'channel_star', label: '我的收藏', src: '' },
		// { icon: 'channel_thumb', label: '我的点赞', src: '' },
		// { icon: 'channel_heart', label: '我的关注', src: '' },
		// { icon: 'channel_create', label: '我的发布', src: '' },
		// { icon: 'channel_fan', label: '我的粉丝', src: '' },
	]

	const rankingItems = [
		{
			icon: 'ranking_heart',
			label: '粉丝排行',
			src: '/expertForum/rankingList/fans',
		},
		{
			icon: 'ranking_star',
			label: '热度排行',
			src: '/expertForum/rankingList/heat',
		},
		{
			icon: 'ranking_point',
			label: '积分排行',
			src: '/expertForum/rankingList/score',
		},
		// { icon: 'ranking_share', label: '分享排行榜', src: '/' },
		// { icon: 'ranking_gift', label: '礼物排行榜', src: '/' },
	]

	const infoItems = [
		{ icon: 'channel_phone', label: '下载App', src: '/download' },
		{ icon: 'channel_service', label: '联系客服', src: '/cs' },
		{ icon: 'channel_about', label: '关于我们', src: '/my/setting/about' },
		{ icon: 'channel_report', label: '意见反馈', src: '/feedback' },
		// { icon: 'channel_mail', label: '站内讯息', src: '/' },
		// { icon: 'channel_clear', label: '清除缓存', src: '/' },
		// { icon: 'channel_gear', label: '平台设置', src: '/' },
	]

	const tools = [
		{
			icon: 'channel_crown',
			title: '申请代言人',
			description: '现场直播开奖结果',
		},
		{
			icon: 'channel_gift',
			title: '活动中心',
			description: '现场直播开奖结果',
			badge: '25',
		},
		{
			icon: 'channel_invite',
			title: '邀请好友',
			description: '现场直播开奖结果',
		},
		{
			icon: 'channel_wallet',
			title: '卡包',
			description: '现场直播开奖结果',
		},
		{
			icon: 'channel_chart',
			title: '月度报表',
			description: '现场直播开奖结果',
		},
		{
			icon: 'channel_diamond',
			title: '用户等级',
			description: '现场直播开奖结果',
		},
	]

	function clickChannel(vo) {
		if (vo.src) redirect(vo.src)
	}
	function clickPlatform(vo) {
		if (vo.src) redirect(vo.src, { auth: vo.auth, skip: vo.skip })
	}
</script>

<style></style>
