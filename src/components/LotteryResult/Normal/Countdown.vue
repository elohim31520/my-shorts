<template>
	<div
		class="flex-y-center text-14 overflow-hidden color-#434343"
		:style="{ height: `${height}px` }"
	>
		<van-swipe
			:autoplay="5000"
			:show-indicators="false"
			vertical
			:height="height"
			:touchable="false"
		>
			<van-swipe-item>
				<p
					class="w-full"
					:style="`padding: ${gap}px 0`"
					v-html="
						`第<span class='color-#ff7a00'>${getShortIssue(period)}</span>期 ${dateTime}`
					"
				></p>
			</van-swipe-item>
			<van-swipe-item>
				<p class="w-full" :style="{ padding: `${gap}px 0` }">
					距下期开奖到计时 ：
					<span v-if="countdownTime" class="font-bold -ml-8 color-#ff7a00">
						{{ countdownTime }}
					</span>
					<span v-else class="color-#AEAEB1 font-bold -ml-8">-- : -- : --</span>
				</p>
			</van-swipe-item>
		</van-swipe>
	</div>
</template>
<script setup>
	import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
	import { Countdown } from '@/modules/date'
	import { getShortIssue } from '@/modules/util.js'
	import { formatTimestamp } from '@/modules/date.js'
	import { zhCN } from 'date-fns/locale'
	import { useMediaQuery } from '@vueuse/core'

	const props = defineProps({
		period: {
			type: [Number, String],
			required: false,
		},
		time: {
			type: Number,
			required: false,
			default: 0,
		},
	})

	let unwatch = null
	const isMobile = useMediaQuery('(max-width: 480px)')
	const gap = ref(8)
	const height = ref(20)
	const countdownTime = ref('')
	const timer = ref(0)
	const dateTime = computed(() =>
		formatTimestamp(props.time, 'yyyy/MM/dd EEEE HH点mm分', { locale: zhCN })
	)

	function setupTimer() {
		const countdown = new Countdown(new Date(props.time), {
			showDay: false,
			showTotalHours: true,
		}) // 建立倒數計時器例項，不顯示天數
		countdownTime.value = countdown.get()
		timer.value = setInterval(() => {
			countdownTime.value = countdown.get() // 更新倒數計時顯示
			if (!countdownTime.value) {
				clearInterval(timer.value) // 如果時間到了，停止計時
			}
		}, 1000)
	}

	function resetTimer() {
		if (timer.value) clearInterval(timer.value)
		countdownTime.value = ''
	}

	watch(
		() => props.time,
		(newTime) => {
			resetTimer()
			setupTimer()
		}
	)

	onMounted(() => {
		setupTimer()
		unwatch = watch(
			() => isMobile.value,
			(value) => {
				if (value) {
					gap.value = 8
					height.value = 20
				} else {
					gap.value = 12
					height.value = 24
				}
			},
			{
				immediate: true,
			}
		)
	})

	onUnmounted(() => {
		if (timer.value) clearInterval(timer.value)
		if (unwatch) unwatch()
	})
</script>

<style scoped></style>
