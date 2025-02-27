<template>
	<div class="w-100%">
		<div class="mb-5">
			<div
				class="shadow-primary w-1/1 p-10 rounded-10 flex-center justify-between"
			>
				<div class="flex items-center justify-start user-info">
					<AvatarRound
						v-user="user.userId"
						:path="user.avatar"
						avatar-width="3.75rem"
					/>
					<div class="flex flex-col justify-between h-60 py-7 ml-10 user-name">
						<div
							v-user="user.userId"
							class="color-#434343 font-600 font-size-18 line-height-22 single-ellipsis"
						>
							{{ user.nickname }}
						</div>
						<div
							class="color-#656565 line-height-19 font-size-14 whitespace-nowrap flex items-end"
						>
							<span>{{ level == 1 ? '邀请数' : '上级' }}:&nbsp;</span>
							<span class="color-#FF8F28" v-if="level == 1">
								{{ moneyFormat(user.cnt) }}
							</span>
							<span
								class="superior color-primary single-ellipsis align-base"
								v-if="level == 2"
								v-user="user.superUserId"
							>
								{{ user.superNickname }}
							</span>
						</div>
					</div>
				</div>

				<div
					class="flex items-center justify-end font-size-14 color-#656565 line-height-19 w-88"
				>
					{{ user.bindDate }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import AvatarRound from '@/components/AvatarRound/index.vue'
	import { moneyFormat } from '@/modules/util.js'

	const props = defineProps({
		user: {
			type: Object,
			default: () => ({}),
		},
		level: {
			type: Number,
			default: 1,
		},
	})
</script>

<style lang="scss" scoped>
	.single-ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.line-height-22 {
		line-height: 1.375rem;
	}

	.line-height-19 {
		line-height: 1.1875rem;
	}

	.user-info {
		width: calc(100% - 5.5rem);
	}

	.user-name {
		padding: 0.359375rem 0;
		width: calc(100% - 3.75rem - 0.625rem);
	}

	.superior {
		display: inline-block;
		width: calc(100% - 2rem);
	}
</style>
