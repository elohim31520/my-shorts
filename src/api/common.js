import { kvRequest } from '@/modules/service'
import { CommonAdapter } from '@/adapters/common'
import { Base64 } from 'js-base64'
import { bizRequest } from '@/modules/service'
import { LRUCache } from 'lru-cache'
import { loseWeight } from '@/modules/util.js'
import { useWebInfo } from '@/hooks/useWebInfo.js'

let cache = new LRUCache({
	max: 20,
	ttl: 10 * 60 * 1000 /*緩存10分鐘*/,
	ttlResolution: 5 * 1000,
})

export function getConfig(domain) {
	if (import.meta.env.SSR && !domain) throw Error('SSR必須傳入域名')
	if (import.meta.env.MODE == 'development') {
		domain = import.meta.env.PUBLIC_DOMAIN_SPECIFY
	} else {
		if (!import.meta.env.SSR) domain = location.hostname
	}

	if (cache.has(domain)) {
		return Promise.resolve(cache.get(domain))
	}

	return kvRequest({
		url: `wm/domain/${domain}`,
	}).then((res) => {
		loseWeight(res, [
			'onlineServiceCode',
			'icon',
			'websiteTitle',
			'appDownloadUrl',
			'statsCodeJsUrl',
			'statsCodeInit',
		])
		cache.set(domain, res)
		return res
	})
}

let ipInfo = null

export function getIPInfo() {
	if (ipInfo) return Promise.resolve(ipInfo)
	return fetch(import.meta.env.PUBLIC_IP_API_URL).then(async (res) => {
		const result = await res.json()
		ipInfo = result
		return result
	})
}

export function getYearList() {
	const currentYear = new Date().getFullYear()
	const list = _range(5).map((i) => {
		return {
			value: currentYear - i,
		}
	})
	return Promise.resolve(
		new CommonAdapter().adapt({
			data: list,
		})
	)
}

export function getSiteProfile({ userId }) {
	const manageSiteId = useWebInfo().getManageSiteId()
	return kvRequest({
		url: `/user/${manageSiteId}/profile/${userId}`,
	})
}

/**
targetRef:
> 1. u: 图库评论
    - targetId: postId(评论ID)
    - targetRef: issueId(期刊ID)
> 2. c: 论坛评论
    - targetId: postId(评论ID)
    - targetRef: postId(主贴ID)
> 3. p: 帖子
    - targetId: postId(帖子ID)
    - targetRef: forumId(论坛ID)
> 4. t: 图库｜期刊
    - targetId: issueId(期刊ID)
    - targetRef: newspaerCode(报纸代码)
> 5. s: 系列
    - targetId: seriesCode(系列代码)
    - targetRef: gameType(游戏类型) 

 likeFlag: 点赞类型
b：bbs
f：论坛
m：主板
p：帖子
t：图库｜期刊
c：论坛评论
u：图库评论
s：系列
 */

export async function toggleLike({
	targetRef,
	targetId,
	likeFlag,
	likeType = 'l',
} = {}) {
	const ipJson = await getIPInfo()
	const ipBase64 = Base64.encode(JSON.stringify(ipJson))
	return bizRequest({
		method: 'POST',
		url: `like/toggle`,
		data: {
			targetRef,
			targetId,
			likeFlag,
			likeType,
			ipInfo: ipBase64,
		},
	})
}

/**
 * 文檔：https://dev-torna.pwtk.cc/#/view/JzAOZBx8
收藏类型
b：bbs
f：论坛
m：主板
p：帖子
t：图库｜期刊
c：论坛评论
u：图库评论
s：系列
 */

export async function toggleCollect({
	targetRef,
	targetId,
	favoriteFlag,
} = {}) {
	const ipJson = await getIPInfo()
	const ipBase64 = Base64.encode(JSON.stringify(ipJson))
	return bizRequest({
		method: 'POST',
		url: `favorite/toggle`,
		data: {
			targetRef,
			targetId,
			favoriteFlag,
			ipInfo: ipBase64,
		},
	})
}

/**
 * 取年份跟期數列表
 * @param {Object} options
 * @param {'a6'|'hk6'|'tw6'|'sg6'|'xa6'} options.lotteryType - 彩票種類的 ID
 * @returns {Promise<Object>}
 */
export function getIssueListKV({ lotteryType }) {
	return kvRequest({
		url: `tk/${lotteryType}/issueList`,
	})
}

/**
 * https://dev-torna.pwtk.cc/#/view/wXnv5qGX
 * b：bbs
 * f：论坛
 * m：主板
 * p：帖子
 * t：图库｜期刊
 * c：论坛评论
 * u：图库评论
 * s：系列
 */
export function getResourceFlag({ targetId, resourceFlag }) {
	return bizRequest({
		method: 'POST',
		url: `user/resourceFlag`,
		data: {
			targetId,
			resourceFlag,
		},
	})
}

/**
 * https://dev-torna.pwtk.cc/#/view/pX93jjj2
 * 就是getResourceFlag的批量版本
 * 傳入的資料格式為陣列 [{}, {}, {}]
 */
export function getBatchResourceFlag(params) {
	return bizRequest({
		method: 'POST',
		url: `user/batch-resourceFlag`,
		data: params,
	})
}

/**
 * https://dev-torna.pwtk.cc/#/view/d8xvPLgz
 */

export function checkIssuesEmpty({
	gameType,
	year,
	seriesCode,
	newspaperCode,
	issues,
}) {
	return bizRequest({
		method: 'POST',
		url: `gameTypeNewspaperIssue/isIssuesHaveData`,
		data: { gameType, year, seriesCode, newspaperCode, issues },
	})
}
