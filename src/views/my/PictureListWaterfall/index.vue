<template>
	<div
		class="pt-5 bg-#fafafa"
		:class="{ 'bg-#fafafa': !isEmptyData, 'min-h-55dvh': !isLogin() }"
	>
		<WithDelay v-if="isEmptyData">
			<NoContent :text="noContentText" />
			<button
				class="text-14 color-#434343 border border-#AEAEB1 rounded-25px px-12 py-4 m-[3rem_auto_0] block"
				@click="redirect('/follow')"
			>
				查看更多
			</button>
		</WithDelay>
		<Waterfall
			ref="waterfallRef"
			v-show="!isEmptyData"
			:apiFunction="apiFunction"
			:apiParams="apiParams"
		/>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import Waterfall from '@/components/Waterfall/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import WithDelay from '@/components/WithDelay/index.vue'
	import { isLogin, redirect } from '@/modules/util'

	const props = defineProps({
		apiFunction: {
			type: Function,
		},
		apiParams: {
			type: Object,
		},
		view: {
			type: String,
		},
	})

	const emit = defineEmits(['update:total'])

	const waterfallRef = ref(null)
	const isEmptyData = computed(() =>
		_get(waterfallRef.value, 'isEmptyData', false)
	)
	const noContentText = computed(() => {
		const messages = {
			follow: '关注',
			collect: '收藏',
			tempView: '最近浏览',
			write: '发布',
			like: '喜欢',
		}
		return `目前没有${messages[props.view]}的想法,查看更多找灵感！`
	})
</script>
