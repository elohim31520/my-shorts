<template>
	<div class="mb-6">
		<div class="flex-y-center justify-between mb-10">
			<h2 class="font-600 text-18">热搜推荐</h2>
			<button class="color-#656565" @click="$emit('changeRecommendations')">
				换一批
			</button>
		</div>
		<div
			v-for="(item, index) in hotSearch"
			:key="index"
			class="lh-30 px-10 mb-10"
			@click="$emit('hotSearchClick', item)"
		>
			{{ item }}
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		hotSearch: {
			type: Array,
			default: () => [],
		},
	})

	const emits = defineEmits(['hotSearchClick', 'changeRecommendations'])
</script>
