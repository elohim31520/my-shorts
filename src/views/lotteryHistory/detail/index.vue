<template>
	<div class="bg-#FAFAFA">
		<!-- 標題區域 -->
		<NormalHeader>
			<template #center>
				<span
					:style="{ width: titleWidth }"
					class="absolute left-1/2 -translate-x-1/2 text-20 font-600 whitespace-nowrap"
				>
					{{ title }}
				</span>
			</template>
		</NormalHeader>

		<div class="py-10 px-10 pt-55">
			<div class="shadow-primary p-10 rounded-10 bg-#fff mb-10">
				<!-- 開獎信息標題 -->
				<div class="text-14 flex-y-center justify-between mb-5">
					<p class="color-#656565 text-14 font-600">
						第 {{ lotteryResult.issue }} 期开奖结果
					</p>
					<p class="color-#AEAEB1 text-12">
						{{ formatTimestamp(lotteryResult.openTime) }}
					</p>
				</div>

				<!-- 開獎號碼列表 -->
				<BallList :openCode="openCode" :showWs="showWs" />
			</div>

			<!-- 顯示特碼和總和的屬性 -->
			<div
				class="shadow-primary py-10 px-20 rounded-10 mb-10 bg-#fff color-#656565 grid grid-cols-2 gap-y-10"
			>
				<p>
					特码单双:
					<span>
						{{ specialNumber.parity }}
					</span>
				</p>
				<p class="text-right">
					特码大小:
					<span>{{ specialNumber.size }}</span>
				</p>
				<p>
					总和大小:
					<span>
						{{ lotteryResult.totalSize }}
					</span>
				</p>
				<p class="text-right">
					总和单双:
					<span>
						{{ lotteryResult.totalParity }}
					</span>
				</p>
			</div>

			<!-- 顯示特碼、平碼和各平碼的屬性 -->
			<div class="shadow-primary py-10 px-20 rounded-10 bg-#fff">
				<p class="mb-10">
					特码:
					<span>{{ specialNumber.value }}</span>
				</p>
				<p class="mb-10">
					正码:
					<span>{{ formattedNormalNumbers }}</span>
				</p>
				<!-- 顯示每個平碼的屬性 -->
				<p
					v-for="(item, index) in normalNumberAttributes"
					:key="index"
					class="mb-10"
				>
					正{{ numberToChinese(index + 1) }}:
					<span>{{ item }}</span>
				</p>
				<p
					v-for="(item, index) in normalNumbers"
					:key="index"
					class="[&:not(:last-child)]:mb-10"
				>
					正{{ index + 1 }}特:
					<span>{{ item.value }}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import BallList from '../BallList/index.vue'
	import { numberToChinese } from '@/modules/util'
	import { formatTimestamp } from '@/modules/date'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const lotteryResult = _get(props.data, 'lotteryResult.data', {})
	const openCode = _get(lotteryResult, 'openCode', [])
	const issue = _get(lotteryResult, 'issue', '')

	const normalNumbers = _slice(openCode, 0, 6) // 前六個為平碼
	const specialNumber = _get(openCode, '[6]', {}) // 第七個為特碼
	const title = `第${issue}期开奖结果`

	// 將正碼的值拼接成字符串
	const formattedNormalNumbers = _join(_map(normalNumbers, 'value'), ' , ')

	// 色彩映射
	const colorMap = {
		red: '红波',
		blue: '蓝波',
		green: '绿波',
	}

	// 計算每個正碼的屬性描述
	const normalNumberAttributes = _map(
		normalNumbers,
		({ size, parity, combinedParity, tailSize, color }) => {
			return `${size}${parity} , ${combinedParity} , ${tailSize} , ${colorMap[color] || color}`
		}
	)
</script>

<style lang="scss" scoped>
	p {
		color: #656565;
	}

	span {
		font-weight: 700;
		color: #434343;
	}
</style>
