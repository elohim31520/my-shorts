<template>
	<div class="bg-#FFFFFF rounded-10 p-10 shadow-primary">
		<h3 class="text-18 text-#434343 font-semibold mb-10">
			第{{ pictureData.issueDTO && pictureData.issueDTO.issue }}期{{
				pictureData.issueDTO && pictureData.issueDTO.newspaperName
			}}
		</h3>
		<div class="flex-y-center mb-10">
			<CdnImage
				round
				width="2rem"
				height="2rem"
				:path="pictureData.avatar"
				fit="cover"
				position="center"
				class="mr-5 flex-shrink-0"
				error-icon="/public-assets/images/svg/default_avatar_man.png"
				v-user="pictureData.postUserId"
			/>
			<div>
				<p
					class="color-#656565 font-bold lh-24.5"
					v-user="pictureData.postUserId"
				>
					{{ pictureData.nickname }}
				</p>
				<p class="text-12 text-#AEAEB1 lh-16.5">
					{{ formatTimestamp(pictureData.postTime, 'yyyy-MM-dd HH:mm') }}
				</p>
			</div>
		</div>
		<p
			class="text-#434343 lh-24 truncate-3-lines"
			v-html="pictureData.postContent"
			@click="goDetail(pictureData.issueDTO.issueId)"
		></p>
	</div>
</template>

<script setup>
	import { formatTimestamp } from '@/modules/date'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { useNavigation } from '@/hooks/useNavigation.js'
	import { redirect } from '@/modules/util.js'

	const { toRoute } = useNavigation()

	const props = defineProps({
		pictureData: {
			type: Object,
			default: {
				avatar: '',
				postUserId: '',
				nickname: '',
				postTime: '',
				postContent: '',
				issueDTO: {
					//頻論期刊內容資訊
					name: '',
					issueId: '',
					newspaperName: '',
				},
			},
		},
	})

	const { issueDTO, postIssue, issueId, postUserId, postTime, postId } =
		props.pictureData

	function goDetail(id) {
		if (!id) return

		const queryParams = new URLSearchParams({
			title: issueDTO.newspaperName,
			period: postIssue,
			issueId,
			postUserId,
			postTime,
			imageExplainId: postId,
			currentIndex: 0,
		}).toString()

		redirect(`pictureExplanation/detail?${queryParams}`)
	}
</script>

<style lang="scss" scoped></style>
