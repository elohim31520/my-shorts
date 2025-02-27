<template>
	<div class="relative h-full w-full">
		<MaterialHeader :active="0" />
		<div class="mt-45">
			<div class="relative z-5">
				<LotteryTypes sync />
				<div ref="target">
					<van-image
						src="/public-assets/images/take-out-material/creation_visual.png"
						class="w-full"
					/>
				</div>
				<div
					id="gap"
					v-show="showGap"
					class="bg-idea fixed top-45 z-2 w-full max-w-480px h-30 text-align-center flex items-center justify-center"
				>
					<SvgIcon name="icon_creation" color="#6ADFFE" size="1.625rem" />
				</div>
			</div>

			<PictureSeriesTab
				class="sticky top-74 z-10"
				@update:seriesActive="handleWaterfallUpdate"
			/>

			<div class="pb-80">
				<div class="p-5 bg-#fafafa" v-if="showOnce" ref="guideRef">
					<div
						class="material-description flex flex-col items-center justify-center bg-white py-20 px-32 color-#434343"
					>
						<div class="title font-size-20 font-600 text-align-center">
							创作一条想法
						</div>
						<div class="sub-title font-14 mt-10">随时随地 / 真实新鲜</div>
						<div class="flex justify-between my-10 gap-16">
							<div class="img-cover">
								<van-image
									class="h-100%"
									src="/public-assets/images/take-out-material/post_example3.png"
								/>
							</div>
							<div class="img-cover">
								<van-image
									class="h-100%"
									src="/public-assets/images/take-out-material/post_example1.png"
								/>
							</div>
							<div class="img-cover">
								<van-image
									class="h-100%"
									src="/public-assets/images/take-out-material/post_example2.png"
								/>
							</div>
						</div>

						<!-- prettier-ignore -->
						<div class="description mt-10">
							{{ webName }}是认真、专业、友善的社区，请广大资深彩民发表想法，带来新的思考和新的视野！{{ webName }}有你更精采。
						</div>
					</div>
				</div>

				<WaterfallKv v-show="isUseKv" />
				<Waterfall
					ref="waterfallRef"
					v-show="!isUseKv"
					:apiFunction="getPictureList"
					:apiParams="apiParams"
					:top="topY"
					:minHeight="minHeight"
				/>
			</div>

			<div
				v-redirect="`/sendIdea?page=material`"
				class="w-40 h-40 bg-#34c759 rounded-full flex-center flex-col font-600 fixed right-10 bottom-108.5 btn-sendIdea"
			>
				<SvgIcon class="cursor-pointer mb-1" name="plus" size="0.71875em" />
				<div class="font-size-10 color-#fff">发想法</div>
			</div>
		</div>
		<DynamicFixedElement
			:position="{ bottom: 0 }"
			:moveRange="49"
			:directions="['up']"
			class="z-10"
		>
			<LotteryTypes sync />
		</DynamicFixedElement>
		<Footer :active="2" :showIcon="false" />
		<DrawScreening
			is-material
			@updateData="updateWaterFallParams"
			:showIssue="false"
		/>
	</div>
</template>

