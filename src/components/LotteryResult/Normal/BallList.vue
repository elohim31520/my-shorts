<template>
	<div
		class="ball-list flex justify-between items-start text-center color-#434343"
	>
		<template v-for="(item, index) in openCode" :key="index">
			<template v-if="!isAllNumbersInvalid">
				<!-- 為每個號碼生成的元素 -->
				<div v-if="!isLastNumber(index)" class="bg-#f9f6ef rounded-20.5 h-69">
					<div class="relative">
						<SvgIcon size="2.5rem" :name="`ball-${item.color}`" />
						<span class="ball-list__number">
							{{ item.isValid ? _trimStart(item.value, '0') : '--' }}
						</span>
					</div>
					<!-- 生肖/五行 -->
					<p class="text-14" v-show="item.pet || item.ws">
						{{ item.isValid ? `${item.pet}/${item.ws}` : '-/-' }}
					</p>
				</div>
				<template v-else>
					<!-- 加號 -->
					<span class="text-24 color-#aeaeb1">+</span>
					<!-- 最後一個號碼 -->
					<div class="bg-#f9f6ef rounded-29.7 h-96">
						<div class="relative">
							<SvgIcon size="3.7156rem" :name="`ball-${item.color}`" />
							<span class="ball-list__number ball-list__number--large">
								{{ item.isValid ? item.value : '--' }}
							</span>
						</div>
						<!-- 生肖/五行 -->
						<p class="text-20.2 lh-24.5" v-show="item.pet || item.ws">
							{{ item.isValid ? `${item.pet}/${item.ws}` : '-/-' }}
						</p>
					</div>
				</template>
			</template>
			<!-- 全部數字都不合規的情況顯示 -->
			<template v-else>
				<!-- 為每個號碼生成的元素 -->
				<div v-if="!isLastNumber(index)" class="bg-#f9f6ef rounded-20.5 h-69">
					<div class="relative">
						<SvgIcon size="2.5rem" :name="`ball-${item.color}`" />
						<span class="ball-list__number">
							{{ invalidTexts[index] }}
						</span>
					</div>
					<!-- 生肖/五行 -->
					<p class="text-14" v-show="item.pet || item.ws">-/-</p>
				</div>
				<template v-else>
					<!-- 加號 -->
					<span class="text-24 color-#aeaeb1">+</span>
					<!-- 最後一個號碼 -->
					<div class="bg-#f9f6ef rounded-29.7 h-96">
						<div class="relative">
							<SvgIcon size="3.7156rem" :name="`ball-${item.color}`" />
							<span class="ball-list__number ball-list__number--large">
								{{ invalidTexts[index] }}
							</span>
						</div>
						<!-- 生肖/五行 -->
						<p class="text-20.2 lh-24.5" v-show="item.pet || item.ws">-/-</p>
					</div>
				</template>
			</template>
		</template>
	</div>
</template>

<script setup>
	import { trimStart as _trimStart } from 'lodash-es'

	const props = defineProps({
		openCode: {
			type: Array,
			required: true,
			default: () => [],
		},
		isAllNumbersInvalid: {
			type: Boolean,
			default: false,
		},
		invalidTexts: {
			type: Array,
			default: () => [],
		},
	})

	// 判斷是否為列表中的最後一個號碼
	const isLastNumber = (index) => {
		return index === props.openCode.length - 1
	}
</script>

<style scoped>
	.ball-list__number {
		color: white;
		font-weight: bold;
		font-size: 1.125rem;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.ball-list__number--large {
		font-size: 1.875rem;
	}
</style>
