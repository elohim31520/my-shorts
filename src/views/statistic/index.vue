<template>
	<NormalHeader title="资讯统计" :isTop="true">
		<!-- <van-field v-model="period" label="期数" /> -->
		<div class="flex color-#656565 text-14">
			期数
			<input
				type="number"
				style="color: #333"
				v-model="period"
				@change="statSummery(period)"
				class="period"
				autocomplete="off"
			/>
		</div>
	</NormalHeader>
	<div class="content">
		<van-popup
			v-model:show="show"
			position="bottom"
			round
			closeable
			:style="{ height: '16.56rem' }"
		>
			<div class="popup-title">{{ popupTitle }}</div>
			<div v-if="typeof popupData === 'number'" class="count">
				{{ `【${Number(popupData)}】 统计的次数：${count}次` }}
			</div>
			<div v-else class="count">
				{{ `【${popupData}】 统计的次数：${count}次` }}
			</div>
			<div class="w-full flex justify-center">
				<van-button
					@click="show = false"
					type="success"
					color="#34c759"
					class="btn btn-confirm"
				>
					确定
				</van-button>
			</div>
		</van-popup>
		<div class="color-#656565">
			<div class="number-list">
				<div class="mb-5">特码出现期数最多的号码</div>
				<div class="ball-list flex-y-center justify-between text-center">
					<!-- 为每个号码生成的元素 -->
					<div
						v-for="(item, index) in specialHotNumberList"
						:key="index"
						class="rounded-20.5"
						@click="showCount(item, '1')"
					>
						<div class="relative">
							<SvgIcon
								size="1.875rem"
								:name="`ball-${getBallColor(item.number)}`"
							/>
							<span class="ball-list__number">
								{{ Number(item.number) }}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="number-list">
				<div class="mb-5">特码当前遗漏期数最多的号码</div>
				<div class="ball-list flex-y-center justify-between text-center">
					<!-- 为每个号码生成的元素 -->
					<div
						v-for="(item, index) in specialColdNumberList"
						:key="index"
						class="rounded-20.5"
						@click="showCount(item, '2')"
					>
						<div class="relative">
							<SvgIcon
								size="1.875rem"
								:name="`ball-${getBallColor(item.number)}`"
							/>
							<span class="ball-list__number">
								{{ Number(item.number) }}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="number-list">
				<div class="mb-5">正码出现期数最多的号码</div>
				<div class="ball-list flex-y-center justify-between text-center">
					<!-- 为每个号码生成的元素 -->
					<div
						v-for="(item, index) in normalHotNumberList"
						:key="index"
						class="rounded-20.5"
						@click="showCount(item, '3')"
					>
						<div class="relative">
							<SvgIcon
								size="1.875rem"
								:name="`ball-${getBallColor(item.number)}`"
							/>
							<span class="ball-list__number">
								{{ Number(item.number) }}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="number-list">
				<div class="mb-5">正码当前遗漏期数最多的号码</div>
				<div class="ball-list flex-y-center justify-between text-center">
					<!-- 为每个号码生成的元素 -->
					<div
						v-for="(item, index) in normalColdNumberList"
						:key="index"
						class="rounded-20.5"
						@click="showCount(item, '4')"
					>
						<div class="relative">
							<SvgIcon
								size="1.875rem"
								:name="`ball-${getBallColor(item.number)}`"
							/>
							<span class="ball-list__number">
								{{ Number(item.number) }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="mt-10 p-10 border border-#e6e6e6 color-#656565 rounded-8 shadow-primary"
		>
			<div class="zodiac-list">
				<span>特码出现期数最多的生肖</span>
				<span>
					<span
						v-for="(zodiac, index) in specialHotAnimalList"
						class="ml-9 inline-block color-#434343"
						@click="showCount(zodiac, '5')"
						:key="index"
					>
						{{ zodiac.name }}
					</span>
				</span>
			</div>
			<div class="zodiac-list">
				<span>特码当前遗漏期数最多的生肖</span>
				<span>
					<span
						v-for="(zodiac, index) in specialColdAnimalList"
						class="ml-9 inline-block color-#434343"
						@click="showCount(zodiac, '6')"
						:key="index"
					>
						{{ zodiac.name }}
					</span>
				</span>
			</div>
			<div class="zodiac-list">
				<span>正码出现期数最多的生肖</span>
				<span>
					<span
						v-for="(zodiac, index) in normalHotAnimalList"
						class="ml-9 inline-block color-#434343"
						@click="showCount(zodiac, '7')"
						:key="index"
					>
						{{ zodiac.name }}
					</span>
				</span>
			</div>
			<div class="zodiac-list last">
				<span>正码当前遗漏期数最多的生肖</span>
				<span>
					<span
						v-for="(zodiac, index) in normalColdAnimalList"
						class="ml-9 inline-block color-#434343"
						@click="showCount(zodiac, '8')"
						:key="index"
					>
						{{ zodiac.name }}
					</span>
				</span>
			</div>
		</div>
		<div
			class="mt-10 p-10 border border-#e6e6e6 color-#656565 rounded-8 shadow-primary"
		>
			<div class="color-list">
				<span>特码出现期数最多的波色</span>
				<span class="flex justify-between w-33rem">
					<span
						v-for="(colors, index) in specialHotColorList"
						class="ml-0"
						:class="getColor(colors.value)"
						@click="showCount(colors, '9')"
						:key="index"
					>
						{{ colors.value }}
					</span>
				</span>
			</div>
			<div class="color-list">
				<span>特码当前遗漏期数最多的波色</span>
				<span class="flex justify-between w-33rem">
					<span
						v-for="(colors, index) in specialColdColorList"
						class="ml-0"
						:class="getColor(colors.value)"
						@click="showCount(colors, '10')"
						:key="index"
					>
						{{ colors.value }}
					</span>
				</span>
			</div>
			<div class="color-list">
				<span>正码出现期数最多的波色</span>
				<span class="flex justify-between w-33rem">
					<span
						v-for="(colors, index) in normalHotColorList"
						class="ml-0"
						:class="getColor(colors.value)"
						@click="showCount(colors, '11')"
						:key="index"
					>
						{{ colors.value }}
					</span>
				</span>
			</div>
			<div class="color-list">
				<span>正码当前遗漏期数最多的波色</span>
				<span class="flex justify-between w-33rem">
					<span
						v-for="(colors, index) in normalColdColorList"
						class="ml-0"
						:class="getColor(colors.value)"
						@click="showCount(colors, '12')"
						:key="index"
					>
						{{ colors.value }}
					</span>
				</span>
			</div>
		</div>

		<div
			class="mt-10 p-10 border border-#e6e6e6 color-#656565 rounded-8 shadow-primary"
		>
			<div class="color-list">
				<span>特码出现期数最多的尾数</span>
				<span class="flex justify-between w-33rem color-#434343">
					<span
						v-for="(colors, index) in specialHotTailList"
						class="ml-0"
						@click="showCount(colors, '13')"
						:key="index"
					>
						{{ colors.name + '尾' }}
					</span>
				</span>
			</div>
			<div class="color-list">
				<span>特码当前遗漏期数最多的尾数</span>
				<span class="flex justify-between w-33rem color-#434343">
					<span
						v-for="(colors, index) in specialColdTailList"
						class="ml-0"
						@click="showCount(colors, '14')"
						:key="index"
					>
						{{ colors.name + '尾' }}
					</span>
				</span>
			</div>
		</div>
	</div>
	<Footer />
</template>
<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import Footer from './Footer/index.vue'
	import { ref } from 'vue'
	import { getStatSummery } from '@/api/statistic'
	import { getBallColor, toast } from '@/modules/util'
	import { notify } from '@/modules/util.js'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	const period = ref(100)
	const popupTitle = ref('')
	const popupData = ref()
	const count = ref(0)
	const show = ref(false)

	const specialHotNumberList = ref([]) // 特码出现期数最多的号码
	const specialColdNumberList = ref([]) // 特码当前遗漏期数最多的号码
	const normalHotNumberList = ref([]) // 正码出现期数最多的号码
	const normalColdNumberList = ref([]) // 正码当前遗漏期数最多的号码
	const specialHotAnimalList = ref([]) // 特码出现期数最多的生肖
	const specialColdAnimalList = ref([]) // 特码当前遗漏期数最多的生肖
	const normalHotAnimalList = ref([]) // 正码出现期数最多的生肖
	const normalColdAnimalList = ref([]) // 正码当前遗漏期数最多的生肖
	const specialHotColorList = ref([]) // 特码出现期数最多的波色
	const specialColdColorList = ref([]) // 特码当前遗漏期数最多的波色
	const normalHotColorList = ref([]) // 正码出现期数最多的波色
	const normalColdColorList = ref([]) // 正码当前遗漏期数最多的波色
	const specialHotTailList = ref([]) // 特码出现期数最多的尾数
	const specialColdTailList = ref([]) // 特码当前遗漏期数最多的尾数

	setData(props.data)

	function statSummery(period = 100) {
		if (!period) {
			notify('请输入期数', { type: 'warning' })
			return
		}
		if (period < 4) {
			toast('请从第4期开始搜索')
			return
		}
		getStatSummery(period).then((res) => {
			setData(res)
		})
	}
	function setData(res) {
		specialHotNumberList.value = _defaultTo(
			_get(res, 'data.specialHotNumberList'),
			[]
		)
		specialColdNumberList.value = _defaultTo(
			_get(res, 'data.specialColdNumberList'),
			[]
		)
		normalHotNumberList.value = _defaultTo(
			_get(res, 'data.normalHotNumberList'),
			[]
		)
		normalColdNumberList.value = _defaultTo(
			_get(res, 'data.normalColdNumberList'),
			[]
		)
		specialHotAnimalList.value = _defaultTo(
			_get(res, 'data.specialHotAnimalList'),
			[]
		)
		specialColdAnimalList.value = _defaultTo(
			_get(res, 'data.specialColdAnimalList'),
			[]
		)
		normalHotAnimalList.value = _defaultTo(
			_get(res, 'data.normalHotAnimalList'),
			[]
		)
		normalColdAnimalList.value = _defaultTo(
			_get(res, 'data.normalColdAnimalList'),
			[]
		)
		specialHotColorList.value = _defaultTo(
			_get(res, 'data.specialHotColorList'),
			[]
		)
		specialHotColorList.value = _defaultTo(
			_get(res, 'data.specialHotColorList'),
			[]
		)
		specialColdColorList.value = _defaultTo(
			_get(res, 'data.specialColdColorList'),
			[]
		)
		normalHotColorList.value = _defaultTo(
			_get(res, 'data.normalHotColorList'),
			[]
		)
		normalColdColorList.value = _defaultTo(
			_get(res, 'data.normalColdColorList'),
			[]
		)
		specialHotTailList.value = _defaultTo(
			_get(res, 'data.specialHotTailList'),
			[]
		)
		specialColdTailList.value = _defaultTo(
			_get(res, 'data.specialColdTailList'),
			[]
		)
	}
	function getColor(text) {
		if (text === '红波') return 'red'
		if (text === '绿波') return 'green'
		if (text === '蓝波') return 'blue'
	}
	function getPopupTitle(group) {
		if (group === '1') return '特码出现期数最多的号码'
		if (group === '2') return '特码当前遗漏期数最多的号码'
		if (group === '3') return '正码出现期数最多的号码'
		if (group === '4') return '正码当前遗漏期数最多的号码'
		if (group === '5') return '特码出现期数最多的生肖'
		if (group === '6') return '特码当前遗漏期数最多的生肖'
		if (group === '7') return '正码出现期数最多的生肖'
		if (group === '8') return '正码当前遗漏期数最多的生肖'
		if (group === '9') return '特码出现期数最多的波色'
		if (group === '10') return '特码当前遗漏期数最多的波色'
		if (group === '11') return '正码出现期数最多的波色'
		if (group === '12') return '正码当前遗漏期数最多的波色'
		if (group === '13') return '特码出现期数最多的尾数'
		if (group === '14') return '特码当前遗漏期数最多的尾数'
	}
	function showCount(item, group) {
		count.value = item.count

		if (Number(group) <= 4) popupData.value = item.number
		if ((Number(group) >= 5 && Number(group) <= 8) || Number(group) >= 13)
			popupData.value = item.name
		if (Number(group) >= 9 && Number(group) <= 12) popupData.value = item.value
		popupTitle.value = getPopupTitle(group)
		show.value = true
	}
</script>

<style lang="scss" scoped>
	.period {
		width: 2.7em;
		margin: 0 1.3rem 0 0.3rem;
		border: 1px solid #aeaeb1;
		border-radius: 0.3em;
		padding: 0 0.3rem;
	}
	.content {
		max-width: 480px;
		padding: 0.625rem;
		padding-bottom: 3.75rem;
		padding-top: 3.4375rem;
		background-color: #fafafa;
		min-height: calc(100dvh - 2.8125rem);
		.number-list {
			color: #656565;
			font-size: 1rem;
			border: 1px solid #e6e6e6;
			border-radius: 0.625rem;
			padding: 0.8rem;
			margin-bottom: 0.625rem;
			box-shadow: 0 0 0.25rem 0 rgba(0, 0, 0, 0.1);
		}
		.zodiac-list {
			display: flex;
			justify-content: space-between;
			font-size: 0.875rem;
			margin-bottom: 0.2rem;
			border-bottom: 1px solid #e6e6e6;
			&.last {
				border: none;
			}
		}
		.color-list {
			display: flex;
			justify-content: space-between;
			font-size: 0.875rem;
		}
		.red {
			color: #fa2a42;
		}
		.green {
			color: $primary-color;
		}
		.blue {
			color: #348ffb;
		}
	}
	:deep(.van-field__label) {
		width: 2rem;
	}
	.van-cell {
		width: 6rem;
	}
	.ball-list__number {
		color: #fff;
		font-weight: bold;
		font-size: 0.875rem;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.popup-title {
		display: flex;
		justify-content: center;
		height: 3.1rem;
		align-items: center;
		font-size: 1.3rem;
		font-weight: bold;
	}
	.count {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 10rem;
		color: #656565;
	}
	.btn {
		// --van-button-radius: 1.25rem;
		height: 100%;
		width: 6.875rem;
		font-size: 1rem;
		height: 100%;
		white-space: nowrap;
	}
	.btn-confirm {
		width: 80%;
		height: 2.5rem;
		font-size: 1.125rem;
		border-radius: 0.5rem;
	}
	:deep(.van-popup__close-icon) {
		color: #434343;
	}
</style>
