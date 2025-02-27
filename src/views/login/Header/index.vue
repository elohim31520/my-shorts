<template>
	<header class="position-fixed top-0 w-full z-10 max-w-480px">
		<div class="flex flex-center position-relative h-45">
			<SvgIcon
				name="arrow_left"
				size="1.875rem"
				class="position-absolute left-10 top-50% transform translate-y--1/2"
				@click="goBack"
			/>
			<span class="text-20">手机登录</span>
		</div>
	</header>
</template>
<script setup>
	function goBack() {
		window.history.back()
	}
</script>
