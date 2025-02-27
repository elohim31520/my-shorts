<template>
	<div>
		<InformationHeader />
		<div class="pt-45 pb-51 bg-#fafafa text-center h-100vh">
			<!-- 未登入時顯示 -->
			<!-- <Guest v-if="!isLogin()" /> -->
			<!-- 已登入但沒有任何關注時顯示 -->
			<Suggest v-model:hasFollow="hasFollow" v-if="!hasFollow" />
			<!-- 已登入且有關注時顯示 -->
			<Content v-else />
		</div>
		<Footer :active="1" />
	</div>
</template>

<script setup>
	import { ref, provide, onMounted } from 'vue'
	import InformationHeader from '@/components/InformationHeader/index.vue'
	import Suggest from './Suggest/index.vue'
	import Guest from './Guest/index.vue'
	import Content from './Content/index.vue'
	import Footer from '@/components/Footer/index.vue'
	// import { isLogin } from '@/modules/util'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	provide('data', props.data)

	const followFans = _get(props.data, 'followFans.data.list', [])
	const hasFollow = ref(!!followFans.length)
</script>
<style lang="scss" scoped></style>
