<template>
	<div class="expert bg-#fafafa">
		<MaterialHeader :active="1" />
		<LotteryTypes class="mt-45" sync />
		<div class="mx-5">
			<Marquee />
			<div v-if="!isExpert" class="flex mt-5">
				<div
					v-for="(item, index) in expertArea"
					:key="index"
					class="btn-shadow mr-10 last:mr-0"
				>
					<a :href="item.linkPath">
						<img :src="item.imgPath" />
					</a>
				</div>
			</div>
			<div class="flex mb-10 mt-10">
				<div
					v-for="(item, index) in subExpertArea"
					:key="index"
					class="btn-shadow mr-10 last:mr-0 relative"
				>
					<a :href="item.linkPath" class="block">
						<b class="shin-num">
							<span>心水数量</span>
							<span class="color-#ff8f28 ml-2">{{ item.total }}</span>
						</b>
						<img :src="item.imgPath" />
					</a>
				</div>
			</div>
			<div v-if="isExpert" class="flex mb-10">
				<div
					v-for="(item, index) in subExpertTalentArea"
					:key="index"
					class="btn-shadow mr-10 last:mr-0 relative"
				>
					<a :href="item.linkPath" class="block">
						<img :src="item.imgPath" />
					</a>
				</div>
			</div>
		</div>
		<div class="flex justify-between mb-10 mx-10 mt-20">
			<b class="color-#434343 text-18">连胜榜</b>
			<a href="/winner/continuous">
				<span class="color-#434343 text-14">更多</span>
				<SvgIcon name="read_more_arrow" size="1.25rem" class="inline-block" />
			</a>
		</div>
		<Winner class="mb-20" />
		<div class="flex justify-between mb-10 mx-10">
			<b class="color-#434343 text-18">精选心水</b>
			<a href="/predict">
				<span class="color-#434343 text-14">更多</span>
				<SvgIcon name="read_more_arrow" size="1.25rem" class="inline-block" />
			</a>
		</div>
		<NoContent v-if="handledList.length == 0" class="mb-100" text="暂无数据" />
		<van-list
			class="mb-90"
			v-if="handledList.length > 0"
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
			:immediate-check="false"
		>
			<div class="mx-10">
				<Prediction
					v-for="(vo, index) in handledList"
					:key="index"
					:data="vo"
					:showAvatar="true"
					:showFooter="true"
					class="mb-10"
				/>
			</div>
		</van-list>
		<DynamicFixedElement
			:position="{ bottom: 0 }"
			:moveRange="49"
			:directions="['up']"
			class="z-10"
		>
			<LotteryTypes sync />
		</DynamicFixedElement>

		<van-popup
			v-model:show="showQualify"
			:style="{ padding: '1.5rem', overflow: 'hidden' }"
			class="dialog"
			closeable
		>
			<van-image
				class="image"
				fit="contain"
				src="/public-assets/images/expert/icon_Popup_Congratulations.svg"
			/>
			<div class="title mt-15">恭喜你成为专家</div>
			<div class="color-#656565 mt-5 p-10">
				成为专家后，可以发布心水灵感，赚取卖料收益和用户打赏收益，请点击右下方+号发布。
			</div>
			<div class="flex justify-center mt-8">
				<van-button
					type="success"
					color="#34c759"
					class="btn btn-invite"
					@click="goSendPredict"
					v-redirect.auth="'/predict/publish'"
				>
					去发布
				</van-button>
			</div>
		</van-popup>

		<van-popup v-model:show="showExpert" class="dialog popup-expert">
			<div class="w-full p-20">
				<p class="text-center text-18 font-600 color-#434343">提示</p>
				<p class="text-center text-18 font-400 color-#656565 mt-20 mb-40">
					成为专家后再来发布心水吧！
				</p>
				<div class="flex justify-around">
					<van-button
						type="default"
						class="btn btn-cancel"
						color="#F2F2F2"
						@click="showExpert = false"
					>
						返回
					</van-button>
					<van-button
						type="success"
						color="#34c759"
						class="btn"
						@click="redirect('/expert/apply')"
					>
						成为专家
					</van-button>
				</div>
			</div>
		</van-popup>

		<div
			@click="goSendPredict"
			class="w-40 h-40 bg-#34c759 rounded-full flex items-center justify-center font-600 fixed right-10 bottom-108.5 btn-predict"
			:class="{ qualify: showQualify }"
		>
			<div class="flex flex-col justify-center items-center">
				<SvgIcon class="cursor-pointer mb-1" name="plus" size="0.71875em" />
				<div class="text-10 color-#fff">发心水</div>
			</div>
		</div>

		<Footer :active="2" :showIcon="false" />
	</div>
</template>

