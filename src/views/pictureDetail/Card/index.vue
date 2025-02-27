<template>
	<div class="w-full bg-white rounded-12 overflow-hidden shadow-primary">
		<div v-if="!detailData.imgPath || is404" class="h-200 flex-center">
			<img src="/public-assets/images/no_picture.png" class="w-150" />
		</div>
		<div v-else class="w-full" :class="{ 'min-h-240 bg-skeleton': !isLoad }">
			<CdnImage
				:path="detailData.imgPath"
				error-icon="/public-assets/images/no_picture.png"
				@error="is404 = true"
				@load="isLoad = true"
				:config="{ width: imageWidth }"
				:show-loading="false"
			/>
		</div>

		<slot></slot>

		<div
			class="py-8 px-16 w-100% mt-3 color-#AEAEB1 flex items-center lh-19.07"
		>
			<SvgIcon
				class="cursor-pointer mr-3.75"
				name="like_fill"
				size="0.9375rem"
			/>
			<span class="color-#aeaeb1 mr-21 text-14">
				{{ digitalConversion(detailData.totalLikeCount) || 0 }}
			</span>

			<SvgIcon
				class="cursor-pointer mr-3.75"
				name="message_fill"
				size="0.9375rem"
			/>
			<span class="color-#aeaeb1 mr-21 text-14">
				{{ digitalConversion(commentCount) || 0 }}
			</span>

			<SvgIcon
				class="cursor-pointer mr-3.75"
				name="star_fill"
				size="0.9375rem"
			/>
			<span class="color-#aeaeb1 mr-21 text-14">
				{{ digitalConversion(detailData.favoriteCount) || 0 }}
			</span>

			<SvgIcon class="cursor-pointer mr-3.75" name="eye" size="0.9375rem" />
			<span class="color-#aeaeb1 mr-21 text-14">
				{{ digitalConversion(detailData.readCount) || 0 }}
			</span>

			<div class="ml-auto font-500 text-14">{{ lottText }}</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onBeforeMount, watch } from 'vue'
	import { storeToRefs } from 'pinia'
	import {
		getCdnUrl,
		digitalConversion,
		rem2Px,
		getCurrentLotteryType,
	} from '@/modules/util'
	import { useLotteryStore } from '@/stores/lottery'
	import { usePictureDetailStore } from '@/stores/pictureDetail'
	import CdnImage from '@/components/CdnImage/index.vue'

	const { lotteryType } = storeToRefs(useLotteryStore())
	const { commentCount } = storeToRefs(usePictureDetailStore())

	const props = defineProps({
		detailData: {
			type: Object,
			default: () => ({}),
		},
	})

	const is404 = ref(false)
	const isLoad = ref(false)
	const imageWidth = ref(0)
	const lottText = ref(getCurrentLotteryType().name)

	onBeforeMount(() => {
		imageWidth.value = Math.ceil(window.innerWidth - rem2Px(1.25))
	})

	watch(
		() => lotteryType.value,
		() => {
			lottText.value = getCurrentLotteryType().name
		}
	)
</script>

<style scoped></style>
