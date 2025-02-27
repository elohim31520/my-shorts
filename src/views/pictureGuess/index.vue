<template>
	<div class="vote-home bg-#fafafa pt-45 min-h-100dvh">
		<NormalHeader>
			<template #center>
				<div
					class="absolute top-0 left-50% -translate-x-50% lh-45 truncate w-280 font-600 text-20 text-center"
				>
					{{ headerTitle }}
				</div>
			</template>
		</NormalHeader>

		<PictureExplanationTab class="mb-5" :params="params" :pathname="pathname" />

		<!-- 列表 -->
		<van-list
			v-model:loading="isLoading"
			:finished="isFinished"
			:finished-text="list.length ? '没有更多了' : ''"
			@load="onLoad"
		>
			<div class="w-full p-10 pt-0">
				<a
					v-for="(vo, index) in list"
					:key="index"
					class="flex flex-col mb-5 bg-#fff"
					:href="
						toRoute('pictureGuess/detail', {
							predict: vo.predict,
							period: vo.issue,
							seriesName: vo.seriesName,
							seriesCode: vo.seriesCode,
							issueId: params.issueId,
							year: vo.year,
							predictionTypeName: vo.predictionTypeName,
							predictTitle: vo.predictTitle,
							playTypeSubName: vo.playTypeSubName,
							userId: vo.userId,
							predictId: vo.predictId,
						})
					"
				>
					<div class="rounded-10 p-10 shadow-primary">
						<div
							class="color-#434343 font-600 text-18 lh-24.515 tracking-2% mb-7.5"
						>
							{{ vo.predictTitle }}
						</div>

						<div class="flex items-center mb-10 relative">
							<!-- 玩家頭像 -->
							<CdnImage
								round
								width="2.1875rem"
								height="2.1875rem"
								:path="vo.avatar"
								fit="cover"
								position="center"
								error-icon="/public-assets/images/default_collect.png"
								class="mr-5 flex-shrink-0"
							/>
							<!-- 暱稱 -->
							<div class="flex flex-col">
								<div class="font-700 text-18 color-[#656565] lh-24.515">
									{{ vo.nickname }}
								</div>
								<!-- 時間 -->
								<div class="text-12 color-#aeaeb1 lh-16.345">
									<span class="mr-10">
										{{ formatTimestamp(vo.createTime, 'yyyy-MM-dd HH:mm') }}
									</span>
								</div>
							</div>

							<!-- 中獎的icon -->
							<div class="absolute right-0 top-0 translate-y--25%">
								<svgIcon name="icon_winning" size="5rem" v-if="vo.isHit" />
								<svgIcon name="icon_missed" size="5rem" v-else />
							</div>
						</div>
						<!-- 圖解內容 -->
						<div class="tracking-2% lh-24 color-#434343 text-16">
							{{ handleContent(vo) }}
						</div>
					</div>
				</a>
			</div>
		</van-list>
		<NoContent v-if="!list.length" text="没有更多讯息了～" />

		<a
			class="z-19 fixed right-10 bottom-90 pc:right-[calc(50%-240px+10px)]"
			:href="toRoute('pictureGuess/create', params)"
		>
			<div
				class="flex-y-center flex-col w-40 h-40 rounded-full bg-primary shadow-[0px_4px_6px_0px_#00000066]"
			>
				<SvgIcon
					name="Button_VoiceChatRoom-join-in"
					class="color-#fff mt-2"
					size="1.2rem"
				/>
				<div class="font-600 text-10 lh-13.62 color-white">竟猜</div>
			</div>
		</a>
	</div>
</template>

<script setup>
	import { ref, reactive } from 'vue'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import PictureExplanationTab from '@/components/PictureExplanationTab/index.vue'
	import { formatTimestamp } from '@/modules/date'
	import { useNavigation } from '@/hooks/useNavigation.js'
	import { getPictureGuessList } from '@/api/picture'

	const { toRoute } = useNavigation()

	const props = defineProps({
		params: { type: Object },
		pathname: { type: String },
		data: { type: Object },
	})

	const list = reactive([])
	const isFinished = ref(false)
	const page = ref(1)
	const size = ref(10)
	const isLoading = ref(false)

	const title = _get(props.params, 'title', '')
	const period = _get(props.params, 'period', '')
	const headerTitle = (() => {
		return title ? `${title}第${period}期` : '无标题'
	})()

	const onLoad = async () => {
		isLoading.value = true
		const bizId = _get(props, 'params.issueId')
		if (!bizId) {
			console.warn('缺少期刊Id參數 (bizId)！')
			isLoading.value = false
			isFinished.value = true
			return
		}

		const res = await getPictureGuessList({
			page: page.value,
			size: size.value,
			bizId,
		})
		const data = _get(res, 'data.list', [])
		list.push(...data)
		if (data.length < size.value) {
			isFinished.value = true
		}
		page.value += 1
		isLoading.value = false
	}

	const handleContent = (vo) => {
		const { predict, predictionTypeName, playTypeSubName } = vo

		if (Array.isArray(predict)) {
			return `${predictionTypeName}-${playTypeSubName}: ${predict.join(', ')}`
		}

		return predict || ''
	}
</script>

<style lang="scss" scoped></style>
