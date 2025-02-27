import { ref } from 'vue'
import {
	getUserPublicDetail,
	getMyForumDetail,
	uploadSingleFile,
	createForumPost,
	createPredictionPost,
	getPredictedCode,
} from '@/api/material'
import { getLastLotteryResultApi } from '@/api/lottery'
import { getLastIssuePost } from '@/api/bbs.js'

import { storeToRefs } from 'pinia'
import { useLotteryStore } from '@/stores/lottery'
import { getLotteryCode, isBlank } from '@/modules/util'

export function useSendIdea() {
	const { lotteryType } = storeToRefs(useLotteryStore())
	const lastLotteryResult = ref(null)

	const getForumsId = async () => {
		const res = await getUserPublicDetail()
		const forumId = _get(res, 'data[0].forumList[0].forumId', '')
		return forumId
	}

	const getMyForumId = async () => {
		const res = await getMyForumDetail()
		const forumId = _get(res, 'data[0].forumList[0].forumId', '')
		return forumId
	}

	const getFilePath = async (file) => {
		const res = await uploadSingleFile(file)
		const path = _get(res, 'data.path', '')
		return path
	}

	const getLastLotteryResult = async () => {
		const response = await getLastLotteryResultApi({
			lotteryType: lotteryType.value,
		})
		const lotteryResult = _get(response, 'data', 0)
		return lotteryResult
	}

	const getLastPost = async ({ postGametypeRef, forumId }) => {
		const res = await getLastIssuePost({
			postGametypeRef,
			forumId,
		})

		const lastPost = _get(res, 'data', null)

		return lastPost
	}

	const createPost = async ({
		title,
		postContent,
		postYear,
		postIssue,
		postGametypeRef,
		seriesId,
		attachments,
		predictFlag,
		forumId,
	}) => {
		const res = await createForumPost({
			forumId,
			title,
			postContent,
			postYear,
			postIssue,
			postGametypeRef,
			seriesId,
			attachments,
			predictFlag,
		})
		return res
	}

	// 參賽帖
	const predictionShow = ref(false)
	const predictedCode = ref([])
	const ipBase64 = ref('')
	const predictionTypeText = ref('')
	const predictionId = ref(0)
	const predictions = ref([])

	const closeCategory = () => (predictionShow.value = false)

	const submitPrediction = (obj) => {
		if (isBlank(obj)) return false

		predictionId.value = _get(obj, 'id', 0)
		predictionTypeText.value = _get(obj, 'name', '')
		const lists = _get(obj, 'list', [])
		predictions.value = [...lists]

		predictions.value.map(
			(item) => (item.gameType = getLotteryCode(lotteryType.value))
		)
	}

	const cancelPredict = () => {
		predictionTypeText.value = ''
		predictionId.value = 0
		predictions.value = []
	}

	const getPredictedCodeHandler = async () => {
		const res = await getPredictedCode({
			gameType: getLotteryCode(lotteryType.value),
			year: lastLotteryResult.value.year,
			issue: lastLotteryResult.value.nextIssue,
		})
		predictedCode.value = _get(res, 'data', [])
	}

	const createPredictPost = async ({
		title,
		forumId,
		postContent,
		postGametypeRef,
		fromIp,
		attachments,
		predictions,
	}) => {
		const res = await createPredictionPost({
			title,
			forumId,
			postContent,
			postGametypeRef,
			fromIp,
			attachments,
			predictions,
		})
		return res
	}

	return {
		lotteryType,
		lastLotteryResult,
		getForumsId,
		getMyForumId,
		getFilePath,
		createPost,
		getLastLotteryResult,
		getLastPost,
		predictionShow,
		predictedCode,
		ipBase64,
		predictionTypeText,
		predictionId,
		predictions,
		closeCategory,
		submitPrediction,
		cancelPredict,
		getPredictedCodeHandler,
		createPredictPost,
	}
}
