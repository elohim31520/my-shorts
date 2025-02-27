<template>
	<div class="bg-#fafafa">
		<NormalHeader title="开奖回放" class="z-11" />

		<div v-if="detail" class="mt-50">
			<div class="text-center py-5" v-html="safeHtml(detail.title)"></div>
			<van-sticky :offset-top="45">
				<div v-show="ready" id="player-wrap" class="w-ful"></div>
				<div
					v-if="!ready"
					class="w-full bg-black h-[calc(100vw*9/16)] pc:h-270px"
				></div>
				<BallList :openCode="openCode" />
			</van-sticky>
		</div>

		<div class="flex-y-center w-full bg-#fafafa sticky z-10 top-45 pb-5 mt-7.5">
			<div
				class="text-18 lh-24.515 mx-10 mt-7.5"
				:class="[
					view == 1 ? 'font-600 color-#434343' : 'font-400 color-#AEAEB1',
				]"
				@click="view = 1"
			>
				网址大全
			</div>
			<div
				class="text-18 lh-24.515 mx-10 mt-7.5"
				:class="[
					view == 2 ? 'font-600 color-#434343' : 'font-400 color-#AEAEB1',
				]"
				@click="view = 2"
			>
				高手论坛
			</div>
		</div>

		<WebList v-if="view == 1" />
		<ForumPostList :hasTypeMenu="false" v-else :showLotteryText="false" />
	</div>
</template>

<script setup>
	import { computed, provide, onMounted, ref } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import BallList from '@/views/live/BallList/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import WebList from '@/views/website/WebList/index.vue'
	import { useLotteryWebSocket } from '@/hooks/useLotteryWebSocket'
	import { usePlayer } from '@/hooks/usePlayer.js'
	import ForumPostList from '@/components/ForumPostList/index.vue'
	import safeHtml from '@/modules/safeHtml.js'

	const { transformOpenCode } = useLotteryWebSocket()

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)

	const view = ref(1)
	const ready = ref(false)
	onMounted(() => {
		const { getPlayer, Events } = usePlayer()
		const player = getPlayer({ id: 'player-wrap', url: detail.value.videoUrl })
		player.on(Events.LOADED_DATA, () => {
			ready.value = true
		})
	})

	const detail = computed(() => {
		return _get(props.data, 'videoDetail.data', {})
	})

	const openCode = computed(() => {
		const list = _get(detail.value, 'numberList', [])
		return transformOpenCode(list)
	})
</script>

<style lang="scss" scoped>
	video {
		width: 100%;
		object-fit: fill;
	}
</style>
