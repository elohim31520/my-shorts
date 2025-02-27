<template>
	<div class="h-full" :class="{ 'bg-#FAFAFA': !isEmptyData }">
		<!-- 純註解不刪，哪天說不定又加回來
			<div class="fixed top-45 z-20 w-full bg-#fafafa max-w-480px">
			<LotteryTypes class="mb-4.5" />
			<PictureSeriesTab @update:seriesActive="handleWaterfallUpdate" />
		</div> -->

		<div>
			<WithDelay v-if="isEmptyData">
				<NoContent text="暂无数据" />
			</WithDelay>
			<Waterfall
				v-show="!isEmptyData"
				ref="waterfallRef"
				v-if="!shouldRefreshWaterfall"
				:apiFunction="getFollowedResourcesApi"
				:apiParams="apiParams"
			/>
		</div>

		<!-- <PictureSeriesSelector @confirmSelection="handleWaterfallUpdate" /> -->
	</div>
</template>

<script setup>
	import { ref, nextTick, watch, computed, onMounted } from 'vue'
	import { storeToRefs } from 'pinia'
	// import LotteryTypes from '@/components/LotteryTypes/index.vue'
	// import PictureSeriesTab from '@/components/PictureSeriesTab/index.vue'
	import Waterfall from '@/components/Waterfall/index.vue'
	// import PictureSeriesSelector from '@/components/PictureSeriesSelector/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { getFollowedResourcesApi } from '@/api/resources'
	import { useLotteryStore } from '@/stores/lottery'
	import WithDelay from '@/components/WithDelay/index.vue'
	import { localStore } from '@/modules/storage'

	const { lotteryType } = storeToRefs(useLotteryStore())
	const shouldRefreshWaterfall = ref(false)
	const apiParams = ref({
		gameTypeCode: lotteryType.value,
	})
	const waterfallRef = ref(null)
	const isEmptyData = computed(() =>
		_get(waterfallRef.value, 'isEmptyData', false)
	)

	function handleWaterfallUpdate(seriesCode) {
		apiParams.value.seriesCode = seriesCode
		triggerWaterfallRefresh()
	}

	async function triggerWaterfallRefresh() {
		shouldRefreshWaterfall.value = true
		await nextTick()
		shouldRefreshWaterfall.value = false
	}

	watch(lotteryType, () => {
		delete apiParams.value.seriesCode
		apiParams.value.gameTypeCode = lotteryType.value
		triggerWaterfallRefresh()
	})

	onMounted(() => {
		localStore.lastVisitedTime = {
			...localStore.lastVisitedTime,
			followedUsersContent: new Date().getTime(),
		}
	})
</script>

<style lang="scss" scoped></style>
