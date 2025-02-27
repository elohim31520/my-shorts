<template>
	<div
		class="bg-#fafafa min-h-100dvh absolute top-0 z-30 w-full-limited flex flex-col"
	>
		<div
			v-if="loading"
			class="absolute! top-1/2 left-1/2 -z-1 -translate-1/2 flex-center flex-col"
		>
			<van-loading size="24px" class="mb-20">加载中...</van-loading>
			<div
				class="bg-#34C759 rounded-8 color-#fff px-20 py-10"
				@click="showDetail = false"
			>
				返回房间
			</div>
		</div>

		<iframe
			:src="iframeUrl"
			frameborder="0"
			class="w-full flex-1"
			:class="{ 'pointer-events-none': loading }"
			@load="loading = false"
		></iframe>

		<div
			v-show="!loading"
			class="absolute w-50 h-45 flex-center cursor-pointer"
			@click="showDetail = false"
		>
			<SvgIcon name="arrow_left" size="1.875rem" class="color-#434343" />
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import { useRoomData } from '../../useRoomData'
	import { useDisplayStates } from '../../useDisplayStates'

	const loading = ref(true)

	const { roomData, iframeUrl } = useRoomData()
	const { showDetail } = useDisplayStates()
</script>

<style lang="scss" scoped></style>
