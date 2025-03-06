<template>
	<SlideItem>
		<SlideList
			uniqueId="home"
			style="background: #000"
			:active="props.active"
			:api="recommendedVideo"
		/>
	</SlideItem>
</template>

<script setup lang="jsx">
	import SlideItem from '@/views/shorts/common/slide/SlideItem.vue'
	import SlideList from './SlideList.vue'
	import { recommendedVideo } from '@/api/shorts'

	const props = defineProps({
		active: {
			type: Boolean,
			default: false,
		},
	})
</script>
