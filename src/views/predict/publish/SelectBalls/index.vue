<template>
	<div>
		<div class="p-10 bg-#fff mt-10 border-radius-10 shadow-primary">
			<van-checkbox-group v-model="selectedBalls" class="flex flex-wrap gap-10">
				<van-checkbox
					class="relative w-39 h-39"
					:name="item"
					v-for="item in options"
					:key="item"
				>
					<template #icon="props">
						<div>
							<SvgIcon size="2.4375rem" :name="ballColor(item)" />
							<span
								class="ball-list__number"
								:class="[item.length > 1 ? 'font-size-15' : 'font-size-20']"
							>
								{{ item }}
							</span>
							<span class="absolute bottom-0 right-0" v-if="isSelected(item)">
								<SvgIcon name="icon_choose_orange" />
							</span>
						</div>
					</template>
				</van-checkbox>
			</van-checkbox-group>
		</div>

		<div class="flex justify-end mt-10 clean">
			<button
				type="button"
				:class="[
					'font-size-14',
					selectedBalls.length > 0 ? 'color-#fc7e7e' : 'color-#e0e0e0',
				]"
				@click="selectedBalls = []"
			>
				清空
			</button>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue'

	const emit = defineEmits(['update:modelValue'])

	const props = defineProps({
		options: {
			type: Array,
			default: () => [],
		},
		limit: {
			type: Number,
			default: 0,
		},
		playType: {
			type: String,
			default: '',
		},
		playPosition: {
			type: String,
			default: '',
		},
		modelValue: {
			type: Array,
			default: () => [],
		},
	})

	const ballColor = (name) => {
		if (name === '红') return 'ball-red'
		else if (name === '蓝') return 'ball-blue'
		else return 'ball-green'
	}

	const selectedBalls = ref([])

	watch(
		() => selectedBalls.value,
		(val) => {
			if (val.length > props.limit) {
				selectedBalls.value.pop()
			}
			emit('update:modelValue', selectedBalls.value)
		}
	)

	const isSelected = (ball) => {
		return _includes(selectedBalls.value, ball)
	}

	const cleanBalls = () => (selectedBalls.value = [])

	watch(
		() => [props.playType, props.playPosition],
		() => {
			cleanBalls()
		}
	)

	defineExpose({
		cleanBalls,
	})
</script>

<style lang="scss" scoped>
	.border-radius-10 {
		border-radius: 0.625rem;
	}

	.clean {
		line-height: 1.1875rem;
	}

	.ball-list__number {
		color: white;
		position: absolute;
		top: 50%;
		left: 50%;
		font-weight: bold;
		transform: translate(-50%, -50%);
		white-space: nowrap;
	}

	:deep(.van-checkbox__icon) {
		height: 100%;
	}
</style>
