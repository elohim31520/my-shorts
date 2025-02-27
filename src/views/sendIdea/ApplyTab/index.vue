<template>
	<div>
		<div class="h-40 px-10 flex items-center gap-10">
			<div
				class="add-previous-options"
				v-for="vo in previousTabs"
				:key="vo.id"
				:class="{ active: vo.id === activeTabs }"
				@click="handleClick(vo)"
			>
				{{ vo.tab }}
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue'

	const emit = defineEmits(['update:modelValue', 'onChange'])

	const props = defineProps({
		modelValue: {
			type: String,
			default: '',
		},
	})

	const previousTabs = [
		{ id: 'all', tab: '加载上期内容' },
		{ id: 'title', tab: '加载上期标题' },
		{ id: 'content', tab: '加载上期正文' },
	]

	const activeTabs = ref('')

	const handleClick = async (val) => {
		activeTabs.value = val.id

		emit('update:modelValue', val.id)
		emit('onChange')
	}

	watch(
		() => props.modelValue,
		(val) => {
			activeTabs.value = val
		}
	)
</script>

<style lang="scss" scoped>
	.add-previous-options {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 1.875rem;
		border: 1px solid #e0e0e0;
		border-radius: 0.625rem;
		color: #656565;
		font-weight: 500;

		&.active {
			border-color: #34c759;
			background-color: #34c759;
			color: #fff;
			font-weight: 600;
		}
	}
</style>
