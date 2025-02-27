<template>
	<div>
		<div v-if="hasTypeMenu" class="sticky z-10" :style="typeMenuStyle">
			<TypeMenu v-model:activeIndex="activeIndex" :hideTopic="hideTopic" />
		</div>
		<div
			v-show="showLotteryText && !targetIsVisible && isReady"
			class="fixed top-44 w-full max-w-480px bg-#FAFAFA z-5 text-#E0E0E0 text-12 font-400 h-25 flex-center"
		>
			{{ lotteryText }}
		</div>
		<div class="bg-#FAFAFA">
			<div class="px-10 pt-10">
				<ClientOnly>
					<List :filterType="activeIndex" />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, watch, onMounted } from 'vue'
	import TypeMenu from '@/components/TypeMenu/index.vue'
	import List from './List/index.vue'
	import ClientOnly from '@/components/ClientOnly/index.vue'

	import { storeToRefs } from 'pinia'
	import { useForumListStore } from '@/stores/forumList.js'
	import { getLotteryType } from '@/modules/util.js'

	const props = defineProps({
		typeStickyTop: {
			type: String || Number,
			default: 0,
		},
		hideTopic: {
			type: Boolean,
			default: false,
		},
		hasTypeMenu: {
			type: Boolean,
			default: true,
		},
		showLotteryText: {
			type: Boolean,
			default: true,
		},
	})
	const activeIndex = ref({
		topic: props.hideTopic ? '' : 'all',
		type: 'all',
	})

	const { targetIsVisible } = storeToRefs(useForumListStore())
	const isReady = ref(false)

	const lotteryText = computed(() => getLotteryType()?.name)

	onMounted(() => (isReady.value = true))

	watch(
		() => props.hasTypeMenu,
		(newVal) => {
			if (!newVal) {
				activeIndex.value = {}
			}
		},
		{ immediate: true }
	)

	const typeMenuStyle = computed(() => {
		const style = {}

		if (props.typeStickyTop) {
			style.top = `${props.typeStickyTop / 16}rem`
		}

		return style
	})
</script>
