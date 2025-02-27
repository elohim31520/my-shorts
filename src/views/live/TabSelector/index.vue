<template>
	<ul
		class="h-35 grid grid-cols-5 px-30 bt-#e7e7e7 bg-#fff color-#AEAEB1 font-500"
	>
		<li
			v-for="(item, index) in tabs"
			:key="item.key"
			class="flex-center w-full"
			:class="{ 'font-600 color-#434343': item.key === selectedKey }"
			@click="selectTab(item.key)"
		>
			<SvgIcon
				v-if="item.icon"
				:name="item.icon"
				class="mr-3"
				:class="[selectedKey === item.key ? 'color-#434343' : 'color-#aeaeb1']"
			/>
			<span>{{ item.label }}</span>
		</li>
	</ul>
</template>

<script setup>
	import { ref, watch } from 'vue'

	const props = defineProps({})

	const tabs = [
		{ label: '推荐', key: 'aa' },
		{ label: '热门', key: 'bb' },
		{ label: '精华', key: 'cc' },
		{ label: '爆款', key: 'dd' },
		{ label: '规则', key: 'ee', icon: 'icon_ruleoff' },
	]

	const selectedKey = ref(tabs[0].key)

	function selectTab(key) {
		selectedKey.value = key
	}
</script>
