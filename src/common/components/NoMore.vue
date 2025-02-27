<template>
	<div class="NoMore">
		<slot v-if="$slots.default"></slot>
		<span v-else>暂时没有更多了</span>
	</div>
</template>
<script>
	export default {
		name: 'NoMore',
	}
</script>

<style scoped lang="scss">
	@import url('@/styles/shorts.scss');

	.NoMore {
		font-size: 13px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--second-text-color);
	}
</style>
