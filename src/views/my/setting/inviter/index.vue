<template>
	<div>
		<NormalHeader title="我的邀请人" />
		<div class="inviter">
			<img
				class="image"
				src="/public-assets/images/my_page/bg_InvitationCode.svg"
			/>
			<div class="flex flex-col items-center justify-center">
				<div v-if="!hasInviter" class="code-info mt-15">
					<div class="mb-12 color-#656565">邀请码：</div>
					<div class="flex items-center justify-between input-wrap flex-1">
						<van-field
							class="code text-18 color-#434343 rounded-full"
							v-model="inviteCode"
							maxlength="7"
							label-align="left"
							placeholder="请输入邀请码"
							clearable
							type="number"
							autocomplete="off"
							id="inviteCode"
						/>
						<van-button
							:disabled="!inviteCode"
							:round="true"
							type="success"
							color="#34c759"
							class="btn btn-search"
							@click="search"
						>
							搜索
						</van-button>
					</div>
				</div>

				<div
					v-if="(isSearched || hasInviter) && !searching"
					class="user bg-white rounded-10 flex p-10 items-center shadow mt-15"
				>
					<div
						class="w-60 h-60 rounded-full overflow-hidden shrink-0 bg-skeleton"
					>
						<CdnImage
							:path="inviter.avatar"
							error-icon="/public-assets/images/svg/default_avatar_man.png"
							:config="{ width: 60 }"
							:show-loading="false"
						/>
					</div>
					<div class="ml-10 flex-1">
						<div class="flex items-center">
							<span
								class="color-#434343 font-600 text-18 mr-4 truncate-1-lines break-all h-27"
							>
								{{ inviter.nickname }}
							</span>
							<LevelTag
								:level="inviter.vipLevel"
								class="inline-block"
								v-if="inviter.vipLevel > 0"
							/>
						</div>
						<p
							class="color-#656565 font-400 truncate-1-lines break-all text-14 h-21"
						>
							{{
								hasInviter ? `邀请成功 ${inviter.bindDate}` : inviter.userMemo
							}}
						</p>
					</div>
				</div>
				<div class="bind mt-20">
					<van-button
						v-if="!hasInviter"
						:disabled="!isSearched"
						type="success"
						:color="isSearched ? '#34c759' : '#E0E0E0'"
						class="btn btn-confirm"
						@click="bind"
					>
						确定添加
					</van-button>
				</div>
			</div>
		</div>
		<van-popup
			v-model:show="showPopup"
			:style="{ padding: '1.5rem', overflow: 'hidden' }"
			class="dialog flex flex-col items-center"
			round
		>
			<SvgIcon
				size="3.75rem"
				:name="isSuccess ? 'icon_Recharge_success' : 'icon_Recharge_fail'"
			/>

			<div class="title mt-15 text-18 font-semibold">
				{{ isSuccess ? '绑定成功' : '绑定失败' }}
			</div>
			<div class="color-#656565 mt-5 mb-5 p-1 text-18">
				{{ isSuccess ? '您已成功绑定邀请码' : errorTip }}
			</div>
			<div class="flex justify-center mt-8">
				<van-button
					type="success"
					color="#34c759"
					class="btn btn-confirm font-semibold"
					@click="showPopup = false"
				>
					确定
				</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { ref } from 'vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import LevelTag from '@/components/LevelTag/index.vue'
	import { notify } from '@/modules/util'
	import { checkInviter, searchInviter, bindInviter } from '@/api/setting.js'
	import { useUserStore } from '@/stores/user.js'

	const { userId } = useUserStore().data

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	const isInitial = ref(true)
	const searching = ref(true)
	const inviteCode = ref('')
	const showPopup = ref(false)
	const isSuccess = ref(true)
	const isSearched = ref(false)
	const hasInviter = ref(true)
	const inviter = ref({})
	const errorTip = ref('')

	check()

	async function check() {
		const data = isInitial.value ? props.data : await checkInviter()
		if (data.success && data.data) {
			hasInviter.value = true
			inviter.value = _get(data, 'data', {})
		} else {
			hasInviter.value = false
		}
		searching.value = false
		isInitial.value = false
	}

	async function search() {
		if (searching.value) return
		if (inviteCode.value && inviteCode.value.length < 7) {
			notify('邀请码为七位数字', { type: 'warning' })
			return
		}
		searching.value = true
		const res = await searchInviter(inviteCode.value)
		if (!res.success || !res.data) {
			isSearched.value = false
			notify('查无资料，请重新输入', { type: 'warning' })
			searching.value = false
			return
		}
		isSearched.value = true
		inviter.value = _get(res, 'data', {})
		inviter.value.inviteCode = inviteCode.value
		searching.value = false
	}

	async function bind() {
		if (inviter.value.userId === userId) {
			isSuccess.value = false
			errorTip.value = '邀请人不能与自己绑定'
			showPopup.value = true
			return
		}
		const data = {
			promoterUserId: inviter.value.userId,
			promotionCode: inviter.value.inviteCode,
		}
		const res = await bindInviter(data)
		isSuccess.value = res.success ? true : false
		showPopup.value = true
		if (!res.success) {
			errorTip.value = res.errMessage
			return
		}
		check()
	}
</script>

<style lang="scss" scoped>
	.inviter {
		margin-top: 2.8125rem;
		background-color: #fafafa;
		min-height: calc(100dvh - 2.8125rem);
		padding-bottom: 1.5rem;
		.image {
			width: 23.4375rem;
			height: 13.0481rem;
			padding: 1.6rem 1.9375rem 0 1.9375rem;
		}
		.code-info {
			width: 22.1875rem;
			height: 6.375rem;
			background: #fff;
			border-radius: 10px;
			padding: 0.625rem 0.8rem;
			box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.1);
		}
		.input-wrap {
			width: 100%;
			:deep(.van-field) {
				background-color: #f2f2f2;
				border-radius: 999px;
				&.error {
					background-color: #ffecec;
					font-size: 1.125rem !important;
				}
			}
			:deep(.van-cell) {
				width: 15.5625rem;
				height: 2.5rem;
				background-color: #fafafa;
				padding: 0;
				align-items: center;
				padding-left: 1rem;
				padding-right: 0.5rem;
				font-size: 1.125rem !important;
				font-weight: 400;
			}
		}
		.user {
			width: 22.1875rem;
			height: 5rem;
		}
	}
	.dialog {
		width: 20.625rem;
		height: 14.75rem;
		background-color: #fff;
		border-radius: 0.625rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		.image {
			width: 6.25rem;
			height: 6.25rem;
		}
	}
	.btn {
		height: 100%;
		font-size: 1rem;
		height: 100%;
		white-space: nowrap;
	}

	.btn-search {
		width: 4.125rem;
		height: 1.875rem;
		font-size: 1.125rem;
	}
	.btn-confirm {
		width: 18.75rem;
		height: 2.5rem;
		font-size: 1.125rem;
		border-radius: 0.5rem;
	}
	.bind {
		:deep(.van-button--disabled) {
			opacity: 1;
		}
	}
</style>
