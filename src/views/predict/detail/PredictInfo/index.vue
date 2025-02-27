<template>
	<div class="rounded-10 mt-10 overflow-hidden">
		<div
			class="px-10 py-6 flex flex-justify-center bg-[linear-gradient(to_right,_#FEFFED,_#F1FFE6)]"
		>
			<div
				class="self-center rounded-5 color-#ffffff bg-#34C759 text-12 font-600 px-5 py-2.25 mr-5"
			>
				{{ detail.playTypeSubName }}
			</div>
			<p class="flex items-center flex-1 text-16 color-#34C759 font-600">
				{{ formatTitle(detail.predictTitle) }}
			</p>
			<p class="flex-center flex-col font-400 color-#656565">
				<!-- prettier-ignore -->
				<span class="text-14">第<span class="color-#FF8F28">{{ formatIssue(detail.issue) }}</span>期</span>
				<span class="text-10">
					{{ formatTimestamp(detail.createTime, 'yyyy-MM-dd HH:mm:ss') }}
				</span>
			</p>
		</div>

		<div class="w-full h-1 bg-#F2F2F2"></div>

		<div class="py-10 bg-[linear-gradient(to_right,_#FFFCF3,_#FFFFFF)]">
			<ul class="flex flex-wrap px-10">
				<li
					v-for="(vo, index) in detail.predictIsHit || []"
					:key="index"
					class="flex-center w-16.66% py-5 relative"
				>
					<SvgIcon size="2.5rem" :name="`ball-${getColor(vo)}`" />
					<span
						class="color-white absolute top-50% left-50% translate-x--1/2 translate-y--1/2]"
					>
						{{ formatNumber(vo.value) }}
					</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
	import { inject } from 'vue'
	import { usePredictDetail } from '../usePredictDetail.js'
	import { formatTimestamp } from '@/modules/date.js'

	const { formatIssue, formatNumber, getColor } = usePredictDetail()
	const detail = _get(inject('data'), 'detail.data', {})

	function formatTitle(value) {
		const maxLength = 18
		return (
			_truncate(value, { length: maxLength, omission: '' }) +
			(String(value).length > maxLength ? '...' : '')
		)
	}
</script>

<style></style>
