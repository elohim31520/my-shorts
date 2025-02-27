import { bizRequest } from '@/modules/service'

//竞选活动列表
export function getCampaignList({ page = 1, size = 10, gameType } = {}) {
	return bizRequest({
		url: 'campaign/list',
		method: 'POST',
		data: {
			page,
			size,
			gameType,
		},
	})
}

//竞选活动的参与记录
export function listPlayTypeForCampaign({
	page = 1,
	size = 10,
	bizId,
	bizFlag,
} = {}) {
	return bizRequest({
		url: 'predict/listPlayTypeForCampaign',
		method: 'POST',
		data: {
			page,
			size,
			bizId,
			bizFlag,
		},
	})
}

//获取竞选结果接口
export function getPredictResult({ page = 1, size = 10, bizId } = {}) {
	return bizRequest({
		url: 'predict/getPredictResult',
		method: 'POST',
		data: {
			page,
			size,
			bizId,
		},
	})
}

//我的竞选列表
export function getMyCampaignList({ page = 1, size = 10, gameType } = {}) {
	return bizRequest({
		url: 'campaign/getJoinCampaignWithUser',
		method: 'POST',
		data: {
			page,
			size,
			gameType,
		},
	})
}

//我的参与
export function getMyListPlayTypeForCampaign({
	page = 1,
	size = 10,
	bizId,
	bizFlag,
} = {}) {
	return bizRequest({
		url: 'predict/listPlayTypeWithUserForCampaign',
		method: 'POST',
		data: {
			page,
			size,
			bizId,
			bizFlag,
		},
	})
}

//立即参与(发布竞选)
export function createPredict({
	bizFlag = 'p',
	bizId,
	playTypeCode,
	predict,
	fromIp,
} = {}) {
	return bizRequest({
		url: 'predict/createPredict',
		method: 'POST',
		data: {
			bizFlag,
			bizId,
			playTypeCode,
			predict,
			fromIp,
		},
	})
}
