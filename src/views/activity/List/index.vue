<template>
	<div class="platform">
		<div v-for="(item, index) in items" class="platform-list" :key="index">
			<div @click="goToActivity(item)">
				<div class="pl-pic">
					<CdnImage
						v-if="item.img && !item.isImageError"
						class="w-full h-full"
						:path="item.img"
						@error="items[index].isImageError = true"
					/>
					<div v-else class="bg-#e5eaf3 h-full w-full flex-center">
						<img
							src="/public-assets/images/icon_Nopicture4.png"
							class="h-full"
						/>
					</div>
				</div>
				<div class="pl-col bg-white">
					<span class="pl-title">{{ item.title }}</span>
					<span class="pl-date">
						{{ formatTimestamp(item.msgTime, 'yyyy-MM-dd') }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { toRefs } from 'vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { formatTimestamp } from '@/modules/date.js'
	import { safeOpen } from '@/modules/util.js'

	const props = defineProps({
		items: {
			type: Array,
			default: () => [],
		},
	})
	const { items } = toRefs(props)

	function goToActivity(item) {
		safeOpen(_get(item, 'msgObj.url'))
	}
</script>

<style lang="scss" scoped>
	.platform {
		padding: 0 0.625rem;
		margin-top: 0.625rem;
		.platform-list {
			border-radius: 10px;
			box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
			.pl-pic {
				height: 5.4rem;
				overflow: hidden;
				img {
					border-radius: 10px 10px 0 0;
				}
			}
			.pl-col {
				padding: 0.25rem 0.75rem;
				display: flex;
				justify-content: space-between;
				margin-bottom: 0.5rem;
				border-radius: 10px;
				.pl-title {
					color: #434343;
					font-size: 1rem;
					font-weight: bold;
				}
				.com-def-btn-active {
					padding: 0.1875rem 0.9375rem;
				}
			}
			.pl-date {
				color: #aeaeb1;
				font-size: 0.875rem;
			}
		}
	}
</style>
