<template>
	<div>
		<div v-if="!isFans" class="px-10 py-5">
			<SearchBar
				v-if="hasSearchBar"
				v-model="searchQuery"
				placeholder="搜索已关注的人"
			/>
		</div>
		<div v-if="isLogin()" class="px-10 pb-5 flex flex-row">
			<p class="color-#656565 text-14">仅显示专家</p>
			<van-checkbox
				v-model="onlyExpert"
				shape="square"
				icon-size="0.9375rem"
				class="expert ml-5"
			></van-checkbox>
		</div>
		<NoContent v-if="handleList.length == 0" text="暂无数据" />
		<van-list
			v-if="handleList.length > 0"
			v-model:loading="loading"
			:finished="finished"
			:finished-text="finishedText"
			@load="onLoad"
		>
			<div class="px-10">
				<div class="mb-5" v-for="item in handleList" :key="item.targetUserId">
					<div
						class="shadow-primary w-1/1 px-10 py-10 rounded-10 flex justify-between items-center gap-10"
					>
						<div class="w-79%">
							<div class="w-1/1 flex justify-between items-center gap-10">
								<div class="w-60 h-60 rounded-50% bg-skeleton">
									<CdnImage
										v-user="item.targetUserId"
										:path="item.targetUserAvatar"
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

								<div class="w-73% my-4">
									<div class="flex justify-start items-center gap-5">
										<p
											v-user="item.targetUserId"
											class="max-w-75% color-#434343 font-600 text-18"
										>
											{{ item.targetUserNickname }}
										</p>
										<LevelTag :level="item.targetUserVipLevel" />
									</div>
									<div class="mt-5 color-#656565 truncate">
										<span>{{ item.targetUserMemo }}</span>
										<span class="ml-10">
											{{ getTimeDifference(item.fanTime) }}
										</span>
									</div>
								</div>
							</div>
						</div>

						<FollowButton
							v-if="!isFans && isSelf && isMounted"
							:isFollowing="item.relationFlag != '0'"
							@toggleFollow="toggleFollow(item)"
						/>

						<FollowButton
							v-else-if="isFans && isSelf && isMounted"
							:isRelation="true"
							:isFollowing="item.relationFlag == '2'"
							@toggleFollow="toggleRelation(item)"
						/>

						<FollowButton
							v-else-if="
								!isSelf && item.targetUserId != userData.userId && isMounted
							"
							:isFollowing="item.relationFlag != '0'"
							@toggleFollow="toggleFollowNotSelf(item)"
						/>
					</div>
				</div>
			</div>
		</van-list>
		<div
			v-if="!isLogin() && !isSelf && handleList.length >= 3"
			class="px-100 -mt-80 pt-120 relative h-100 bg-gradient-to-t from-white to-white/10 pointer-events-none"
		>
			<button
				class="color-#434343 bg-#fff rounded-10 text-20 py-8 w-100% flex-center"
				style="pointer-events: fill"
				@click="doLogin"
			>
				<span>查看更多</span>
				<svgIcon class="inline-block" name="read_more_arrow" size="1.875rem" />
			</button>
		</div>
	</div>
</template>

