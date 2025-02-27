<template>
	<div class="pt-45">
		<Header title="属性参照" :isTop="true" />
		<div class="scroll-container">
			<swiper
				:slides-per-view="3.65"
				:space-between="10"
				class="scroll-content px-10"
				:initialSlide="index"
			>
				<swiper-slide
					v-for="(item, index) in tabList"
					:key="index"
					:class="['btn mr-10', { active: item.tab === currentTab }]"
					@click="changeTab(item.tab)"
				>
					{{ item.name }}
				</swiper-slide>
			</swiper>
		</div>

		<div class="px-10 py-5" v-show="currentTab === 'color'">
			<div
				class="mb-10 pa-10 rounded-20 shadow"
				v-for="(item, index) in attrData.colorList"
				:key="index"
			>
				<p
					class="font-600"
					:class="[
						{
							co1: item.name === '红波',
							co2: item.name === '蓝波',
							co3: item.name === '绿波',
						},
					]"
				>
					{{ item.name }}
				</p>
				<div class="mt-5 flex justify-start items-center flex-wrap gap-3">
					<div
						class="ball"
						v-for="innerItem in item.list"
						:key="innerItem.number"
					>
						<div class="relative">
							<SvgIcon
								size="1.875rem"
								:name="`ball-${getIconName(innerItem.color)}`"
							/>
							<span class="ball-number">
								{{ handleNumber(innerItem.number) }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div
			class="px-10 py-5 flex justify-center items-start gap-5"
			v-show="currentTab === 'shengxiao'"
		>
			<div class="w-50%">
				<div
					class="mb-10 pa-10 rounded-20 shadow"
					v-for="(item, index) in attrData.shengxiaoList.slice(0, 6)"
					:key="index"
				>
					<p class="font-600 color-#656565">
						{{ item.name }}
					</p>
					<div class="mt-5 flex justify-start items-center flex-wrap gap-1">
						<div
							class="ball"
							v-for="innerItem in item.list"
							:key="innerItem.number"
						>
							<div class="relative">
								<SvgIcon
									size="1.875rem"
									:name="`ball-${getIconName(innerItem.color)}`"
								/>
								<span class="ball-number">
									{{ handleNumber(innerItem.number) }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="w-50%">
				<div
					class="mb-10 pa-10 rounded-20 shadow"
					v-for="(item, index) in attrData.shengxiaoList.slice(6, 12)"
					:key="index"
				>
					<p class="font-600 color-#656565">
						{{ item.name }}
					</p>
					<div class="mt-5 flex justify-start items-center flex-wrap gap-1">
						<div
							class="ball"
							v-for="innerItem in item.list"
							:key="innerItem.number"
						>
							<div class="relative">
								<SvgIcon
									size="1.875rem"
									:name="`ball-${getIconName(innerItem.color)}`"
								/>
								<span class="ball-number">
									{{ handleNumber(innerItem.number) }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="px-10 py-5" v-show="currentTab === 'wuxing'">
			<div
				class="mb-10 pa-10 rounded-20 shadow"
				v-for="(item, index) in attrData.wuxingList"
				:key="index"
			>
				<p class="font-600 color-#656565">
					{{ item.name }}
				</p>
				<div class="mt-5 flex justify-start items-center flex-wrap gap-3">
					<div
						class="ball"
						v-for="innerItem in item.list"
						:key="innerItem.number"
					>
						<div class="relative">
							<SvgIcon
								size="1.875rem"
								:name="`ball-${getIconName(innerItem.color)}`"
							/>
							<span class="ball-number">
								{{ handleNumber(innerItem.number) }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="px-10 py-5" v-show="currentTab === 'animalType'">
			<div
				class="mb-10 pa-10 rounded-20 shadow"
				v-for="(item, index) in attrData.animalTypeList"
				:key="index"
			>
				<div class="flex justify-start items-center flex-wrap">
					<span class="mr-10 font-600 color-#656565">{{ item.name }}</span>
					<span
						class="text-14 font-400 color-#656565"
						v-for="(innerItem, index) in item.list"
						:key="innerItem"
					>
						{{ `${index === 0 ? innerItem : '、' + innerItem}` }}
					</span>
				</div>
			</div>
		</div>

		<Footer />
	</div>
</template>

<script setup>
	import Header from '@/components/NormalHeader/index.vue'
	import Footer from '../Footer/index.vue'
	import { ref } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => {},
		},
	})

	const tabList = [
		{ name: '波色', tab: 'color' },
		{ name: '生肖', tab: 'shengxiao' },
		{ name: '五行', tab: 'wuxing' },
		{ name: '家禽野兽', tab: 'animalType' },
	]

	const attrData = _get(props.data, 'data')

	const currentTab = ref('color')

	const index = _findIndex(tabList, (item) => item.tab == currentTab.value)

	function changeTab(tab) {
		if (currentTab.value !== tab) {
			currentTab.value = tab
		}
	}

	function getIconName(val) {
		return val === 3 ? 'green' : val === 2 ? 'blue' : 'red'
	}

	// 後端返回的數字是字串
	function handleNumber(num) {
		return _trimStart(num, '0')
	}
</script>
<style lang="scss" scoped>
	.swiper {
		padding: 0 0.625rem;
		width: 100%;
	}

	.scroll-container {
		max-width: 480px;
		width: 100%;
		height: 2.5rem;
		background-color: #fafafa;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.btn {
		width: 25.4%;
		height: 1.875rem;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.625rem;
		font-weight: 500;
		text-align: center;
		color: #656565;
		border: solid 0.0625rem #e0e0e0;
		&.active {
			background-color: #e0f7fa;
			color: $primary-color;
			border-color: $primary-color;
			font-weight: 600;
			background-color: #f1fee6;
		}
	}

	.shadow {
		box-shadow: 0px 0px 8px 0px #0000001a;
	}

	.ball {
		padding: 0.3125rem 0;
	}

	.co1 {
		color: #fa2a42;
	}

	.co2 {
		color: #348ffb;
	}

	.co3 {
		color: $primary-color;
	}

	.ball-number {
		color: #fff;
		font-weight: 700;
		font-size: 0.9375rem;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
