<template>
	<div class="rounded-10 mt-10 overflow-hidden">
		<div class="bg-[linear-gradient(to_right,_#FFFCF3,_#FFFFFF)]">
			<div class="py-10 text-14 font-400 color-#656565 text-center">
				<span class="mr-10">{{ detail.openDate }}</span>
				<!-- prettier-ignore -->
				<span>第<span class="color-#FF8F28">{{ formatIssue(detail.issue) }}</span>期</span>
			</div>
			<div class="w-full h-1 bg-#F2F2F2"></div>

			<ul class="flex flex-justify-between px-10 py-10">
				<li
					v-for="(vo, index) in previous6"
					:key="index"
					class="bg-#F9F6EF rounded-999px pb-10"
				>
					<div class="relative">
						<SvgIcon size="2.5rem" :name="`ball-${formatColor(vo.color)}`" />
						<span
							class="color-white absolute top-50% left-50% translate-x--1/2 translate-y--1/2]"
						>
							{{ vo.num }}
						</span>
					</div>
					<div class="flex-center">
						<p class="w-[min-content] break-all text-14">
							{{ vo.shengxiao }}
							{{ formatSize(vo.size) }}
							{{ formatParity(vo.oddEven) }}
						</p>
					</div>
				</li>
				<li class="flex color-#AEAEB1 text-24 font-400">+</li>
				<li class="bg-#F9F6EF rounded-999px pb-10">
					<div class="relative">
						<SvgIcon size="2.5rem" :name="`ball-${formatColor(tail.color)}`" />
						<span
							class="color-white absolute top-50% left-50% translate-x--1/2 translate-y--1/2]"
						>
							{{ tail.num }}
						</span>
					</div>
					<div class="flex-center">
						<p class="w-[min-content] break-all text-14">
							{{ tail.shengxiao }}
							{{ formatSize(tail.size) }}
							{{ formatParity(tail.oddEven) }}
						</p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
	import { inject, computed, ref } from 'vue'
	import { usePredictDetail } from '../usePredictDetail.js'

	const detail = _get(inject('data'), 'detail.data', {})

	if (_isEmpty(detail.numsInfo)) {
		detail.numsInfo = [
			{ num: '等' },
			{ num: '待' },
			{ num: '官' },
			{ num: '方' },
			{ num: '开' },
			{ num: '奖' },
			{ num: '快' },
		]
	}

	const tail = computed(() => _defaultTo(_takeRight(detail.numsInfo)[0], {}))
	const previous6 = computed(() => _take(detail.numsInfo, 6))
	const { formatIssue, formatColor, formatSize, formatParity } =
		usePredictDetail()
</script>

<style></style>
