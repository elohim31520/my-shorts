<template>
	<div class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full-limited pt-65">
		<NormalHeader
			title="聊天室资料"
			:onBack="
				() => {
					showInfo = false
				}
			"
		></NormalHeader>

		<FourQuadrantAvatar
			class="h-100 w-100 mx-auto mb-30"
			:images="userAvatars"
		/>

		<div class="px-20">
			<p class="color-#AEAEB1 mb-10">聊天室名称:</p>
			<p class="color-#434343 mb-30">{{ roomData.title }}</p>
			<p class="color-#AEAEB1 mb-10">聊天室简介:</p>
			<p class="color-#434343 break-all">
				{{ roomData.note }}
			</p>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import FourQuadrantAvatar from '@/components/FourQuadrantAvatar/index.vue'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const { roomData } = useRoomData()
	const { showInfo } = useDisplayStates()

	const userAvatars = computed(() => {
		// 只取前四個
		return _slice(_map(_values(roomData.earliestOnlineUsers), 'avatar'), 0, 4)
	})
</script>

<style lang="scss" scoped></style>
