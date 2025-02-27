<template>
	<div class="p-10 pt-55">
		<NoContent v-if="!visitorList.length" text="暂无数据" />
		<!-- 開獎記錄列表 -->
		<van-list
			v-else
			v-model:loading="loading"
			:finished="finished"
			:immediate-check="false"
			finished-text="没有更多了"
			@load="handleLoad"
		>
			<div
				class="flex-y-center justify-between bg-white rounded-10 p-10 mb-5 relative shadow-primary"
				v-for="(item, index) in visitorList"
				:key="index"
			>
				<div class="w-60 h-60 bg-skeleton rounded-full shrink-0 mr-10">
					<CdnImage
						:path="item.avatar"
						fit="cover"
						position="center"
						round
						error-icon="/public-assets/images/svg/default_avatar_man.png"
						v-user="item.userId"
						:config="{ width: '3.75rem' }"
					/>
				</div>

				<div class="w-full overflow-hidden">
					<p class="text-18 truncate font-600 color-#434343 lh-22 h-22 mb-5">
						{{ item.nickname || '' }}
					</p>
					<div class="flex-y-center color-#656565">
						<p class="mr-5 text-12 lh-16">
							IP属地：{{ translateLocationName(item.country) }}
						</p>
						<SvgIcon name="information-1" @click="showPopup = true" />
					</div>
				</div>

				<p class="color-#656565 text-14">
					{{ formatTimestamp(item.visitTime, 'yyyy/MM/dd') }}
				</p>
			</div>
		</van-list>
		<LocateTip v-model="showPopup" />
	</div>
</template>

<script setup>
	import { ref, watch, inject, computed, reactive, onBeforeMount } from 'vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { formatTimestamp } from '@/modules/date'
	import { translateLocationName } from '@/modules/util.js'
	import { getVisitorApi } from '@/api/user'
	import LocateTip from '@/components/LocateTip/index.vue'
	import lscache from 'lscache'

	const loading = ref(false)
	const finished = ref(false)
	const pageSize = 10
	const pageIndex = ref(2) // 前10筆已在SSR獲取
	const showPopup = ref(false)
	const visitorList = reactive(_get(inject('data'), 'visitor.data.list', []))

	onBeforeMount(() => {
		const visitTime = _get(_head(visitorList), 'visitTime')
		if (visitTime) lscache.set('visit-time', visitTime)
	})

	async function handleLoad() {
		const response = await getVisitorApi({ page: pageIndex.value })
		const list = _get(response, 'data.list', [])
		const total = _get(response, 'data.total', 0)

		visitorList.push(...list)
		loading.value = false
		pageIndex.value++

		// 判斷是否已加載完所有資料
		if (visitorList.length >= total) {
			finished.value = true
		}
	}
</script>

<style lang="scss" scoped></style>
