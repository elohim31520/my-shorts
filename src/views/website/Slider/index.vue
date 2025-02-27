<template>
	<swiper :slides-per-view="4.6" :space-between="10" class="mySwiper">
		<swiper-slide
			v-for="(item, index) in menuList"
			:key="index"
			@click="swiperClick(item.url)"
		>
			<div class="flex flex-col items-center py-9 rounded-15">
				<SvgIcon :name="item.icon" size="3rem" />
				<p class="text-center text-14 mt-5 font-600">{{ item.name }}</p>
			</div>
		</swiper-slide>
	</swiper>
</template>

<script setup>
	import { redirect } from '@/modules/util.js'
	const menuList = [
		{
			name: '开奖现场',
			icon: 'button_onSite',
			url: '/live',
		},
		{
			name: '资料大全',
			icon: 'button_material',
			url: '/corpus',
		},
		{
			name: '资讯统计',
			icon: 'button_statistics',
			url: '/statistic',
		},
		{
			name: '查询工具',
			icon: 'button_Query',
			url: '/consultation',
		},
		{
			name: '幽默猜测',
			icon: 'button_guess',
			url: '/humorVote',
		},
		{
			name: '工具宝箱',
			icon: 'button_tool',
			url: '/toolbox',
		},
		// {
		// 	name: '六合图库',
		// 	icon: 'button_Gallery',
		// 	url: '',
		// },
		{
			name: '高手论坛',
			icon: 'button_forum',
			url: '/expertForum',
		},
	]

	function swiperClick(url) {
		redirect(url)
	}
</script>

<style lang="scss" scoped>
	.mySwiper {
		padding: 0 0.625rem;
	}
</style>
