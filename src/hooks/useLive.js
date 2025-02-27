import { getLotteryType } from '@/modules/util.js'
import { watch, ref } from 'vue'
import { useLotteryStore } from '@/stores/lottery.js'
import { storeToRefs } from 'pinia'

export function useLive() {
	const backgroundImage = ref(getImagePath(getLotteryType()))

	const { lotteryType } = storeToRefs(useLotteryStore())

	watch(
		() => lotteryType.value,
		(value) => {
			backgroundImage.value = getImagePath(value)
		}
	)

	return {
		backgroundImage,
	}
}

function getImagePath(value) {
	if (_includes(['a6', 'hk6'], value))
		return `/public-assets/images/live_bg_${value}.jpg`
	return null
}
