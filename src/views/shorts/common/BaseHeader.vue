<template>
	<div id="BaseHeader" :class="[props.isFixed ? 'fixed' : '']">
		<div class="header">
			<dy-back
				:mode="props.backMode"
				:img="props.backImg"
				@click="back"
				class="left"
				direction="left"
			/>
			<slot name="center"><span></span></slot>
			<slot name="right"><span></span></slot>
		</div>
		<slot name="bottom"></slot>
	</div>
</template>
<script setup lang="ts">
	import { useAttrs } from 'vue'

	defineOptions({
		name: 'BaseHeader',
	})

	const props = defineProps({
		backMode: {
			type: String,
			default: 'gray',
		},
		backImg: {
			type: String,
			default: 'back',
		},
		isClose: {
			type: Boolean,
			default: false,
		},
		isFixed: {
			type: Boolean,
			default: true,
		},
	})
	const attrs: any = useAttrs()

	function back() {
		if (attrs.onBack) {
			attrs.onBack()
		} else {
			console.log('router back')
		}
	}
</script>

<style scoped lang="scss">
	@import url('@/styles/shorts.scss');
	#BaseHeader {
		width: 100%;
		color: white;

		&.fixed {
			z-index: 2;
			top: 0;
			position: fixed;
		}

		.header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: var(--common-header-height);
			box-sizing: border-box;
			border-bottom: 1px solid #cccccc11;
			position: relative;

			.left {
				position: absolute;
				left: 10px;
			}

			& > :nth-last-child(1) {
				height: 100%;
				position: absolute;
				right: 17px;
				top: 0;
				display: flex;
				align-items: center;
			}
		}
	}
</style>
