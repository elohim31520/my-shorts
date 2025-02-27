<template>
	<div>
		<div class="maintain">
			<div class="flex justify-center">
				<van-image
					fit="cover"
					src="/public-assets/images/maintain/bg_repair.png"
				/>
			</div>

			<van-swipe indicator-color="#34c759" :autoplay="5000">
				<van-swipe-item v-for="(vo, index) in items" :key="index">
					<div class="title mt-25 flex justify-center color-#ff8f28">
						{{ vo.planTitle }}
					</div>
					<div class="w-full content">
						<div
							class="tips color-#656565 text-14"
							v-html="safeHtml(vo.planDesc)"
						></div>
						<div class="maintain-time">
							<div class="title text-16 font-semibold mt-16">维护时间：</div>
							<div class="time text-14 color-#656565">
								{{ formatTimestamp(vo.startTime, 'yyyy-MM-dd HH:mm:ss') }} -
								{{ formatTimestamp(vo.endTime, 'yyyy-MM-dd HH:mm:ss') }}
							</div>
						</div>
					</div>
				</van-swipe-item>
			</van-swipe>
		</div>
	</div>
</template>

<script setup>
	import { useMaintainStore } from '@/stores/maintain.js'
	import { storeToRefs } from 'pinia'
	import { formatTimestamp } from '@/modules/date.js'
	import safeHtml from '@/modules/safeHtml.js'

	const { items } = storeToRefs(useMaintainStore())
</script>

<style lang="scss" scoped>
	.maintain {
		margin-top: 1.875rem;
		background-color: #fff;
		min-height: calc(100dvh - 2.8125rem);
		.title {
			font-size: 1.25rem;
			font-weight: 500;
		}
		.content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 1.3125rem;
		}
		.maintain-time {
			width: 100%;
		}
		:deep(.van-image) {
			width: 14.0625rem;
			height: 13.8125rem;
			// padding: 0.5rem 1.9375rem 0 1.9375rem;
		}
	}
</style>
