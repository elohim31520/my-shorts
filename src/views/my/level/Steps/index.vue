!
<template>
	<div class="flex items-center">
		<div class="line w-20"></div>
		<div class="flex justify-between items-center flex-1">
			<div
				v-for="(level, index) in levels"
				:key="level"
				:class="[index < levels.length - 1 ? 'flex-1' : '']"
			>
				<div class="flex items-center">
					<div
						class="relative w-10 h-10 bg-#956C5A bd-1px-#C0B8B3 rounded-full"
						:class="[
							props.vipLevel === level ? 'act' : '',
							props.vipLevel < level ? 'lock' : '',
						]"
					>
						<div v-if="props.vipLevel < level">
							<SvgIcon name="icon_vip_lock" size="0.5625rem" />
						</div>
						<span
							class="text-#956C5A text-12 font-600 leading-none absolute -top-20 left-50% -translate-x-2/4"
						>
							vip{{ level }}
						</span>
					</div>
					<div v-if="index < levels.length - 1" class="flex-1 line"></div>
				</div>
			</div>
		</div>
		<div class="line w-20"></div>
	</div>
</template>

<script setup>
	import { ref } from 'vue'

	const props = defineProps({
		vipLevel: {
			type: [Number, String],
			default: 0,
		},
		maxLevel: {
			type: [Number, String],
			default: 9,
		},
	})

	const levels = ref(Array.from({ length: props.maxLevel }, (_, i) => i + 1)) //vip最高等級
</script>

<style lang="scss" scoped>
	.line {
		border-top: 1px solid #c0b8b3;
		border-bottom: 1px solid #c0b8b3;
	}
	.act {
		width: 0.9375rem;
		height: 0.9375rem;
		border: 2px solid #956c5a;
		background: linear-gradient(
			180deg,
			#fffaee 0%,
			#f9d587 60.2%,
			#fde3aa 78.37%
		);
	}
	.lock {
		width: 0.9375rem;
		height: 0.9375rem;
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		span {
			color: #c0b8b3;
		}
	}
</style>
