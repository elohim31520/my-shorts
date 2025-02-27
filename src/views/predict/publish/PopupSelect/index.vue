<template>
	<div>
		<div class="flex justify-between items-center">
			<div class="flex justify-start font-size-18 font-600 color-#434343">
				<p class="mr-10">{{ title }}:</p>
				<p class="color-primary mr-5">{{ predictionTypeName }}</p>

				<van-button
					type="button"
					:class="{ active: isActive }"
					@click="show = true"
				>
					<SvgIcon name="arrow_left" size="1.53125rem" class="color-primary" />
				</van-button>
			</div>

			<div class="font-size-14 color-#aeaeb1" v-if="isCount">
				已选择
				<span class="color-primary">{{ selectedLength }}/{{ maxCount }}</span>
			</div>
		</div>

		<div class="popup-wrapper">
			<van-action-sheet v-model:show="show" @select="onSelect" :title="title">
				<div class="content">
					<div class="row-items" v-for="(vo, index) in allItems" :key="index">
						<ul>
							<PlayTypeCodeBall
								v-for="(voo, ii) in vo"
								:key="ii"
								:class="[
									{ active: voo.predictionTypeName == predictionTypeName },
									{ unused: voo.predictionTypeName === '' },
								]"
								@click="doClick(voo)"
								:predictionTypeName="voo.predictionTypeName"
								:layer="title == '位置' ? 2 : 1"
							/>
						</ul>
					</div>
				</div>
			</van-action-sheet>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, watch } from 'vue'
	import PlayTypeCodeBall from '@/components/PlayTypeCodeBall/index.vue'

	const props = defineProps({
		title: {
			type: String,
			default: '',
		},
		options: {
			type: Array,
			default: () => [],
		},
		value: {
			type: String,
			default: '',
		},
		isCount: {
			type: Boolean,
			default: true,
		},
		isPrimary: {
			type: Boolean,
			default: false,
		},
		maxCount: {
			type: Number,
			default: 1,
		},
		selectedLength: {
			type: Number,
			default: 0,
		},
	})

	const emit = defineEmits(['changeValue'])

	const predictionTypeName = ref(_get(props, 'value', ''))
	const isActive = ref(false)
	const show = ref(false)

	const onSelect = () => (show.value = false)

	const doClick = (vo) => {
		predictionTypeName.value = vo.predictionTypeName
		let maxCount = 1
		if (props.isPrimary) {
			maxCount = vo.maxCount
		} else {
			const list = _find(
				props.options,
				(item) => item.predictionTypeName === vo.predictionTypeName
			)
			maxCount = list.maxCount
		}

		emit('changeValue', {
			predictionTypeName: vo.predictionTypeName,
			maxCount,
		})
		show.value = false
	}

	const lists = computed(() => {
		let list = _get(props, 'options', [])
		const remainder = list.length % 5

		if (!(remainder % 5)) return list

		for (let i = 0; i < 5 - remainder; i++) {
			list.push({ predictionTypeName: '' })
		}
		return list
	})

	const allItems = computed(() => {
		return _chunk(lists.value, 5)
	})

	watch(
		() => props.value,
		(val) => {
			predictionTypeName.value = val
			// if (!props.isPrimary) predictionTypeName.value = val
		}
	)
</script>

<style lang="scss" scoped>
	p {
		line-height: 1.36111rem;
	}

	.van-button {
		padding: 0;
		height: 1.53125rem;
		transform: rotate(270deg);
		transition: transform 0.3s;

		&.active {
			transform: rotate(90deg);
		}
	}

	.popup-wrapper {
		ul {
			display: flex;
			justify-content: space-between;
		}

		:deep(.van-action-sheet__content) {
			.content {
				padding: 1.25rem 1.40625rem 2.21875rem;
				.row-items {
					margin-bottom: 0.375rem;
					height: 3.125rem;
					ul {
						height: 100%;
					}
				}
			}
		}

		:deep(.van-action-sheet__header) {
			height: 2.5rem;
			font-size: 1.25rem;
		}
	}
</style>
