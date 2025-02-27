<template>
	<div class="ball-list flex-y-center justify-between text-center">
		<template v-for="(item, index) in openCode" :key="index">
			<template v-if="!isAllNumbersInvalid">
				<!-- 為每個號碼生成的元素 -->
				<div v-if="!isLastNumber(index)" class="bg-#f9f6ef rounded-25 h-60">
					<div class="relative">
						<SvgIcon size="2.2rem" :name="`ball-${item.color}`" />
						<span class="ball-list__number">
							{{ item.isValid ? _trimStart(item.value, '0') : '--' }}
						</span>
					</div>
					<!-- 生肖/五行 -->
					<p>{{ item.isValid ? `${item.pet}/${item.ws}` : '-/-' }}</p>
				</div>
				<template v-else>
					<!-- 加號 -->
					<span class="text-20 relative -top-14">+</span>
					<!-- 最後一個號碼 -->
					<div class="bg-#f9f6ef rounded-25 h-60">
						<div class="relative">
							<SvgIcon size="2.2rem" :name="`ball-${item.color}`" />
							<span class="ball-list__number">
								{{ item.isValid ? item.value : '--' }}
							</span>
						</div>
						<!-- 生肖/五行 -->
						<p>{{ item.isValid ? `${item.pet}/${item.ws}` : '-/-' }}</p>
					</div>
				</template>
			</template>
			<!-- 全部數字都不合規的情況顯示 -->
			<template v-else>
				<!-- 為每個號碼生成的元素 -->
				<div v-if="!isLastNumber(index)" class="bg-#f9f6ef rounded-25 h-60">
					<div class="relative">
						<SvgIcon size="2.2rem" :name="`ball-${item.color}`" />
						<span class="ball-list__number">
							{{ invalidTexts[index] }}
						</span>
					</div>
					<!-- 生肖/五行 -->
					<p>-/-</p>
				</div>
				<template v-else>
					<!-- 加號 -->
					<span class="text-20 relative -top-14">+</span>
					<!-- 最後一個號碼 -->
					<div class="bg-#f9f6ef rounded-25 h-60">
						<div class="relative">
							<SvgIcon size="2.2rem" :name="`ball-${item.color}`" />
							<span class="ball-list__number">{{ invalidTexts[index] }}</span>
						</div>
						<!-- 生肖/五行 -->
						<p>-/-</p>
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
		font-size: 0.875rem;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
