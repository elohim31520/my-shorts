<template>
	<div>
		<p class="mb-10 color-#656565 font-600 lh-20 pt-36.5">尚未登录</p>
		<p class="color-#aeaeb1 text-14 font-500 lh-18 mb-150">
			请先登录才能关注更多内容
		</p>
		<LoginBlock class="mx-auto w-fit" />
	</div>
</template>

<script setup>
	import LoginBlock from '@/components/LoginBlock/index.vue'
</script>
<style lang="scss" scoped></style>
