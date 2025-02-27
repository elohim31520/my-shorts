<template>
	<div class="corpus bg-#fafafa">
		<NormalHeader title="资料大全">
			<div
				v-if="yearList.length"
				class="color-#34c759 text-14 mr-8"
				@click="toggleYear"
			>
				{{ currentYear }}年
			</div>
		</NormalHeader>
		<div v-if="showYearBlock" class="swiper-container">
			<swiper :slides-per-view="4.5" :space-between="10" class="cb-swiper">
				<swiper-slide
					v-for="(year, index) in yearList"
					:key="index"
					class="year-list my-18 flex items-center justify-evenly"
					:class="{ active: year == currentYear }"
					@click="doClickYear(year)"
				>
					{{ year }}年
				</swiper-slide>
			</swiper>
		</div>
		<div class="p-10">
			<SearchBar v-model="keyword" placeholder="搜寻相关标题文章" />
		</div>
		<van-list
			v-model:loading="loading"
			:finished="finished"
			@load="onLoad"
			:immediate-check="false"
		>
			<ul class="cp-category">
				<li
					v-for="(item, index) in forumListFilter"
					:key="index"
					@click="goPosts(item)"
					class="truncate-1-lines"
				>
					<div class="item">
						{{ item.forumName }}
					</div>
				</li>
			</ul>
		</van-list>
		<NoContent text="暂无数据" v-show="noData" />
	</div>
</template>

<script setup>
	/**
	 * BBS -> 主板 -> 論壇 -> 帖子
	 * 「資料大全」就是一個BBS，初始取kv的資料，如果用年份篩選，就調用biz
	 */
	import { storeToRefs } from 'pinia'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import SearchBar from '@/components/SearchBar/index.vue'
	import NoContent from '@/components/NoContent/index.vue'

	import { ref, computed, onBeforeMount, watch } from 'vue'
	import { getCorpus } from '@/api/corpus'
	import { getYearList } from '@/api/common'
	import { isBlank } from '@/modules/util.js'
	import { getCorpusForumsAPi } from '@/api/bbs.js'
	import { redirect, getLotteryCode } from '@/modules/util.js'
	import { useLotteryStore } from '@/stores/lottery'

	const { lotteryType } = storeToRefs(useLotteryStore())

	const corpusList = ref([])
	const currentYear = ref('')
	const keyword = ref('')
	const yearList = ref([])
	const showYearBlock = ref(false)
	const forumList = ref([])
	const noData = ref(false)
	const loading = ref(false)
	const finished = ref(false)
	const size = 45
	let page = 1
	let mainBoardId = null

	onBeforeMount(async () => {
		await Promise.all([getForumsKV(), getYearResult()])
		getForumsBiz()
	})

	watch(currentYear, async (value, pre) => {
		if (!pre) return
		page = 1
		getForumsBiz()
	})

	async function onLoad() {
		loading.value = true
		page++
		await getForumsBiz()
		loading.value = false
	}

	async function getForumsBiz() {
		noData.value = false
		const res = await getCorpusForumsAPi({
			gameType: getLotteryCode(lotteryType.value),
		})
		const newData = _get(res, 'data', [])
		if (page == 1) forumList.value = []
		forumList.value.push(...newData)
		finished.value = true //目前沒有分頁
		noData.value = forumList.value.length == 0
	}

	async function getForumsKV() {
		const res = await getCorpus()
		// forumList.value = _get(res, 'data.0.forumList')
		mainBoardId = _get(res, 'data.0.mainboard_id')
	}

	const forumListFilter = computed(() => {
		if (isBlank(keyword.value)) return forumList.value
		return forumList.value.filter((vo) =>
			_includes(vo.forumName, keyword.value)
		)
	})

	async function getYearResult() {
		const res = await getYearList()
		yearList.value = _get(res, 'data', []).map((vo) => vo.value)
		currentYear.value = yearList.value[0]
	}

	function doClickYear(year) {
		currentYear.value = year
		showYearBlock.value = false
	}

	function toggleYear() {
		showYearBlock.value = !showYearBlock.value
	}

	function goPosts(vo) {
		redirect(`/postList/${vo.forumId}?title=${vo.forumName}`)
	}
</script>

<style lang="scss" scoped>
	.corpus {
		padding-top: 3rem;
		min-height: 100dvh;
		.year-btn {
			color: #fff;
			background-color: $primary-color;
			font-size: 1rem;
			border-radius: 30px;
			padding: 0.375rem 0.625rem;
			margin-right: 1rem;
		}
		.swiper-container {
			.cb-swiper {
				border-top: 1px solid #e0e0e0;
				box-shadow: 0 3px 4px rgba(0, 0, 0, 0.2);
				padding: 0 0.75rem;
				margin-bottom: 1rem;
				.swiper-wrapper {
					max-width: 100vw;
					width: 100%;
					overflow: hidden;
					.year-list {
						font-size: 1rem;
						color: #666;
						border: 1px solid #dfdfdf;
						border-radius: 30px;
						margin-top: 0.625rem;
						margin-bottom: 0.625rem;
						height: 1.875rem;
						display: inline-flex;
						justify-content: center;
						align-items: center;
					}
					.active {
						color: $primary-color;
						border-color: $primary-color;
						background-color: #efffe5;
					}
				}
			}
		}

		.cp-category {
			display: flex;
			flex-wrap: wrap;
			padding: 0 0.625rem;
			li {
				width: 33.333%;
				margin-bottom: 0.625rem;
				.item {
					margin: 0 0.3125rem;
					background-color: #f2f2f2;
					color: #343434;
					border-radius: 0.5rem;
					text-align: center;
					font-size: 1rem;
					height: 2.0625rem;
					line-height: 2.0625rem;
				}
			}
			.com-def-btn-active {
				border-width: 1px;
			}
		}
	}
</style>
