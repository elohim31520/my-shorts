<template>
	<component :is="asyncComponent" v-bind="options" />
</template>

<script setup>
	/**
	 *  example:
	 *
	 *  import EmojiPicker from '@/components/EmojiPicker/index.vue'
	 *
	 *  <EmojiPicker v-show="showEmojiPicker" @select="handleSelectEmoji" />
	 *
	 *  function handleSelectEmoji(emoji) {
	 *      text.value += emoji.i
	 *  }
	 *
	 */
	import { shallowRef, onMounted } from 'vue'
	import 'vue3-emoji-picker/css'

	const props = defineProps({
		show: {
			type: Boolean,
			default: true,
		},
	})

	const options = {
		native: true,
		hideSearch: true,
		hideGroupNames: true,
	}

	const asyncComponent = shallowRef(null)
	const loadComponent = async () => {
		// 不可在SSR環境引入
		const EmojiPicker = await import('vue3-emoji-picker')
		asyncComponent.value = EmojiPicker.default
	}

	onMounted(() => {
		loadComponent()
	})
</script>

<style lang="scss" scoped>
	.v3-emoji-picker {
		box-shadow: none;
		border-radius: 0;
	}

	:deep() {
		.v3-footer {
			display: none;
		}

		.v3-group {
			flex-grow: 1 !important;
		}
	}
</style>
