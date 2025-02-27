<template>
	<div class="mt-55">
		<NormalHeader title="已关注" border-bottom-color="#F2F2F2" />
		<template v-if="!!followList.length">
			<FollowList />
		</template>
		<template v-if="!!followList.length && showList">
			<div class="my-10 px-10 flex justify-between items-center">
				<span class="font-700 color-#434343">发现大牛</span>
				<span class="font-400 color-#434343" @click="closeList">关闭</span>
			</div>
			<DaniuList />
		</template>
		<template v-if="!followList.length">
			<div class="my-10 px-10 flex justify-between items-center">
				<span class="font-700 color-#434343">发现大牛</span>
				<span class="font-400 color-#434343" @click="changeList">換一批</span>
			</div>
			<DaniuList :isChange="isChange" :changedData="changedData" />
		</template>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import DaniuList from '@/components/DaniuList/index.vue'
	import FollowList from '@/views/my/follow/FollowList/index.vue'
	import { ref, provide, onBeforeMount } from 'vue'
	import { getDaniuList } from '@/api/daniu'
	import { isLogin } from '@/modules/util'
	import { getFollowers } from '@/api/newsList'
	import { storeToRefs } from 'pinia'
	import { useUserStore } from '@/stores/user.js'
	import { useMessageFollowStore } from '@/stores/messageFollow'

	const useStore = useUserStore()
	const { data: user } = useStore

	const { handleList, getUserRelation } = useMessageFollowStore()
	const { followList, isMounted } = storeToRefs(useMessageFollowStore())

	onBeforeMount(async () => {
		const data = isLogin()
			? await getFollowers({
					userId: user.userId,
					page: 1,
					size: 10,
				})
			: {}
		let dataList = _get(data, 'data.list', [])
		dataList = await getUserRelation(dataList)
		dataList = handleList(dataList)
		followList.value.push(...dataList)
		isMounted.value = true
	})

	const showList = ref(true)
	const isChange = ref(false)
	const changedData = ref([])

	function closeList() {
		showList.value = false
	}

	async function changeList() {
		isChange.value = true
		const data = await getDaniuList({
			userId: isLogin() ? user.userId : '',
			isFollowed: 0,
			anotherBatch: 'y',
			page: 1,
			size: 10,
		})
		changedData.value = _get(data, 'data.list', [])
		return changedData.value
	}
</script>

<style lang="scss" scoped></style>
