<template>
	<SlideItem class="slide-item-class">
		<div
			class="sub-type"
			:class="state.subTypeIsTop ? 'top' : ''"
			ref="subTypeRef"
		>
			<div class="local">
				<div class="card" @touchmove.capture="stop">
					<div class="nav-item">
						<SvgIcon name="icon_credit_card" size="2.2rem" />
						<span>美食</span>
					</div>
					<div class="nav-item">
						<SvgIcon name="icon_credit_card" size="2.2rem" />
						<span>休闲娱乐</span>
					</div>
					<div class="nav-item">
						<SvgIcon name="icon_credit_card" size="2.2rem" />
						<span>游玩</span>
					</div>
					<div class="nav-item">
						<SvgIcon name="icon_credit_card" size="2.2rem" />
						<span>丽人/美发</span>
					</div>
					<div class="nav-item">
						<SvgIcon name="icon_credit_card" size="2.2rem" />
						<span>住宿</span>
					</div>
					<div class="nav-item">
						<SvgIcon name="icon_credit_card" size="2.2rem" />
						<span>游玩</span>
					</div>
					<div class="nav-item">
						<SvgIcon name="icon_credit_card" size="2.2rem" />
						<span>丽人/美发</span>
					</div>
					<div class="nav-item">
						<SvgIcon name="icon_credit_card" size="2.2rem" />
						<span>住宿</span>
					</div>
				</div>
			</div>
		</div>
		<div
			class="sub-type-notice"
			v-if="state.subType === -1 && !state.subTypeVisible"
			@click="showSubType"
		>
			附近吃喝玩乐
		</div>
		<SlideList
			:active="props.active"
			uniqueId="hot"
			:style="{
				background: 'black',
				marginTop: state.subTypeVisible ? state.subTypeHeight : 0,
			}"
			:api="recommendedVideo"
			@touchstart="pageClick"
		/>
	</SlideItem>
</template>

<script setup lang="jsx">
	import SlideItem from '@/views/shorts/common/slide/SlideItem.vue'
	import { onMounted, onUnmounted, reactive, ref } from 'vue'
	import bus, { EVENT_KEY } from '@/modules/bus'
	import SlideList from './SlideList.vue'
	import { recommendedVideo } from '@/api/shorts'
	import { useShorts } from '@/views/shorts/hooks/useShorts'

	const { _stopPropagation } = useShorts()

	const props = defineProps({
		cbs: {
			type: Object,
			default() {
				return {}
			},
		},
		active: {
			type: Boolean,
			default: false,
		},
	})

	function stop(e) {
		e.stopPropagation()
	}

	const subTypeRef = ref(null)
	const state = reactive({
		index: 0,
		subType: -1,
		subTypeVisible: false,
		subTypeHeight: '0',
		//用于改变zindex的层级到上层，反正比slide高就行。不然摸不到subType.
		subTypeIsTop: false,
	})

	function showSubType(e) {
		_stopPropagation(e)
		console.log('subTypeRef')
		state.subTypeHeight = subTypeRef.value.getBoundingClientRect().height + 'px'
		state.subTypeVisible = true
		setTimeout(() => (state.subTypeIsTop = true), 300)
		bus.emit(EVENT_KEY.OPEN_SUB_TYPE)
	}

	function pageClick(e) {
		// console.log('pageClick')
		if (state.subTypeVisible) {
			state.subTypeIsTop = state.subTypeVisible = false
			bus.emit(EVENT_KEY.CLOSE_SUB_TYPE)
			_stopPropagation(e)
		}
	}

	onMounted(() => {
		// getData()
	})
	onUnmounted(() => {})
</script>

<style scoped lang="scss">
	.slide-item-class {
		position: relative;

		.sub-type {
			width: 100%;
			position: absolute;
			top: 0;

			&.top {
				z-index: 2;
			}

			.local {
				transition: all 0.3s;
				font-size: 14px;
				color: gray;
				//background: #f9f9f9;
				background: linear-gradient(to right, rgb(36, 34, 84), rgb(7, 5, 16));

				display: flex;
				justify-content: center;
				align-items: center;

				.card {
					margin: 20px;
					margin-top: var(--common-header-height);
					padding: 20px;
					border-radius: 8px;
					width: 100%;
					//background: white;
					background: linear-gradient(
						to right,
						rgb(53, 51, 110),
						rgb(29, 21, 66)
					);
					box-sizing: border-box;
					display: flex;
					align-items: flex-end;
					justify-content: space-between;
					overflow: auto;
				}

				.nav-item {
					$width: 35px;
					display: flex;
					align-items: center;
					flex-direction: column;
					flex-shrink: 0;
					width: 17vw;

					img {
						width: $width;
						height: $width;
						margin-bottom: 5px;
					}
				}
			}
		}

		.sub-type-notice {
			position: absolute;
			background: rgba(black, 0.4);
			top: 100px;
			left: 50%;
			transform: translateX(-50%);
			padding: 3px 12px;
			border-radius: 10px;
			z-index: 3;
			font-size: 12px;
			color: white;
		}
	}
</style>
