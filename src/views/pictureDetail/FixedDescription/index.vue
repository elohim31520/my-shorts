<template>
	<!-- 絕對定位的圖解 -->
	<Transition>
		<div
			class="fixed top-45 left-50% -translate-x-50% z-10 bg-white max-w-480px w-full p-10 bt-#E7E7E7 rounded-b-10 shadow-primary"
		>
			<p class="color-#434343 text-14">
				<span class="font-600">图解：</span>
				{{ description }}
			</p>
		</div>
	</Transition>
</template>

<script setup>
	const props = defineProps({
		description: {
			type: String,
			default: '',
		},
	})
</script>

<style lang="scss" scoped>
	.v-enter-active,
	.v-leave-active {
		transition: opacity 0.3s ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}

	.slide-fade-enter-active {
		transition: all 0.3s ease-out;
	}

	.slide-fade-leave-active {
		transition: all 0.3s ease-out;
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateY(100%);
		opacity: 0;
	}
</style>
