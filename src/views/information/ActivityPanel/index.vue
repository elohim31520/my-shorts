<template>
	<div
		class="mt-55 pt-20 pb-10 px-20 flex flex-row justify-center items-center gap-4"
	>
		<div
			class="flex-col flex-center flex-1"
			v-for="(item, index) in items"
			:key="index"
			@click="goTo(item.page)"
		>
			<SvgIcon size="3.75rem" :name="item.icon" />
			<p class="mt-8 color-#434343 font-600 whitespace-nowrap">
				{{ item.label }}
			</p>
		</div>
	</div>
</template>

<script setup>
	import { redirect } from '@/modules/util.js'
	const items = [
		{ label: '喜欢和收藏', icon: 'collect', page: '/my/collect' },
		{ label: '已关注', icon: 'follow', page: '/my/follow' },
		{ label: '评论和＠', icon: 'comment', page: '/my/comment' },
		{ label: '活动', icon: 'activity', page: '/activity' },
	]

	function goTo(path) {
		redirect(path)
	}
</script>

<style lang="scss" scoped></style>
