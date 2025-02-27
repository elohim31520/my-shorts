<template>
	<div class="px-40 flex-center flex-col">
		<img class="w-173" src="/public-assets/images/no_content.png" alt="" />
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
