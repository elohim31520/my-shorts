<template>
	<ul class="statistic-footer">
		<li
			v-for="(vo, index) in footers"
			:key="index"
			:class="{ active: index == footerIndex }"
			@click="doClick(vo)"
		>
			<p class="flex-center">{{ first(vo.name) }}</p>
			<span>{{ vo.name }}</span>
		</li>
		<li v-if="isMounted">
			<van-popover
				v-model:show="showPopover"
				placement="top-end"
				class="statistic-popover"
			>
				<ul class="statistic-item-list">
					<li
						v-for="(vo, index) in items"
						:key="index"
						@click="doClick(vo)"
						:class="{ active: index == currentIndex }"
					>
						<div class="frame">
							<img :src="`/public-assets/images/statistic/${vo.icon}`" />
							<span>{{ vo.name }}</span>
						</div>
					</li>
				</ul>
				<template #reference>
					<p class="flex-center more"></p>
					<span>更多</span>
				</template>
			</van-popover>
		</li>
		<li v-else>
			<p class="flex-center more"></p>
			<span>更多</span>
		</li>
	</ul>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { redirect } from '@/modules/util.js'

	const showPopover = ref(false)
	const isMounted = ref(false)
	const footerIndex = ref(-1)
	const currentIndex = ref(-1)

	const footers = [
		{ path: '/statistic', name: '资讯统计' },
		{ path: '/statistic/attribute', name: '属性参照' },
		{ path: '/statistic/trend/special', name: '特码历史' },
		{ path: '/statistic/trend/positive', name: '正码历史' },
	]

	const items = [
		{ path: '/statistic', name: '资讯统计', icon: '1.png' },
		{ path: '/statistic/attribute', name: '属性参照', icon: '2.png' },
		{ path: '/statistic/trend/special', name: '特码历史', icon: '3.png' },
		{ path: '/statistic/trend/positive', name: '正码历史', icon: '4.png' },
		{ path: '/statistic/table/ws', name: '尾数大小', icon: '5.png' },
		{ path: '/statistic/pie/sxSpecial', name: '生肖特码', icon: '6.png' },
		{ path: '/statistic/pie/sxPositive', name: '生肖正码', icon: '7.png' },
		{ path: '/statistic/pie/spSpecial', name: '波色特码', icon: '8.png' },
		{ path: '/statistic/pie/spPositive', name: '波色正码', icon: '9.png' },
		{ path: '/statistic/bar/special', name: '特码两面', icon: '10.png' },
		{ path: '/statistic/pie/specialTail', name: '特码尾数', icon: '11.png' },
		{ path: '/statistic/pie/positiveTail', name: '正码尾数', icon: '12.png' },
		{ path: '/statistic/bar/positive', name: '正码总分', icon: '13.png' },
		{ path: '/statistic/pie/number', name: '号码波段', icon: '14.png' },
		{ path: '/statistic/table/jqys', name: '家禽野兽', icon: '15.png' },
		{ path: '/statistic/table/lm', name: '连码走势', icon: '16.png' },
		{ path: '/statistic/table/lx', name: '连肖走势', icon: '17.png' },
	]

	onMounted(() => {
		isMounted.value = true
		footerIndex.value = _findIndex(
			footers,
			(vo) => vo.path == location.pathname
		)
		currentIndex.value = _findIndex(items, (vo) => vo.path == location.pathname)
	})

	function first(str) {
		return _head(str.split(''))
	}

	function doClick(vo) {
		if (vo.path) {
			redirect(vo.path, { skip: true })
		}
	}
</script>

<style lang="scss" scoped>
	.statistic-item-list {
		display: flex;
		flex-wrap: wrap;
		li {
			width: 25%;
			font-size: 0.75rem;
			padding: 0.5rem;
			&.active {
				.frame {
					background-color: #eee;
				}
			}
			.frame {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				padding: 0.3rem;
			}
			img {
				width: 1.5rem;
				height: 1.5rem;
				margin-bottom: 0.2rem;
			}
		}
	}
	.statistic-popover {
		left: 1rem !important;
		width: calc(100vw - 2rem);
		@media (min-width: 480px) {
			left: calc(50% - 240px + 1rem) !important;
			width: calc(480px - 2rem);
		}
	}
	.statistic-footer {
		z-index: 10;
		display: flex;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		max-width: 480px;
		height: 3.125rem;
		background-color: #fff;
		@media (min-width: 480px) {
			left: calc(50% - 240px);
		}
		li {
			width: 20%;
			height: 100%;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-size: 0.75rem;
			font-weight: 600;
			color: #656565;
			&.active {
				color: $primary-color;
				p {
					color: #fff;
					background-color: $primary-color;
				}
			}
			p {
				width: 1.5625rem;
				height: 1.5625rem;
				border-radius: 50%;
				background-color: #aeaeb1;
				color: #f2f2f2;
				margin-bottom: 0.2rem;
				position: relative;
				&.more {
					&::after {
						content: '';
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						width: 50%;
						height: 3px;
						background-color: #fff;
					}
					&::before {
						content: '';
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%) rotate(90deg);
						width: 50%;
						height: 3px;
						background-color: #fff;
					}
				}
			}
		}
	}
</style>