<script setup>
	import SearchBar from '@/components/SearchBar/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import FollowButton from '@/components/FollowButton/index.vue'
	import LevelTag from '@/components/LevelTag/index.vue'
	import { getTimeDifference } from '@/modules/date.js'
	import {
		getFollowFans,
		addFollow,
		delFollow,
		getSomeoneFollow,
		getFollowBatch,
	} from '@/api/daniu'
	import { ref, inject, computed, watch, onMounted } from 'vue'
	import { isLogin, toast } from '@/modules/util'
	import { useLoginPopupStore } from '@/stores/loginPopup.js'
	import { useUserStore } from '@/stores/user.js'

	const props = defineProps({
		isFans: {
			type: Boolean,
			default: false,
		},
		hasSearchBar: {
			type: Boolean,
			default: true,
		},
	})

	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const pageSize = ref(10)
	const searchQuery = ref('')
	const isMounted = ref(false)
	const onlyExpert = ref(false)

	const contentList = ref(
		_get(
			inject('data'),
			'data.list',
			_get(inject('data'), 'followList.data.list', [])
		)
	)
	const someoneUserId = inject('someoneUserId', '')
	const isSelf = inject('isSelf')
	const handleList = computed(() => {
		if (!isLogin() && !isSelf) return contentList.value.slice(0, 3)
		if (!props.isFans) {
			return contentList.value.filter((item) =>
				_includes(
					_toLower(item.targetUserNickname),
					_toLower(searchQuery.value)
				)
			)
		} else {
			return contentList.value
		}
	})

	const finishedText = computed(() => {
		if (!isLogin() && !isSelf && handleList.value.length >= 3) {
			return ''
		} else {
			return '没有更多了'
		}
	})

	onMounted(async () => {
		contentList.value = await checkFollow(contentList.value)
		isMounted.value = true
	})

	const onLoad = async () => {
		if (contentList.value.length < pageSize.value) {
			finished.value = true
			return false
		}
		loading.value = true
		page.value += 1
		await getContent()
		loading.value = false
	}

	async function getContent() {
		let apiName = isSelf ? getFollowFans : getSomeoneFollow

		const data = await apiName({
			businessType: window._global.clientType,
			page: page.value,
			size: pageSize.value,
			direct: !props.isFans ? '1' : '2',
			targetUserId: isSelf ? null : someoneUserId,
		})
		let dataList = _get(data, 'data.list', [])
		const total = _get(data, 'data.total', 0)

		dataList = await checkFollow(dataList)
		contentList.value.push(...dataList)
		finished.value = contentList.value.length >= total || dataList.length == 0
	}

	async function toggleFollow(item) {
		if (item.relationFlag != '0') {
			const response = await delFollow({
				toUserId: item.targetUserId,
			})
			const success = _get(response, 'success', false)
			if (success) {
				item.relationFlag = '0'
				toast('取消关注成功')
			}
		} else {
			const response = await addFollow({
				toUserId: item.targetUserId,
			})
			const success = _get(response, 'success', false)
			if (success) {
				item.relationFlag = '1'
				toast('关注成功')
			}
		}
	}

	async function toggleRelation(item) {
		if (item.relationFlag == '2') {
			const response = await delFollow({
				toUserId: item.targetUserId,
			})
			const success = _get(response, 'success', false)
			if (success) {
				item.relationFlag = '1'
				toast('取消关注成功')
			}
		} else {
			const response = await addFollow({
				toUserId: item.targetUserId,
			})
			const success = _get(response, 'success', false)
			if (success) {
				item.relationFlag = '2'
				toast('关注成功')
			}
		}
	}

	const useStore = useUserStore()
	const { data: userData } = useStore

	function doLogin() {
		useLoginPopupStore().toggle()
	}

	async function checkFollow(list) {
		if (!list.length) return list
		const userIdList = list.map((item) => item.targetUserId)
		const relation = await getFollowBatch({
			targetUserIdList: userIdList,
			direct: '1',
		})
		const relationList = _get(relation, 'data', [])
		return list.map((item, index) => {
			return { ...item, relationFlag: relationList[index].relationFlag }
		})
	}

	async function toggleFollowNotSelf(item) {
		if (item.relationFlag != '0') {
			const response = await delFollow({
				toUserId: item.targetUserId,
			})
			const success = _get(response, 'success', false)
			if (success) {
				item.relationFlag = '0'
				toast('取消关注成功')
			}
		} else {
			const response = await addFollow({
				toUserId: item.targetUserId,
			})
			const success = _get(response, 'success', false)
			if (success) {
				item.relationFlag = '1'
				toast('关注成功')
			}
		}
	}

	watch(
		() => userData.userId,
		(newVal) => {
			if (newVal) window.location.reload()
		}
	)

	watch(
		() => onlyExpert.value,
		(newVal) => {
			page.value = 1
			contentList.value = []
			getContent()
		}
	)
</script>

<style lang="scss" scoped>
	.expert {
		:deep(.van-checkbox__icon .van-icon) {
			border-radius: 0.3125rem;
			border-color: #656565;
		}
		:deep(.van-checkbox__icon--checked .van-icon) {
			border-color: #656565;
			color: #656565;
			background-color: #00000000;
		}
	}
</style>
