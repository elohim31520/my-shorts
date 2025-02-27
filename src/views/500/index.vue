<template>
	<div>
		<Header title="发生错误" />
		<ClientOnly>
			<van-empty image="error" :description="text" class="mt-45" />
			<div class="px-16 text-14 color-#969799 mb-16">
				<p class="mb-4">错误原因：</p>
				<p>{{ message }}</p>
			</div>
		</ClientOnly>

		<div class="flex-center">
			<van-space>
				<van-button type="default" size="small" @click="goHome">
					返回首页
				</van-button>
				<van-button
					size="small"
					plain
					type="success"
					@click="reload"
					class="min-w-64"
				>
					重试
				</van-button>
			</van-space>
		</div>
	</div>
</template>
<script setup>
	import Header from '@/components/NormalHeader/index.vue'
	import ClientOnly from '@/components/ClientOnly/index.vue'
	import { ref, onMounted } from 'vue'
	import { redirect } from '@/modules/util.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	const message = _get(props.data, 'message')
	const text = ref('')

	onMounted(() => {
		text.value = `很抱歉，您访问的页面发生错误：${window.location.pathname}`
	})

	function reload() {
		window.location.reload()
	}

	function goHome() {
		redirect('/', { skip: true })
	}
</script>
