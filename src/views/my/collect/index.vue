<template>
	<div class="my-55">
		<NormalHeader title="喜欢和收藏" border-bottom-color="#F2F2F2" />
		<NoContent
			v-if="collectList.length == 0"
			text="暂无收到喜欢和收藏，多发创作可以收获更多~"
		/>
		<div v-if="collectList.length > 0" class="px-10">
			<van-list
				v-model:loading="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="onLoad"
			>
				<div
					class="mb-5"
					v-for="(item, index) in collectList"
					:key="index"
					:set="(imagePath = getFirstImage(item))"
				>
					<div
						class="shadow w-1/1 px-10 py-10 rounded-10 flex justify-between items-center gap-5"
					>
						<div class="w-81%">
							<div class="w-1/1 flex justify-between items-center gap-10">
								<div class="w-60 h-60 rounded-50% bg-skeleton">
									<CdnImage
										v-user="item.msgObj.userId"
										:path="item.msgObj.img"
										fit="cover"
										position="center"
										width="3.75rem"
										height="3.75rem"
										round
										error-icon="/public-assets/images/svg/default_avatar_man.png"
										:config="{ width: '3.75rem' }"
										:show-loading="false"
									/>
								</div>

								<div class="flex-1 my-8">
									<div class="flex justify-between items-center gap-5">
										<p
											v-user="item.msgObj.userId"
											class="color-#434343 font-600 text-18"
										>
											{{ item.msgObj.nickname }}
										</p>
										<div
											v-if="isMounted && item.msgObj.relationFlag != '0'"
											class="my-3 w-51 h-18 rounded-25 border border-#E0E0E0 flex-center"
										>
											<span class="text-10 font-400 color-#AEAEB1">
												你的粉丝
											</span>
										</div>
									</div>
									<div class="mt-5 color-#656565 text-12">
										<span>{{ item.title }}</span>
										<span class="ml-10">
											{{ getTimeDifference(item.msgTime) }}
										</span>
									</div>
								</div>
							</div>
						</div>

						<CdnImage
							v-if="imagePath"
							:path="imagePath"
							fit="cover"
							position="center"
							width="3.75rem"
							height="3.75rem"
							radius="0.375rem"
							@click="viewImage(item)"
							:config="{ width: '3.75rem' }"
						/>
					</div>
				</div>
			</van-list>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { ref, onMounted } from 'vue'
	import { getTimeDifference } from '@/modules/date.js'
	import { getFavoritesAndLikes } from '@/api/newsList'
	import { useUserStore } from '@/stores/user.js'
	import { getCdnUrl, isNotBlank } from '@/modules/util.js'
	import { getFollowBatch } from '@/api/daniu'
	import { previewImage } from '@/modules/imgCrypto.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const useStore = useUserStore()
	const { data: user } = useStore

	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const pageSize = ref(10)
	const isMounted = ref(false)

	const collectList = ref(_get(props.data, 'data.list', []))

	onMounted(async () => {
		collectList.value = await getUserRelation(collectList.value)
		isMounted.value = true
	})

	const onLoad = async () => {
		if (collectList.value.length < pageSize.value) {
			finished.value = true
			return false
		}

		loading.value = true
		page.value += 1

		const data = await getFavoritesAndLikes({
			userId: user.userId,
			page: page.value,
			size: pageSize.value,
		})
		let dataList = _get(data, 'data.list', [])
		dataList = await getUserRelation(dataList)

		collectList.value.push(...dataList)
		loading.value = false
		if (dataList.length < pageSize.value) {
			finished.value = true
		}
	}

	async function getUserRelation(list) {
		if (!list.length) return list
		const userIdList = list.map((item) => item.msgObj.userId)
		const relation = await getFollowBatch({
			targetUserIdList: userIdList,
			direct: '2',
		})
		const relationList = _get(relation, 'data', [])
		return list.map((item, index) => {
			return {
				...item,
				msgObj: {
					...item.msgObj,
					relationFlag: relationList[index].relationFlag,
				},
			}
		})
	}

	function getFirstImage(item) {
		const isPost = _get(item, 'msgObj.sourceType') == 'post'
		const attachments = _get(item, 'msgObj.attachments', [])
		const target = _find(attachments, (vo) =>
			isPost ? isNotBlank(vo.url) : isNotBlank(vo.attachmentUrl)
		)
		return isPost ? _get(target, 'url') : _get(target, 'attachmentUrl')
	}

	function viewImage(item) {
		const isPost = _get(item, 'msgObj.sourceType') == 'post'
		const attachments = _get(item, 'msgObj.attachments', [])
		const urlList = isPost
			? attachments
					.filter((vo) => isNotBlank(vo.url))
					.map((vo) => getCdnUrl(vo.url))
			: attachments
					.filter((vo) => isNotBlank(vo.attachmentUrl))
					.map((vo) => getCdnUrl(vo.attachmentUrl))
		previewImage({
			images: urlList,
			closeable: true,
		})
	}
</script>

<style lang="scss" scoped></style>
