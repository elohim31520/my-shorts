<template>
	<div class="px-40 flex-center flex-col">
		<img
			class="inline-block mr-5 w-176"
			src="/public-assets/images/svg/icon_NotFound.png"
		/>
		<p class="mt-12 text-14 font-400 color-#AEAEB1">{{ text }}</p>
	</div>
</template>

<script setup>
	const props = defineProps({
		text: {
			type: String,
			default: '',
		},
	})
</script>

<style lang="scss" scoped></style>
