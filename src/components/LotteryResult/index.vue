<template>
	<div>
		<component
			:is="currentComponent"
			:lotteryResult="lotteryResult"
			:participantCount="participantCount"
		/>
	</div>
</template>

<script setup>
	import { ref, watch, inject, computed, onMounted } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useLotteryStore } from '@/stores/lottery'
	import {
		getLastLotteryResultApi,
		getNextLotteryInfoApi,
		getLotteryResultApi,
	} from '@/api/lottery'
	import { getHumorParticipantCountApi } from '@/api/humor.js'
	import { moneyFormat } from '@/modules/util'
	import Simple from './Simple/index.vue'
	import Normal from './Normal/index.vue'

	const props = defineProps({
		isSimple: {
			type: Boolean,
			default: false,
		},
		query: {
			type: Object,
			required: false,
			//{ lotteryType, year, issue } 必須要給「彩種」「年份」「期數」
		},
		enableHumorCount: {
			type: Boolean,
			default: true,
		},
	})

	const { lotteryType } = storeToRefs(useLotteryStore())

	// 取得 SSR 環境的傳入的初始值
	const lotteryResult = ref(_get(inject('data'), 'lotteryResult.data', {}))
	const participantCount = ref(0)
	const invalidTexts = ['等', '待', '官', '方', '开', '奖', '快']
	const nextLotteryYear = ref() //下一期年份
	const nextLotteryIssue = ref() //下一期期數

	const getLotteryResult = async () => {
		const response = props.query
			? await getLotteryResultApi({ ...props.query }).then((res) => {
					if (!res.data) res.data = createDefaultResult()
					return res
				})
			: await getLastLotteryResultApi({
					lotteryType: lotteryType.value,
				})

		lotteryResult.value = _get(response, 'data', {})
	}

	function createDefaultResult() {
		return {
			year: props.query.year,
			issue: props.query.issue,
			openCode: _fill(Array(7), '-'),
		}
	}

	const getLastIssueInfo = async () => {
		const res = await getNextLotteryInfoApi(lotteryType.value)
		nextLotteryYear.value = _get(res, 'data.nextIssueYear')
		nextLotteryIssue.value = _get(res, 'data.nextIssue')
	}

	const getHumorParticipantCount = async () => {
		const response = await getHumorParticipantCountApi({
			year: nextLotteryYear.value,
			issue: nextLotteryIssue.value,
			lotteryType: lotteryType.value,
		})

		participantCount.value = moneyFormat(_get(response, 'data.number', 0))
	}

	function checkValidNumber(value) {
		const number = +value

		return _isNumber(number) && !_isNaN(number) && number !== 0
	}

	function processOpenCode(openCode) {
		const cloneOpenCode = _cloneDeep(openCode)

		return _map(cloneOpenCode, (code) => {
			const isValid = checkValidNumber(code.value)
			const color = isValid ? code.color : 'black'

			return {
				...code,
				isValid,
				color,
			}
		})
	}

	function checkAllNumbersInvalid(processedOpenCode) {
		return _every(processedOpenCode, (code) => !code.isValid)
	}

	// 監聽彩票類型變化更新結果
	watch(lotteryType, async () => {
		await Promise.all([getLotteryResult(), getLastIssueInfo()])
		getHumorParticipantCount()
	})

	watch(
		lotteryResult,
		(newValue) => {
			const processedOpenCode = processOpenCode(newValue.openCode)
			const isAllNumbersInvalid = checkAllNumbersInvalid(processedOpenCode)

			newValue.processedOpenCode = processedOpenCode
			newValue.isAllNumbersInvalid = isAllNumbersInvalid
			newValue.invalidTexts = invalidTexts
			newValue.lotteryType = _get(props.query, 'lotteryType')
		},
		{ immediate: true }
	)

	const currentComponent = computed(() => (props.isSimple ? Simple : Normal))

	onMounted(async () => {
		if (props.enableHumorCount) {
			await getLastIssueInfo()
			getHumorParticipantCount()
		}
	})
</script>

<style lang="scss" scoped></style>
