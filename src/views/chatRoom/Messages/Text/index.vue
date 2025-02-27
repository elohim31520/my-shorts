<template>
	<div>
		<!-- 其他用戶發的信息 -->
		<div v-if="!userInfo.isSelf" class="flex">
			<Avatar class="w-35 h-35 mr-10 shrink-0" :user="userInfo" />
			<div>
				<div class="flex-y-center">
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
				<p
					class="color-#434343 w-fit lh-19 max-w-283 break-words text-14 mt-10 p-10 bg-#fff rounded-10 rounded-ss-none"
				>
					{{ content }}
				</p>
			</div>
		</div>

		<!-- 自己發的信息 -->
		<div v-else class="flex flex-row-reverse">
			<Avatar class="w-35 h-35 ml-10" :user="userInfo" />
			<!-- 聊天內容 -->
			<p
				class="color-#434343 w-fit lh-19 max-w-283 break-words whitespace-pre-wrap text-14 mt-10 p-10 bg-#B1FF95 rounded-10 rounded-se-none"
			>
				{{ content }}
			</p>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import { getOrDefault } from '@/modules/util'
	import CdnImage from '@/components/CdnImage/index.vue'
	import Avatar from '../../Avatar/index.vue'
	import { useRoomData } from '../../useRoomData'

	const props = defineProps({
		message: {
			type: Object,
			default: () => ({}),
		},
	})

	const { roomData } = useRoomData()

	const userInfo = computed(() => {
		const userId = getOrDefault(props.message, 'data.userId', '')

		return roomData.members[userId]
	})
	const content = computed(() =>
		getOrDefault(props.message, 'data.content', '')
	)
</script>

<style lang="scss" scoped></style>
