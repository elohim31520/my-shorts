<template>
	<van-popup v-model:show="show" class="error-main" closeable>
		<van-empty image="network" description="服务发生错误" class="max-w-420px">
			<ul class="flex flex-col text-14 color-#969799">
				<li v-for="(vo, index) in errors" :key="index" class="p-4">
					<span>[{{ vo.errno }}]</span>
					<span>[{{ vo.code }}]:</span>
					<span>{{ vo.syscall }}</span>
					<div>{{ vo.baseURL }}{{ vo.pathname }}</div>
				</li>
			</ul>

			<div class="flex flex-center mt-8">
				<van-space>
					<van-button type="default" size="small" @click="reload">
						点击重试
					</van-button>
				</van-space>
			</div>
		</van-empty>
	</van-popup>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	const show = ref(false)
	const errors = ref([])

	onMounted(() => {
		if (window.ERRORS && window.ERRORS.length > 0) {
			show.value = true
			errors.value = window.ERRORS
		}
	})

	function reload() {
		window.location.reload()
	}
</script>

<style lang="scss" scoped>
	.error-main {
		border-radius: 0.5rem;
		--van-empty-image-size: 3rem;
		.van-empty {
			width: 90dvw;
		}
		li {
			border-bottom: 1px solid #ccc;
			margin-bottom: 0.5rem;
		}
	}
</style>
