<template>
	<div class="fixed top-0 bg-#ffffff z-10 w-full max-w-480px">
		<HuntTreasureHeader />
	</div>
	<List />
	<Footer :active="3" />
</template>

<script setup>
	import { provide } from 'vue'
	import HuntTreasureHeader from '@/components/HuntTreasureHeader/index.vue'
	import List from './List/index.vue'
	import Footer from '@/components/Footer/index.vue'

	const props = defineProps({
		data: {
			type: Array,
			default: () => [],
		},
	})

	provide('data', props.data)
</script>
