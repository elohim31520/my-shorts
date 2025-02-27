<template>
	<div class="bg-[linear-gradient(to_right,_#fdebeb,_#fde6e6)]">
		<NormalHeader title="竞选专家">
			<SvgIcon
				v-if="status != 'n'"
				class="cursor-pointer"
				name="profile_add_election"
				size="1.35rem"
				@click="goToMyJoin"
			/>
		</NormalHeader>
		<div class="key-visual mt-45 text-center">
			<b class="text-24 font-600 color-#434343">
				<span>{{ campaignData.predictionTypeName }}竞选</span>
			</b>
			<div class="text-14 color-#656565 my-10 font-600">
				{{ periodText }}
			</div>
			<div v-if="status !== 'n'" class="relative">
				<div class="period-wording">当选标准：参与满3期中3期</div>
				<div v-if="status === 'e'" class="btn-history com-def-btn-active">
					<a @click.prevent="goTo">历史纪录</a>
				</div>
			</div>
			<div v-else class="period-wording">本期竞选活动暂未开始，敬请期待！</div>
			<div
				class="status-tag"
				:class="{
					'color-#FF8F28': status === 'y',
					'color-#34C759': status === 'n',
					'color-#aeaeb1': status === 'e',
				}"
			>
				{{ statusText }}
			</div>
		</div>
		<div class="detail-content">
			<ul class="flex-center justify-evenly py-6">
				<li
					v-for="(item, index) in switchBar"
					:key="index"
					:class="{ active: item.type == switchActive }"
					@click="switchActive = item.type"
				>
					{{ item.name }}
				</li>
			</ul>
			<Instructions
				v-if="switchActive == 1"
				@getCampaignData="getCampaignData"
			/>
			<Record v-else @getCampaignData="getCampaignData" />
		</div>
		<div v-if="status === 'y'" class="btn-join">
			<a
				:class="{ 'disable-btn': campaignData.isParticipated == 'y' }"
				@click.prevent="directToApply"
			>
				{{ btnText }}
			</a>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, provide } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import Instructions from './Instructions/index.vue'
	import Record from './Record/index.vue'
	import { isLogin, redirect, getCurrentLotteryType } from '@/modules/util.js'
	import { useLoginPopupStore } from '@/stores/loginPopup.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	const { status } = props.data
	provide('status', status)

	const switchBar = computed(() => {
		switch (status) {
			case 'y':
				return [
					{
						name: '参与纪录',
						type: 0,
					},
					{
						name: '活动描述',
						type: 1,
					},
				]
			case 'n':
				return [
					{
						name: '活动描述',
						type: 1,
					},
				]
			case 'e':
				return [
					{
						name: '竞选结果',
						type: 0,
					},
					{
						name: '活动描述',
						type: 1,
					},
				]
			default:
				return []
		}
	})
	const switchActive = ref(status === 'n' ? 1 : 0)

	const statusText = computed(() => {
		switch (status) {
			case 'y':
				return '进行中'
			case 'n':
				return '待开始'
			case 'e':
				return '已结束'
			default:
				return '---'
		}
	})

	const gameTypeName = ref('')
	const lotteryInfo = getCurrentLotteryType()
	gameTypeName.value = _get(lotteryInfo, 'fullName', '')

	const campaignData = ref({})
	const periodText = computed(() => {
		if (campaignData.value?.startIssue && campaignData.value?.endIssue) {
			return `${gameTypeName.value} (${campaignData.value.startIssue}期 - ${campaignData.value.endIssue}期)`
		}
		return `${gameTypeName.value} (期数加载中...)`
	})
	const btnText = computed(() => {
		return campaignData.value.isParticipated == 'y' ? '已参与竞选' : '立即参与'
	})

	function getCampaignData(val) {
		campaignData.value = val
	}
	function goTo() {
		const url = window.location.pathname
		const match = url.match(/\/detail\/(\d+)/)
		redirect(`/election/history?bizId=${match[1]}`)
	}

	function directToApply() {
		if (campaignData.value.isParticipated == 'y') return
		// if (!isLogin()) {
		// 	useLoginPopupStore().toggle()
		// 	return false
		// }
		redirect(
			`/election/apply?id=${campaignData.value.campaignId}&playTypeCode=${campaignData.value.playTypeCode}&period=${campaignData.value.currentIssue}`
		)
	}

	function goToMyJoin() {
		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return false
		}
		const url = window.location.pathname
		const match = url.match(/\/detail\/(\d+)/)
		redirect(`/my/join?bizId=${match[1]}`)
	}
</script>

<style lang="scss" scoped>
	.key-visual {
		position: relative;
		background: url('/public-assets/images/expert/bg_campaign_expert.svg')
			no-repeat 0px;
		background-size: cover;
		padding: 1.5625rem 0 0.9375rem;
		.period-wording {
			font-size: 0.75rem;
			color: #fa2a42;
			background-color: #fff;
			margin: 0 auto;
			padding: 0.125rem 1.5rem;
			border-radius: 0.625rem;
			display: inline-block;
		}
		.status-tag {
			position: absolute;
			right: 1rem;
			top: 0;
			font-size: 0.875rem;
		}
		.btn-history {
			position: absolute;
			right: 0.3125rem;
			top: 0;
			padding: 0.1875rem 0.625rem;
			font-size: 0.75rem;
		}
	}
	.detail-content {
		background-color: #fafafa;
		border-radius: 0.625rem 0.625rem 0 0;
		box-shadow: 0 -0.125rem 0.375rem rgba(0, 0, 0, 0.1);
		margin-top: 0.625rem;
		ul {
			border-bottom: 1px solid #e7e7e7;
			background-color: #fff;
			border-radius: 0.625rem 0.625rem 0 0;
			li {
				color: #aeaeb1;
				font-size: 1rem;
				position: relative;
			}
			.active {
				font-weight: 600;
				color: #434343;
				&::after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: -3px;
					width: 2.5rem;
					height: 0.125rem;
					background-color: $primary-color;
					border-radius: 0.3125rem;
					transform: translateX(-50%);
				}
			}
		}
	}
	.btn-join {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		padding: 0.625rem 2.34375rem;
		background-color: #fff;
		a {
			color: #fff;
			background-color: $primary-color;
			text-align: center;
			font-weight: 600;
			font-size: 1.125rem;
			padding: 0.5rem 0;
			border-radius: 0.625rem;
			display: block;
		}
		.disable-btn {
			cursor: not-allowed;
			opacity: 0.65;
		}
	}
</style>
