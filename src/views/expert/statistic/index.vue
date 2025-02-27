<template>
	<div class="">
		<Header title="专家统计" />
		<div class="mt-45 pt-5 bg-#fafafa content" v-if="lists.length">
			<BarChart v-for="item in lists" :data="item" :key="item.period" />
		</div>
		<div class="mt-45" v-else>
			<NoContent text="暂无数据" v-if="!duration" />
		</div>

		<Footer v-model="playTypeCode" />
	</div>
</template>

<script setup>
	import { provide, ref, watch } from 'vue'
	import Header from '@/components/NormalHeader/index.vue'
	import Footer from '@/components/PlayTypeCodeFooter/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import BarChart from './BarChart/index.vue'

	import { getExpertStatistics } from '@/api/expert.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)

	const gameType = _get(props, 'data.gameType', '')
	const playTypeCode = ref(_get(props, 'data.playTypeCode', ''))
	const lists = ref(_get(props, 'data.statisticsData.data.list', []))
	const duration = ref(false)

	watch(
		() => playTypeCode.value,
		(val) => {
			changePlayType(val)
		}
	)

	const changePlayType = async (code) => {
		duration.value = true
		lists.value = []
		playTypeCode.value = code
		const res = await getExpertStatistics({
			gameType,
			playTypeCode: code,
		})

		if (res.success) {
			lists.value = _get(res, 'data.list', [])
		}

		duration.value = false
	}
</script>

<style lang="scss" scoped>
	.content {
		min-height: calc(100vh - 2.8125rem);
		padding-bottom: 3.125rem;
	}
</style>
