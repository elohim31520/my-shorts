<template>
	<div class="p-10 bg-#fafafa">
		<div
			v-for="vo in recommendList"
			:key="vo.postId"
			class="w-full h-auto text-18 font-400 lh-19.07 p-10 mb-10 bg-#fff rounded-10 shadow-primary"
		>
			<div class="mb-10 color-#AEAEB1">
				<span>
					{{ vo.postYear }}
					<label class="color-primary">第{{ vo.shortIssue }}期</label>
				</span>
			</div>
			<div class="lh-24.515" v-html="safeHtml(vo.postContent)"></div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, computed } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useLotteryStore } from '@/stores/lottery'
	import { getForumIdListKV } from '@/api/bbs'
	import { getRecommendZodiacKV } from '@/api/recommend'
	import safeHtml from '@/modules/safeHtml.js'

	const { lotteryType } = storeToRefs(useLotteryStore())

	const list = ref([])

	const recommendList = computed(() => {
		return list.value.filter((vo) => vo.gameTypeName == lotteryType.value)
	})

	onMounted(() => {
		getForumIdListKV().then((res) => {
			const forumId = _get(res, 'data[0].forumList[0].forumId')
			if (forumId) {
				getRecommendZodiacKV(forumId).then((res) => {
					list.value = _get(res, 'data', [])
				})
			}
		})
	})
</script>
