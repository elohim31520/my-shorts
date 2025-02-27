<template>
	<CdnImage
		:path="user.avatar"
		round
		fit="cover"
		position="center"
		error-icon="/public-assets/images/svg/default_avatar_man.png"
		@click="handleShowUserProfile"
		:config="{ width: '3.125rem' }"
	/>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { useDisplayStates } from '../useDisplayStates'
	import { useRoomData } from '../useRoomData'

	const props = defineProps({
		user: {
			type: Object,
			default: () => ({}),
		},
	})

	const { showUserProfile } = useDisplayStates()
	const { roomData, selectedUser } = useRoomData()

	const handleShowUserProfile = () => {
		// TODO 暫無判別遊客的字段
		if (!props.user.nickname) return
		showUserProfile.value = true
		selectedUser.value = props.user
	}
</script>

<style lang="scss" scoped></style>
