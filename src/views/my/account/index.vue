<template>
	<div class="account">
		<NormalHeader title="我的帐户" />
		<div class="credit-center">
			<div
				class="banner"
				:style="{
					'background-color': '#FFFBEE',
				}"
			>
				<div class="current-credit">
					<div class="title">当前积分</div>
					<div class="number">{{ moneyFormat(scores) }}</div>
					<div class="mt-10 flex">
						<span class="charge bg-#ff8f28" @click="goTo('充值')">
							<SvgIcon name="icon_user_makemoney２" size="1.25rem" />
							<span class="ml-4">充值</span>
						</span>
						<!-- <span class="ml-20 charge bg-#34C759" @click="goTo('提现')">
							<SvgIcon name="icon-withdraw-money" size="1.25rem" />
							<span class="ml-4">提现</span>
						</span> -->
					</div>
				</div>
			</div>
			<div class="content">
				<div class="credit-type-tabs">
					<div
						@click="scoreType = '充值'"
						:class="scoreType === '充值' ? 'active' : ''"
					>
						充值积分
					</div>
					<!-- <div
						@click="scoreType = '提现'"
						:class="scoreType === '提现' ? 'active' : ''"
					>
						提现积分
					</div> -->
				</div>
				<div class="bg">
					<div v-if="list.length || !finished" class="mt-10" :key="scoreType">
						<van-list
							v-model:loading="loading"
							:finished="finished"
							finished-text="没有更多了"
							@load="onLoad"
						>
							<div class="history-info">
								<div v-for="item in list" class="order">
									<div class="order-title">
										<div>订单编号：{{ item.payOrderId }}</div>
										<div :class="orderType(item.state, 'color')">
											{{ orderType(item.state, 'label') }}
										</div>
									</div>
									<div class="order-type">
										<div>
											<span class="type">{{ scoreType }}-积分</span>
											<div class="deposit">
												{{
													formatTimestamp(
														item.createTime,
														'yyyy-MM-dd HH:mm:ss'
													)
												}}
											</div>
										</div>
										<div class="money">
											<span
												v-if="scoreType === '充值'"
												class="flex flex-items-center"
											>
												<SvgIcon name="score" size="1.25rem" />
												{{ moneyFormat(item.amount) }}
											</span>
											<span v-else>¥{{ moneyFormat(item.amount) }}</span>
										</div>
									</div>
								</div>
							</div>
						</van-list>
					</div>
					<NoContent v-else text="没有更多讯息了~" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import NoContent from '@/components/NoContent/index.vue'
	import { getRechargeRecordApi } from '@/api/recharge'
	import { getBalance } from '@/api/user.js'
	import { ref, onBeforeMount, watch } from 'vue'
	import { formatTimestamp } from '@/modules/date'
	import { moneyFormat, redirect } from '@/modules/util.js'

	const scoreType = ref('充值')
	const loading = ref(false)
	const finished = ref(false)
	const scores = ref(0)
	const total = ref(0)
	const api = new Map([
		['充值', getRechargeRecordApi],
		['提现', getRechargeRecordApi],
	])
	const cache = new Map()
	const list = ref([])
	const page = ref(0)
	const size = ref(10)
	const state = new Map([
		[0, { label: '发起付款待验证', color: '' }],
		[1, { label: '已经验证，等待付款', color: '' }],
		[2, { label: '付款成功', color: 'green' }],
		[3, { label: '超时', color: 'red' }],
		[4, { label: '异常', color: 'red' }],
		[5, { label: '人工到账', color: 'green' }],
		[6, { label: '已取消', color: 'gary' }],
	])
	function orderType(val, type) {
		// 0 发起付款待验证 1 已经验证，等待付款 2 付款成功 3 超时 4 异常 5 人工到账 6 已取消
		let { label, color } = state.get(val)
		return type === 'label' ? label : color
	}
	async function onLoad() {
		loading.value = true
		page.value = page.value + 1
		let res = await api.get(scoreType.value)({
			page: page.value,
			size: size.value,
		})
		if (res.success) {
			total.value = _toInteger(_get(res, 'data.total', 0))
			list.value.push(..._get(res, 'data.list', []))
		}
		if (list.value.length >= total.value) {
			finished.value = true
		}
		loading.value = false
	}

	function goTo(val) {
		let url = val === '充值' ? '/recharge' : '/withdraw'
		redirect(url, { auth: true })
	}
	function setPageParams(info) {
		list.value = info.list
		total.value = info.total
		page.value = info.page
		finished.value = info.finished
	}
	watch(scoreType, (val) => {
		cache.set(scoreType.value, {
			list: list.value,
			page: page.value,
			total: total.value,
			finished: finished.value,
		})
		scoreType.value = val
		if (cache.has(val)) {
			let info = cache.get(val)
			setPageParams(info)
		} else {
			setPageParams({
				list: [],
				total: 0,
				page: 1,
				finished: false,
			})
		}
	})
	onBeforeMount(() => {
		getBalance().then((res) => {
			if (!res.success) return
			scores.value = _get(res, 'data.score')
		})
	})
</script>

<style lang="scss" scoped>
	.account {
		.credit-center {
			.banner {
				margin-top: 2.8125rem;
				height: 9rem;
				width: 100%;
				background-size: 13.1rem 8.2rem;
				background-position: 10.1rem 0.4rem;
				background-repeat: no-repeat;
				background-color: #fff6ef;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
			.current-credit {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				.title {
					display: flex;
					justify-content: center;
					font-size: 1rem;
					font-weight: 500;
				}
				.number {
					display: flex;
					justify-content: center;
					height: 2.55rem;
					font-size: 1.875rem;
					font-weight: 500;
				}
				.charge {
					display: flex;
					// display: inline-block;
					width: 5.4375rem;
					height: 1.875rem;
					border-radius: 0.9375rem;
					align-items: center;
					justify-content: center;
					color: #ffffff;
					cursor: pointer;
				}
			}
			.content {
				.credit-type-tabs {
					display: flex;
					align-items: center;
					justify-content: space-around;
					padding: 0rem 4.5rem;
					color: #aeaeb1;
					background-color: #fff;
					box-shadow: 0px -0.0625rem 0.375rem 0px rgba(0, 0, 0, 0.1);
					border-radius: 10px 10px 0px 0px;
					div {
						position: relative;
						display: flex;
						align-items: center;
						cursor: pointer;
						height: 2rem;
					}
					.active {
						color: #434343;
						font-weight: 600;
					}
					.active::after {
						content: '';
						width: 2.5rem;
						height: 0.125rem;
						background-color: $primary-color;
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						bottom: 0;
					}
				}
				.bg {
					background-color: #fafafa;
					min-height: 65dvh;
					max-height: 65dvh;
					overflow-y: auto;
				}
			}
			.history-info {
				padding: 0.3125rem 0.625rem;
				.order {
					padding: 0.625rem 0.9375rem;
					border-bottom: 1px solid #e7e7e7;
					.order-title {
						font-size: 0.75rem;
						display: flex;
						justify-content: space-between;
						color: #434343;
						.red {
							color: #fc7e7e;
						}
						.green {
							color: $primary-color;
						}
						.gary {
							color: #aeaeb1;
						}
					}
					.order-type {
						font-size: 0.75rem;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-weight: 500;
						.type {
							font-size: 1rem;
						}
						.money {
							font-size: 1.125rem;
						}
						.gary {
							color: #aeaeb1;
						}
					}
				}
			}
		}
	}
</style>
