<template>
	<div class="vote-home bg-#fafafa pt-45 min-h-100dvh relative">
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
		<NoContent v-if="isEmptyData" text="没有更多讯息了～" />
		<van-list
			v-else
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
					:href="toExplanationRoute(vo, index)"
				>
					<div class="rounded-10 p-10 shadow-primary">
						<div
							class="color-#434343 font-600 text-18 lh-24.515 tracking-2% mb-7.5 truncate"
						>
							{{ postTitle }}图解
						</div>

						<div class="flex items-center mb-10">
							<!-- 玩家頭像 -->
							<div class="min-w-35 mr-5">
								<CdnImage
									round
									width="2.1875rem"
									height="2.1875rem"
									:path="vo.avatar"
									fit="cover"
									position="center"
									error-icon="/public-assets/images/svg/default_avatar_man.png"
									v-user="vo.postUserId"
								/>
							</div>

							<!-- 暱稱 -->
							<div class="flex flex-col">
								<div class="font-700 text-18 color-[#656565] lh-24.515">
									{{ vo.nickname }}
								</div>
								<!-- 時間 -->
								<div class="text-12 color-#aeaeb1 lh-16.345">
									<span class="mr-10">
										{{ formatTimestamp(vo.postTime, 'yyyy-MM-dd HH:mm') }}
									</span>
								</div>
							</div>
						</div>
						<!-- 圖解內容 -->
						<div
							class="tracking-2% lh-24 color-#434343 text-16 truncate-2-lines"
							v-html="safeHtml(vo.postContent)"
						></div>
					</div>
				</a>
			</div>
		</van-list>

		<a
			class="z-19 fixed right-10 bottom-90 pc:right-[calc(50%-240px+10px)]"
			:href="toRoute('pictureExplanation/create', params)"
		>
			<div
				class="flex-y-center flex-col w-40 h-40 rounded-full bg-primary shadow-[0px_4px_6px_0px_#00000066]"
			>
				<SvgIcon
					name="Button_VoiceChatRoom-join-in"
					class="color-#fff mt-2"
					size="1.2rem"
				/>
				<div class="font-600 text-10 lh-13.62 color-white">发图解</div>
			</div>
		</a>
	</div>
</template>

<script setup>
	import { ref, reactive, computed, onBeforeMount } from 'vue'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import PictureExplanationTab from '@/components/PictureExplanationTab/index.vue'
	import { formatTimestamp } from '@/modules/date'
	import { useNavigation } from '@/hooks/useNavigation.js'
	import { getPictureExplanationList } from '@/api/picture'
	import safeHtml from '@/modules/safeHtml.js'

	const { toRoute } = useNavigation()

	const props = defineProps({
		params: { type: Object },
		pathname: { type: String },
		data: { type: Object },
	})

	const list = reactive(_get(props.data, 'explanationList.data.list', []))
	const total = computed(() => {
		return +_get(props.data, 'explanationList.data.total', 0)
	})
	const page = ref(2)
	const size = ref(10)
	const isLoading = ref(false)
	const isFinished = ref(list.length >= total.value)
	const title = _get(props.params, 'title', '')
	const period = _get(props.params, 'period', '')

	const headerTitle = (() => {
		return title ? `${title}第${period}期` : '无标题'
	})()
	const postTitle = (() => {
		return title ? `第${period}期${title}` : '无标题'
	})()

	const isEmptyData = computed(() => !list.length && isFinished.value)

	const onLoad = async () => {
		isLoading.value = true

		const issueId = _get(props.params, 'issueId', '')

		const res = await getPictureExplanationList({
			page: page.value,
			size: size.value,
			issueId,
		})

		const newData = _get(res, 'data.list', [])

		list.push(...newData)
		if (list.length >= total.value) {
			isFinished.value = true
		}
		page.value += 1
		isLoading.value = false
	}

	function toExplanationRoute(vo, idx) {
		const title = _get(vo, 'issueDTO.newspaperName', '')

		return toRoute('pictureExplanation/detail', {
			title,
			period: vo.postIssue,
			issueId: vo.issueId,
			year: vo.year,
			postUserId: vo.postUserId,
			postTime: vo.postTime,
			imageExplainId: vo.postId, //圖解ID
			currentIndex: idx, //給詳情頁切換下一則用
		})
	}
</script>

<style lang="scss" scoped></style>
