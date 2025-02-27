<template>
	<div class="forum-collection">
		<div class="color-#434343 text-18 pl-10 mt-10 font-700">论坛大全</div>
		<swiper
			:slides-per-view="3"
			:space-between="10"
			class="my-10 px-10!"
			v-show="showSwiper"
			@afterInit="showSwiper = true"
		>
			<swiper-slide v-for="(group, groupIndex) in forumList" :key="groupIndex">
				<div
					v-for="(item, index) in group"
					:key="index"
					class="lh-30 bg-#f2f2f2 rounded-8 px-5 cursor-pointer mb-10 text-center color-#434343 text-12 flex-center"
					@click="doClick(item)"
				>
					<div class="truncate" :class="textWidth(item)">
						{{ item.siteName }}
					</div>
					<div class="lh-0">
						<SvgIcon
							v-if="item.isRecommended == 'y'"
							class="inline"
							size="0.9375rem"
							name="icon_forum_collect_recommended"
						/>
						<SvgIcon
							v-if="item.isSelected == 'y'"
							class="inline"
							size="0.9375rem"
							name="icon_forum_collect_selected"
						/>
						<SvgIcon
							v-if="item.isHot == 'y'"
							class="inline"
							size="0.9375rem"
							name="icon_forum_collect_hot"
						/>
					</div>
				</div>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script setup>
	import { inject, computed, ref } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useWebsite } from '@/hooks/useWebsite'
	import { useLotteryStore } from '@/stores/lottery'
	import { safeOpen, getLotteryTypeList } from '@/modules/util.js'

	const data = inject('data')
	const showSwiper = ref(false)
	const webSite = useWebsite()

	const lotteryTypes = getLotteryTypeList()
	const bbsSiteList = _get(data, 'bbsSiteList.data', [])

	const { lotteryType } = storeToRefs(useLotteryStore())
	const forumList = computed(() => {
		if (!lotteryType.value) return []
		const target = _find(lotteryTypes, (vo) => vo.key == lotteryType.value)
		if (!target) {
			console.error(
				`彩種${lotteryType.value}尚未匹配, ${JSON.stringify(lotteryTypes)}`
			)
			return []
		}
		const result = _filter(bbsSiteList, (vo) =>
			_includes(vo.focusGameType, String(target.code))
		)
		let chunkSize = 1
		if (result.length > 8) chunkSize = 2
		if (result.length > 12) chunkSize = 3
		return _chunk(result, chunkSize)
	})
	function textWidth(item) {
		const count = ['isRecommended', 'isSelected', 'isHot'].filter(
			(key) => item[key] === 'y'
		).length

		if (count === 3) return 'w-50'
		if (count === 2) return 'w-60'
		if (count === 1) return 'w-70'
		return ''
	}

	function doClick(vo) {
		let url = webSite.getSiteUrl(vo)
		safeOpen(url)
	}
</script>

<style lang="scss" scoped>
	@media (max-width: 360px) {
		.forum-collection {
			.svg-icon {
				width: 0.66rem !important;
				height: 0.66rem !important;
			}
		}
	}
</style>
