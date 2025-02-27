<template>
	<div>
		<NormalHeader title="申请专家" />
		<div class="apply">
			<img class="image" src="/public-assets/images/expert/bg_expert.svg" />
			<div class="tips">
				<div class="mt-32 tip">
					<img
						class="label left-1/2 translate-x--1/2"
						src="/public-assets/images/expert/icon_Label2.svg"
					/>
					<span class="title left-1/2 translate-x--1/2">
						什么是六合彩专家？
					</span>
					<div>
						六合彩专家是指对六合彩有研究或声称对其有预测能力的人群。一般会利用历史经验、数据分析等方法，尝试预测中奖号码。只要成绩准，月赚百万不是梦！
					</div>
				</div>
				<div class="tip">
					<img
						class="label long left-1/2 translate-x--1/2"
						src="/public-assets/images/expert/icon_Label1.svg"
					/>

					<!-- prettier-ignore -->
					<span class="title long left-1/2 translate-x--1/2">
						如何成为六合彩专家？<span class="text-10">(2选1即可)</span>
					</span>
					<ol class="event-ins">
						<li>分享此产品邀请5个好友以上并成功绑定即可成为专家。</li>
						<li>
							参与竞选专家活动，生肖竞选或号码竞选，连胜3次即可获 得专家资格。
						</li>
					</ol>
				</div>
				<div class="tip">
					<img
						class="label left-1/2 translate-x--1/2"
						src="/public-assets/images/expert/icon_Label2.svg"
					/>
					<span class="title left-1/2 translate-x--1/2">六合专家的好处？</span>
					通过淘料市场成为六合专家后，可以发布六合彩心水，赚取卖
					<br />
					料收益和用户的打赏收益，所获得收益可直接申请提款。
					<ol class="event-ins">
						<li>
							卖料收益为用户购买心水消费的70.0%。
							<br />
							例如：用户消费10元购买您的心水，您可获得的收益为7 元。
						</li>
						<li>
							打赏收益为用户打赏的70.0%。
							<br />
							例如：用户打赏10元给您，您可获得的收益为7元。
						</li>
					</ol>
				</div>
				<div class="tip">
					<img
						class="label left-1/2 translate-x--1/2"
						src="/public-assets/images/expert/icon_Label2.svg"
					/>
					<span class="title right-111">六合专家注意事项</span>
					<ol class="event-ins">
						<li>
							六合专家每期可同时发布3个彩种12个类型的心水资料，发
							布成功后，心水内容无法更改。
						</li>
						<li>
							六合专家推荐的心水会出现在六合王、连胜榜和历史冠军
							内，按照优胜略汰的原则进行排序。
						</li>
						<li>
							为保证心水质量，六合专家推荐的心水如果连续多期不
							中，则所发心水无法被用户购买，需连胜两期后方可开放 购买。
						</li>
						<li>
							为勉励专业持续研究六合资料，六合专家如果连续三期不
							发布心水则取消其六合彩专家资格。
						</li>
						<li>开奖当晚20:30至21:35禁止发布心水，其余时间不做限 制。</li>
					</ol>
				</div>
				<!-- <p></p> -->
				<div class="tip">
					<img
						class="label left-1/2 translate-x--1/2"
						src="/public-assets/images/expert/icon_Label2.svg"
					/>
					<span class="title right-111">六合专家违规说明</span>
					<ol class="event-ins">
						<li>禁止一人操纵多个账号。</li>
						<li>禁止在淘料市场发布的心水资料带有联系方式。</li>
						<li>禁止在聊天室进行宣传、攻击他人等活动。</li>
					</ol>
				</div>
			</div>
			<div class="flex justify-center">
				<van-button
					v-if="canApply"
					type="warning"
					color="#FF8F28"
					class="btn btn-invite"
					@click="apply"
				>
					申请成为专家
				</van-button>
				<van-button
					v-else
					type="success"
					color="#34c759"
					class="btn btn-invite"
					v-redirect.auth="'/my/invite'"
				>
					邀请好友
				</van-button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { expertApply, isCanApply } from '@/api/apply'
	import { redirect } from '@/modules/util.js'
	import { useUserStore } from '@/stores/user.js'
	import { storeToRefs } from 'pinia'
	import { ref, onBeforeMount } from 'vue'

	const { isLogin } = storeToRefs(useUserStore())

	const canApply = ref(false)

	onBeforeMount(async () => {
		if (!isLogin.value) return
		const res = await isCanApply()
		canApply.value = _get(res, 'data', '')
	})

	async function apply() {
		const data = await expertApply()
		if (!data.success) return
		redirect(`/expert?qualify=1`)
	}
</script>

<style lang="scss" scoped>
	.apply {
		margin-top: 2.8125rem;
		background-color: #fafafa;
		min-height: calc(100dvh - 2.8125rem);
		background-color: #fff5d0;
		padding-bottom: 1.5rem;
		.tips {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.tip {
				position: relative;
				width: 22.1875rem;
				background-color: #fff;
				margin-bottom: 1.5rem;
				font-size: 0.75rem;
				color: #656565;
				border-radius: 0.625rem;
				box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.1);
				padding: 1.9rem 0.5rem 0.56rem 1rem;
				.title {
					position: absolute;
					top: -0.3rem;
					// right: 6.2rem;
					z-index: 2;
					font-size: 1rem;
					color: #ffffff;
					&.long {
						width: 13.5rem;
					}
				}
			}
			.label {
				position: absolute;
				top: -0.4rem;
				width: 11.56rem;
				height: 1.875rem;
				z-index: 1;
				&.become {
					right: 2.2rem;
				}
				&.long {
					width: 16.56rem;
				}
			}
		}
		.btn {
			--van-button-radius: 0.25rem;
			height: 100%;
			width: 6.875rem;
			font-size: 1rem;
			height: 100%;
			white-space: nowrap;
		}
		.btn-invite {
			width: 80%;
			height: 2.5rem;
			font-size: 1.125rem;
			border-radius: 0.5rem;
		}
		.image {
			width: 23.4375rem;
			height: 13.0481rem;
			padding: 1.6rem 1.9375rem 0 1.9375rem;
		}
	}
	.event-ins {
		background-color: #fff;
		font-size: 0.75rem;
		color: #656565;
		border-radius: 0.625rem;
		padding: 0.2rem 0.3rem 0rem 1rem;

		list-style: decimal;
		li {
			// margin-bottom: 1.5rem;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
</style>
