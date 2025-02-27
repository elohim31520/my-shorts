<template>
	<NoContent v-show="!list.length" text="暂无数据" />
	<van-list
		v-model:loading="isLoadingMore"
		:finished="isFinished"
		@load="onLoad"
		:immediate-check="false"
		:finished-text="list.length ? '没有更多了' : ''"
	>
		<div class="w-full flex justify-between p-5 bg-#FAFAFA">
			<div class="w-49%">
				<div
					class="mb-8 shadow-primary rounded-7 overflow-hidden"
					v-for="(item, index) in galleryList1"
					:key="index"
				>
					<Card :data="item" :order="index" />
				</div>
			</div>
			<div class="w-49%">
				<div
					class="mb-8 shadow-primary rounded-7 overflow-hidden"
					v-for="(item, index) in galleryList2"
					:key="index"
				>
					<Card :data="item" :order="index" />
				</div>
			</div>
		</div>
	</van-list>
</template>

<script setup>
	import NoContent from '@/components/NoContent/index.vue'
	import Card from '../Card/index.vue'
	import { useWaterfall } from '../useWaterfall'

	const {
		list,
		isLoadingMore,
		isFinished,
		onLoad,
		galleryList1,
		galleryList2,
	} = useWaterfall()
</script>
