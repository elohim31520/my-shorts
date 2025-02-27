<template>
	<div class="channel-promote">
		<NormalHeader title="我的推广" />
		<div class="mt-45 bg-#fafafa pb-60 content">
			<div class="bg-#fff sub-header">
				<ul class="tabs w-full flex-center gap-50">
					<li
						v-for="vo in tabItems"
						:key="vo.level"
						class="relative h-full"
						:class="{ active: vo.level === activeLevel }"
						@click="clickTab(vo.level)"
					>
						<div
							:title="vo.name"
							class="h-full flex-center flex-col justify-between"
							:class="[
								vo.level === activeLevel
									? 'color-#434343 font-600'
									: 'color-#656565 font-500',
							]"
						>
							<div class="tab-name">{{ vo.name }}</div>
							<span
								class="active-border bg-primary"
								v-if="vo.level === activeLevel"
							></span>
						</div>
					</li>
				</ul>
			</div>

			<div class="p-10 lists-content">
				<div
					class="mb-10 h-22 flex justify-between items-center font-600 invite-customer"
				>
					<div>
						今日邀请客户:
						<span class="color-#FF8F28">{{ todayInvite }}人</span>
					</div>
					<div>
						总邀请客户:
						<span class="color-#FF8F28">{{ totalInvite }}人</span>
					</div>
				</div>

				<SearchBar
					v-model="keyword"
					placeholder="搜寻邀请客户"
					class="mb-10"
					@click-search="onClickSearch"
				/>

				<div class="inline-lists">
					<ClientOnly>
						<van-list
							v-if="lists.length > 0"
							v-model:loading="loading"
							:finished="finished"
							finished-text="没有更多了"
							@load="onLoad"
						>
							<User
								v-for="vo in lists"
								:key="vo.id"
								:user="vo"
								:level="activeLevel"
							/>
						</van-list>

						<NoContent text="暂无数据" v-if="lists.length === 0 && !loading" />
					</ClientOnly>
				</div>
			</div>
		</div>

		<div
			class="footer fixed bottom-0 w-full max-w-480px bg-#fafafa h-60 flex items-center justify-center"
		>
			<van-button color="#34c759" class="btn-promote" v-redirect="`/my/invite`">
				<div class="flex items-center font-size-18">马上去推广</div>
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { watch, computed, onBeforeMount } from 'vue'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import SearchBar from '@/components/SearchBar/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import ClientOnly from '@/components/ClientOnly/index.vue'
	import User from './User/index.vue'

	import { getMyCustomerCount, getOtherCustomerCount } from '@/api/promote.js'
	import { useMyPromote } from '@/hooks/useMyPromote.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	// 今日邀請客戶/總邀請客戶
	const myCustomerCount = await getMyCustomerCount()
	const otherCustomerCount = await getOtherCustomerCount()
	const todayInvite = computed(() =>
		activeLevel.value === 1
			? _get(myCustomerCount, 'data.dailyCnt', 0)
			: _get(otherCustomerCount, 'data.dailyCnt', 0)
	)
	const totalInvite = computed(() =>
		activeLevel.value === 1
			? _get(myCustomerCount, 'data.totalCnt', 0)
			: _get(otherCustomerCount, 'data.totalCnt', 0)
	)

	const {
		loading,
		finished,
		refresh,
		lists,
		onLoad,
		activeLevel,
		keyword,
		tabItems,
		clickTab,
		onClickSearch,
	} = useMyPromote()

	watch(
		() => activeLevel.value,
		() => {
			keyword.value = ''
			refresh.value = true
			finished.value = false
			loading.value = true
			onLoad()
		}
	)

	onBeforeMount(() => {
		onLoad()
	})
</script>

<style lang="scss" scoped>
	.sub-header {
		position: relative;
		display: flex;
		align-items: center;
		z-index: 100;
		background-color: #fff;
		height: 2.1875rem;
		max-width: 480px;
		width: 100%;
		justify-content: flex-end;
		padding: 0.375rem 0 0.1875rem;
		box-shadow: 0 -0.0625rem 0.375rem 0 #0000001a;

		.tabs {
			height: 1.625rem;

			li {
				div {
					&.tab-name {
						line-height: 1.375;
					}
				}

				span {
					display: inline-block;
					width: 62.5%;
					height: 2px;
					border-radius: 0.15625rem;
				}
			}
		}
	}

	.content {
		min-height: calc(100vh - 2.8125rem);

		.invite-customer {
			letter-spacing: 0.02rem;
		}
		.lists-content {
			min-height: calc(100vh - 2.8125rem - 2.1875rem - 3.75rem);

			.inline-lists {
				height: calc(
					100vh - 2.8125rem - 2.1875rem - 3.75rem - 1.25rem - 2rem - 2.5rem
				);
				overflow-y: auto;
			}
		}
	}

	.footer {
		.btn-promote {
			width: calc(100% * 300 / 375);
			border-radius: 0.625rem;
			height: 2.5rem;
			line-height: 2.5rem;
		}
	}
</style>
