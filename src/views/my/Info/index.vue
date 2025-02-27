<template>
	<div class="px-15 bg pt-22 pb-30">
		<div class="flex items-center pos-relative">
			<MyInfo>
				<!-- <template v-if="isSelf" v-slot:myChannel>
					<div
						class="text-14 color-#34c759 py-5 px-10 border-2 border-#34c759 rounded-15 flex items-center ml-10 whitespace-nowrap absolute -right-10 top-15"
					>
						<SvgIcon name="icon_MyChannel" size="0.875rem" />
						<a v-redirect="'/my/channel'"><div class="ml-4">我的频道</div></a>
					</div>
				</template> -->
			</MyInfo>
		</div>
		<div
			v-if="user.talent == 2"
			class="color-#FF8F28 flex-center h-30 bg-#FFEED0 rounded-10 border-1 border-#FF8F28 mt-15 -mb-15"
			@click="redirectToExpertPage"
		>
			<SvgIcon name="expert_channel" size="1rem" />
			<b class="text-14 font-700 mx-5">专家频道</b>
			<!-- <span class="text-12">查看详情</span> -->
		</div>
	</div>
</template>

<script setup>
	import { inject, computed } from 'vue'
	import { useUserStore } from '@/stores/user.js'
	import MyInfo from '@/components/MyInfo/index.vue'
	import { redirect } from '@/modules/util'

	const isSelf = inject('isSelf')
	const someone = computed(() => {
		if (!isSelf) return _get(inject('data'), 'someone.data')
	})
	const useStore = useUserStore()
	const { data: userData } = useStore
	const user = computed(() => _defaultTo(someone.value, userData))

	function redirectToExpertPage() {
		let url = isSelf ? '/expert/user' : `/expert/user/${user.value.userId}`
		redirect(url)
	}
</script>

<style scoped lang="scss">
	.bg {
		background-image: url('/public-assets/images/my_page/bg.svg');
		background-size: cover;
		background-position: 0 0;
		background-repeat: no-repeat;
	}
</style>
