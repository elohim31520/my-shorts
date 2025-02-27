<template>
	<div>
		<NormalHeader title="客服" />
		<div class="cs">
			<van-image
				fit="cover"
				src="/public-assets/images/cs/bg_customerService.png"
			/>
			<div class="title flex justify-center">24小时在线服务</div>
			<div class="w-full flex justify-center">
				<van-button
					@click="goTo"
					type="success"
					color="#34c759"
					class="btn btn-contact"
				>
					联络客服
				</van-button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { safeOpen, isLogin } from '@/modules/util.js'
	import { getConfig } from '@/api/common.js'
	import { useLoginPopupStore } from '@/stores/loginPopup.js'
	import { onBeforeMount } from 'vue'

	let csUrl = null

	onBeforeMount(async () => {
		const config = await getConfig()
		csUrl = _get(config, 'data.onlineServiceCode')
	})

	async function goTo() {
		//反饋要先登入
		const isFeedback = window.location.pathname == '/feedback'
		if (isFeedback && !isLogin()) {
			useLoginPopupStore().toggle()
			return
		}
		safeOpen(csUrl)
	}
</script>

<style lang="scss" scoped>
	.cs {
		margin-top: 2.8125rem;
		background-color: #fafafa;
		min-height: calc(100dvh - 2.8125rem);
		.title {
			font-size: 1.25rem;
			font-weight: 500;
		}
		.btn {
			margin-top: 2rem;
			--van-button-radius: 0.25rem;
			height: 100%;
			width: 6.875rem;
			font-size: 1rem;
			height: 100%;
			white-space: nowrap;
		}
		.btn-contact {
			width: 80%;
			height: 2.5rem;
			font-size: 1.125rem;
			border-radius: 0.5rem;
		}
		:deep(.van-image) {
			padding: 0.5rem 1.9375rem 0 1.9375rem;
		}
	}
</style>