<script setup>
	import { provide, ref, watch, onMounted, watchEffect } from 'vue'
	import { storeToRefs } from 'pinia'

	import MaterialHeader from '@/components/MaterialHeader/index.vue'
	import PictureSeriesTab from '@/components/PictureSeriesTab/index.vue'
	import Footer from '@/components/Footer/index.vue'
	import WaterfallKv from '@/components/WaterfallKv/index.vue'
	import Waterfall from 'src/components/Waterfall/index.vue'
	import DrawScreening from '@/components/DrawScreening/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'

	import { useWaterfall } from '@/components/WaterfallKv/useWaterfall'
	import { useLotteryStore } from '@/stores/lottery'
	import { useMaterialStore } from '@/stores/material'
	import { getPictureList } from '@/api/picture'
	import { getLastLotteryResultApi } from '@/api/lottery'
	import { useGallery } from '@/hooks/useGallery'
	import {
		useElementVisibility,
		useWindowSize,
		useIntersectionObserver,
	} from '@vueuse/core'
	import { getWebTitle, rem2Px } from '@/modules/util.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)

	const { lotteryResultInfo } = useMaterialStore()
	lotteryResultInfo.value = Object.assign(
		{ lotteryType: props.data.lotteryType },
		props.data.lotteryResult.data
	)

	const webName = getWebTitle()
	const showOnce = ref(false)
	const target = ref(null)
	const targetIsVisible = useElementVisibility(target)
	const topY = ref(0)
	const minHeight = ref(0)

	const { lotteryType } = storeToRefs(useLotteryStore())
	const { kvList } = useWaterfall()
	const { formatGalleryData } = useGallery()

	const selectedFilters = ref({})
	const apiParams = ref({})
	const isUseKv = ref(true)
	const waterfallRef = ref(null)
	const showGap = ref(false)
	const guideRef = ref(null)

	// 圖紙瀑布kv 傳進store管理
	const list = _get(props.data, 'galleryResult.data.issueList', [])
	const apiPath = _get(props.data, 'galleryResult.apiPath', '')
	const galleries = list.map((vo) => formatGalleryData(vo, apiPath))
	kvList.splice(0, kvList.length)
	kvList.push(...galleries)

	const updateWaterFallParams = async (params) => {
		selectedFilters.value = params
		apiParams.value = params
		isUseKv.value = false
	}

	const handleWaterfallUpdate = (seriesCode) => {
		selectedFilters.value = {}
		apiParams.value = {}
		if (!seriesCode) {
			isUseKv.value = true
			return
		}
		apiParams.value.seriesCode = seriesCode
		isUseKv.value = false
	}

	const calMinHeight = () => {
		const { height } = useWindowSize()
		const sum = rem2Px(
			`${2.8125 /*頭*/ + 1.875 /*gap*/ + 2.1875 /*系列*/ + 1.875 /*彩種*/ + 3.125 /*footer*/}rem`
		)
		minHeight.value = height.value - sum
	}

	const gapHandler = () => {
		const top = rem2Px('4.6875rem')
		useIntersectionObserver(
			target,
			([entry], observerElement) => {
				const isVisible = entry?.isIntersecting || false
				showGap.value = !isVisible
			},
			{
				rootMargin: `-${top}px 0px 0px 0px`,
			}
		)
	}

	watch(lotteryType, async (val) => {
		const res = await getLastLotteryResultApi({ lotteryType: val })
		if (res.success) {
			lotteryResultInfo.value = Object.assign({ lotteryType: val }, res.data)
		}
		selectedFilters.value = {}
		apiParams.value = {}
		// 彩種變化，改用kv waterfall
		if (!isUseKv.value) isUseKv.value = true
	})

	watch(
		targetIsVisible,
		(value) => {
			const guideHeight = _get(
				guideRef.value?.getBoundingClientRect(),
				'height',
				0
			)
			const { top, height } = target.value.getBoundingClientRect()
			const headerHeight =
				document.getElementById('material-header').offsetHeight
			const gapHeight = rem2Px('1.875rem')
			topY.value = Math.ceil(
				top + height - headerHeight - gapHeight + guideHeight
			)
		},
		{ once: true }
	)

	onMounted(() => {
		if (!window.sessionStorage.getItem('showOnce')) {
			showOnce.value = true
			window.sessionStorage.setItem('showOnce', true)
		}
		watchEffect(calMinHeight)
		gapHandler()
	})
</script>

<style lang="scss" scoped>
	.bg-idea {
		background: linear-gradient(
			180deg,
			rgba(216, 255, 255, 1) 0%,
			rgba(159, 231, 240, 1) 100%
		);
	}

	.material-description {
		border-radius: 0.625rem;
		box-shadow: 0px 0.0625rem 0.375rem 0px rgba(0, 0, 0, 0.2);

		.title {
			line-height: 1.362;
			letter-spacing: 0.025rem;
		}

		.sub-title {
			letter-spacing: 0.02rem;
		}

		.img-cover {
			// width: 29.9%;
			height: 9.375rem;
			img {
				width: auto;
				height: 100%;
			}
		}

		.description {
			line-height: 1.375;
			letter-spacing: 0.02rem;
		}
	}

	.btn-sendIdea {
		box-shadow: 0 0.125rem 0.1875rem 0 rgba(0, 0, 0, 0.4);
	}

	.bg-picture-tab {
		background-image: linear-gradient(to bottom, #94e8f4, #fff);
	}

	@media (min-width: 480px) {
		.btn-sendIdea {
			right: calc(50% - 240px + 15px);
		}
	}
</style>
