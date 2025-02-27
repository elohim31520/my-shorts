<template>
	<div class="w-100%">
		<div class="mb-5">
			<div
				class="bg-#ffffff shadow-primary w-1/1 px-15 py-5 rounded-10 flex-center justify-start gap-10"
			>
				<div v-user.expert="user.saleUserId">
					<AvatarRound :path="user.saleAvatar" avatar-width="3.125rem" />
				</div>

				<div
					v-redirect="`/predict/detail/${user.predictionId}`"
					class="flex-1 flex flex-col justify-between h-60 content-right"
				>
					<div class="flex items-start justify-between">
						<p
							class="color-#434343 font-600 font-size-18 line-height-22 single-ellipsis"
						>
							{{ user.saleNickname }}
						</p>
						<div
							class="font-size-12 font-500 line-height-16"
							:class="[
								user.payStatus == '1' ? 'color-primary' : 'color-#fc7e7e',
							]"
						>
							{{ user.payStatusName }}
						</div>
					</div>
					<div class="flex items-center justify-between h-19 text-12">
						<div class="flex">
							<div
								class="flex-center color-#fff bg-#ff8f28 w-19 h-19 rounded-full mr-5"
								v-if="user.guaranteed === 'y'"
							>
								保
							</div>
							<span class="color-#aeaeb1 line-height-19 mr-10">
								积分:{{ user.point }}
							</span>
						</div>
						<div class="font-size-12 color-#656565 line-height-19">
							{{ formatTimestamp(user.createTime, 'yyyy-MM-dd') }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import AvatarRound from '@/components/AvatarRound/index.vue'
	import { formatTimestamp } from '@/modules/date.js'

	const props = defineProps({
		user: {
			type: Object,
			default: () => ({}),
		},
	})
</script>

<style lang="scss" scoped>
	.single-ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.line-height-16 {
		line-height: 1.03125rem;
	}

	.line-height-22 {
		line-height: 1.375rem;
	}

	.line-height-19 {
		line-height: 1.1875rem;
	}

	.content-right {
		padding: 0.359375rem 0;
		width: calc(100% - 3.75rem);

		.single-ellipsis {
			max-width: calc(100% - 3rem);
		}
	}
</style>
