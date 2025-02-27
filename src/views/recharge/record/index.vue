<template>
	<div class="min-h-100dvh p-10 pt-55 bg-#fafafa color-#434343">
		<NormalHeader title="充值记录" />
		<NoContent v-if="!rechargeRecords.length && finished" text="暂无数据" />
		<van-list
			v-else
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="handleLoad"
		>
			<div
				v-for="(record, index) in rechargeRecords"
				:key="index"
				class="px-15 py-10 bb-#E7E7E7"
			>
				<div class="flex-y-center justify-between text-12">
					<p>订单编号：{{ record.payOrderId }}</p>
					<p :class="record.statusClass">{{ record.statusText }}</p>
				</div>
				<div class="flex-y-center justify-between">
					<div>
						<p class="font-600 mb-2">充值-积分</p>
						<p class="text-12 color-#656565">
							{{ formatTimestamp(record.createTime, 'yyyy-MM-dd HH:mm:ss') }}
						</p>
					</div>
					<div class="flex flex-col items-end">
						<div :class="record.priceClass">
							<span class="text-18">{{ record.amount }}</span>
							<span class="text-12">元</span>
						</div>
						<div class="flex-center" :class="record.scoreClass">
							<SvgIcon name="score" size="1.25rem" class=""></SvgIcon>
							<p class="text-18 font-600">{{ moneyFormat(record.score) }}</p>
						</div>
					</div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script setup>
	import { ref, reactive } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { getRechargeRecordApi } from '@/api/recharge'
	import { formatTimestamp } from '@/modules/date'
	import { moneyFormat } from '@/modules/util'

	const rechargeRecords = reactive([])
	const loading = ref(false)
	const finished = ref(false)

	const statusMap = {
		0: {
			text: '发起付款待验证',
			statusClass: '',
			scoreClass: '',
			priceClass: '',
		},
		1: {
			text: '已经验证，等待付',
			statusClass: '',
			scoreClass: '',
			priceClass: '',
		},
		2: {
			text: '付款成功',
			statusClass: 'color-#34C759',
			scoreClass: '',
			priceClass: 'color-#34C759',
		},
		3: {
			text: '超时',
			statusClass: 'color-#FC7E7E',
			scoreClass: 'color-#AEAEB1',
			priceClass: 'color-#AEAEB1',
		},
		4: {
			text: '异常',
			statusClass: 'color-#FC7E7E',
			scoreClass: 'color-#AEAEB1',
			priceClass: 'color-#AEAEB1',
		},
		5: {
			text: '人工到账',
			statusClass: 'color-#FF9500',
			scoreClass: '',
			priceClass: '',
		},
		6: {
			text: '已取消',
			statusClass: 'color-#FC7E7E',
			scoreClass: 'color-#AEAEB1',
			priceClass: 'color-#AEAEB1',
		},
	}
	const pageSize = 10
	let pageIndex = 1

	const handleLoad = async () => {
		const response = await getRechargeRecordApi({ page: pageIndex })
		const responseClone = _cloneDeep(response)
		const list = _get(responseClone, 'data.list', [])
		const total = _get(responseClone, 'data.total', 0)

		list.forEach((record) => {
			const statusInfo = statusMap[record.state] || {
				text: '未知状态',
				statusClass: '',
				scoreClass: '',
				priceClass: '',
			}
			record.statusText = statusInfo.text
			record.statusClass = statusInfo.statusClass
			record.scoreClass = statusInfo.scoreClass
			record.priceClass = statusInfo.priceClass
		})

		rechargeRecords.push(...list)
		loading.value = false
		pageIndex++

		// 判斷是否已加載完所有資料
		if (rechargeRecords.length >= total) {
			finished.value = true
		}
	}
</script>

<style lang="scss" scoped></style>
