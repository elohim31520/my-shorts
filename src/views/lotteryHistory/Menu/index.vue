<template>
	<div
		class="h-40 flex-y-center text-18 bg-#fafafa color-#656565 max-w-480px grid grid-cols-2 gap-x-10"
	>
		<div
			v-for="(tab, index) in tabs"
			:key="index"
			class="h-30 bd-#E0E0E0 rounded-10 flex-center"
			:class="[
				isActive(tab.path) ? ' color-primary bd-#34C759! bg-#F1FEE6' : '',
			]"
			@click="handleTabClick(tab.path)"
		>
			{{ tab.title }}
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { redirect } from '@/modules/util.js'

	const basePath = '/lotteryHistory'
	const tabs = [
		{ title: '开奖记录', path: '/record' },
		{ title: '开奖日期', path: '/date' },
	]
	const currentPath = ref('')

	function handleTabClick(path) {
		redirect(`${basePath}${path}`, { skip: true })
	}

	function isActive(path) {
		return currentPath.value === `${basePath}${path}`
	}

	onMounted(() => {
		currentPath.value = window.location.pathname
	})
</script>

<style lang="scss" scoped></style>
