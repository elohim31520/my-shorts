<template>
	<SlideItem class="slide-item-class">
		<div
			class="sub-type"
			:class="state.subTypeIsTop ? 'top' : ''"
			ref="subTypeRef"
		>
			<div class="card" @touchmove="_stop">
				<div
					class="nav-item"
					@click="goLive(i)"
					:key="j"
					v-for="(i, j) in store.users"
				>
					<img :src="i.avatar_168x168?.url_list[0]" alt="" />
					<span>{{ i.nickname }}</span>
				</div>
			</div>
		</div>
		<div
			class="sub-type-notice"
			v-if="state.subType === -1 && !state.subTypeVisible"
			@click.stop="showSubType"
		>
			{{ store.users.length }}个直播
		</div>
		<SlideList
			:cbs="{ isLive: true }"
			:active="props.active"
			uniqueId="live"
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
	import { useBaseStore } from '@/stores/shorts'
	import { useShorts } from '@/views/shorts/hooks/useShorts'

	const { _stop, _stopPropagation } = useShorts()

	const store = useBaseStore()
	const props = defineProps({
		active: {
			type: Boolean,
			default: false,
		},
	})

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

	function goLive(item) {
		bus.emit(EVENT_KEY.NAV, {
			path: '/home/live',
			query: { id: item.id },
		})
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
			font-size: 12px;
			color: white;

			&.top {
				z-index: 2;
			}

			.card {
				margin-top: var(--common-header-height);
				padding: 20px 5px;
				width: 100%;
				background: rgba(black, 0.4);
				box-sizing: border-box;
				display: flex;
				overflow: auto;
				gap: 10px;
				padding-left: 20px;
			}

			.nav-item {
				$width: 50px;
				width: $width + 5px;
				margin: 0 5px;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				flex-shrink: 0;

				span {
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				img {
					width: $width;
					height: $width;
					border-radius: 50%;
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
