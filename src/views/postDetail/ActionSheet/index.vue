<template>
	<van-popup
		:show="show"
		position="bottom"
		@close="doClose"
		class="action-sheet"
	>
		<div class="header">
			更多
			<SvgIcon
				name="closure"
				size="1.375rem"
				class="color-#434343"
				@click="doClose"
			/>
		</div>

		<div class="body">
			<ul>
				<li v-user="userId">查看主人页</li>
				<li v-redirect="`/postList/user/${userId}`">历史帖子</li>
				<li v-redirect="'/feedback'">举报</li>
			</ul>
		</div>
	</van-popup>
</template>

<script setup>
	const props = defineProps({
		show: {
			type: Boolean,
			default: false,
		},
		userId: {
			type: String,
		},
	})
	const emit = defineEmits(['update:show'])

	function doClose() {
		emit('update:show', false)
	}
</script>

<style lang="scss" scoped>
	.header {
		text-align: center;
		position: relative;
		font-size: 1.25rem;
		font-weight: 600;
		color: #434343;
		height: 2.5rem;
		line-height: 2.5rem;
		border-bottom: 1px solid #e0e0e0;
		svg {
			position: absolute;
			right: 0.5rem;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.action-sheet {
		border-top-left-radius: 0.625rem;
		border-top-right-radius: 0.625rem;
	}
	.body {
		ul {
			display: flex;
			flex-direction: column;
			width: 80%;
			margin: 1rem auto;
			li {
				width: 100%;
				text-align: center;
				background-color: #f2f2f2;
				color: #434343;
				font-size: 1rem;
				font-weight: 400;
				margin: 0.625rem 0;
				height: 2.5rem;
				line-height: 2.5rem;
				border-radius: 0.5rem;
			}
		}
	}
</style>
