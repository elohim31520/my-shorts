<template>
	<van-popup
		class="rounded-10 px-30 pt-20.135 pb-25 text-18 text-center"
		:close-on-click-overlay="false"
	>
		<p class="font-600 color-#434343 mb-39.5 text-18">
			{{ isReconnectLimitReached ? '重连次数已达上限' : '连线中' }}
		</p>
		<p
			v-if="isReconnectLimitReached"
			class="color-#656565 mb-51 text-18 relative"
		>
			请稍后再试，或检查网络设置
		</p>
		<p v-else class="color-#656565 mb-51 text-18 relative loading">
			房间连线中，请稍候
		</p>
		<van-button class="leave-button" @click="redirect('/')">
			返回首页
		</van-button>
	</van-popup>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { redirect } from '@/modules/util'
	import { useRoomData } from '../../useRoomData'
	import { useWebSocket } from '@/hooks/useChatWebSocket'

	const { roomData } = useRoomData()
	const { isReconnectLimitReached, currentReconnectCount } = useWebSocket()
</script>

<style lang="scss" scoped>
	$dot-states: '.', '..', '...', '....';
	$steps: length($dot-states);

	@keyframes dots {
		@for $i from 1 through $steps {
			#{calc(100% / $steps) * $i} {
				content: nth($dot-states, $i);
			}
		}
	}

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

	.loading::after {
		position: absolute;
		content: '';
		animation: dots 2s infinite steps($steps - 1, start);
	}
</style>
