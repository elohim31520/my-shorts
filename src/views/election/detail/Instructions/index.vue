<template>
	<div>
		<ol
			class="event-ins"
			:class="
				status == 'y' ? 'm-[2.5rem_2.5rem_16rem]' : 'm-[2.5rem_2.5rem_4rem]'
			"
		>
			<li>
				本次六合彩专家竞选根据{{
					campaignData.gameTypeLongName
				}}官方开奖结果进行结算，本次竞选的期数为{{
					campaignData.startIssue
				}}期至{{ campaignData.endIssue }}期。
			</li>
			<li v-if="campaignData.playTypeCode == '0102'">
				本次竞选为六合彩特肖竞选，每期在12个生肖中最多选择3个生肖参与，提交后无法修改；如选择的生肖出现在当期特肖开奖结果即为中奖。
			</li>
			<li v-if="campaignData.playTypeCode == '0095'">
				本次竞选为六合彩特碼竞选，每期在49个号码中最多选择6个号码参与，提交后无法修改；如选择的号码出现在当期特码开奖结果即为中奖。
			</li>
			<li>本次竞选共需要参与满3期且中3期才有机会获得六合彩专家资格。</li>
			<li>
				在开奖日21:00后无法参与当期竞选，需要在当期开完奖后才能参与下期特肖竞选。
			</li>
			<li>
				竞选结束当天系统会进行结算并发放六合彩专家资格，用户可在竞选结果页面查看本次获得六合彩专家资格的名单，获得专家资格的用户可在竞选结束当晚24:00后，前往六合彩【淘料市场】点击
				【申请专家】，即可立即成为六合彩专家。
			</li>
			<li>
				禁止含有恶意谩骂词汇或含广告的用户名参与竞选，如有发现将取消其资格。
			</li>
			<li>{{ getWebTitle() }}保留活动的最终解释权。</li>
		</ol>
	</div>
</template>

<script setup>
	import { onBeforeMount, inject, ref } from 'vue'
	import { listPlayTypeForCampaign } from '@/api/election.js'
	import { getWebTitle } from '@/modules/util.js'

	const status = inject('status', '')
	const apiParams = {
		page: 1,
		size: 10,
		bizFlag: 'p',
	}
	const campaignData = ref([])
	const emit = defineEmits(['getCampaignData'])

	async function getCampaignData() {
		const url = window.location.pathname
		const match = url.match(/\/detail\/(\d+)/)
		apiParams.bizId = match ? match[1] : null
		const res = _get(await listPlayTypeForCampaign(apiParams), 'data', {})
		const { list, ...rest } = res
		campaignData.value = rest
		emit('getCampaignData', rest)
	}

	onBeforeMount(async () => {
		await getCampaignData()
	})
</script>

<style lang="scss" scoped>
	.event-ins {
		color: #656565;
		background-color: #fff;
		font-size: 1rem;
		box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.1);
		border-radius: 0.75rem;
		padding: 1.25rem 1.25rem 1.25rem 2.5rem;
		list-style: decimal;
		li {
			margin-bottom: 1.5rem;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
</style>
