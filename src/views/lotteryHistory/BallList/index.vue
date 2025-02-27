<template>
	<!-- 開獎號碼列表 -->
	<div class="ball-list flex-y-center justify-between text-center">
		<template v-for="(item, index) in openCode" :key="index">
			<!-- 為每個號碼生成的元素 -->
			<div v-if="!isLastNumber(index)" class="bg-#f9f6ef rounded-25 h-69">
				<div class="relative">
					<SvgIcon size="2.5625rem" :name="`ball-${item.color}`" />
					<span class="ball-list__number">
						{{ _trimStart(item.value, '0') }}
					</span>
				</div>
				<!-- 生肖/五行 -->
				<p class="text-14.7 color-#434343 lh-16">
					{{ item.pet }}{{ showWs ? `/${item.ws}` : '' }}
				</p>
			</div>
			<template v-else>
				<!-- 加號 -->
				<span class="text-20 color-#aeaeb1 relative -top-10">+</span>
				<!-- 最後一個號碼 -->
				<div class="bg-#f9f6ef rounded-25 h-69">
					<div class="relative">
						<SvgIcon size="2.5625rem" :name="`ball-${item.color}`" />
						<span class="ball-list__number">
							{{ _trimStart(item.value, '0') }}
						</span>
					</div>
					<!-- 生肖/五行 -->
					<p class="text-14.7 color-#434343 lh-16">
						{{ item.pet }}{{ showWs ? `/${item.ws}` : '' }}
					</p>
				</div>
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
		showWs: {
			type: Boolean,
			default: false,
		},
	})

	// 判斷是否為列表中的最後一個號碼
	const isLastNumber = (index) => {
		return index === props.openCode.length - 1
	}
</script>

<style scoped>
	.ball-list__number {
		color: #fff;
		font-size: 1.3125rem;
		font-weight: bold;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
