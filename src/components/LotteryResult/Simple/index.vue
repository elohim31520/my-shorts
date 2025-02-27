<template>
	<div class="mx-10 bg-white rounded-10 bd-#EDE9DE color-#656565 p-10 pt-5">
		<DrawInfo v-if="pending" />
		<div v-else class="color-#ff7a00 flex-center text-12 mb-4">
			<p>
				{{ lotteryResult.year }}年 第{{
					getShortIssue(lotteryResult.issue, lotteryResult.lotteryType)
				}}期
			</p>
		</div>

		<!-- 彩球列表 -->
		<BallList
			class="text-12"
			:openCode="lotteryResult.processedOpenCode"
			:isAllNumbersInvalid="lotteryResult.isAllNumbersInvalid"
			:invalidTexts="lotteryResult.invalidTexts"
		/>
	</div>
</template>

<script setup>
	import BallList from './BallList.vue'
	import DrawInfo from '@/components/DrawInfo/index.vue'
	import { getShortIssue } from '@/modules/util.js'
	import { computed } from 'vue'

	const props = defineProps({
		lotteryResult: {
			type: Object,
			default: () => ({}),
		},
	})
	const pending = computed(() => props.lotteryResult.isAllNumbersInvalid) //true:尚未開獎
</script>

<style lang="scss" scoped></style>
