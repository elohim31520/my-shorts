<template>
	<div
		class="fixed top-0 z-9 bg w-full flex items-center justify-center max-w-480px"
	>
		<div class="flex items-center justify-between w-full">
			<div
				class="flex items-center space-x-2 color-primary text-14 bg-white/70 py-3 px-5 relative invisible"
			>
				<svgIcon name="qrcode" size="1.25rem" />
				<span class="text-12 font-500 color-primary">邀請好友</span>
				<div class="bg-primary color-white text-10 font-600 prize">10%獎勵</div>
			</div>
			<div class="flex items-center space-x-2">
				<a href="/my/visitor" class="relative mr-10">
					<svgIcon size="1.8rem" name="observes" />
					<i
						v-if="showDot"
						class="bg-#FF3B3B w-5 h-5 inline-block absolute top-2px right-2px rounded-full"
					></i>
				</a>

				<a href="/my/setting" v-redirect.auth>
					<svgIcon size="1.8rem" name="icon_button_system" />
				</a>
			</div>
		</div>
	</div>
</template>

<script setup>
	import lscache from 'lscache'
	import { ref, onBeforeMount } from 'vue'
	import { checkVisited } from '@/api/user.js'

	const showDot = ref(false)

	onBeforeMount(async () => {
		const visitTime = lscache.get('visit-time')
		const time = _defaultTo(
			visitTime,
			946656000000 /*給一個很早的時間 2020-01-01 00:00:00*/
		)
		const res = await checkVisited(time)
		showDot.value = _get(res, 'data', false)
	})
</script>

<style lang="scss" scoped>
	.bg {
		width: 100%;
		height: 2.5rem;
		margin: 0;
		padding: 0.3125rem 0.9375rem;
		background-image: linear-gradient(to right, #fdf8e9 0%, #fbfdf9 100%);
	}
	.prize {
		width: 3.125rem;
		height: 1.15625rem;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 100%;
		top: 0;
		white-space: nowrap;
		border-radius: 1rem 1rem 1rem 0;
		transform: translateY(-20%);
	}
</style>
