<template>
	<div>
		<van-action-sheet v-model:show="show" title="API接口调用">
			<div class="pt-20 px-10 pb-90 text-12">
				<p class="text-14 color-#434343 mb-20">
					本站API免费向所有用户开放，但是请不要频繁请求。单个IP请求单个API一分钟内超过10次将会被防火墙封禁IP
				</p>
				<p>API_PATH =https://api.bnzcx.net/api/getPictureType</p>
				<p>请求方式：GET/POST</p>
				<p>lotteryType 1:香港 2:澳门 3:台湾 4:新加坡</p>
				<p>pageSize 每页条数，默认10</p>
				<p>pageNum 页码，从1开始，默认1</p>
				<p>该API可以获得所有的图片分类。</p>
				<p>响应参数介绍：</p>
				<p>{</p>
				<p>"height": //高度,</p>
				<p>"lotteryType": //开奖类型 1:香港 2:澳门 3:台湾 4:新加坡,</p>
				<p>"pictureId": //图片id,</p>
				<p>"pictureName": //图片名称,</p>
				<p>"pictureTypeId": //图片类型id,</p>
				<p>"pictureUrl": //最新一期的图片地址,小图</p>
				<p>"width": //宽度,</p>
				<p>"year": //年份</p>
				<p>}`</p>
			</div>
			<div
				class="bg-#fff left-1/2 -translate-x-1/2 bottom-0 absolute w-full-limited h-60 flex-center"
			>
				<div
					class="w-300 lh-40 text-center bg-#F2F2F2 rounded-8 text-18 font-600"
				>
					复制
				</div>
			</div>
		</van-action-sheet>
	</div>
</template>

<script setup>
	const show = defineModel()
</script>

<style lang="scss" scoped>
	:deep() {
		.van-popup {
			width: 20.625rem;
		}
		.van-action-sheet__header {
			font-size: 1.25rem;
			border-bottom: 0.0625rem solid #f2f2f2;
		}
		.van-action-sheet__content {
			@include scrollbar-hidden;
		}

		.van-action-sheet__close {
			font-size: 1.375rem;
			color: #434343;
		}

		.van-action-sheet__header {
			border-bottom: 0;
		}
	}
</style>
