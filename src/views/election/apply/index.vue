<template>
	<div class="bg-#fafafa com-min-h-with-header">
		<NormalHeader :title="`${predictionTypeName}竞选`" />
		<div class="mt-45">
			<div class="flex-center justify-between mx-10">
				<div class="color-#434343 text-18 font-600 py-20">
					{{ gameTypeName || '' }}-{{ period || '' }}期
				</div>
				<div class="text-14 color-#AEAEB1">
					已选择
					<span class="color-primary">
						{{ selectContent.length }} / {{ maxCount }}
					</span>
				</div>
			</div>

			<div
				class="shadow-[0_0_0.5rem_0_#0000001A] mb-10 rounded-10 p-10 mx-10 bg-#fff"
			>
				<div class="flex flex-col items-center">
					<div class="grid grid-cols-7 gap-12 rounded-10">
						<div
							class="col-span-1"
							v-for="vo in options"
							:key="vo.name"
							@click="addContent(vo)"
						>
							<div class="rounded-25">
								<div class="relative">
									<div>
										<SvgIcon size="2.4375rem" name="ball-green" />
										<SvgIcon
											v-if="selectContent.includes(vo.name)"
											size="0.9375rem"
											name="icon_choose_orange"
											class="absolute right--5 bottom-0 z-10"
										/>
									</div>

									<div
										class="w-100% h-100% absolute left-0 top-0 flex-y-center justify-center"
									>
										<div
											class="font-600 lh-20 color-#fff whitespace-nowrap"
											:class="[vo.name.length >= 2 ? 'text-16' : 'text-20']"
										>
											{{ vo.name }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="fixed bottom-0 h-60 w-full px-9.75 flex-y-center justify-between bg-#fff max-w-480px"
		>
			<div
				class="w-132 h-40 bg-#E0E0E0 color-#434343 font-600 text-18 rounded-8 flex-center"
				@click="resetSelection"
			>
				重置
			</div>
			<div
				class="min-w-215.5 h-40 flex-center rounded-8 bg-primary color-#fff"
				@click="publishContent"
			>
				提交
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onBeforeMount } from 'vue'
	import { getPrimaryPlayTypes } from '@/api/picture'
	import { createPredict } from '@/api/election'
	import { getIPInfo } from '@/api/common'
	import {
		getCurrentLotteryType,
		toast,
		isLogin,
		redirect,
	} from '@/modules/util'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { useLoginPopupStore } from '@/stores/loginPopup'
	import { Base64 } from 'js-base64'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})
	const { period, playTypeCode, id } = props.data.searchQuery
	const lotteryInfo = getCurrentLotteryType()
	const predictionTypeName = ref('')
	const gameType = _get(lotteryInfo, 'code', '')
	const gameTypeName = ref(_get(lotteryInfo, 'fullName', ''))
	const option = ref([])
	const selectContent = ref([])
	const minCount = ref(null)
	const maxCount = ref(null)
	const ipBase64 = ref('')
	const loading = ref(false)

	async function getOptionList() {
		const res = _get(
			await getPrimaryPlayTypes({ bizFlag: 'p', gameType }),
			'data.list',
			[]
		)
		option.value = res.filter((item) => item.playTypeCode == playTypeCode)[0]
		minCount.value = option.value.minCount
		maxCount.value = option.value.maxCount
		predictionTypeName.value = option.value.predictionTypeName
	}

	const options = computed(() => {
		const list = (option.value?.optionList || []).reduce(
			(accumulator, name) => {
				accumulator.push({
					name,
				})
				return accumulator
			},
			[]
		)
		return list
	})

	const addContent = (item) => {
		const index = selectContent.value.indexOf(item.name)
		// 重複就刪除
		if (index !== -1) {
			selectContent.value.splice(index, 1)
			return
		}

		if (selectContent.value.length >= maxCount.value) {
			toast(`最多选择${maxCount.value}个, 最少${minCount.value}个`)
			return
		}
		selectContent.value.push(item.name)
	}

	function resetSelection() {
		selectContent.value.length = 0
	}

	async function publishContent() {
		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return
		}
		if (loading.value) return
		if (!selectContent.value.length) {
			toast('请选择发布内容')
			return
		}
		if (
			selectContent.value.length > maxCount ||
			selectContent.value.length < minCount
		) {
			toast(`最多选择${maxCount}个, 最少${minCount}个`)
			return
		}
		loading.value = true

		const res = await createPredict({
			bizFlag: 'p',
			bizId: id,
			playTypeCode,
			predict: selectContent.value,
			fromIp: ipBase64.value,
		})
		loading.value = false
		if (res.success) {
			toast('发布成功')
			setTimeout(() => {
				redirect(`/election/detail/${id}?status=y`, { skip: true })
			}, 500)
		}
	}

	onBeforeMount(async () => {
		getIPInfo().then((ipJson) => {
			ipBase64.value = Base64.encode(JSON.stringify(ipJson))
		})
		await getOptionList()
	})
</script>

<style lang="scss" scoped></style>