<script setup>
	import { ref, provide, computed, watch, onMounted } from 'vue'
	import { storeToRefs } from 'pinia'
	import MaterialHeader from '@/components/MaterialHeader/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import Footer from '@/components/Footer/index.vue'
	import Marquee from '@/components/Marquee/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import Prediction from '@/components/Prediction/index.vue'
	import Winner from '@/components/Winner/index.vue'
	import { useLotteryStore } from '@/stores/lottery'
	import { redirect, getCurrentLotteryType } from '@/modules/util.js'
	import { getPlatformSwitchInfo, getPredictRecommend } from '@/api/predict.js'
	import { useUserStore } from '@/stores/user.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)

	const { lotteryType } = storeToRefs(useLotteryStore())
	const { isExpert } = storeToRefs(useUserStore())

	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const pageSize = 10

	const expertArea = [
		{
			imgPath: '/public-assets/images/expert/btn_expert_l.png',
			linkPath: '/expert/apply',
		},
		{
			imgPath: '/public-assets/images/expert/btn_expert_r.png',
			linkPath: '/election',
		},
	]
	const subExpertArea = ref([
		{
			imgPath: '/public-assets/images/expert/btn_king.png',
			linkPath: '/winner/top',
			total: null,
		},
		{
			imgPath: '/public-assets/images/expert/btn_champ.png',
			linkPath: '/winner/history',
			total: null,
		},
		{
			imgPath: '/public-assets/images/expert/btn_statistic.png',
			linkPath: '/expert/statistic',
			total: null,
		},
	])
	const subExpertTalentArea = ref([
		{
			imgPath: '/public-assets/images/expert/btn_my_sell.png',
			linkPath: '/my/sell',
		},
		{
			imgPath: '/public-assets/images/expert/btn_my_buy.png',
			linkPath: '/my/buy',
		},
		{
			imgPath: '/public-assets/images/expert/btn_my_expert.png',
			linkPath: '/expert/user',
		},
	])

	const predictList = ref(_get(props.data, 'predictRecommend.data.list', []))
	const handledList = computed(() => {
		return predictList.value.flatMap((item) => {
			const { senseList, ...rest } = item
			return senseList.map((innerItem) => ({
				...innerItem,
				gameSubName: innerItem.gameName,
				gameSubCode: innerItem.gameCode,
				...rest,
			}))
		})
	})
	const showQualify = ref(false)
	const showExpert = ref(false)
	const gameType = ref('')
	const platformSwitchInfo = ref({})

	const onLoad = async () => {
		loading.value = true
		page.value += 1
		await getPredictList()
		loading.value = false
	}

	function goSendPredict() {
		if (isExpert.value) {
			redirect('/predict/publish')
		} else {
			showExpert.value = true
		}
	}

	function dialogQualifyVisible() {
		const url = new URL(window.location.href)
		const qualify = url.searchParams.get('qualify')

		if (qualify) {
			showQualify.value = true
			url.searchParams.delete('qualify')
			window.history.replaceState(null, '', url.toString())
		}
	}

	async function getPlatformSwitchInfoData() {
		const res = await getPlatformSwitchInfo(gameType.value)
		platformSwitchInfo.value = _get(res, 'data', {})
		const { sixKingCount, pastChampionsCount, expertStatisticsCount } =
			platformSwitchInfo.value
		const totalMap = [sixKingCount, pastChampionsCount, expertStatisticsCount]
		totalMap.forEach((item, index) => {
			subExpertArea.value[index].total = item
		})
	}

	async function getPredictList() {
		const { code: gameType } = getCurrentLotteryType()
		const res = await getPredictRecommend({
			page: page.value,
			size: pageSize,
			gameType,
		})
		const list = _get(res, 'data.list', [])
		const total = _get(res, 'data.total', 0)
		predictList.value.push(...list)
		finished.value = predictList.value.length >= total || list.length == 0
	}

	onMounted(() => {
		dialogQualifyVisible()
	})
	watch(
		() => lotteryType.value,
		async (value) => {
			const lotteryInfo = getCurrentLotteryType()
			gameType.value = _get(lotteryInfo, 'code', '')
			await getPlatformSwitchInfoData()
		},
		{ immediate: true }
	)
	watch(
		() => lotteryType.value,
		async (value) => {
			page.value = 1
			predictList.value = []
			await getPredictList()
		}
	)
</script>

<style lang="scss" scoped>
	.btn-shadow {
		box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.1);
		border-radius: 0.75rem;
	}
	.shin-num {
		font-weight: 400;
		font-size: 0.625rem;
		position: absolute;
		left: 2.375rem;
		bottom: 0.25rem;
		color: #656565;
	}
	.dialog {
		width: 20.625rem;
		height: 20.25rem;
		background-color: #fff;
		border-radius: 0.625rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		.image {
			width: 6.25rem;
			height: 6.25rem;
		}
		.btn {
			--van-button-radius: 0.25rem;
			height: 100%;
			font-size: 1rem;
			height: 100%;
			white-space: nowrap;
		}
		.btn-invite {
			width: 18.75rem;
			height: 2.5rem;
			font-size: 1.125rem;
			border-radius: 0.5rem;
		}
	}
	.popup-expert {
		height: auto;
		.btn {
			width: 6.5rem;
			padding: 0.625rem 0;
			border-radius: 0.5rem;
			border: none;
			font-weight: 600;
		}
		.van-button--default {
			color: #434343 !important;
		}
	}

	.btn-predict {
		box-shadow: 0 0.125rem 0.1875rem 0 rgba(0, 0, 0, 0.4);
	}

	@media (min-width: 480px) {
		.btn-predict {
			right: calc(50% - 240px + 15px);
		}
	}
	.qualify {
		z-index: 2002;
	}
	:deep(.van-popup__close-icon) {
		color: #434343;
	}
</style>
