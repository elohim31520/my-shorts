<template>
	<div
		class="mx-5 relative bg-gradient-to-r from-#fff8e5 to-#fcfffa rounded-10 shadow-primary"
	>
		<div class="color-#434343 mx-auto overflow-hidden relative">
			<div
				class="h-36.5 flex-y-center justify-evenly bb-1-#EDE9DE80 text-14"
				:class="{ 'pl-20': showOfficialSign }"
			>
				<p
					class="text-14"
					v-html="
						`第<span class='color-#ff7a00'>${getShortIssue(lotteryResult.issue, lotteryType)}</span>期`
					"
				></p>
				<div class="bl-1-#e0e0e0 h-8"></div>
				<p class="text-14 color-#cab363">{{ participantCount }}人参与</p>
				<div class="bl-1-#e0e0e0 h-8"></div>
				<a
					class="color-#FF8F28 bd-#FF8F28 rounded-15 w-68 h-24.5 text-12 text-center font-600 bg-#FFEED0 lh-24.5"
					href="/lotteryHistory/record"
				>
					历史记录
				</a>
			</div>
			<div class="text-12 relative py-5">
				<!-- 彩球列表 -->
				<BallList
					class="px-5"
					:openCode="lotteryResult.processedOpenCode"
					:isAllNumbersInvalid="lotteryResult.isAllNumbersInvalid"
					:invalidTexts="lotteryResult.invalidTexts"
				/>
				<!-- 倒計時 -->
				<Countdown
					class="w-full px-10 absolute bottom-10"
					:period="lotteryResult.nextIssue"
					:time="lotteryResult.nextTime"
				/>
			</div>
		</div>
		<SvgIcon
			v-show="showOfficialSign"
			name="official"
			size="2.2rem"
			class="absolute -top-2"
		/>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import Countdown from './Countdown.vue'
	import BallList from './BallList.vue'
	import { useLotteryStore } from '@/stores/lottery'
	import { storeToRefs } from 'pinia'
	import { getShortIssue } from '@/modules/util.js'

	const props = defineProps({
		lotteryResult: {
			type: Object,
			default: () => ({}),
		},
		participantCount: {
			type: [String, Number],
			default: 0,
		},
	})
	const { lotteryType } = storeToRefs(useLotteryStore())
	// 僅澳六顯示官方標記
	const showOfficialSign = computed(() => lotteryType.value === 'a6')
</script>

<style scoped></style>
