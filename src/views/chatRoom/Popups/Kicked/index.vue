<template>
	<van-popup
		class="rounded-10 px-30 pt-20.135 pb-25 text-18 text-center"
		:close-on-click-overlay="false"
	>
		<p class="font-600 color-#434343 mb-27.5 text-18">提示</p>
		<p class="color-#656565 text-18">您已被房主请出房间，</p>
		<p class="color-#656565 mb-39 text-18">请等待30分钟后在尝试进入房间</p>

		<van-button class="leave-button" @click="redirect('/')">确认</van-button>
	</van-popup>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { redirect } from '@/modules/util'
	import { useRoomData } from '../../useRoomData'

	const { roomData } = useRoomData()
</script>

<style lang="scss" scoped>
	.van-button {
		width: 16.875rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
		color: #fff;
		background-color: #fc7e7e;
	}
</style>
