<template>
	<div
		class="shadow-[0_2px_1rem_0_rgba(0,0,0,0.1)] bg-#fff h-35 flex justify-around px-10 text-center"
	>
		<swiper
			:slides-per-view="
				playTypeCodeList.length > 4 ? 5 : playTypeCodeList.length + 1
			"
			:space-between="5"
			@swiper="initSwiper"
		>
			<swiper-slide
				v-for="(item, index) in tabItems"
				:key="index"
				class="lh-35 flex-center cursor-pointer color-#aeaeb1"
				:class="{ active: item.playTypeCode == typeValue }"
				@click="handleTabClick(item)"
			>
				<span>{{ item.predictionTypeName }}</span>
			</swiper-slide>
		</swiper>

		<span
			class="w-55 shrink-0 flex-center color-primary cursor-pointer"
			@click="playCodeSelectStore.open"
		>
			+更多
		</span>
	</div>
</template>

<script setup>
	import { usePlayCodeSelectStore } from '@/stores/playCodeSelect.js'
	import { ref, watch, onBeforeMount } from 'vue'

	const props = defineProps({
		playTypeCodeList: {
			type: Array,
			default: () => [],
		},
		typeName: {
			type: String,
			required: true,
		},
		typeValue: {
			type: String,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	})

	const emit = defineEmits(['update:typeName', 'update:typeValue'])

	const playCodeSelectStore = usePlayCodeSelectStore()

	const tabItems = ref([{ predictionTypeName: '综合', playTypeCode: 'all' }])

	onBeforeMount(() => {
		const loseWeightList = props.playTypeCodeList.map((item) => {
			return {
				predictionTypeName: item.predictionTypeName,
				playTypeCode: item.playTypeCode,
			}
		})
		tabItems.value = [...tabItems.value, ...loseWeightList]
	})

	let swiperInstance

	function handleTabClick(item) {
		if (!props.loading) {
			emit('update:typeName', item.predictionTypeName)
			emit('update:typeValue', item.playTypeCode)
		}
	}

	const initSwiper = (swiper) => {
		swiperInstance = swiper
	}

	function scrollToSeries(playTypeCode) {
		if (!playTypeCode) return

		const index = _findIndex(
			tabItems.value,
			(item) => item.playTypeCode === playTypeCode
		)

		if (index !== -1 && swiperInstance) {
			swiperInstance.slideTo(index)
		}
	}

	// 只有在從更多選擇playTypeCode才做滾動
	watch(
		() => playCodeSelectStore.playTypeCode,
		(newValue) => {
			scrollToSeries(newValue)
		}
	)
</script>

<style lang="scss" scoped>
	.active span {
		color: #434343;
		font-weight: 600;
	}
</style>
