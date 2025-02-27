<template>
	<div class="mt-55 mx-10">
		<Header title="我的评论" />
		<div>
			<van-row class="mb-10">
				<van-col span="12">
					<div
						v-redirect.auth.skip="'/my/review/gallery'"
						class="flex-center type-btn mr-5"
						:class="{ active: activeType == 'gallery' }"
					>
						图纸
					</div>
				</van-col>
				<van-col span="12">
					<div
						v-redirect.auth.skip="'/my/review/forum'"
						class="flex-center type-btn ml-5"
						:class="{ active: activeType == 'forum' }"
					>
						论坛
					</div>
				</van-col>
			</van-row>
		</div>
		<van-list
			v-model:loading="loading"
			finished-text="没有更多了"
			:finished="finished"
			@load="onLoad"
			:key="activeType"
			:immediate-check="false"
		>
			<div
				v-for="(article, index) in list"
				:key="index"
				class="bg-#ffffff rounded-3xl p-10 mb-10 leading-tight comment-card shadow"
			>
				<div class="relative">
					<div class="flex items-center">
						<div class="h-36 w-36 min-w-36 rounded-50% bg-skeleton">
							<CdnImage
								v-if="article.mainAuthor.userId"
								v-user="article.mainAuthor.userId"
								:show-loading="false"
								round
								:path="article.mainAuthor.avatar"
								fit="cover"
								position="center"
								width="100%"
								height="100%"
								error-icon="/public-assets/images/svg/default_avatar_man.png"
								:config="{ width: '2.25rem' }"
							/>
							<img v-else :src="article.mainAuthor.avatar" />
						</div>
						<div class="ml-10">
							<div
								v-if="article.mainAuthor.userId"
								class="text-18 font-bold text-#656565 w-230"
								v-user="article.mainAuthor.userId"
							>
								{{ article.mainAuthor.name }}
							</div>
							<div v-else class="text-18 font-bold text-#656565 w-230">
								{{ article.mainAuthor.name }}
							</div>
							<div class="text-12">
								<span class="text-#aeaeb1 mr-5">
									{{ article.mainCreateTime }}
								</span>
								<span class="text-#34c759">
									{{ article.mainGameTypeName }}
								</span>
							</div>
						</div>
					</div>
					<a
						href="javascript:void(0)"
						class="btn-set absolute right-0 top-50% -translate-y-2/4 btn-look"
						@click="navigateToDetail(article.mainId, article.bbsId)"
					>
						<span>查看</span>
					</a>
				</div>
				<div
					v-html="safeHtml(article.mainTitle)"
					class="text-20 pt-10"
					:class="
						article.isMain
							? 'font-bold truncate-1-lines'
							: 'truncate-2-lines text-#656565'
					"
				></div>
				<div
					v-if="article.mainAuthor.imgPath"
					class="text-18 pt-10 text-#656565"
				>
					「图片」
				</div>
				<div
					class="my-10 truncate-2-lines text-18"
					:class="{ 'ml-32': !article.isMain }"
				>
					<div class="flex items-center">
						<div class="h-36 w-36 min-w-36 rounded-50% bg-skeleton">
							<CdnImage
								:show-loading="false"
								round
								:path="article.me.avatar"
								fit="cover"
								position="center"
								width="100%"
								height="100%"
								error-icon="/public-assets/images/svg/default_avatar_man.png"
								:config="{ width: '2.25rem' }"
							/>
						</div>
						<div class="ml-10">
							<div class="text-18 text-#656565">我</div>
							<div class="text-16 text-#434343">
								{{ article.commentContent }}
							</div>
						</div>
					</div>
					<div v-if="article.me.imgPath" class="ml-46 mt-5 w-75 h-75">
						<CdnImage
							class="reply-img"
							:show-loading="false"
							:path="article.me.imgPath"
							width="4.6875rem"
							height="4.6875rem"
							fit="cover"
							position="center"
							@click="viewImage(article.me.imgPath)"
							:config="{ width: '4.6875rem' }"
						/>
					</div>
				</div>
			</div>
		</van-list>
		<div v-if="!list.length && total == 0">
			<NotFound text="暂无数据"></NotFound>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive, computed } from 'vue'

	import CdnImage from '@/components/CdnImage/index.vue'
	import Header from '@/components/NormalHeader/index.vue'
	import NotFound from '@/components/NotFound/index.vue'

	import { getCommentList, getForumList } from '@/api/review.js'
	import { redirect, getCdnUrl } from '@/modules/util.js'
	import { useReview } from '@/hooks/useReview.js'
	import { previewImage } from '@/modules/imgCrypto.js'
	import safeHtml from '@/modules/safeHtml.js'

	const props = defineProps({
		data: {
			type: Object,
		},
		lotteryList: {
			type: Array,
			default: () => [],
		},
		type: {
			type: String,
			default: 'gallery',
		},
	})
	const { formatData } = useReview(props.lotteryList)
	const activeType = _get(props, 'type')

	const list = reactive(_get(props, 'data.list', []))
	const total = ref(+_get(props, 'data.total', 0))
	const page = ref(2)
	const size = 10
	const loading = ref(false)
	const finished = ref(list.length >= total.value)
	const fetchDataMethod =
		activeType == 'gallery' ? getCommentList : getForumList

	const onLoad = async () => {
		loading.value = true

		const res = await fetchDataMethod({
			page: page.value,
			size,
		})

		const newData = _get(res, 'data.list', [])
		total.value = _toInteger(_get(res, 'data.total', 0))

		list.push(...formatData(newData, activeType))
		if (list.length >= total.value) {
			finished.value = true
		}
		page.value += 1
		loading.value = false
	}

	function navigateToDetail(id, type) {
		let url
		if (activeType == 'gallery') {
			url = `/pictureDetail?id=${id}`
		} else {
			if (type == 'userPublic') {
				url = `/postDetail/${id}`
			} else {
				url = `/creationDetail/${id}`
			}
		}

		redirect(url)
	}

	const viewImage = (path) => {
		previewImage({
			images: [getCdnUrl(path)], //props.list.map((path) => getCdnUrl(path)),
			closeable: true,
			startPosition: 0,
		})
	}
</script>

<style lang="scss">
	.reply-img {
		img {
			border-radius: 10px;
		}
	}
	.type-btn {
		border-radius: 10px;
		border: 1px solid #e0e0e0;
		color: #656565;
		&.active {
			background-color: #f1fee6;
			color: $primary-color;
			font-weight: 600;
			border-color: $primary-color;
		}
	}
	.comment-card {
		border-radius: 20px;
	}

	.btn-look {
		width: 3.75rem;
		height: 1.5625rem;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid $primary-color;
		background-color: #fdffed;
		border-radius: 0.9375rem;
		span {
			font-size: 0.875rem;
			font-weight: 400;
			color: $primary-color;
		}
	}
	.count {
		display: flex;
		align-items: center;
		margin-right: 0.625rem;
	}
	.count-text {
		font-size: 0.875rem;
	}
	.btn-set {
		width: 3.75rem;
		span {
			font-size: 0.875rem;
		}
	}

	:deep(.van-grid-item__content) {
		padding: 0 0 0.875rem 0;
		&::after {
			border: none;
		}
	}
	:deep(.van-hairline--top:after) {
		border: none;
	}
	:deep(.van-image__img) {
		aspect-ratio: 1/1;
	}

	.btn-transition-enter-active,
	.btn-transition-leave-active {
		transition: all 0.5s ease;
	}

	.btn-transition-enter-from {
		opacity: 0;
	}

	.btn-transition-leave-to {
		opacity: 0;
	}
	.shadow {
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	}
</style>
