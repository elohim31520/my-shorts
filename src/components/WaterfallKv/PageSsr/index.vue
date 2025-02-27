<template>
	<div class="w-full flex justify-between p-5 bg-#FAFAFA">
		<div class="w-49%">
			<div
				class="mb-8 shadow-primary rounded-7 overflow-hidden"
				v-for="(item, index) in galleryList1"
				:key="index"
			>
				<Drawing :data="item" />
			</div>
		</div>
		<div class="w-49%">
			<div
				class="mb-8 shadow-primary rounded-7 overflow-hidden"
				v-for="(item, index) in galleryList2"
				:key="index"
			>
				<Drawing :data="item" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import { useWaterfall } from '../useWaterfall'
	import Drawing from '@/components/Drawing/index.vue'

	const { kvList: list } = useWaterfall()

	//資料太多，頁面體積過大，只取前8筆
	const galleryList1 = computed(() =>
		_filter(list.slice(0, 8), (_, index) => index % 2 === 0)
	)

	const galleryList2 = computed(() =>
		_filter(list.slice(0, 8), (_, index) => index % 2 !== 0)
	)
</script>
