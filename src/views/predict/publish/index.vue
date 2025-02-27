<template>
	<div class="">
		<Header title="发布心水" />
		<div class="mt-45 pt-20 px-10 bg-#fafafa content-wrapper">
			<PopupSelect
				title="类型"
				:options="playTypeCodeList"
				:value="playType"
				:maxCount="maxCount"
				:selectedLength="selectedOptions.length"
				@changeValue="changePlayType"
				:isPrimary="true"
			/>
			<PopupSelect
				class="mt-20"
				title="位置"
				:options="playPositionList"
				:value="playPosition"
				@changeValue="changePlayPosition"
				:isCount="false"
				v-if="playPositionList.length"
			/>

			<div class="form-wrapper mt-10">
				<div class="form-group bg-#fff p-10 border-radius-10 shadow-primary">
					<h3>标题：</h3>
					<div class="flex gap-5 justify-between items-center">
						<div class="flex-1">
							<ClientOnly>
								<van-field
									v-model="form.title"
									type="text"
									placeholder="请输入标题"
									maxlength="18"
									autocomplete="off"
								/>
							</ClientOnly>
						</div>
						<div class="font-size-14 color-#aeaeb1 text-right word-count">
							<span>{{ form.title.length }}</span>
							/18
						</div>
					</div>
				</div>

				<div
					class="p-10 mt-10 border-radius-10 shadow-primary h-74"
					:class="[isError ? 'bg-#ffecec' : 'bg-#fff']"
				>
					<div class="form-group">
						<h3 class="flex justify-between">
							<span>查看积分:</span>
							<span class="font-size-12 color-#aeaeb1">
								最小单位{{
									minScore === 0 ? `${minScore}(免费)` : minScore
								}}，最大单位{{ maxScore }}
							</span>
						</h3>
						<div class="flex-1 h-22 color-#434343">
							<ClientOnly>
								<van-field
									v-model="form.integral"
									type="digit"
									placeholder="请输入查看积分"
									:maxlength="maxScore.toString().length"
									autocomplete="off"
								/>
							</ClientOnly>
						</div>
					</div>
				</div>

				<SelectBalls
					ref="childrenBalls"
					:options="optionList"
					:limit="maxCount"
					:playType="playType"
					:playPosition="playPosition"
					v-model="selectedOptions"
				/>
			</div>
		</div>

		<div
			class="footer fixed bottom-0 w-full max-w-480px bg-white h-60 flex items-center justify-center px-10"
		>
			<van-button
				color="#f2f2f2"
				size="large"
				class="btn btn-reset"
				:disabled="isSubmit"
				@click="resetForm"
			>
				<span :class="[canReset ? 'color-#434343' : 'color-#aeaeb1']">
					重置
				</span>
			</van-button>
			<van-button
				:color="publishBtnColor"
				size="large"
				class="btn btn-publish"
				:loading="isSubmit"
				loading-text="发布中..."
				@click="handleSubmit"
			>
				<div
					:class="[
						'flex',
						'items-center',
						canSubmit ? 'color-#fff' : 'color-#aeaeb1',
					]"
				>
					发布心水
				</div>
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { provide, ref, computed, onMounted, watch } from 'vue'
	import Header from '@/components/NormalHeader/index.vue'
	import ClientOnly from '@/components/ClientOnly/index.vue'
	import PopupSelect from './PopupSelect/index.vue'
	import SelectBalls from './SelectBalls/index.vue'

	import { Base64 } from 'js-base64'
	import { getIPInfo } from '@/api/common.js'
	import { createPreferredChoicePredict } from '@/api/predict.js'
	import { useLoginPopupStore } from '@/stores/loginPopup.js'
	import { useUserStore } from '@/stores/user.js'
	import { storeToRefs } from 'pinia'

	import {
		isLogin,
		toast,
		confirmDialog,
		redirect,
		getCurrentLotteryType,
		isBlank,
		back,
	} from '@/modules/util'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)

	const { isExpert } = storeToRefs(useUserStore())

	const playTypeCodeList = _get(props, 'data.playCodeLists.list', [])
	const playType = ref(_get(playTypeCodeList, '[0].predictionTypeName', ''))

	const playPositionList = ref(_get(props, 'data.playPositionLists', []))
	const playPosition = ref(_get(props, 'data.playPosition', ''))

	const optionList = ref(_get(props, 'data.optionList', []))

	const playTypeMaxCount = ref(_get(props, 'data.playTypeMaxCount', 0))
	const playPositionMaxCount = ref(_get(props, 'data.playPositionMaxCount', 0))

	const playTypeMinScore = ref(_get(playTypeCodeList, '[0].minScore', 0))
	const playTypeMaxScore = ref(_get(playTypeCodeList, '[0].maxScore', 0))
	const playPositionMinScore = ref(
		_get(playPositionList.value, '[0].minScore', 0)
	)
	const playPositionMaxScore = ref(
		_get(playPositionList.value, '[0].maxScore', 0)
	)

	const maxCount = computed(
		() => playPositionMaxCount.value || playTypeMaxCount.value
	)
	const minScore = computed(
		() => playPositionMinScore.value || playTypeMinScore.value
	)
	const maxScore = computed(
		() => playPositionMaxScore.value || playTypeMaxScore.value
	)

	const changePlayType = (val) => {
		playType.value = val.predictionTypeName

		const list = _find(
			playTypeCodeList,
			(vo) => vo.predictionTypeName === val.predictionTypeName
		)
		playTypeMaxCount.value = list.maxCount
		playTypeMinScore.value = list.minScore
		playTypeMaxScore.value = list.maxScore

		optionList.value = list.optionList
		selectedOptions.value = []

		playPositionList.value = _get(list, 'children', [])
		playPosition.value = _get(
			playPositionList.value,
			'[0].predictionTypeName',
			''
		)
		playPositionMaxCount.value = playPositionList.value.length
			? playPositionList.value[0].maxCount
			: 0
		playPositionMinScore.value = playPositionList.value.length
			? playPositionList.value[0].minScore
			: 0
		playPositionMaxScore.value = playPositionList.value.length
			? playPositionList.value[0].maxScore
			: 0
	}

	const changePlayPosition = (val) => {
		playPosition.value = val.predictionTypeName
		playPositionMaxCount.value = val.maxCount
		playPositionMinScore.value = val.minScore
		playPositionMaxScore.value = val.maxScore
		selectedOptions.value = []
	}

	const childrenBalls = ref(null)
	const selectedOptions = ref([])

	const form = ref({
		title: '',
		integral: '',
	})

	const canSubmit = computed(() => {
		return !!(
			form.value.title.length &&
			form.value.integral.length &&
			selectedOptions.value.length === maxCount.value
		)
	})

	const canReset = computed(() => {
		return !!(
			playType.value !== playTypeCodeList[0].predictionTypeName ||
			playPosition.value !==
				playTypeCodeList[0].children[0].predictionTypeName ||
			form.value.title.length ||
			form.value.integral.length ||
			selectedOptions.value.length
		)
	})

	const publishBtnColor = ref('#f2f2f2')

	watch(
		() => canSubmit.value,
		(val) => {
			if (val) publishBtnColor.value = '#34c759'
			else publishBtnColor.value = '#f2f2f2'
		}
	)

	const isError = ref(false)

	const resetForm = () => {
		if (!canReset.value) return false

		form.value.title = ''
		form.value.integral = ''
		isError.value = false
		childrenBalls.value.cleanBalls()
		changePlayType({
			predictionTypeName: playTypeCodeList[0].predictionTypeName,
			maxCount: playTypeCodeList[0].maxCount,
		})
	}

	const isSubmit = ref(false)
	const handleSubmit = async () => {
		if (!canSubmit.value) return false

		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return false
		}

		if (!isExpert.value) {
			confirmDialog('您还不是专家，目前无法发文', {
				title: '前往申請專家',
				confirmButtonText: '申請專家',
			})
				.then(() => {
					redirect('/expert/apply')
				})
				.catch(() => {
					return false
				})

			return false
		}

		if (isBlank(form.value.title)) {
			toast('请输入标题')
			return false
		}

		if (
			isBlank(form.value.integral) ||
			form.value.integral < minScore.value ||
			form.value.integral > maxScore.value
		) {
			isError.value = true
			toast(
				`查看积分输入格式错误\n请输入数字${minScore.value}-${maxScore.value}`
			)
			return false
		}
		isError.value = false

		if (maxCount.value !== selectedOptions.value.length) {
			toast(
				`您目前只选取了${selectedOptions.value.length}个，还差${maxCount.value - selectedOptions.value.length}个`
			)
			return false
		}

		if (isSubmit.value) return false

		isSubmit.value = true

		const { code: gameType } = getCurrentLotteryType()
		const playCode = _get(
			_find(
				playTypeCodeList,
				(item) => item.predictionTypeName === playType.value
			),
			'playTypeCode',
			''
		)
		const playPositionCode = _get(
			_find(
				playPositionList.value,
				(item) => item.predictionTypeName === playPosition.value
			),
			'playTypeCode',
			''
		)
		const playTypeCode = playPositionCode || playCode
		let selectedBalls = []
		selectedOptions.value.map((item) => selectedBalls.push(item))

		const res = await createPreferredChoicePredict({
			bizFlag: 'r',
			gameType,
			playTypeCode,
			predictScore: form.value.integral,
			predict: selectedBalls,
			predictTitle: form.value.title,
			fromIp: ipBase64.value,
		})

		if (res.success) {
			toast('发布成功')
			back()
		} else {
			toast('发布失败')
			setTimeout(() => (isSubmit.value = false), 1000)
		}
	}

	const ipBase64 = ref('')
	onMounted(() => {
		getIPInfo().then((ipJson) => {
			ipBase64.value = Base64.encode(JSON.stringify(ipJson))
		})
	})
</script>

<style lang="scss" scoped>
	.content-wrapper {
		min-height: calc(100vh - 2.8125rem);
		padding-bottom: 5rem;

		.border-radius-10 {
			border-radius: 0.625rem;
		}

		.form-wrapper {
			.form-group {
				line-height: 1.375;
				letter-spacing: 0.02rem;
				h3 {
					color: #434343;
					margin-bottom: 0.625rem;
				}

				:deep(.van-field) {
					padding: 0;
					input {
						font-size: 1rem;
						&::placeholder {
							color: #aeaeb1;
							font-size: 1rem;
						}
					}
				}
			}
			.word-count {
				letter-spacing: 0.0175rem;
				line-height: 1.375rem;
			}
		}
	}

	.footer {
		left: 50%;
		transform: translateX(-50%);

		.btn {
			border-radius: 0.5rem;
			line-height: 2.5;
			height: 2.5rem;
			font-size: 1.125rem;
			font-weight: 600;

			&.btn-reset {
				width: 36.056%;
				margin-right: 0.5rem;
			}

			&.btn-publish {
				flex: 1;
				border: 0;
			}
		}
	}
</style>
