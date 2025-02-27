<template>
	<van-popup
		class="text-center font-bold px-20 flex-y-center flex-col justify-between pb-25 pt-35"
	>
		<div class="w-50 h-50 rounded-1/2 bg-#656565 flex-center">
			<SvgIcon name="observes" size="2.8125rem" class="color-white" />
		</div>
		<p class="lh-20 color-#434343">
			消耗钻石即可查看访客,开通金卡或黑卡会员可无限免费查看
		</p>
		<div class="flex justify-between w-full px-10">
			<div class="w-120 lh-40 bd-#34c759 rounded-7 color-primary">
				<span>查看(100</span>
				<SvgIcon
					name="icon_diamond"
					class="inline-block align-text-bottom"
					size="1.125rem"
				/>
				<span>)</span>
			</div>
			<div class="w-120 lh-40 bg-#34c759 rounded-7 color-white">开通会员</div>
		</div>
	</van-popup>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
</script>

<style lang="scss" scoped>
	.van-overlay {
		height: auto;
		top: 2.5rem;
		bottom: 3.125rem;
		left: 50%;
		transform: translateX(-50%);
		max-width: 480px;
	}
	.van-popup--center {
		width: 20.625rem;
		height: 14.0625rem;
		top: auto;
		bottom: 4.375rem;
		transform: none;
		border-radius: 0.5rem;
		overflow-y: visible;

		&::after {
			content: '';
			position: absolute;
			top: -1.5rem;
			left: calc(50% - 3.75rem);
			border: 0.75rem solid transparent;
			border-left-width: 0.625rem;
			border-right-width: 0.625rem;
			border-bottom: 0.75rem white solid;
		}
	}
</style>
