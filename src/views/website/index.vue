<template>
	<div class="flex flex-col min-h-100vh pt-139 bg-#fafafa">
		<div class="fixed top-0 z-10 bg-#fff w-full max-w-480px">
			<HuntTreasureHeader />
			<Slider />
		</div>
		<LotteryTypes sync />
		<WebList class="pb-90" />
		<DynamicFixedElement
			:position="{ bottom: 0 }"
			:moveRange="49"
			:directions="['up']"
			class="z-10"
		>
			<LotteryTypes sync />
		</DynamicFixedElement>
		<Footer :active="3" />
	</div>
</template>

<script setup>
	import { provide } from 'vue'
	import HuntTreasureHeader from '@/components/HuntTreasureHeader/index.vue'
	import Slider from './Slider/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import WebList from './WebList/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import Footer from '@/components/Footer/index.vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => {},
		},
	})

	provide('data', props.data)
</script>
