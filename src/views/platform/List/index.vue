<template>
	<div class="platform">
		<van-list
			v-model:loading="isLoading"
			:finished="isFinished"
			@load="onLoad"
			finished-text="没有更多了"
		>
			<div
				v-for="(item, index) in items"
				class="platform-list shadow-primary"
				:class="{ last: index == items.length - 1 }"
				:key="index"
			>
				<div class="pl-pic flex-center">
					<CdnImage
						v-if="item.siteLogo && !item.isImageError"
						class="w-full h-full"
						:path="item.siteLogo"
						@error="data[index].isImageError = true"
					/>
					<div v-else class="bg-#e5eaf3 h-full w-full flex-center">
						<img
							src="/public-assets/images/icon_Nopicture4.png"
							class="h-full"
						/>
					</div>
				</div>

				<div class="pl-col">
					<span class="pl-title">{{ item.siteName }}</span>
					<a
						class="text-14 bg-#fdfeed bd-#34C759 rounded-15 w-80 h-20 lh-0 flex-center color-primary"
						@click="doClick(item, $event)"
					>
						查看详情
					</a>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script setup>
	import { ref, reactive, inject, computed } from 'vue'
	import { useWebsite } from '@/hooks/useWebsite'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { safeOpen } from '@/modules/util.js'

	const fetchSize = 5
	const data = reactive(_defaultTo(inject('data'), []))
	const website = useWebsite()
	const isLoading = ref(false)
	const size = ref(fetchSize)
	const items = computed(() => data.slice(0, size.value))
	const isFinished = computed(() => size.value >= data.length)

	function doClick(vo, event) {
		event.preventDefault()
		const url = website.getSiteUrl(vo)
		safeOpen(url)
	}

	function onLoad() {
		size.value += fetchSize
		setTimeout(() => {
			isLoading.value = false
		}, 600)
	}
</script>

<style lang="scss" scoped>
	.platform {
		padding: 3.625rem 0.625rem 3rem;
		background-color: #fafafa;

		.platform-list {
			border-radius: 0.625rem;
			overflow: hidden;
			background-color: #fff;
			margin-bottom: 0.625rem;
			&.last {
				margin-bottom: 0;
			}
			.pl-pic {
				height: 5.2813rem;
			}
			.pl-col {
				height: 2rem;
				padding: 0 0.625rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.pl-title {
					color: #434343;
					font-size: 1rem;
					font-weight: 600;
				}
			}
		}
	}
</style>
