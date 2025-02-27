<template>
	<div class="recommend">
		<div class="fixed w-100% max-w-480px top-0 z-10 the-header">
			<HuntTreasureHeader />
		</div>
		<div class="pt-47" ref="wrap">
			<LotteryTypes sync />
			<div class="px-10 py-10">
				<Marquee />
			</div>
			<WebsiteSlider
				:bbsSites="props.data.bbsSiteList?.data"
				class="mt-5 pl-10"
				ref="target"
			/>
		</div>
		<ForumPostList typeStickyTop="68" :hideTopic="true" class="mt-15" />
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
	import { ref, provide, onMounted, watchEffect, watch } from 'vue'
	import HuntTreasureHeader from '@/components/HuntTreasureHeader/index.vue'
	import Marquee from '@/components/Marquee/index.vue'
	import WebsiteSlider from '@/components/WebsiteSlider/index.vue'
	import Footer from '@/components/Footer/index.vue'
	import ForumPostList from '@/components/ForumPostList/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import { useForumListStore } from '@/stores/forumList.js'
	import { storeToRefs } from 'pinia'
	import { useWindowSize, useElementSize } from '@vueuse/core'

	const props = defineProps({
		data: {
			type: Object,
			default: '',
		},
	})

	provide('data', props.data)
	const { target } = storeToRefs(useForumListStore())
	const wrap = ref(null)
	const { height: warpHeight } = useElementSize(wrap)

	watch(
		() => warpHeight.value,
		(value) => {
			useForumListStore().setTop(value)
		}
	)

	onMounted(() => {
		watchEffect(calMinHeight)
	})

	function calMinHeight() {
		const fontSize = parseFloat(window.getComputedStyle(document.body).fontSize)
		const sum =
			68 + //stickyTop
			35 //ForumPostList 一行分類
		const { height } = useWindowSize()
		const minHeight = height.value - (sum * fontSize) / 16
		useForumListStore().setMinHeight(minHeight)
	}
</script>

<style lang="scss" scoped>
	.com-def-btn-active {
		width: 5rem;
		height: 1.875rem;
	}
	.recommend {
		:deep(.van-list__finished-text) {
			padding-bottom: 5rem;
		}
	}
</style>
