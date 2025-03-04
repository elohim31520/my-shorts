<template>
	<div class="indicator-home" :class="{ isLight }">
		<div class="notice" :style="noticeStyle"><span>下拉刷新内容</span></div>
		<div class="toolbar" ref="toolbar" :style="toolbarStyle">
			<SvgIcon
				name="icon_button_Menu"
				size="1.875rem"
				@click="$emit('showSlidebar')"
			/>
			<div class="tab-ctn">
				<div class="tabs" ref="tabs">
					<div
						class="tab"
						:class="{ active: index === 0 }"
						@click.stop="change(0)"
					>
						<span>关注</span>
					</div>
					<div
						class="tab"
						:class="{ active: index === 1 }"
						@click.stop="change(1)"
					>
						<span>图纸</span>
					</div>
					<div
						class="tab"
						:class="{ active: index === 2 }"
						@click.stop="change(2)"
					>
						<span>图纸</span>
					</div>
					<div
						class="tab"
						:class="{ active: index === 3 }"
						@click.stop="change(3)"
					>
						<span>直播</span>
						<img src="/shorts/img/icon/live.webp" class="tab2-img" />
					</div>
					<div
						class="tab"
						:class="{ active: index === 4 }"
						@click.stop="change(4)"
					>
						<span>推荐</span>
					</div>
				</div>
				<div class="indicator" ref="indicator"></div>
			</div>
			<SvgIcon
				class="color-white"
				name="icon_button_Query"
				size="1.875rem"
				v-redirect="'/resourceSearch'"
			/>
		</div>
		<Loading
			:style="loadingStyle"
			class="loading"
			style="width: 40px"
			:is-full-screen="false"
		/>
	</div>
</template>
<script>
	import Loading from '@/common/components/Loading.vue'
	import bus from '@/common/utils/bus'
	import { mapState } from 'pinia'
	import { useBaseStore } from '@/stores/shorts'
	import { _css } from '@/common/utils/dom'

	export default {
		name: 'IndicatorHome',
		components: {
			Loading,
		},
		props: {
			loading: {
				type: Boolean,
				default() {
					return false
				},
			},
			//用于和slidList绑定，因为一个页面可能有多个slidList，但只有一个indicator组件
			name: {
				type: String,
				default: () => '',
			},
			index: {
				type: Number,
				default: () => 0,
			},
			isLight: {
				type: Boolean,
				default: () => false,
			},
		},
		setup() {
			const baseStore = useBaseStore()
			return { baseStore }
		},
		data() {
			return {
				indicatorRef: null,
				lefts: [],
				indicatorSpace: 0,
				type: 1,
				moveY: 0,
			}
		},
		computed: {
			...mapState(useBaseStore, ['judgeValue', 'homeRefresh']),
			transform() {
				return `translate3d(0, ${this.moveY - this.judgeValue > this.homeRefresh ? this.homeRefresh : this.moveY - this.judgeValue}px, 0)`
			},
			toolbarStyle() {
				if (this.loading) {
					return {
						opacity: 1,
						'transition-duration': '300ms',
						transform: `translate3d(0, 0, 0)`,
					}
				}
				if (this.moveY) {
					return {
						opacity:
							1 - (this.moveY - this.judgeValue) / (this.homeRefresh / 2),
						transform: this.transform,
					}
				}
				return {
					opacity: 1,
					'transition-duration': '300ms',
					transform: `translate3d(0, 0, 0)`,
				}
			},
			noticeStyle() {
				if (this.loading) {
					return { opacity: 0 }
				}
				if (this.moveY) {
					return {
						opacity:
							(this.moveY - this.judgeValue) / (this.homeRefresh / 2) - 0.5,
						transform: this.transform,
					}
				}
				return { opacity: 0 }
			},
			loadingStyle() {
				if (this.loading) {
					return { opacity: 1, 'transition-duration': '300ms' }
				}
				if (this.moveY) {
					return {
						opacity:
							(this.moveY - this.judgeValue) / (this.homeRefresh / 2) - 0.5,
						transform: this.transform,
					}
				}
				return {}
			},
		},
		created() {},
		mounted() {
			this.initTabs()
			bus.on(this.name + '-moveX', this.move)
			bus.on(this.name + '-moveY', (e) => {
				this.moveY = e
			})
			bus.on(this.name + '-end', this.end)
		},
		unmounted() {
			bus.off(this.name + '-moveX', this.move)
			bus.off(this.name + '-moveY')
			bus.off(this.name + '-end', this.end)
		},

		methods: {
			change(index) {
				this.$emit('update:index', index)
				_css(this.indicatorRef, 'transition-duration', `300ms`)
				_css(this.indicatorRef, 'left', this.lefts[index] + 'px')
			},
			initTabs() {
				let tabs = this.$refs.tabs
				this.indicatorRef = this.$refs.indicator
				let indicatorWidth = _css(this.indicatorRef, 'width')
				for (let i = 0; i < tabs.children.length; i++) {
					let item = tabs.children[i]
					let tabWidth = _css(item, 'width')
					this.lefts.push(
						item.getBoundingClientRect().x -
							tabs.children[0].getBoundingClientRect().x +
							(tabWidth * 0.5 - indicatorWidth / 2)
					)
				}
				this.indicatorSpace = this.lefts[1] - this.lefts[0]
				_css(this.indicatorRef, 'transition-duration', `300ms`)
				_css(this.indicatorRef, 'left', this.lefts[this.index] + 'px')
			},
			move(e) {
				_css(this.indicatorRef, 'transition-duration', `0ms`)
				_css(
					this.indicatorRef,
					'left',
					this.lefts[this.index] -
						e / (this.baseStore.bodyWidth / this.indicatorSpace) +
						'px'
				)
			},
			end(index) {
				this.moveY = 0
				_css(this.indicatorRef, 'transition-duration', `300ms`)
				_css(this.indicatorRef, 'left', this.lefts[index] + 'px')
				setTimeout(() => {
					_css(this.indicatorRef, 'transition-duration', `0ms`)
				}, 300)
			},
		},
	}
</script>

<style scoped lang="scss">
	.indicator-home {
		position: absolute;
		font-size: 16px;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		color: white;
		height: var(--home-header-height);
		transition: all 0.3s;
		font-weight: bold;

		.notice {
			opacity: 0;
			top: 0;
			position: absolute;
			width: 100vw;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.loading {
			opacity: 0;
			top: 7px;
			right: 7px;
			position: absolute;
		}

		.toolbar {
			z-index: 2;
			position: relative;
			color: white;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			padding: 0 15px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.tab-ctn {
				width: 80%;
				position: relative;

				.tabs {
					display: flex;
					justify-content: space-between;

					.tab {
						transition: color 0.3s;
						color: rgba(white, 0.7);
						position: relative;
						font-size: 17px;
						cursor: pointer;

						.tab1-img {
							position: absolute;
							$width: 12px;
							width: $width;
							height: $width;
							margin-left: 4px;
							transition: all 0.3s;
							// margin-top: 7px;
						}

						.tab2-img {
							position: absolute;
							height: 15px;
							left: 24px;
							top: -5px;
						}

						&.active {
							color: white;
						}
					}
				}

				.indicator {
					//transition: left .3s;
					position: absolute;
					bottom: -6px;
					height: 2.6px;
					width: 26px;
					//width: calc(100% / 5);
					background: #34c759;
					border-radius: 5px;
				}
			}
		}

		.mask {
			top: 0;
			position: absolute;
			width: 100vw;
			height: calc(var(--vh, 1vh) * 100);
			background: #00000066;
		}
	}
</style>
