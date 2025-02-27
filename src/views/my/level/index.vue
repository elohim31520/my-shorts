<template>
	<div class="max-w-480px h-100vh pt-95" :style="{ background: bgColor }">
		<NormalHeader title="会员等级" />
		<Steps :vipLevel="vipLevel" :maxLevel="vipDetails.maxVip" />
		<div class="mx-15 mt-45 relative" v-if="vipLevel > 0">
			<van-image :src="vipImage" />
			<div class="absolute bottom-17 left-25 w-85%">
				<span class="text-10" :style="{ color: textColor }">
					升级进度: {{ vipDetails.userCurrentScore }}/{{
						vipDetails.theScoreOfNextVipLevel
					}}
				</span>
				<van-progress
					:percentage="upgradePercent"
					:show-pivot="false"
					:color="textColor"
					:track-color="progressColor"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import Steps from './Steps/index.vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const vipDetails = ref(props.data)
	//計算進度條％數
	const upgradePercent = computed(() => {
		const levelUpScore = _get(vipDetails.value, 'theScoreOfNextVipLevel', 0) //升級所需積分
		const currentScore = _get(vipDetails.value, 'userCurrentScore', 0) //目前積分
		const percent = (currentScore / levelUpScore).toFixed(2) * 100
		return percent > 100 ? 100 : percent
	})
	const vipLevel = computed(() => _get(vipDetails.value, 'userCurrentVip', 0))

	// 背景色對應vip等級
	const colorMap = [
		'#ffd7d7',
		'#ffe4d7',
		'#dbdbdb',
		'#ddf5ff',
		'#ecddff',
		'#fff4dd',
		'#ffe9b8',
		'#FFE9B8',
		'#F1B7FF',
	]
	const bgColor = computed(() =>
		vipLevel.value > 0
			? `linear-gradient(180deg, #ffffff 7.04%, ${colorMap[vipLevel.value - 1]} 100%)`
			: ''
	)

	//文字顏色對應vip等級
	const textColorMap = [
		'#B87663',
		'#B57B51',
		'#95989C',
		'#3D8ADC',
		'#9645CF',
		'#C17D35',
		'#F5E1B4',
		'#F5E1B4',
		'#F5E1B4',
	]
	const textColor = computed(() =>
		vipLevel.value > 0 ? textColorMap[vipLevel.value - 1] : ''
	)

	//進度條背景顏色對應vip等級
	const progressColorMap = [
		'#C66A6080',
		'#C6816080',
		'#CBCBCB80',
		'#96D2FF80',
		'#CB8FE580',
		'#D4A94D80',
		'#5B5B5B',
		'#5B5B5B',
		'#4237A0',
	]
	const progressColor = computed(() =>
		vipLevel.value > 0 ? progressColorMap[vipLevel.value - 1] : ''
	)

	// 動態生成圖片路徑
	const vipImage = computed(
		() => `/public-assets/images/my_page/icon_vip_${vipLevel.value}.png`
	)
</script>
