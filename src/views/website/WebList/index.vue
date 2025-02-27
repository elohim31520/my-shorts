<template>
	<van-list
		v-model:loading="isLoading"
		:finished="isFinished"
		@load="onLoad"
		:immediate-check="false"
		:disabled="disabled"
		finished-text="没有更多了"
	>
		<WebsiteList :data="items" class="px-10" />
	</van-list>
</template>

<script setup>
	import { inject, ref, watch, computed, useTemplateRef } from 'vue'
	import { useLotteryStore } from '@/stores/lottery'
	import { storeToRefs } from 'pinia'
	import WebsiteList from '@/components/WebsiteList/index.vue'
	import { getLotteryTypeList } from '@/modules/util.js'

	const { lotteryType } = storeToRefs(useLotteryStore())
	const websiteList = _get(inject('data'), 'websiteList.data', [])
	const lotteryTypes = getLotteryTypeList()
	const fetchSize = 24
	const isLoading = ref(false)
	const isFinished = ref(false)
	const size = ref(fetchSize)
	const disabled = ref(false)

	const items = computed(() => {
		const target = _find(lotteryTypes, (vo) => vo.key == lotteryType.value)
		if (!target) {
			console.error(
				`彩種${lotteryType.value}尚未匹配, ${JSON.stringify(lotteryTypes)}`
			)
			return []
		}
		const result = _filter(websiteList, (vo) =>
			_includes(vo.focusGameType, String(target.code))
		)
		isFinished.value = size.value >= result.length
		disabled.value = true //避免列表重新渲染，觸發van-list onLoad事件
		setTimeout(() => (disabled.value = false), 0)
		return result.slice(0, size.value)
	})

	watch(lotteryType, () => {
		size.value = fetchSize
	})

	function onLoad() {
		size.value += fetchSize
		setTimeout(() => {
			isLoading.value = false
		}, 600)
	}
</script>
