<template>
	<div class="predict-detail">
		<div class="px-10">
			<NormalHeader title="查看资料" />
			<UserProfile
				class="mt-55"
				:userId="detail.userId"
				:showHistory="false"
				:showDonate="true"
				:showLocate="true"
				:truncateName="true"
				:showViewSelf="false"
				v-if="detail.userId"
			/>

			<PredictInfo />
			<ResultInfo />

			<img
				src="/public-assets/images/platform/platform_02.jpg"
				class="mt-10 rounded-10"
			/>

			<div class="text-18 color-#434343 font-600 mt-20">网址大全</div>
		</div>
		<LotteryTypes sync :edge="10" />
		<WebsiteList :data="webListFilter" class="px-10" />
		<van-popup
			v-model:show="showPopup"
			:close-on-click-overlay="false"
			overlay-class="overlay"
			:overlay-style="{ 'backdrop-filter': 'blur(7px)' }"
		>
			<PayPredictTip
				:predictId="predictId"
				:point="point"
				@afterPay="afterPay"
				@onCancel="back"
			/>
		</van-popup>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import UserProfile from '@/components/UserProfile/index.vue'
	import PredictInfo from './PredictInfo/index.vue'
	import ResultInfo from './ResultInfo/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import WebsiteList from '@/components/WebsiteList/index.vue'
	import PayPredictTip from '@/components/PayPredictTip/index.vue'

	import { storeToRefs } from 'pinia'
	import { provide, computed, onBeforeMount, ref } from 'vue'
	import { getWebsiteList } from '@/api/website'
	import { useLotteryStore } from '@/stores/lottery.js'
	import { getLotteryTypeList, back } from '@/modules/util.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)

	const { predictId } = props.data
	const errCode = _get(props.data, 'detail.errCode')
	const errMessage = _get(props.data, 'detail.errMessage')
	const isDenied = ref(_includes(['E500058', 'E500057'], errCode))
	const detail = _get(props.data, 'detail.data', {})
	const { lotteryType } = storeToRefs(useLotteryStore())
	const lotteryTypes = getLotteryTypeList()
	const webList = ref([])
	const showPopup = ref(isDenied.value)
	const point = getPoint(errMessage)

	const webListFilter = computed(() => {
		const target = _find(lotteryTypes, (vo) => vo.key == lotteryType.value)
		if (!target) return []
		return _filter(webList.value, (vo) =>
			_includes(vo.focusGameType, String(target.code))
		).slice(0, 12)
	})

	onBeforeMount(() => {
		gteWebs()
	})

	async function gteWebs() {
		const res = await getWebsiteList()
		webList.value = _get(res, 'data')
	}

	function afterPay() {
		window.location.reload()
	}

	/*從errMessage解析出積分
	E500057: 此心水花费10积分,请先登录
	E500058: 请先购买心水,消耗1积分
	*/
	function getPoint(str) {
		return _get(/(\d.*)积分/.exec(str), '[1]', 0)
	}
</script>

<style lang="scss" scoped>
	.predict-detail {
		:deep(.van-popup--center) {
			max-width: 440px;
			width: 90%;
			border-radius: 0.625rem;
		}
		.overlay {
			z-index: 100; //為了蓋過header
		}
	}
</style>
