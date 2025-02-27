!
<template>
	<NormalHeader title="邀请好友" />
	<div class="mt-45 relative select-none">
		<van-image src="/public-assets/images/my_page/invite.png" width="100%" />
		<ClientOnly>
			<div
				class="bg-white absolute bottom-0 left-50% -translate-x-50% rounded-tl-[10px] rounded-tr-[10px]"
			>
				<div
					class="relative bg-#F1FEE6 color-#34C759 text-20 font-400 text-center pb-4 pt-20 rounded-tl-[10px] rounded-tr-[10px]"
				>
					<img
						class="absolute left-1/2 translate-x--1/2 top--7 w-86%"
						src="/public-assets/images/expert/icon_Label2.svg"
					/>
					<p
						class="text-16 color-white font400 absolute left-1/2 translate-x--1/2 top--5"
					>
						我的邀请码
					</p>
					{{ promoCode }}
				</div>

				<QrCode
					:width="px160"
					:text="userUrl"
					:margin="0"
					@onCreated="setQRCodeUrl"
					class="m-20"
				/>

				<div class="text-center text-#434343 text-18 font-600 leading-snug">
					<p>邀请好友扫码</p>
					<p>即刻领取现金红包</p>
				</div>
			</div>
		</ClientOnly>
	</div>
	<div class="my-30 h-40 flex-center gap-10 px-10">
		<a
			href="javascript:void(0)"
			class="w-50% h-full m-auto flex-center bg-#34C759 rounded-3xl text-white text-18 font-600"
			@click="doCopy"
		>
			复制邀请链接
		</a>
		<a
			:href="qrCodeUrl"
			class="w-50% h-full m-auto flex-center bg-#F1FEE6 rounded-3xl color-#34C759 text-18 font-600 bd-#34c759"
			download="qrCode"
		>
			保存二维码
		</a>
	</div>
</template>

<script setup>
	import { watch, ref, onBeforeMount } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import ClientOnly from '@/components/ClientOnly/index.vue'
	import QrCode from '@/components/QRCode/index.vue'
	import { useFontSize, clipboard } from '@/modules/util'
	import { useUserStore } from '@/stores/user.js'

	const useStore = useUserStore()
	const { data: user } = useStore
	const px160 = useFontSize(160)
	const userUrl = ref('')
	const qrCodeUrl = ref('')
	const promoCode = _head(user.myPromotionCodeList)

	onBeforeMount(() => {
		userUrl.value = `${window.location.origin}/login?inviter=${promoCode}`
	})

	function setQRCodeUrl(url) {
		qrCodeUrl.value = url
	}

	function doCopy() {
		clipboard(userUrl.value)
	}
</script>

<style lang="scss">
	body {
		background-color: #fff;
	}
</style>
