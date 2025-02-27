<template>
	<div class="px-15 pt-20 pb-20 bg relative">
		<div class="flex-y-center">
			<MyInfo :hasUserInfo="false" />
		</div>
		<div class="mt-10 flex items-center space-x-2 star-score-col">
			<a :href="'/my/star'" v-redirect.auth class="mr-32 block">
				<span class="text-14 color-#656565">星星中心</span>
				<div class="flex items-center h-26.5">
					<svgIcon name="star" size="1.25rem" />
					<span class="ml-5 font-bold color-#434343 text-22">
						{{ moneyFormat(stars) }}
					</span>
				</div>
			</a>
			<a :href="'/my/score'" v-redirect.auth class="mr-32 block">
				<span class="text-14 color-#656565">积分中心</span>
				<div class="flex items-center h-26.5">
					<svgIcon name="score" size="1.25rem" />
					<span class="ml-5 font-bold color-#434343 text-22">
						{{ moneyFormat(scores) }}
					</span>
				</div>
			</a>
		</div>
	</div>
</template>

<script setup>
	import MyInfo from '@/components/MyInfo/index.vue'
	import { ref, onBeforeMount } from 'vue'
	import { getBalance } from '@/api/user.js'
	import { moneyFormat } from '@/modules/util.js'

	const scores = ref(0)
	const stars = ref(0)

	onBeforeMount(async () => {
		const res = await getBalance()
		if (!_get(res, 'success')) return
		scores.value = _get(res, 'data.score', 0)
		stars.value = _get(res, 'data.starBalance', 0)
	})
</script>

<style scoped lang="scss">
	.bg {
		background-image: url('/public-assets/images/my_page/bg.svg');
		background-size: cover;
		background-position: 0 0;
		background-repeat: no-repeat;
	}
	.blue {
		background-image: linear-gradient(to right, #1f87e7, #46b1ff);
	}
	.pink {
		background-image: linear-gradient(to right, #db4cff, #ff81dc);
	}
	.red {
		background-image: linear-gradient(to right, #ff3939, #ff8f50);
	}
	.yellow {
		background-image: linear-gradient(to right, #ffb444, #f7d354);
	}
	.green {
		background-image: linear-gradient(to right, #31c824, #4de14a);
	}
	.cyan {
		background-image: linear-gradient(to right, #1ce0c8, #74c5ff);
	}
	.star-score-col {
		margin-left: 5.1rem;
	}
</style>
