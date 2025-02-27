<template>
	<div class="ball-list flex-center pt-5.025 pb-5.4 bg rounded-b-10 shadow-1">
		<template v-for="(item, index) in openCode" :key="index">
			<!-- 為每個號碼生成的元素 -->
			<div
				v-if="!isLastNumber(index)"
				class="bg-#f9f6ef rounded-20.5 h-55.2 px-7.5"
			>
				<div class="relative">
					<SvgIcon size="2.05rem" :name="`ball-${item.color}`" />
					<span class="ball-list__number text-16.82 lh-16.82">
						{{ _trimStart(item.value, '0') }}
					</span>
				</div>
				<!-- 生肖/五行 -->
				<p class="text-11.76 color-#434343 lh-16" v-show="item.pet || item.ws">
					{{ `${item.pet}/${item.ws}` }}
				</p>
			</div>
			<template v-else>
				<!-- 加號 -->
				<span class="text-24 color-#aeaeb1 px-7.5">+</span>
				<!-- 最後一個號碼 -->
				<div class="bg-#f9f6ef rounded-20.5 h-55.2 px-7.5">
					<div class="relative">
						<SvgIcon size="2.05rem" :name="`ball-${item.color}`" />
						<span class="ball-list__number text-16.82 lh-16.82">
							{{ item.value }}
						</span>
					</div>
					<!-- 生肖/五行 -->
					<p
						class="text-11.76 color-#434343 lh-16"
						v-show="item.pet || item.ws"
					>
						{{ `${item.pet}/${item.ws}` }}
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
	})

	// 判斷是否為列表中的最後一個號碼
	const isLastNumber = (index) => {
		return index === props.openCode.length - 1
	}
</script>

<style scoped>
	.bg {
		background: linear-gradient(81.01deg, #fffcf3 -1.02%, #ffffff 100%);
	}
	.ball-list__number {
		color: white;
		font-weight: 700;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.shadow-1 {
		box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.4);
	}
</style>
