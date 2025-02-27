<template>
	<div>
		<NormalHeader title="我的买料" />
		<div class="mt-45 pb-40 bg-#fafafa bt-#e7e7e7 lists">
			<div class="relative z-5">
				<LotteryTypes sync />
			</div>

			<div class="pt-5">
				<ClientOnly>
					<van-list
						v-model:loading="loading"
						:finished="finished"
						@load="onLoad"
						finished-text="没有更多了"
						v-if="lists.length"
					>
						<User
							v-for="(vo, index) in lists"
							:key="index"
							class="px-10"
							:user="vo"
						/>
					</van-list>

					<NoContent text="暂无数据" v-show="!lists.length && !loading" />
				</ClientOnly>
			</div>
		</div>
		<DynamicFixedElement
			:position="{ bottom: '-40' }"
			:moveRange="40"
			class="z-10"
		>
			<LotteryTypes sync />
		</DynamicFixedElement>
	</div>
</template>

<script setup>
	import { watch, onBeforeMount } from 'vue'

	import NormalHeader from '@/components/NormalHeader/index.vue'
	import ClientOnly from '@/components/ClientOnly/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import DynamicFixedElement from '@/components/DynamicFixedElement/index.vue'
	import LotteryTypes from '@/components/LotteryTypes/index.vue'
	import User from './User/index.vue'

	import { useMyBuy } from '@/hooks/useMyBuy.js'

	const { loading, finished, refresh, lists, gameType, onLoad } = useMyBuy()

	watch(
		() => gameType.value,
		() => {
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
	.lists {
		min-height: calc(100vh - 2.8125rem);
	}
</style>
