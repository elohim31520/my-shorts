<template>
	<div
		class="flex-y-center justify-center z-10 w-full bg-white fixed left-0 top-0"
	>
		<div class="px-10 w-full max-w-480px">
			<div class="flex items-center h-45 w-full">
				<SvgIcon
					name="arrow_left"
					size="1.875rem"
					class="color-#434343 shrink-0"
					@click="back"
				/>
				<span class="color-#434343 flex-grow truncate font-600 mr-12.835">
					{{ detailData.newspaperName }}
				</span>
				<GenericButton
					:isActive="isLiked"
					@buttonClick="handleLikeClick"
					class="mr-5 shrink-0"
				>
					<div class="flex-center">
						<svgIcon
							v-if="!isLiked"
							name="like_click1"
							size="0.875rem"
							class="color-#f82430 mr-2.5"
						/>
						<span>{{ statesText }}</span>
					</div>
				</GenericButton>

				<span class="text-green-500 text-14 font-600 whitespace-nowrap">
					第{{ periodFull }}期
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import { usePictureDetailStore } from '@/stores/pictureDetail'
	import GenericButton from '@/components/GenericButton/index.vue'
	import { storeToRefs } from 'pinia'
	import { back } from '@/modules/util.js'

	const { periodFull } = storeToRefs(usePictureDetailStore())
	const { doLike } = usePictureDetailStore()

	const props = defineProps({
		detailData: {
			type: Object,
			default: () => ({}),
		},
	})

	const isLiked = computed(() => props.detailData.seriesLikeStatus === 'y')
	const statesText = computed(() => (isLiked.value ? '已喜欢' : '喜欢'))

	const handleLikeClick = async () => {
		await doLike(props.detailData, {
			targetIdKey: 'seriesCode',
			targetRefKey: 'gameType',
			statusKey: 'seriesLikeStatus',
			likeFlag: 's',
			updateCount: false,
		})
	}
</script>

<style lang="scss" scoped>
	.subscribe-btn {
		text-align: center;
		margin-left: auto;
		background-clip: text;
		-webkit-background-clip: text;
		background-image: linear-gradient(to right, #f82430 0%, #ff3a75 100%);
		-webkit-text-fill-color: transparent;
	}
</style>
