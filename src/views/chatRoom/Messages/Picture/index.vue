<template>
	<div>
		<!-- 其他用戶發的信息 -->
		<div v-if="!userInfo.isSelf" class="flex">
			<Avatar class="w-35 h-35 mr-10 shrink-0" :user="userInfo" />
			<div>
				<div class="flex-y-center mb-3.5">
					<div
						v-if="userInfo.isOwner"
						class="bg-primary min-w-30 h-15 lh-15 flex-center rounded-7 mr-5"
					>
						<span class="text-mini-10 color-#fff">房主</span>
					</div>
					<!-- 等級 -->
					<div class="lh-12 mr-5">
						<span class="font-600 text-mini-10 color-primary">LV.</span>
						<span class="font-600 text-14 color-primary">
							{{ userInfo.level }}
						</span>
					</div>
					<!-- 用戶名 -->
					<span class="color-#656565 lh-15 truncate-1-lines break-all">
						{{ userInfo.nickname }}
					</span>
				</div>
				<!-- 聊天內容 -->
				<div
					class="w-180 rounded-7 shadow-primary overflow-hidden bg-#fff"
					@click="handleShowDetail"
				>
					<div v-if="content.isImageError" class="pt-25 pb-6 px-40">
						<img class="h-100" src="/public-assets/images/no_picture.png" />
						<p class="text-14 text-center color-#AEAEB1">暂无圖紙</p>
					</div>
					<CdnImage
						v-else
						:path="content.imgPath"
						fit="cover"
						position="center"
						@load="handleLoad"
						@error="handleError(content)"
						error-icon="/public-assets/images/no_picture.png"
					/>
					<div
						class="p-10 relative"
						:class="{ 'pt-20': thumbnailImages.length }"
					>
						<ul
							v-if="thumbnailImages.length"
							class="absolute -top-20 left-1/2 w-150 -translate-x-1/2 grid grid-cols-4 gap-x-10"
						>
							<li
								v-for="(thumbnailUrl, index) in thumbnailImages"
								:key="index"
								class="w-30 h-30 rounded-4 overflow-hidden shadow-primary"
							>
								<CdnImage :path="thumbnailUrl" class="w-full h-full" />
							</li>
						</ul>
						<p class="truncate-2-lines font-600 color-#434343 mb-7">
							{{ content.newspaperName }}
						</p>
						<div class="flex-y-center justify-between">
							<span class="truncate max-w-100 text-14 color-#AEAEB1">
								{{ content.seriesName }}
							</span>
							<div class="flex-y-center">
								<SvgIcon name="icon_like" size="0.9375rem" class="mr-4" />
								<span class="color-#AEAEB1 text-14">
									{{ digitalConversion(content.likeCount) || '赞' }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 自己發的信息 -->
		<div v-else class="flex flex-row-reverse mb-3.5">
			<Avatar class="w-35 h-35 ml-10" :user="userInfo" />
			<!-- 聊天內容 -->
			<div
				class="w-180 rounded-7 shadow-primary overflow-hidden bg-#fff"
				@click="handleShowDetail"
			>
				<div v-if="content.isImageError" class="pt-25 pb-6 px-40">
					<img class="h-100" src="/public-assets/images/no_picture.png" />
					<p class="text-14 text-center color-#AEAEB1">暂无圖紙</p>
				</div>
				<CdnImage
					v-else
					:path="content.imgPath"
					fit="cover"
					position="center"
					@load="handleLoad"
					@error="handleError(content)"
					error-icon="/public-assets/images/no_picture.png"
				/>
				<div class="p-10 relative" :class="{ 'pt-20': thumbnailImages.length }">
					<ul
						v-if="thumbnailImages.length"
						class="absolute -top-20 left-1/2 w-150 -translate-x-1/2 grid grid-cols-4 gap-x-10"
					>
						<li
							v-for="(thumbnailUrl, index) in thumbnailImages"
							:key="index"
							class="w-30 h-30 rounded-4 overflow-hidden shadow-primary"
						>
							<CdnImage :path="thumbnailUrl" class="w-full h-full" />
						</li>
					</ul>
					<p class="truncate-2-lines font-600 color-#434343 mb-7">
						{{ content.newspaperName }}
					</p>
					<div class="flex-y-center justify-between">
						<span class="truncate max-w-100 text-14 color-#AEAEB1">
							{{ content.seriesName }}
						</span>
						<div class="flex-y-center">
							<SvgIcon name="icon_like" size="0.9375rem" class="mr-4" />
							<span class="color-#AEAEB1 text-14">
								{{ digitalConversion(content.likeCount) || '赞' }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed, inject } from 'vue'
	import { getOrDefault, digitalConversion } from '@/modules/util'
	import CdnImage from '@/components/CdnImage/index.vue'
	import Avatar from '../../Avatar/index.vue'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const props = defineProps({
		message: {
			type: Object,
			default: () => ({}),
		},
	})

	const messageScrollController = inject('messageScrollController')

	const { isAtBottom, scrollToBottom } = messageScrollController

	const { roomData, iframeUrl } = useRoomData()
	const { showDetail } = useDisplayStates()

	const userInfo = computed(() => {
		const userId = getOrDefault(props.message, 'data.userId', '')

		return roomData.members[userId]
	})
	const content = computed(() =>
		getOrDefault(props.message, 'data.content', {})
	)
	const thumbnailImages = computed(() =>
		getOrDefault(content.value, 'thumbnailImages', [])
	)

	const handleShowDetail = () => {
		const pictureId = getOrDefault(content.value, 'issueId', '')

		iframeUrl.value = `${location.origin}/pictureDetail?id=${pictureId}`
		showDetail.value = true
	}

	const handleLoad = () => {
		scrollToBottom(isAtBottom)
	}

	const handleError = (content) => {
		content.isImageError = true
		scrollToBottom(isAtBottom)
	}
</script>

<style lang="scss" scoped></style>
