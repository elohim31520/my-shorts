<template>
	<div class="ranking-list" :class="`active-${type}`">
		<div class="rl-header">
			<ul>
				<li v-for="(item, index) in tabList" :key="index">
					<a
						v-redirect.skip="`/expertForum/rankingList/${item.params}`"
						:class="{ active: item.params == type }"
					>
						{{ item.name }}
					</a>
				</li>
			</ul>
			<div class="go-back" @click="back">
				<SvgIcon name="arrow_left" size="1.875rem" class="color-#434343" />
			</div>
		</div>
		<div class="rl-switch">
			<ul>
				<li
					v-for="(item, index) in switchList"
					:key="index"
					:class="{ active: switchActive === item.params }"
					@click="switchSubCategory(item)"
				>
					{{ item.name }}
				</li>
			</ul>
		</div>
		<div class="rl-board" :class="type">
			<template v-if="isLoading">
				<div
					v-for="index in 3"
					:key="index"
					class="rl-list skeleton"
					:class="[`list-sort${index}`, { 'top-one': index === 1 }]"
				>
					<div class="rl-avatar">
						<div class="icon-ranking">
							<SvgIcon size="1.875rem" :name="`icon_Rankings_No${index}`" />
						</div>
						<div class="skeleton-avatar bg-skeleton!"></div>
						<div class="skeleton-username bg-skeleton!"></div>
						<div class="skeleton-number bg-skeleton!"></div>
					</div>
					<div class="rl-top" :class="`ranking-top-${index}`">
						<b>Top{{ index }}</b>
					</div>
				</div>
			</template>
			<template v-else>
				<template v-for="(item, index) in rankListDataTop" :key="index">
					<div
						class="rl-list"
						:class="[`list-sort${index + 1}`, { 'top-one': index === 0 }]"
					>
						<div class="rl-avatar">
							<div class="icon-ranking" :class="{ invisible: item.noRank }">
								<SvgIcon
									size="1.875rem"
									:name="`icon_Rankings_No${index + 1}`"
								/>
							</div>
							<LevelTag class="icon-level" :level="item.vipLevel" />
							<div class="w-68 h-68 bg-skeleton rounded-full">
								<CdnImage
									:path="item.avatar"
									v-user="item.userId"
									fit="cover"
									position="center"
									width="100%"
									height="100%"
									error-icon="/public-assets/images/svg/default_avatar_man.png"
									:config="{ width: '4.25rem' }"
									:show-loading="false"
								/>
							</div>
							<div
								class="rl-username truncate"
								:class="{ 'color-#656565': item.noRank }"
							>
								{{ item.nickname || '未输入名称' }}
							</div>
							<div
								class="rl-heat color-#656565"
								:class="{ invisible: item.noRank }"
							>
								<!-- <span>{{ typeCategory[type]['name'] }}</span> -->
								<span>
									{{ moneyFormat(item[type]) }}
								</span>
							</div>
							<FollowButton
								:class="{
									invisible:
										item.noRank || item.userId === followListSelf.userId,
								}"
								:isFollowing="item.isFollowing"
								@toggleFollow="toggleFollow(item)"
							/>
						</div>
						<div class="rl-top" :class="`ranking-top-${index + 1}`">
							<b>Top{{ index + 1 }}</b>
						</div>
					</div>
				</template>
			</template>
		</div>
		<div
			v-if="isLogin()"
			class="rl-follow-self mb-10"
			:class="`active-${type}`"
		>
			<ul class="follow-list">
				<li>
					<div class="fl-avatar bg-skeleton!">
						<CdnImage
							v-if="followListSelf.userId"
							:path="followListSelf.avatar"
							fit="cover"
							v-user="followListSelf.userId"
							position="center"
							error-icon="/public-assets/images/svg/default_avatar_man.png"
							:config="{ width: '3.5rem' }"
							:show-loading="false"
						/>
						<div class="fl-ranking">
							{{
								userRankingInfoPosition > -1 ? userRankingInfoPosition : '...'
							}}
						</div>
					</div>
					<div class="fl-content">
						<div class="fl-info">
							<span class="fl-name">我</span>
							<LevelTag :level="followListSelf.vipLevel" />
							<!-- <span class="fl-name">{{ followListSelf.nickname }}</span> -->
							<!-- <span class="fl-level">LV.{{ followListSelf.vipLevel }}</span> -->
						</div>
						<div class="fl-number">
							<span>
								{{ typeCategory[type]['name'] }}
							</span>
							<span v-if="switchActive != 'total'">变动</span>
							<span>: {{ moneyFormat(userRankingInfoValue) }}</span>
						</div>
					</div>
					<div class="fl-btn">
						<span v-if="userRankingInfoPosition > -1" class="fl-no-ranking">
							排名：{{ userRankingInfoPosition }}
						</span>
						<span v-else class="fl-no-ranking">暂无排名</span>
					</div>
				</li>
			</ul>
		</div>
		<div
			class="rl-follow"
			:class="followListSelf.userId ? 'min-h-40dvh' : 'min-h-50dvh'"
			:key="switchActive"
		>
			<FollowList
				v-if="rankListDataSort.length"
				:type="type"
				:typeCategory="typeCategory"
				:rankListDataSort="rankListDataSort"
				:switchActive="switchActive"
			/>
			<NoContent v-else text="暂无排名" />
		</div>
	</div>
