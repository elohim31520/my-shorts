<template>
	<div class="years-wrap">
		<div class="h-38 whitespace-nowrap min-w-100% pl-14 flex-y-center">
			<span
				v-for="vo in list"
				:key="vo.id"
				class="border border-#a9a9a9 rounded-15 w-55 h-20 text-center lh-18 text-12 mr-14 inline-block"
				:class="{ 'bg-primary color-white border-none': vo.id == year }"
				@click="setYear(vo.id)"
			>
				{{ vo.name }}
			</span>
		</div>
	</div>
</template>

<script setup>
	import { usePictureDetailStore } from '@/stores/pictureDetail'
	import { storeToRefs } from 'pinia'

	const { setYear } = usePictureDetailStore()
	const { year } = storeToRefs(usePictureDetailStore())

	/**
	 * @typedef {Object} YearItem
	 * @property {number} id - int 唯一標識符，代表年份。
	 * @property {string} name - 該年份的顯示名稱，格式為“YYYY年”。
	 */

	/**
	 * @type {YearItem[]}
	 * @description list 包含一系列年份對象。
	 */
	const props = defineProps({
		list: {
			type: [Object, Array],
			default: () => [],
		},
	})
</script>

<style lang="scss">
	.years-wrap {
		overflow-x: auto;
		&::-webkit-scrollbar {
			display: none;
		}
	}
</style>
