<template>
	<div class="mt-45">
		<Header title="用户设置"></Header>
		<div class="pt-20 px-10">
			<a
				v-redirect.auth="'/my/setting/head'"
				class="photo bg-white mb-10 shadow"
			>
				<div class="flex flex-items-center ml-15 my-10">
					<div class="h-60 w-60 bg-skeleton rounded-50%">
						<CdnImage
							round
							:path="user.avatar"
							fit="cover"
							position="center"
							height="100%"
							width="100%"
							error-icon="/public-assets/images/svg/default_avatar_man.png"
							:show-loading="false"
							:config="{ width: 60 }"
						/>
					</div>
					<span class="ml-10 title">修改头像</span>
				</div>
				<div class="mr-15">
					<SvgIcon name="icon_VoiceChat_Enter" size="1.875rem" />
				</div>
			</a>
			<div class="content shadow">
				<a v-redirect.auth="'/my/setting/name'" class="item">
					<div class="flex flex-items-center">
						<SvgIcon name="icon_settings_Name2" size="1.375rem" />
						<span class="ml-10 title">我的昵称</span>
					</div>
					<SvgIcon name="icon_VoiceChat_Enter" size="1.875rem" />
				</a>
				<a v-redirect.auth="'/my/setting/memo'" class="item">
					<div class="flex flex-items-center">
						<SvgIcon name="icon_settings_name" size="1.375rem" />
						<span class="ml-10 title">我的简介</span>
					</div>
					<SvgIcon name="icon_VoiceChat_Enter" size="1.875rem" />
				</a>
				<a v-redirect.auth="'/my/setting/phone'" class="item">
					<div class="flex flex-items-center">
						<SvgIcon name="icon_settings_phone" size="1.375rem" />
						<span class="ml-10 title">修改手机号</span>
					</div>
					<SvgIcon name="icon_VoiceChat_Enter" size="1.875rem" />
				</a>
				<a v-redirect.auth="'/my/setting/inviter'" class="item">
					<div class="flex flex-items-center">
						<SvgIcon name="icon_settings_invite" size="1.375rem" />
						<span class="ml-10 title">我的邀请人</span>
					</div>
					<SvgIcon name="icon_VoiceChat_Enter" size="1.875rem" />
				</a>
				<a v-redirect="'/my/setting/about'" class="item">
					<div class="flex flex-items-center">
						<SvgIcon name="icon_settings_about_us" size="1.375rem" />
						<span class="ml-10 title">关于我们</span>
					</div>
					<SvgIcon name="icon_VoiceChat_Enter" size="1.875rem" />
				</a>
			</div>
			<div class="px-27.5 pt-30" v-if="isLogin">
				<van-button @click="logOutShow = true" class="btn">退出登录</van-button>
			</div>
		</div>
		<!-- 退出登入 -->
		<van-action-sheet
			v-model:show="logOutShow"
			class="text-18"
			title="退出登录"
			closeable
		>
			<div class="logout-content">
				<div class="text-18 flex-center py-15">是否要退出登录？</div>
				<div class="pb-20">
					<van-button @click="logOutShow = false" class="btn btn-green">
						再考虑一下
					</van-button>
				</div>
				<div class="pb-40">
					<van-button @click="logOut" class="btn">确定退出</van-button>
				</div>
			</div>
		</van-action-sheet>
	</div>
</template>
<script setup>
	import CdnImage from '@/components/CdnImage/index.vue'
	import Header from '@/components/NormalHeader/index.vue'
	import { ref } from 'vue'
	import { logout } from '@/api/login.js'
	import { notify, redirect } from '@/modules/util.js'
	import { useUserStore } from '@/stores/user.js'
	import { storeToRefs } from 'pinia'
	const { data: user } = storeToRefs(useUserStore())
	const { isLogin } = useUserStore()
	const logOutShow = ref(false)
	const logOut = async () => {
		await logout()
		notify('登出成功')
		setTimeout(() => {
			redirect('/', { skip: true })
		}, 800)
	}
</script>
<style lang="scss">
	.photo {
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0rem 0.9375rem;
		padding: 0.9375rem 0rem;
	}
	.item:not(:last-child) {
		border-bottom: 1px solid #f2f2f2;
	}
	.title {
		font-size: 1.125rem;
	}
	.content {
		background-color: white;
		border-radius: 10px;
	}
	.btn {
		font-weight: bold;
		width: 100%;
		border-radius: 10px;
		font-size: 1.125rem;
		color: #fff;
		background-color: #fc7e7e;
	}
	.btn-green {
		color: white;
		background-color: $primary-color;
	}
	.btn-grey {
		color: black;
		font-weight: bold;
		background-color: #f2f2f2;
	}
	.logout-content {
		padding: 0rem 2.34375rem;
		border-top: 1px solid #f2f2f2;
	}
	.phone-content {
		border-top: 1px solid #f2f2f2;
	}
	.van-action-sheet__close {
		color: #434343 !important;
	}
	.van-action-sheet__header {
		font-size: 1.25rem;
	}
	.btn-name {
		margin-bottom: 0.625rem;
		background-color: #fafafa;
		border-radius: 20px;
		font-size: 1.125rem;
	}
	.shadow {
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	}
</style>
