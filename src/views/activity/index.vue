<template>
	<div class="pt-45">
		<Header title="活动" />
		<van-list
			@load="onLoad"
			:loading="isLoading"
			:finished="finished"
			:immediate-check="false"
			finished-text="没有更多了"
		>
			<List :items="items" />
		</van-list>
		<NoContent v-if="items.length === 0" text="暂无活动, 请等待下期活动推出~" />

		<Footer :active="3" />
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import { useUserStore } from '@/stores/user'
	import Header from '@/components/NormalHeader/index.vue'
	import List from './List/index.vue'
	import Footer from '@/components/Footer/index.vue'
	import { storeToRefs } from 'pinia'
	import { getActivityList } from '@/api/activity.js'
	import NoContent from '@/components/NoContent/index.vue'
	const { data: user } = storeToRefs(useUserStore())
	const props = defineProps({
		data: {
			type: Object,
			default: () => [],
		},
	})
	const total = _toInteger(props.data.total)
	const page = ref(1)
	const size = ref(10)
	const items = ref(props.data.list)
	const isLoading = ref(false)
	const finished = ref(items.value.length >= total)

	const onLoad = async () => {
		isLoading.value = true
		page.value++
		const res = await getActivityList({
			page: page.value,
			size: size.value,
			userId: user.value.userId,
		})
		const success = _get(res, 'success', false)
		isLoading.value = false
		if (!success) {
			finished.value = true
			return
		}
		const activityData = _get(res, 'data.list', [])
		items.value.push(...activityData)
		finished.value = items.value.length >= total
	}
</script>
