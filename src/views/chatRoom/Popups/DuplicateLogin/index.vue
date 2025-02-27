<template>
	<van-popup
		class="rounded-10 px-30 pt-20.135 pb-25 text-18 text-center"
		:close-on-click-overlay="false"
	>
		<p class="font-600 color-#434343 mb-39.5 text-18">重复登录</p>
		<p class="color-#656565 mb-51 text-18">帐号重复登录,已离开房间！</p>

		<van-button class="leave-button" @click="redirect('/')">
			返回首页
		</van-button>
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
