<template>
	<div class="w-full flex justify-between p-5 bg-#FAFAFA">
		<div class="w-49%">
			<div
				class="mb-8 shadow-primary rounded-7 overflow-hidden"
				v-for="(item, index) in galleryList1"
				:key="index"
			>
				<Drawing :data="item" :order="index" />
			</div>
		</div>
		<div class="w-49%">
			<div
				class="mb-8 shadow-primary rounded-7 overflow-hidden"
				v-for="(item, index) in galleryList2"
				:key="index"
			>
				<Drawing :data="item" :order="index" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'

	import Drawing from '@/components/Drawing/index.vue'

	const props = defineProps({
		list: {
			type: Array,
			default: () => [],
		},
	})

	const galleryList1 = computed(() =>
		_filter(props.list, (_, index) => index % 2 === 0)
	)

	const galleryList2 = computed(() =>
		_filter(props.list, (_, index) => index % 2 !== 0)
	)
</script>
