<template>
	<div class="min-h-100dvh" :class="{ 'bg-#fafafa': !isEmptyData }">
		<NormalHeader title="浏览记录" border-bottom-color="#ebedf0" />
		<Tab
			@changeDateTab="changeDateTab"
			class="fixed top-45 w-full max-w-480px z-10"
		/>

		<div class="pt-120 px-10">
			<NoContent v-if="isEmptyData" text="暂无数据" />
			<van-list
				v-else
				v-model:loading="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="handleLoad"
			>
				<ul>
					<li
						v-for="(item, index) in visitHistoryList"
						:key="index"
						class="not-last-mb-10"
					>
						<Post :postData="item" />
					</li>
				</ul>
			</van-list>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive, computed, provide, nextTick } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import Post from '@/components/Post/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import Tab from '../Tab/index.vue'
	import { getVisitForumHistoryApi } from '@/api/user'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)

	const loading = ref(false)
	const finished = ref(false)
	const pageIndex = ref(1)
	const visitHistoryList = reactive([])
	const recentFlag = ref(1) // 指定時間範圍
	const isEmptyData = computed(() => !visitHistoryList.length && finished.value)

	async function handleLoad() {
		const response = await getVisitForumHistoryApi({
			page: pageIndex.value,
			recentFlag: recentFlag.value,
		})
		const list = _get(response, 'data.list', [])
		const total = _get(response, 'data.total', 0)

		visitHistoryList.push(...list)
		loading.value = false
		pageIndex.value++

		// 判斷是否已加載完所有資料
		if (visitHistoryList.length >= total) {
			finished.value = true
		}
	}

	async function changeDateTab(key) {
		finished.value = true
		await nextTick()
		recentFlag.value = key
		visitHistoryList.length = 0
		loading.value = false
		finished.value = false
		pageIndex.value = 1
	}
</script>

<style lang="scss" scoped></style>
