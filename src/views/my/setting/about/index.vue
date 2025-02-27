<template>
	<div class="mt-45 pt-20 pl-10 pr-10">
		<Header title="关于我们"></Header>
		<div class="bg-white about-content pl-10 pr-10">
			<div class="web-about">
				<p class="web-title">{{ getWebTitle() }}</p>
				<p class="web-version pt-5">
					版本：{{ version }}
					<span v-if="isCacheActive">.C</span>
				</p>
			</div>
			<div>
				<p class="pt-10 pb-10 about-text">
					<span class="mr-5">QQ:</span>
					{{ qq }}
				</p>
			</div>
			<div>
				<p class="pt-10 pb-10 about-text">
					<span class="mr-5">官网:</span>
					{{ url }}
				</p>
			</div>
		</div>
	</div>
</template>
<script setup>
	import Header from '@/components/NormalHeader/index.vue'
	import { getWebTitle } from '@/modules/util.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const url = _get(props.data, 'url')
	const qq = _get(props.data, 'qq')
	const version = import.meta.env.PUBLIC_VERSION
	const isCacheActive = import.meta.env.PUBLIC_REDIS_ENABLE
</script>
<style lang="scss">
	.web-about {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 2rem 0;
	}
	.web-title {
		font-size: 2.375rem;
		font-weight: bold;
		color: $primary-color;
	}
	.web-version {
		font-size: 0.75rem;
		color: #aeaeb1;
	}

	.about-content {
		border-radius: 10px;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
		div:not(:last-child) {
			border-bottom: 1px solid #f2f2f2;
		}
	}
	.about-text {
		font-size: 1rem;
		font-weight: normal;
		color: #434343;
	}
</style>
