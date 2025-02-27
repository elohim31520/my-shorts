<template>
	<div>
		<van-list
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
		>
			<ul class="follow-list">
				<li v-for="(item, index) in loadRankListData" :key="index">
					<div class="fl-avatar bg-skeleton!">
						<CdnImage
							:path="item.avatar"
							v-user="item.userId"
							fit="cover"
							position="center"
							error-icon="/public-assets/images/svg/default_avatar_man.png"
							:key="item.userId"
							:show-loading="false"
							:config="{ width: '3.5rem' }"
						/>
						<div class="fl-ranking">{{ index + 4 }}</div>
					</div>
					<div class="fl-content">
						<div class="fl-info">
							<span v-user="item.userId" class="fl-name truncate">
								{{ item.nickname || '未输入名称' }}
							</span>
							<LevelTag :level="item.vipLevel" />
							<!-- <span class="fl-level">LV.{{ item.vipLevel }}</span> -->
						</div>
						<div class="fl-number">
							<span>{{ typeCategory[type]['name'] }}</span>
							<span v-if="switchActive != 'total'">变动</span>
							<span>: {{ moneyFormat(item[type]) }}</span>
						</div>
					</div>
					<div class="fl-btn">
						<FollowButton
							v-if="user.userId !== item.userId"
							:isFollowing="item.isFollowing"
							@toggleFollow="toggleFollow(item)"
						/>
					</div>
				</li>
			</ul>
		</van-list>
	</div>
</template>

<script setup>
	import CdnImage from '@/components/CdnImage/index.vue'
	import FollowButton from '@/components/FollowButton/index.vue'
	import { ref, toRefs, onMounted, watch } from 'vue'
	import { addFollow, delFollow } from '@/api/daniu'
	import { useUserStore } from '@/stores/user.js'
	import LevelTag from '@/components/LevelTag/index.vue'
	import { moneyFormat, toast } from '@/modules/util.js'

	const props = defineProps({
		type: {
			type: String,
		},
		typeCategory: {
			type: Object,
		},
		rankListDataSort: {
			type: Array,
		},
		switchActive: {
			type: String,
		},
	})

	const { type, typeCategory, rankListDataSort } = toRefs(props)

	const useStore = useUserStore()
	const { data: user } = useStore

	async function toggleFollow(item) {
		if (item.userId) {
			if (!item.isFollowing) {
				await addFollow({
					toUserId: item.userId,
				})
				toast('关注成功')
			} else {
				await delFollow({
					toUserId: item.userId,
				})
				toast('取消关注成功')
			}
			item.isFollowing = !item.isFollowing
		}
	}

	const loading = ref(false)
	const finished = ref(false)
	const size = 10
	const currentIndex = ref(0)
	const loadRankListData = ref([])

	onMounted(() => {
		loadNextList()
	})

	function loadNextList() {
		const start = currentIndex.value
		const end = start + size
		const nextList = rankListDataSort.value.slice(start, end)
		loadRankListData.value.push(...nextList)
		currentIndex.value += size

		if (currentIndex.value >= rankListDataSort.value.length) {
			finished.value = true
		}
	}

	function onLoad() {
		loading.value = true
		setTimeout(() => {
			loadNextList()
			loading.value = false
		}, 500)
	}

	watch(rankListDataSort, (newValue) => {
		loadRankListData.value = []
		currentIndex.value = 0
		finished.value = false
		loadNextList()
	})
</script>

<style lang="scss" scoped></style>
