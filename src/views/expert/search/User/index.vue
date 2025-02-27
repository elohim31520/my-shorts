<template>
	<div class="bg-white rounded-10 flex p-10 items-center">
		<div class="w-60 h-60 rounded-full overflow-hidden shrink-0 bg-skeleton">
			<CdnImage
				:path="user.avatar"
				error-icon="/public-assets/images/svg/default_avatar_man.png"
				width="100%"
				height="100%"
				fit="cover"
				:show-loading="false"
				:config="{ width: '3.75rem' }"
				lazy-load
				rootMargin="0px 0px 200px 0px"
			/>
		</div>
		<div class="ml-10 flex-1">
			<div class="flex items-center">
				<span
					class="color-#434343 font-600 text-18 mr-4 truncate-1-lines break-all"
				>
					{{ user.nickname }}
				</span>
				<LevelTag
					:level="user.vipLevel"
					class="inline-block"
					v-if="user.vipLevel > 0"
				/>
			</div>
			<p class="color-#656565 font-400 text-14">粉丝{{ user.fans }}</p>
		</div>
		<div
			class="color-#34c759 bd-#34c759 rounded-15 w-60 h-25 lh-25 text-14 text-center font-400 bg-gradient-to-r from-#fffeee to-#efffe5 shrink-0"
			v-redirect="`/expert/user/${user.userId}`"
		>
			查看
		</div>
	</div>
</template>

<script setup>
	import CdnImage from '@/components/CdnImage/index.vue'
	import LevelTag from '@/components/LevelTag/index.vue'

	const props = defineProps({
		user: {
			type: Object,
			default: () => ({
				userId: null,
				avatar: null,
				nickname: null,
				vipLevel: 0,
				fans: 0,
			}),
		},
	})
</script>

<style></style>
