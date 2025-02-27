<template>
	<div class="min-h-100dvh" :class="{ 'bg-#fafafa': !isEmptyData }">
		<NormalHeader title="浏览记录" border-bottom-color="#ebedf0" />
		<Tab
			@changeDateTab="changeDateTab"
			class="fixed top-45 w-full max-w-480px z-10"
		/>

		<div class="pt-110">
			<WithDelay v-if="isEmptyData">
				<NoContent text="暂无数据" />
			</WithDelay>
			<Waterfall
				ref="waterfallRef"
				v-show="!isEmptyData"
				v-if="!shouldRefreshWaterfall"
				:apiFunction="getVisitGalleryHistoryApi"
				:apiParams="apiParams"
			/>
		</div>
	</div>
</template>

<script setup>
	import { ref, nextTick, computed, provide } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import Waterfall from '@/components/Waterfall/index.vue'
	import WithDelay from '@/components/WithDelay/index.vue'
	import Tab from '../Tab/index.vue'
	import { getVisitGalleryHistoryApi } from '@/api/user'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)

	const apiParams = ref({})
	const shouldRefreshWaterfall = ref(false)
	const waterfallRef = ref(null)
	const isEmptyData = computed(() =>
		_get(waterfallRef.value, 'isEmptyData', false)
	)

	function handleWaterfallUpdate(key) {
		apiParams.value.recentFlag = key
		triggerWaterfallRefresh()
	}

	async function triggerWaterfallRefresh() {
		shouldRefreshWaterfall.value = true
		await nextTick()
		shouldRefreshWaterfall.value = false
	}

	function changeDateTab(key) {
		handleWaterfallUpdate(key)
	}
</script>

<style lang="scss" scoped></style>
