<template>
	<div class="color-#AEAEB1 bg-#fff font-500">
		<ul class="flex-center font-500 pt-6 pb-7 bb-#E7E7E7">
			<li
				v-for="(item, index) in tabs"
				:key="index"
				class="mx-25 lh-22"
				:class="{ 'active-tab': item.path === activeTab }"
				@click="handleTabClick(item.path)"
			>
				{{ item.title }}
			</li>
		</ul>

		<ul class="flex py-5.5 bb-#E7E7E7">
			<li
				v-for="(item, index) in dateTabs"
				:key="index"
				class="mx-10 lh-18"
				:class="{ 'active-date-tab': item.key === activeDateTab }"
				@click="handleDateTabChange(item.key)"
			>
				{{ item.title }}
			</li>
		</ul>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { redirect } from '@/modules/util.js'

	const dateTabs = [
		{ title: '今天', key: 1 },
		{ title: '近一个月', key: 2 },
		{ title: '近半年', key: 3 },
		{ title: '近一年', key: 4 },
	]
	const tabs = [
		{ title: '图库', path: '/activityHistory/gallery' },
		{ title: '论坛', path: '/activityHistory/forum' },
	]

	const activeTab = ref('')
	const activeDateTab = ref(dateTabs[0].key)

	const emit = defineEmits(['changeDateTab'])

	function handleTabClick(path) {
		redirect(path, { skip: true })
	}

	function handleDateTabChange(key) {
		activeDateTab.value = key
		emit('changeDateTab', key)
	}

	onMounted(() => {
		activeTab.value = window.location.pathname
	})
</script>

<style lang="scss" scoped>
	.active-tab {
		position: relative;
		color: #434343;
		font-weight: 600;
		&::after {
			content: '';
			display: block;
			width: 78.13%;
			height: 0.125rem;
			position: absolute;
			left: 50%;
			bottom: -0.25rem;
			transform: translateX(-50%);
			border-radius: 0.1563rem;
			background-color: #34c759;
		}
	}

	.active-date-tab {
		color: #434343;
		font-weight: 600;
	}
</style>
