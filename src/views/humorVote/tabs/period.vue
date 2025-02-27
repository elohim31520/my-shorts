<template>
	<div class="grid grid-cols-5 gap-4 period-wrap">
		<div class="col-span-4">
			<div class="tabs" ref="rolBd">
				<div class="min-w-100% whitespace-nowrap h-30">
					<span
						v-for="vo in list"
						:key="vo.number"
						class="w-75 mt-9 text-12 text-center inline-block"
						:class="{ 'color-primary': vo.number == period }"
						@click="setPeriod(vo.number)"
					>
						{{ vo.name }}
					</span>
				</div>
			</div>
		</div>
		<div class="col-span-1">
			<van-dropdown-menu ref="dropdownRef">
				<van-dropdown-item :title="getTitle()">
					<div class="dropdown-body w-full">
						<div class="grid grid-cols-4 text-center py-10">
							<div v-for="vo in list" :key="vo.number" class="col-span-1">
								<span
									class="flex-y-center lh-28 rounded-2 border border-[#a9a9a9] mb-10 justify-center text-12"
									:class="{
										'border-#34c759 color-primary': vo.number == period,
									}"
									@click="select(vo.number)"
								>
									{{ vo.name }}
								</span>
							</div>
						</div>
					</div>
				</van-dropdown-item>
			</van-dropdown-menu>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch, nextTick } from 'vue'
	import { usePictureDetailStore } from '@/stores/pictureDetail'
	import { storeToRefs } from 'pinia'

	const { setPeriod } = usePictureDetailStore()
	const { period } = storeToRefs(usePictureDetailStore())

	/**
	 * @typedef {Object} periodItem
	 * @property {number} period - int 唯一標識符，代表年份＋期數 ex: 2024100。
	 * @property {string} name - 該年份的顯示名稱，格式為“第XXX期”。
	 * @property {number} number - int 期數，ex: 100”。
	 */

	/**
	 * @type {periodItem[]}
	 * @description list 包含一系列期數對象。
	 */
	const props = defineProps({
		list: {
			type: [Object, Array],
			default: () => [],
		},
	})

	const dropdownRef = ref(null)

	watch(period.value, (v) => {
		setRol()
	})

	const elementIsVisibleInViewport = (el, partiallyVisible = false, opt) => {
		const { top, left, bottom, right } = el.getBoundingClientRect()
		let width = innerWidth

		if (opt && opt.right) {
			width = innerWidth - opt.right
		}

		return partiallyVisible
			? ((top > 0 && top < innerHeight) ||
					(bottom > 0 && bottom < innerHeight)) &&
					((left > 0 && left < width) || (right > 0 && right < innerWidth))
			: top >= 0 && left >= 0 && bottom <= innerHeight && right <= width
	}

	const getIndex = () => {
		return props.list.findIndex((vo) => vo.number === period.value)
	}

	const setRol = async () => {
		await nextTick()
		if (!refs.rolBd) return
		let act = refs.rolBd.querySelector('.act')
		let isView = elementIsVisibleInViewport(act, false, { right: 70 })
		let wz = act.getBoundingClientRect()
		if (!isView) {
			refs.rolBd.scrollLeft = wz.width * getIndex()
		}
	}

	const getTitle = () => {
		let obj = props.list.find((vo) => vo.number === period.value)
		return _get(obj, 'name', '请选择')
	}

	const select = (num) => {
		setPeriod(num)
		dropdownRef.value?.close()
	}
</script>

<style lang="scss">
	.period-wrap {
		.van-dropdown-menu {
			height: 1.875rem;
		}
		.van-dropdown-menu__bar {
			height: 2rem;
		}
		.van-hairline--top-bottom::after,
		.van-hairline-unset--top-bottom::after {
			border: 0;
		}
		.van-dropdown-item {
			z-index: 103;
		}
		.van-dropdown-menu__title {
			font-size: 0.75rem;
			background: $primary-color;
			color: #fff;
			border-radius: 0.9375rem;
			padding: 0 0.9375rem 0 0.3125rem;
		}
		.van-dropdown-menu__title::after {
			right: 0.375rem;
		}
		.dropdown-body {
			max-height: 34.375rem;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
		}
	}
	.tabs {
		overflow-x: auto;
		&::-webkit-scrollbar {
			display: none;
		}
	}
</style>
