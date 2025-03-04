<template>
	<div id="Community" @dragstart="(e) => _stopPropagation(e)">
		<div class="search" @click="nav('/home/search')">
			<div class="left">
				<SvgIcon
					class="color-white"
					name="icon_button_Query"
					size="2rem"
					@click.stop="_no"
				/>
				<span>壁纸</span>
			</div>
			<div class="right">搜索</div>
		</div>

		<teleport to="body">
			<div class="shadow">
				<div class="wrap"></div>
				<!-- <AlbumDetail :detail="state.current" @close="close" /> -->
			</div>
		</teleport>
	</div>
</template>

<script setup>
	import { reactive, ref, watch } from 'vue'
	import {
		_no,
		_stopPropagation,
		cloneDeep,
	} from '@/common/utils'
	import { useNav } from '@/common/utils/hooks/useNav'
	import { useBaseStore } from '@/stores/shorts'
	// import AlbumDetail from '@/views/other/AlbumDetail.vue'
	import { _css } from '@/common/utils/dom'

	const Mock = {
		mock: () => '',
	}

	const nav = useNav()
	const baseStore = useBaseStore()
	const props = defineProps({
		active: {
			type: Boolean,
			default: false,
		},
	})

	const state = reactive({
		show: false,
		current: {
			id: '',
			note_card: {
				interact_info: {},
				cover: {},
				image_list: [],
				display_title: '',
				user: {},
				comment_list: [],
				createTime: '',
			},
		},
		d: false,
	})
	let rect = ref({})

	watch(
		() => props.active,
		(n) => {
			if (n && !state.show) {
				state.show = true
			}
		},
		{ immediate: true }
	)

	function close() {
		if (import.meta.env.SSR) return
		let s = document.querySelector('.shadow ')
		let domRect = rect.value
		let t = '.3'
		_css(s, 'transition', `all ${t}s`)
		_css(s, 'top', domRect.top)
		_css(s, 'left', domRect.left)
		_css(s, 'width', domRect.width)
		_css(s, 'height', domRect.height)

		let a = document.querySelector('.goods-detail')
		_css(a, 'transition', `all ${t}s`)
		_css(a, 'opacity', '0')
		_css(a, 'width', '100vw')
		_css(a, 'height', '100vh')
		_css(a, 'transform', `scale(${domRect.sw},${domRect.sh})`)
		_css(a, 'transform-origin', `0 0`)

		let d = document.querySelector('.shadow .wrap')
		_css(d, 'transition', `all ${t}s`)
		_css(d, 'opacity', '1')

		// state.d = false
		setTimeout(() => {
			_css(s, 'z-index', '-100')
			_css(s, 'transition', 'all 0s')
			_css(s, 'top', '-200vh')
		}, 300)
	}

	function showDetail(e, item) {
		let data = Mock.mock({
			'comment_list|3-50': [
				{
					name: '@cname',
					text: '@cparagraph(3)',
				},
			],
		})
		item.note_card.comment_list = data.comment_list
		item.note_card.createTime = Mock.Random.date('MM-dd')
		item.note_card.interact_info.collect_count = Mock.Random.integer(60, 3000)
		item.note_card.interact_info.share_count = Mock.Random.integer(60, 3000)
		state.current = cloneDeep(item)
		// console.log(state.current)

		state.d = true

		let domRect = e.currentTarget.getBoundingClientRect()
		// // console.log('e', domRect)

		let s = document.querySelector('.shadow')

		_css(s, 'z-index', '1')
		_css(s, 'transition', 'all 0s')
		_css(s, 'top', domRect.top)
		_css(s, 'left', domRect.left)
		_css(s, 'width', domRect.width)
		_css(s, 'height', domRect.height)

		let t = '.3'
		let d = document.querySelector('.shadow .wrap')
		d.innerHTML = ''
		d.append(e.currentTarget.cloneNode(true))
		_css(d, 'display', 'block')
		_css(d, 'transition', `all ${t}s`)
		_css(d, 'opacity', '1')

		let sw = domRect.width / baseStore.bodyWidth
		let sh = domRect.height / baseStore.bodyHeight
		domRect.sw = sw
		domRect.sh = sh

		let a = document.querySelector('.goods-detail')
		_css(a, 'opacity', '0')
		_css(a, 'width', '100vw')
		_css(a, 'height', '100vh')
		_css(a, 'transform', `scale(${domRect.sw},${domRect.sh})`)
		_css(a, 'transform-origin', `0 0`)

		rect.value = domRect
		setTimeout(() => {
			_css(s, 'transition', `all ${t}s`)
			_css(s, 'top', 0)
			_css(s, 'left', 0)
			_css(s, 'width', '100vw')
			_css(s, 'height', '100vh')

			_css(d, 'opacity', '0')
			_css(d, 'z-index', '-1')

			_css(a, 'transition', `all ${t}s`)
			_css(a, 'opacity', '1')
			_css(a, 'transform', `scale(1,1)`)
			_css(a, 'transform-origin', `0 0`)
		})
	}
</script>

<style scoped lang="scss">
	#Community {
		font-size: 14px;
		color: white;
		padding-top: var(--home-header-height);
		background: rgb(21, 23, 36);

		.Scroll {
			height: calc(
				var(--vh, 1vh) * 100 - var(--home-header-height) - var(--footer-height)
			) !important;
		}

		@p: 1px;

		.search {
			margin-left: 2%;
			width: 96%;
			box-sizing: border-box;
			padding: 10px;
			border: 1px solid #646464;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 16px;
			margin-bottom: 10px;
			border-radius: 8px;

			.left {
				display: flex;
				align-items: center;
				gap: 5px;
				color: gray;

				svg {
					font-size: 16px;
				}
			}
		}

		.list {
			margin-left: 2%;
			width: 96%;
		}
	}

	.card {
		border-radius: 4px;
		overflow: hidden;
		background: var(--main-bg);

		.poster {
			display: block;
			width: 100%;
			object-fit: cover;
			//height: 33vh;
		}

		.bottom {
			color: gainsboro;
			padding: 10px;
			padding-bottom: 15px;

			.title {
				font-size: 14px;
				margin-bottom: 8px;
			}

			.b2 {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.user {
					display: flex;
					font-size: 12px;

					img {
						width: 15px;
						border-radius: 50%;
						margin-right: 5px;
					}
				}

				.star {
					display: flex;
					align-items: center;
					gap: 3px;

					svg {
						font-size: 15px;
					}

					.num {
						font-size: 12px;
					}
				}
			}
		}
	}

	.shadow {
		background: var(--color-message);
		position: absolute;
		left: 0;
		top: -200vh;
		width: 100%;
		transition: all 0.3s;
		overflow: hidden;
		z-index: -100;

		.wrap {
			position: absolute;
			z-index: 9999;
		}
	}
</style>