</template>

<script setup>
	import { ref, provide, onMounted, watch, computed } from 'vue'
	import {
		isLogin,
		back,
		updateURLParameter,
		moneyFormat,
	} from '@/modules/util'
	import { getFollowFans, addFollow, delFollow } from '@/api/daniu'
	import CdnImage from '@/components/CdnImage/index.vue'
	import FollowButton from '@/components/FollowButton/index.vue'
	import FollowList from './FollowList/index.vue'
	import { useUserStore } from '@/stores/user.js'
	import LevelTag from '@/components/LevelTag/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import {
		getUserRankingHeatDay,
		getUserRankingHeatWeek,
		getUserRankingHeatMonth,
		getUserRankingHeatAll,
		getUserRankingFansDay,
		getUserRankingFansWeek,
		getUserRankingFansMonth,
		getUserRankingFansAll,
		getUserRankingScoreDay,
		getUserRankingScoreWeek,
		getUserRankingScoreMonth,
		getUserRankingScoreAll,
		getUserRankingInfo,
	} from '@/api/ranking'
	import { toast } from '@/modules/util'

	const props = defineProps({
		data: {
			type: Object,
		},
	})
	provide('data', props.data)

	const useStore = useUserStore()
	const { data: user } = useStore

	const { type, title } = props.data

	const typeCategory = {
		heat: {
			name: '人气',
		},
		fans: {
			name: '粉丝',
		},
		score: {
			name: '积分',
		},
	}

	const followListSelf = ref({
		avatar: null,
		userId: null,
		nickname: null,
		vipLevel: 0,
		ranking: 0,
		fansCount: 0,
		score: 0,
		friendCount: 0,
	})

	const tabList = [
		{
			name: '人气榜',
			params: 'heat',
		},
		{
			name: '粉丝榜',
			params: 'fans',
		},
		{
			name: '积分榜',
			params: 'score',
		},
	]
	const switchList = ref([
		{
			name: '日榜',
			params: 'day',
		},
		{
			name: '周榜',
			params: 'week',
		},
		{
			name: '月榜',
			params: 'month',
		},
		{
			name: '总榜',
			params: 'total',
		},
	])
	const switchActive = ref('day')
	const rankListDataTop = ref([])
	const rankListDataSort = ref([])
	const rankingInfoSelf = ref({ data: {} })
	const userRankingInfoValue = computed(() => {
		const selfData = rankingInfoSelf.value?.data
		return selfData ? Object.values(selfData)[0]?.value : 0
	})

	const userRankingInfoPosition = computed(() => {
		const selfData = rankingInfoSelf.value?.data
		return selfData ? Object.values(selfData)[0]?.position : -1
	})
	const selfInfoType = computed(() =>
		switchList.value.findIndex((item) => item.params === switchActive.value)
	)
	const isLoading = ref(true)

	async function getRankingData(period) {
		isLoading.value = true
		const apiMap = {
			heat: {
				day: { key: 4, api: getUserRankingHeatDay },
				week: { key: 5, api: getUserRankingHeatWeek },
				month: { key: 6, api: getUserRankingHeatMonth },
				total: { key: 7, api: getUserRankingHeatAll },
			},
			fans: {
				day: { key: 8, api: getUserRankingFansDay },
				week: { key: 9, api: getUserRankingFansWeek },
				month: { key: 10, api: getUserRankingFansMonth },
				total: { key: 11, api: getUserRankingFansAll },
			},
			score: {
				day: { key: 0, api: getUserRankingScoreDay },
				week: { key: 1, api: getUserRankingScoreWeek },
				month: { key: 2, api: getUserRankingScoreMonth },
				total: { key: 3, api: getUserRankingScoreAll },
			},
		}

		const apiConfig = apiMap[type]?.[period]
		if (!apiConfig) return

		const { key: selfKey, api: apiFunction } = apiConfig
		rankingInfoSelf.value = isLogin()
			? await getUserRankingInfo({ keys: [selfKey], userId: user.userId })
			: {}

		if (!apiFunction) return

		const rankListData = ref([])
		rankListDataTop.value.length = 0
		rankListDataSort.value.length = 0
		try {
			const apiData = await apiFunction()
			const data = _get(apiData, 'data', [])
			rankListData.value = Object.keys(data).map((key) => ({
				...data[key],
			}))
			await getFollowList()
			if (isLogin()) {
				getSelfInfo()
			}

			const listLength = rankListData.value.length
			if (listLength < 3) {
				for (let i = listLength; i < 3; i++) {
					rankListData.value.push({
						avatar: '',
						nickname: '暂无排名',
						vipLevel: 0,
						noRank: true,
					})
				}
			}
			rankListData.value.forEach((item) => {
				item.isFollowing = followListId.value.includes(item.userId)
			})
			rankListDataTop.value = rankListData.value.slice(0, 3)
			rankListDataSort.value = rankListData.value.slice(3)
		} finally {
			isLoading.value = false
		}
	}

	async function switchSubCategory(item) {
		switchActive.value = item.params
		await getRankingData(item.params)
	}

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

	function getSelfInfo() {
		for (let key in user) {
			if (followListSelf.value.hasOwnProperty(key)) {
				followListSelf.value[key] = user[key]
			}
		}
	}

	const page = ref(1)
	const pageSize = ref(300)
	const followListId = ref([])

	async function getFollowList() {
		const data = await getFollowFans({
			businessType: window._global.clientType,
			page: page.value,
			size: pageSize.value,
			direct: '1',
		})
		const dataList = _get(data, 'data.list', [])
		followListId.value = dataList.map((item) => item.targetUserId)
	}

	function changesSwitchList() {
		const queryParams = new URLSearchParams(window.location.search)
		const period = queryParams.get('period') ?? 'day'
		switchActive.value = period.toLowerCase()
	}

	onMounted(() => {
		changesSwitchList()
		getRankingData(switchActive.value)
	})

	watch(
		() => switchActive.value,
		(value) => {
			updateURLParameter('period', value)
		}
	)
