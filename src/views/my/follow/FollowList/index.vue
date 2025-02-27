<template>
	<van-list
		v-model:loading="loading"
		:finished="finished"
		finished-text="没有更多了"
		@load="onLoad"
	>
		<div class="px-10">
			<div class="mb-5" v-for="(item, index) in followList" :key="item.msgId">
				<FollowUser
					@update:relationFlag="updateRelationFlag(index)"
					:userData="item"
				/>
			</div>
		</div>
	</van-list>
</template>

<script setup>
	import { ref } from 'vue'

	import FollowUser from '@/components/FollowUser/index.vue'

	import { getFollowers } from '@/api/newsList'
	import { storeToRefs } from 'pinia'
	import { useUserStore } from '@/stores/user.js'
	import { useMessageFollowStore } from '@/stores/messageFollow'

	const useStore = useUserStore()
	const { data: user } = useStore

	const { handleList, getUserRelation } = useMessageFollowStore()
	const { followList } = storeToRefs(useMessageFollowStore())

	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)
	const pageSize = ref(10)

	const onLoad = async () => {
		loading.value = true
		page.value += 1

		const data = await getFollowers({
			userId: user.userId,
			page: page.value,
			size: pageSize.value,
		})
		const list = _get(data, 'data.list', [])
		const relation = await getUserRelation(list)
		const dataList = handleList(relation)

		followList.value.push(...dataList)
		loading.value = false
		if (list.length < pageSize.value) {
			finished.value = true
		}
	}

	const updateRelationFlag = (index) => {
		const flag =
			_get(followList.value[index], 'msgObj.relationFlag') == 1 ? 2 : 1
		followList.value[index].msgObj.relationFlag = flag
	}
</script>
