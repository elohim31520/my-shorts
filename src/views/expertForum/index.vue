<template>
	<div class="expert-forum">
		<div class="h-45 w-100% fixed z-12 top-0 left-0" ref="headerRef">
			<HomeHeader :active="0" />
		</div>
		<div ref="wrap" class="pt-45">
			<LotteryTypes sync />
			<Marquee class="marquee" />
			<RecommendUser :list="daniuList" />
			<div class="pd-space">
				<ul class="ranking-list">
					<li @click="rankingLink('heat')">
						<b>人气排行榜</b>
						<img
							src="/public-assets/images/svg/expert_forum_button_Popularity.png"
						/>
					</li>
					<li @click="rankingLink('fans')">
						<b>粉丝排行榜</b>
						<img src="/public-assets/images/svg/expert_forum_button_Fans.png" />
					</li>
					<li @click="rankingLink('score')">
						<b>积分排行榜</b>
						<img
							src="/public-assets/images/svg/expert_forum_button_Points.png"
						/>
					</li>
				</ul>
			</div>
			<Collection ref="target" />
		</div>
		<ForumPostList typeStickyTop="68" />
		<SideBar />
		<DynamicFixedElement
			:position="{ bottom: 0 }"
			:moveRange="49"
			:directions="['up']"
			class="z-10"
		>
			<LotteryTypes sync />
		</DynamicFixedElement>
		<Footer :active="0" :showIcon="true" />
		<DrawScreening />
		<div
			class="post-article flex-center flex-col bottom-108.5 right-10"
			v-redirect="'/sendIdea'"
		>
			<SvgIcon class="cursor-pointer mb-1" name="plus" size="0.71875em" />
			<div class="font-size-10 color-#fff">发帖子</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, provide, onMounted, watchEffect, watch } from 'vue'
	import HomeHeader from '@/components/HomeHeader/index.vue'
	import Marquee from '@/components/Marquee/index.vue'
	import Collection from './Collection/index.vue'
	import Footer from '@/components/Footer/index.vue'
	import SideBar from '@/components/SideBar/index.vue'
	import RecommendUser from '@/components/RecommendUser/index.vue'
	import DrawScreening from '@/components/DrawScreening/index.vue'
	import { redirect } from '@/modules/util.js'
	import ForumPostList from '@/components/ForumPostList/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import { useWindowSize, useElementSize } from '@vueuse/core'
	import { useForumListStore } from '@/stores/forumList.js'
	import { storeToRefs } from 'pinia'

	const props = defineProps({
		data: { type: Object },
	})
	const stickyRef = ref(null)
	const headerRef = ref(null)
	const wrap = ref(null)
	const { target } = storeToRefs(useForumListStore())
	const { height: warpHeight } = useElementSize(wrap)

	provide('data', props.data)
	provide('domRef', {
		headerRef,
		stickyRef,
	})

	watch(
		() => warpHeight.value,
		(value) => {
			useForumListStore().setTop(value)
		}
	)

	const rankingLink = (path) => {
		redirect(`/expertForum/rankingList/${path}`)
	}
	const daniuList = ref(_get(props, 'data.usersResult.data', []))

	onMounted(() => {
		watchEffect(calMinHeight)
	})

	function calMinHeight() {
		const fontSize = parseFloat(window.getComputedStyle(document.body).fontSize)
		const sum =
			68 + //stickTop
			36 +
			35 /* ForumPostList 兩行分類 */

		const { height } = useWindowSize()
		const minHeight = height.value - (sum * fontSize) / 16
		useForumListStore().setMinHeight(minHeight)
	}
</script>

<style lang="scss" scoped>
	.expert-forum {
		background-color: #fafafa;
		.pd-space {
			padding: 0 0.6rem;
		}
		.marquee {
			margin: 0.3125rem 0 0.625rem 0.625rem;
		}
		.ranking-list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			li {
				padding-right: 0.625rem;
				position: relative;
				b {
					text-align: center;
					color: #fff;
					font-size: 0.9375rem;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					left: 1.75rem;
				}
			}
			li:last-child {
				padding-right: 0;
			}
		}
		.post-article {
			width: 2.5rem;
			height: 2.5rem;
			background-color: $primary-color;
			border-radius: 50%;
			position: fixed;
			z-index: 10;
			box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.4);
		}
		:deep(.van-list__finished-text) {
			padding-bottom: 5rem;
		}
	}
	@media (min-width: 480px) {
		.expert-forum {
			.post-article {
				right: calc(50% - 240px);
			}
		}
	}
</style>
