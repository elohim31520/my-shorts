<template>
	<div>
		<NormalHeader title="我的勋章" />
		<div class="pt-45 px-10 pb-10">
			<div class="card shadow" v-for="(item, index) in medalList" :key="index">
				<div class="font-bold text-18 pt-20 pl-20">{{ item.type }}</div>
				<div class="flex flex-wrap mt-20">
					<div
						v-for="detail in item.list"
						:key="detail.name"
						class="w-33.33% flex-center flex-col"
					>
						<div class="w-60 h-60">
							<SvgIcon size="3.75rem" :name="detail.icon" />
						</div>
						<div class="mt-5 h-30 mb-10 text-12 text-#656565 font-bold">
							{{ detail.name }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { ref } from 'vue'
	const props = defineProps({
		data: {
			type: Array,
			default: () => [],
		},
	})
	const medalList = ref(props.data)
</script>

<style scoped>
	.card {
		background-color: white;
		border-radius: 20px;
		margin-top: 0.625rem;
	}
	.shadow {
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	}
</style>
