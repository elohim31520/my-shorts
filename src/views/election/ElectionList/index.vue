<template>
	<div class="bg-#ffffff w-full rounded-10 p-10 overflow-hidden outer-shadow">
		<div
			class="flex items-center w-full justify-between"
			@click="directToDetail(electionData)"
		>
			<div>
				<div class="color-#434343 text-18 font-700 truncate-1-lines">
					{{ electionData.campaignName }}
				</div>
				<div>
					<span
						class="bg-#34C759 color-#fff font-600 text-12 rounded-15 px-8 py-4 mr-5"
					>
						{{ electionData.predictionTypeName }}竞选
					</span>
					<span class="color-#656565 text-14">
						({{ electionData.startIssue }}期 - {{ electionData.endIssue }}期)
					</span>
				</div>
			</div>
			<div
				class="text-12 font-600"
				:class="{
					'event-processing': electionData.isInProgress === 'y',
					'event-waiting': electionData.isInProgress === 'n',
					'event-end': electionData.isInProgress === 'e',
				}"
			>
				{{ statusText }}
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed, toRefs } from 'vue'
	import { redirect } from '@/modules/util'

	const props = defineProps({
		electionData: {
			type: Object,
			default: () => [],
		},
	})
	const { electionData } = toRefs(props)

	function directToDetail({ campaignId, isInProgress }) {
		redirect(`/election/detail/${campaignId}?status=${isInProgress}`)
	}

	const statusText = computed(() => {
		switch (electionData.value.isInProgress) {
			case 'y':
				return '进行中'
			case 'n':
				return '待开始'
			case 'e':
				return '已结束'
			default:
				return '---'
		}
	})
</script>

<style lang="scss" scoped>
	.outer-shadow {
		box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.1);
		border-radius: 0.75rem;
	}
	.event-processing {
		color: #ff8f28;
	}
	.event-waiting {
		color: #34c759;
	}
	.event-end {
		color: #aeaeb1;
	}
</style>
