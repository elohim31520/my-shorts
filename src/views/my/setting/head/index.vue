<template>
	<div class="mt-55">
		<Header title="修改头像"></Header>
		<div class="">
			<div class="flex-center">
				<div class="w-96 h-96 rounded-50% bg-skeleton overflow-hidden">
					<CdnImage
						:show-loading="false"
						:path="user.avatar"
						fit="cover"
						position="center"
						error-icon="/public-assets/images/svg/default_avatar_man.png"
						:config="{ width: '6rem' }"
					/>
				</div>
			</div>
			<van-row class="mt-30 min-h-256 gap-y-8" align="center">
				<van-col v-for="item in avatarList" span="8" :key="item.id">
					<div @click="changeHead(item)" class="flex-center relative">
						<div
							class="w-80 h-80 rounded-50% bg-skeleton"
							:class="checkHeadStyle(item)"
						>
							<CdnImage
								:show-loading="false"
								round
								:path="item.path"
								fit="cover"
								position="center"
								error-icon="/public-assets/images/svg/default_avatar_man.png"
								:config="{ width: '5rem' }"
							/>
						</div>

						<SvgIcon
							v-if="item.path === head?.path && item.id === head?.id"
							:name="
								firstLoad ? 'icon_Log_Checkbox_bock' : 'icon_Log_Checkbox_on'
							"
							size="1.25rem"
							class="check-icon"
						/>
					</div>
				</van-col>
			</van-row>
			<div class="mx-40 mt-30">
				<van-button
					:loading="loading"
					@click="saveHead"
					class="btn"
					:disabled="isDisabled"
				>
					确定更换
				</van-button>
			</div>
		</div>
	</div>
</template>
<script setup>
	import Header from '@/components/NormalHeader/index.vue'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { useUserStore } from '@/stores/user.js'
	import { storeToRefs } from 'pinia'
	import { editHead } from '@/api/setting.js'
	import { ref, onMounted, toRefs, computed } from 'vue'
	import { notify, back } from '@/modules/util'
	const { data: user } = storeToRefs(useUserStore())
	const userStore = useUserStore()
	const props = defineProps({
		data: {
			type: Array,
			default: () => [],
		},
	})
	const head = ref()
	const { data: avatarList } = toRefs(props)
	const loading = ref(false)
	const firstLoad = ref(true)
	const isDisabled = computed(
		() => !head.value || head.value.path == user.value.avatar
	)

	const changeHead = (item) => {
		if (item.id !== head.value?.id && item.path !== head.value?.path) {
			firstLoad.value = false
		}
		head.value = item
	}
	onMounted(async () => {
		let defaultVal = avatarList.value.find((x) => x.path === user.value.avatar)
		if (defaultVal) {
			head.value = defaultVal
		}
	})

	const saveHead = async () => {
		if (head.value.path === user.value.avatar) {
			return
		}
		loading.value = true
		const res = await editHead(head.value.path)
		const success = _get(res, 'success')
		loading.value = false
		if (!success) return
		notify('更改成功')
		userStore.setUser(_get(res, 'data', {}))
		setTimeout(() => {
			back()
		}, 250)
	}
	const checkHeadStyle = (item) => {
		let css = firstLoad.value ? 'head-now' : 'head-check'
		return item.path === head.value?.path && item.id === head.value?.id
			? css
			: ''
	}
</script>
<style lang="scss" scoped>
	.check-icon {
		position: absolute;
		bottom: 0px;
		right: 25px;
		z-index: 2;
	}
	.head-check {
		outline: 2px solid #34c759;
	}
	.head-now {
		outline: 2px solid black;
	}
	.btn {
		width: 100%;
		border-radius: 10px;
		font-size: 1rem;
		color: #fff;
		font-weight: 500;
		background-color: #34c759;
	}
</style>
