import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFollowBatch } from '@/api/daniu'

export const useMessageFollowStore = defineStore('messageFollow', () => {
	const followList = ref([])

	const isMounted = ref(false)

	// 過濾掉重複的用戶id與沒關注我的
	function handleList(list) {
		if (!list.length) return list
		const followerSet = new Set()
		return list.filter((item) => {
			if (!followerSet.has(item.msgObj.followerUserId)) {
				followerSet.add(item.msgObj.followerUserId)
				return item.msgObj.relationFlag != '0'
			}
			return false
		})
	}

	async function getUserRelation(list) {
		if (!list.length) return list
		const userIdList = list.map((item) => item.msgObj.followerUserId)
		const relation = await getFollowBatch({
			targetUserIdList: userIdList,
			direct: '2',
		})
		const relationList = _get(relation, 'data', [])
		return list.map((item, index) => {
			return {
				...item,
				msgObj: {
					...item.msgObj,
					relationFlag: relationList[index].relationFlag,
				},
			}
		})
	}
	return { followList, isMounted, handleList, getUserRelation }
})
