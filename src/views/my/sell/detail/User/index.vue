<template>
	<div class="w-100%">
		<div class="mb-5">
			<div
				class="bg-#ffffff shadow-primary w-1/1 px-15 py-5 rounded-10 flex-center justify-start gap-10"
			>
				<div class="w-50 h-50 bg-skeleton rounded-full">
					<CdnImage
						round
						:path="user.avatar"
						fit="cover"
						position="center"
						width="100%"
						height="100%"
						error-icon="/public-assets/images/svg/default_avatar_man.png"
						:show-loading="false"
						:config="{ width: 50 }"
					/>
				</div>

				<div class="flex-1 flex flex-col justify-between gap-10 h-60 py-5">
					<p
						v-user="user.userId"
						class="color-#434343 font-600 font-size-18 truncate-1-lines"
					>
						{{ user.nickname }}
					</p>
					<div class="flex items-center justify-between text-12">
						<div class="flex">
							<div
								class="flex-center color-#fff bg-#ff8f28 w-16 h-16 text-10 rounded-full mr-5"
								v-if="user.guaranteed === 'y'"
							>
								保
							</div>
							<span class="color-#aeaeb1 mr-10">积分:{{ user.point }}</span>
						</div>
						<div class="font-size-12 color-#656565">
							{{ formatTimestamp(user.createTime, 'yyyy-MM-dd HH:mm:ss') }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import CdnImage from '@/components/CdnImage/index.vue'
	import { formatTimestamp } from '@/modules/date.js'

	const props = defineProps({
		user: {
			type: Object,
			default: () => ({}),
		},
	})
</script>

<style lang="scss" scoped></style>
