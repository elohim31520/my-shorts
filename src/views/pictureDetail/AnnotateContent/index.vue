<template>
	<div class="shadow-primary rounded-7 color-[#434343] bg-#fff">
		<div v-if="description">
			<div class="py-10 px-12.5 lh-20 w-full relative color-#656565">
				<van-text-ellipsis :content="description" :rows="4">
					<template #action="{ expanded }">
						<span class="w-100% color-primary flex justify-end">
							<span v-if="expanded">
								收起
								<van-icon name="arrow-up" />
							</span>
							<span v-else>
								展开
								<van-icon name="arrow-down" />
							</span>
						</span>
					</template>
				</van-text-ellipsis>
			</div>
		</div>
		<div v-else>
			<div
				class="py-10 px-12.5 lh-20 w-full relative color-#656565 flex-y-center justify-center"
			>
				<div class="text-14 lh-19.07 color-#AEAEB1">暂无图解</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { watch } from 'vue'
	import { storeToRefs } from 'pinia'
	import { toast } from '@/modules/util'
	import { usePictureDetailStore } from '@/stores/pictureDetail'

	const { showStory } = storeToRefs(usePictureDetailStore())

	const props = defineProps({
		description: {
			type: String,
			default: '',
		},
	})

	watch(
		() => showStory.value,
		(newVal) => {
			// 按footer的圖解又沒圖解時，跳toast
			if (newVal && !props.description) {
				toast('暂无图解')
				showStory.value = false
			}
		}
	)
</script>

<style></style>
