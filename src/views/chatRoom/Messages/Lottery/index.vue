<template>
	<div>
		<!-- 其他用戶發的信息 -->
		<div v-if="!userInfo.isSelf" class="flex">
			<Avatar class="w-35 h-35 mr-10 shrink-0" :user="userInfo" />
			<div>
				<div class="flex-y-center mb-3.5">
					<div
						v-if="userInfo.isOwner"
						class="bg-primary min-w-30 h-15 lh-15 flex-center rounded-7 mr-5"
					>
						<span class="text-mini-10 color-#fff">房主</span>
					</div>
					<!-- 等級 -->
					<div class="lh-12 mr-5">
						<span class="font-600 text-mini-10 color-primary">LV.</span>
						<span class="font-600 text-14 color-primary">
							{{ userInfo.level }}
						</span>
					</div>
					<!-- 用戶名 -->
					<span class="color-#656565 lh-15 truncate-1-lines break-all">
						{{ userInfo.nickname }}
					</span>
				</div>
				<!-- 聊天內容 -->
				<div
					class="w-300 rounded-10 p-4.225 shadow-primary overflow-hidden bg-#fff"
					@click="handleShowDetail"
				>
					<!-- 開獎信息標題 -->
					<div class="flex-y-center justify-between mb-4.225 px-8.45">
						<span class="color-#656565 text-12 font-600">
							第 {{ content.issue }} 期开奖结果
						</span>
						<span class="text-mini-10 color-#AEAEB1">
							{{ recordTime }}
						</span>
					</div>

					<!-- 開獎號碼列表 -->
					<BallList :openCode="openCode" />
				</div>
			</div>
		</div>

		<!-- 自己發的信息 -->
		<div v-else class="flex flex-row-reverse mb-3.5">
			<Avatar class="w-35 h-35 ml-10" :user="userInfo" />
			<!-- 聊天內容 -->
			<div
				class="w-300 rounded-10 p-4.225 shadow-primary overflow-hidden bg-#fff"
				@click="handleShowDetail"
			>
				<!-- 開獎信息標題 -->
				<div class="flex-y-center justify-between mb-4.225 px-8.45">
					<span class="color-#656565 text-12 font-600">
						第 {{ content.issue }} 期开奖结果
					</span>
					<span class="text-mini-10 color-#AEAEB1">
						{{ recordTime }}
					</span>
				</div>

				<!-- 開獎號碼列表 -->
				<BallList :openCode="openCode" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import { getOrDefault, getBallNumberData } from '@/modules/util'
	import { formatTimestamp, getZonedDate } from '@/modules/date'
	import CdnImage from '@/components/CdnImage/index.vue'
	import Avatar from '../../Avatar/index.vue'
	import BallList from './BallList/index.vue'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const props = defineProps({
		message: {
			type: Object,
			default: () => ({}),
		},
	})

	const { roomData, iframeUrl } = useRoomData()
	const { showDetail } = useDisplayStates()

	const userInfo = computed(() => {
		const userId = getOrDefault(props.message, 'data.userId', '')

		return roomData.members[userId]
	})
	const content = computed(() =>
		getOrDefault(props.message, 'data.content', {})
	)
	const openCode = computed(() => {
		const { openCode } = getBallNumberData(
			getOrDefault(content.value, 'openNo', [])
		)

		return openCode
	})
	const recordTime = computed(() => {
		const recordTime = getOrDefault(content.value, 'recordTime', '')

		return formatTimestamp(recordTime)
	})

	const handleShowDetail = () => {
		const issue = getOrDefault(content.value, 'issue', '')
		const recordTime = getOrDefault(content.value, 'recordTime', '')
		const year = getZonedDate(recordTime).getFullYear()

		iframeUrl.value = `${location.origin}/lotteryHistory/detail?year=${year}&issue=${issue}`
		showDetail.value = true
	}
</script>

<style lang="scss" scoped></style>