</script>

<style lang="scss">
	.ranking-list {
		.rl-header {
			position: relative;
			padding: 0.625rem 0 0;
			background-color: #fff;
			ul {
				display: flex;
				justify-content: center;
				li {
					margin: 0 1rem;
					font-weight: 500;
					a {
						display: block;
						font-size: 1.125rem;
						color: #aeaeb1;
					}
					.active {
						color: #333;
						padding-bottom: 0.25rem;
						// border-bottom: 2px solid $primary-color;
						&:after {
							content: '';
							display: block;
							width: 60%;
							height: 0.125rem;
							border-radius: 0.3125rem;
							background-color: #34c759;
							margin: auto;
						}
					}
				}
			}
			.go-back {
				position: absolute;
				left: 0;
				top: 0.6rem;
			}
		}
		.rl-switch {
			padding-bottom: 0.3125rem;
			background-color: #fff;
			ul {
				display: flex;
				justify-content: center;
				li {
					margin: 0 1.25rem;
					font-size: 1rem;
					color: #aeaeb1;
					padding: 0.5rem 0;
				}
				.active {
					color: #333;
				}
			}
		}
		.rl-board {
			display: flex;
			padding: 0 0.625rem;
			color: #434343;
			padding-top: 2rem;
			width: 100%;
			min-height: 14.625rem;
			.rl-list {
				width: 33.333%;
				.rl-avatar {
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					margin-bottom: 0.625rem;
					position: relative;
					.icon-ranking {
						position: absolute;
						left: 50%;
						top: -1.425rem;
						transform: translateX(-50%);
						z-index: 1;
					}
					.icon-level {
						position: absolute;
						left: 50%;
						top: 3.6rem;
						transform: translateX(-50%);
						z-index: 1;
					}
					.com-btn-follow {
						background-image: none;
						border: 1px solid #ff3a75;
					}
					.rl-username {
						font-size: 0.8125rem;
						margin-top: 0.7rem;
						font-weight: 700;
						width: 100%;
						max-width: 7.375rem;
						text-align: center;
					}
					.rl-heat {
						font-size: 0.8125rem;
						margin-bottom: 0.25rem;
						width: 100%;
						text-align: center;
						span {
							display: inline-block;
						}
					}
				}
				.rl-top {
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					text-align: center;
					border-bottom: none !important;
					padding: 0.375rem 0;
					b {
						width: 100%;
						font-size: 1.5rem;
					}
					p {
						width: 100%;
						font-size: 0.75rem;
					}
				}
				.ranking-top-1 {
					border-radius: 5px 5px 0 0;
					border: 1px solid #ffdd68;
					background: #f5d874;
					background: linear-gradient(140deg, #f5d874 0%, #feffc0 100%);
					height: 4.25rem;
					b {
						background: linear-gradient(#ff9800, #ffee81);
						background-clip: text;
						-webkit-text-fill-color: transparent;
					}
					p {
						color: #fe9b39;
					}
				}
				.ranking-top-2 {
					border-radius: 5px 0 0 0;
					border: 1px solid #92e5ff;
					border-right: none;
					margin-left: 0.5rem;
					background: #bfedf9;
					background: linear-gradient(140deg, #abeeff 0%, #e7faff 100%);
					b {
						background: linear-gradient(#129bfd, #a3e8ff);
						background-clip: text;
						-webkit-text-fill-color: transparent;
					}
					p {
						color: #34bcff;
					}
				}
				.ranking-top-3 {
					border-radius: 0 5px 0 0;
					border: 1px solid #ffd192;
					border-left: none;
					margin-right: 0.5rem;
					background: #f0b66c;
					background: linear-gradient(140deg, #f0b66c 0%, #fff0d2 100%);
					b {
						background: linear-gradient(#c7491b, #ffc876);
						background-clip: text;
						-webkit-text-fill-color: transparent;
					}
					p {
						color: #ec722b;
					}
				}
			}
			.top-one {
				margin-top: -1.2rem;
			}
			.list-sort1 {
				order: 2;
			}
			.list-sort2 {
				order: 1;
			}
			.list-sort3 {
				order: 3;
			}
		}
		.rl-follow-self {
			.follow-list {
				padding-top: 0;
				li {
					margin-bottom: 0;
					.fl-no-ranking {
						font-size: 0.875rem;
						color: #aeaeb1;
					}
				}
			}
		}
		.heat {
			background: url('/public-assets/images/ranking_list/bg_ranking_popularity.svg')
				no-repeat 0px;
			background-size: cover;
		}
		.fans {
			background: url('/public-assets/images/ranking_list/bg_ranking_fans.svg')
				no-repeat 0px;
			background-size: cover;
		}
		.score {
			background: url('/public-assets/images/ranking_list/bg_ranking_points.svg')
				no-repeat 0px;
			background-size: cover;
		}
		.rl-follow {
			border-radius: 10px 10px 0 0;
			box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
			position: relative;
			z-index: 1;
			background-color: #fff;
		}
	}
	.active-heat {
		background-color: #d2f2ff;
	}
	.active-fans {
		background-color: #fbdff1;
	}
	.active-score {
		background-color: #fde7df;
	}
	.follow-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0.625rem 0.625rem 0;
		li {
			display: flex;
			align-items: center;
			width: 100%;
			border-radius: 10px;
			padding: 0.5rem 0.375rem;
			margin-bottom: 0.5rem;
			background-color: #fff;
			box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
			.fl-avatar {
				display: flex;
				align-content: center;
				position: relative;
				width: 3.5rem;
				height: 3.5rem;
				border-radius: 50%;
				margin-right: 0.5rem;
				background-color: #f3f4f6;
				.fl-ranking {
					position: absolute;
					left: -0.1rem;
					bottom: 0rem;
					font-size: 0.875rem;
					color: #fff;
					background: #ff8f28;
					border-radius: 50%;
					min-width: 1.25rem;
					height: 1.25rem;
					text-align: center;
				}
				.van-image {
					width: 3.5rem;
					height: 3.5rem;
					:deep(.van-image__img) {
						height: auto !important;
					}
				}
			}
			.fl-content {
				width: 62%;
				padding: 0 1%;
				.fl-info {
					font-weight: 700;
					display: flex;
					align-items: center;
					span {
						display: inline-block;
					}
					.fl-name {
						font-size: 1.125rem;
						color: #434343;
						margin-right: 0.3rem;
					}
					.fl-level {
						font-size: 0.75rem;
						color: #fff;
						padding: 0.1rem 0.2rem;
						border-radius: 25px;
						background: #009518;
						background: linear-gradient(#15c030 0%, #009518 100%);
					}
				}
				.fl-number {
					font-size: 1rem;
					color: #656565;
				}
			}
			.fl-btn {
				width: 20%;
			}
		}
	}
	.van-image {
		img {
			border-radius: 50%;
		}
	}

	.skeleton-avatar {
		width: 4.2375rem;
		height: 4.2375rem;
		background: #e0e0e0;
		border-radius: 50%;
	}

	.skeleton-username,
	.skeleton-number {
		width: 100%;
		height: 1rem;
		background: #e0e0e0;
		margin: 0.5rem 0;
		border-radius: 4px;
	}

	.skeleton-username {
		width: 70%;
	}

	.skeleton-number {
		width: 50%;
		margin-bottom: 1.2rem;
	}
</style>
