<template>
	<div class="main">
		<h1>Bar組件</h1>
		<h2>Pinia store : {{ store.count }}</h2>
		<h3>{{ webInfo.templateId }}</h3>
		<h3>{{ webInfo.sketchCode }}</h3>
		<h3>{{ webInfo.manageSiteId }}</h3>
	</div>
	<swiper :slides-per-view="3.65" :space-between="10">
		<swiper-slide v-for="n in 10" :key="n">
			<div class="w-80 h-80 bg-gray-3" @click="doClick(n)">{{ n }}</div>
		</swiper-slide>
	</swiper>
</template>

<script setup>
	import { useCounterStore } from '@/stores/counter.js'
	import { useWebInfoStore } from '@/stores/webInfo.js'
	import { toast } from '@/modules/util.js'
	const store = useCounterStore()
	const webInfo = useWebInfoStore()

	function doClick(text) {
		toast(text)
	}
</script>

<style>
	.main {
		width: 100%;
		background-color: blueviolet;
		color: #fff;
	}
</style>
