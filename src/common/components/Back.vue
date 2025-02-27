<template>
	<img class="close" ref="imgEl" :src="src" />
</template>
<script setup lang="ts">
	import { _css } from '@/common/utils/dom'
	import { onMounted, ref, computed } from 'vue'

	defineOptions({
		name: 'Back',
	})
	const props = defineProps({
		mode: {
			type: String,
			default: 'gray',
		},
		img: {
			type: String,
			default: 'back',
		},
		direction: {
			type: String,
			default: 'left',
		},
		scale: {
			type: [Number, String],
			default: 1,
		},
	})

	const imgEl = ref()
	const src = computed(() => {
		return new URL(
			`/shorts/img/icon/components/${props.mode}-${props.img}.png`,
			import.meta.url
		).href
	})

	onMounted(() => {
		_css(
			imgEl,
			'transform',
			`rotate(${props.direction === 'left' ? '0' : '180'}deg) scale(${props.scale})`
		)
	})
</script>

<style scoped lang="scss">
	img {
		width: 20px;
	}
</style>
