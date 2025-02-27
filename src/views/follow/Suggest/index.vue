<template>
	<div class="pt-36.5">
		<p class="mb-10 color-#656565 font-600 lh-20">推荐的创作者</p>
		<p class="color-#aeaeb1 text-14 font-500 lh-18">
			关注后，查看他们的最新创作
		</p>
		<swiper
			:effect="'coverflow'"
			:grabCursor="true"
			:centeredSlides="true"
			:slidesPerView="'auto'"
			:coverflowEffect="{
				rotate: 0, // rotate 旋轉角度
				stretch: 20, // 幻燈片之間的左右位移距離
				depth: 12, // 深度感
				scale: 0.9, // 非活動幻燈片縮放
				slideShadows: false, // 非活動幻燈片的陰影開關
			}"
			:loop="true"
			:modules="[EffectCoverflow]"
			@swiper="initSwiper"
		>
			<swiper-slide
				v-for="(item, index) in cloneDaniuList"
				:key="String(item.userId)"
				class="bg-#fff"
			>
				<div class="relative mb-15">
					<div class="rounded-full w-68 h-68 mx-auto bg-skeleton">
						<CdnImage
							:path="item.avatar"
							fit="cover"
							position="center"
							round
							class="w-full h-full"
							error-icon="/public-assets/images/avatar_miss.png"
							:show-loading="false"
							:config="{ width: '4.25rem' }"
						/>
					</div>
					<div
						class="absolute left-50% -bottom-7.5 -translate-x-50% w-76.5 grid grid-cols-3 gap-x-4"
					>
						<CdnImage
							v-for="(img, index) in item.medalList"
							:key="index"
							:path="img.url"
							fit="cover"
							position="center"
							class="h-22 w-22"
						/>
					</div>
				</div>
				<SvgIcon
					size="1.875rem"
					name="icon_button_closure"
					class="absolute top-10 right-10"
					@click="handleDelete(index)"
				/>

				<p class="color-#434343 mb-5 font-600 lh-22 truncate-1-lines">
					{{ item.nickname || '&nbsp;' }}
				</p>
				<p class="color-#aeaeb1 mb-15 text-14 font-500 h-19.05 lh-19.05">
					{{ getPostDateDescription(item) }}
				</p>
				<div class="grid grid-cols-3 gap-x-5 mb-15 h-50">
					<CdnImage
						v-for="(imgUrl, index) in getPostImages(item)"
						:key="index"
						:path="imgUrl"
						fit="cover"
						position="center"
						class="h-50 w-50"
						radius="0.3125rem"
					/>
				</div>
				<GenericButton
					class="mx-auto"
					:isActive="item.isFollowing"
					:buttonState="item.isFollowing ? 'following' : 'follow'"
					:statesText="statesText"
					@buttonClick="toggleFollow(item, index)"
				/>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script setup>
	import { inject, ref, computed } from 'vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import GenericButton from '@/components/GenericButton/index.vue'
	import { EffectCoverflow } from 'swiper/modules'
	import { useLotteryStore } from '@/stores/lottery'
	import { storeToRefs } from 'pinia'
	import { addFollow, delFollow } from '@/api/daniu'
	import {
		mergeAndFilter,
		getRelativeDayDescription,
		toast,
	} from '@/modules/util'

	const daniuListKV = _values(_get(inject('data'), 'daniuListKV.data', {}))
	const cloneDaniuList = ref(_cloneDeep(daniuListKV))

	const props = defineProps({
		hasFollow: {
			type: Boolean,
			required: false,
		},
	})
	const emit = defineEmits(['update:hasFollow'])

	let swiperInstance

	const initSwiper = (swiper) => {
		swiperInstance = swiper
	}

	const statesText = {
		following: '已关注',
		follow: '关注',
	}

	const handleDelete = (index) => {
		cloneDaniuList.value.splice(index, 1)
	}

	const toggleFollow = async (item, index) => {
		if (item.isFollowing) {
			const response = await delFollow({
				toUserId: item.userId,
			})
			const success = _get(response, 'success', false)

			if (success) {
				toast('取消关注')
				cloneDaniuList.value[index].isFollowing = false
			}
		} else {
			const response = await addFollow({
				toUserId: item.userId,
			})
			const success = _get(response, 'success', false)

			if (success) {
				toast('关注成功')
				swiperInstance.slideNext()
				cloneDaniuList.value[index].isFollowing = true
			}
		}
	}

	// 獲取帖子中的圖片，只取前三筆
	const getPostImages = (item) => {
		return _slice(_get(item, 'works.[0].img', []), 0, 3)
	}

	// 獲取發帖日期描述
	const getPostDateDescription = (item) => {
		const createTime = _get(item, 'works.[0].createTime', '')
		const dayDescription = getRelativeDayDescription(createTime)
		return dayDescription && `${dayDescription}發了創作`
	}
</script>
<style lang="scss" scoped>
	.swiper {
		padding: 2.5rem 0;
	}
	.swiper-slide {
		position: relative;
		width: 11.25rem;
		padding: 1.3438rem 0.625rem 0.625rem;
		border-radius: 0.625rem;
		box-shadow: 0 0.0625rem 0.375rem 0 rgba(0, 0, 0, 0.2);
	}
</style>
