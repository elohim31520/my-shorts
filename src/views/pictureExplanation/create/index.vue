<template>
	<div class="bg-#fafafa min-h-100dvh">
		<NormalHeader title="发布图解" />

		<div class="px-10 pt-65">
			<!-- 图解标题 -->
			<div class="shadow-primary mb-10 rounded-10">
				<van-field
					v-model="titleInput"
					maxlength="18"
					readonly
					:placeholder="titlePlaceholder"
					label-align="top"
					class="rounded-10 creation-title__field"
					autocomplete="off"
				>
					<template #label>
						<div class="flex-y-center justify-between w-full color-#434343">
							<span class="text-16">图解标题:</span>
						</div>
					</template>
				</van-field>
			</div>

			<!-- 图解内容: -->
			<div class="shadow-primary rounded-10 mb-75.5">
				<van-field
					v-model="descriptionInput"
					maxlength="300"
					placeholder="请输入图解内容"
					show-word-limit
					rows="1"
					autosize
					type="textarea"
					label-align="top"
					class="rounded-10"
					autocomplete="off"
				>
					<template #label>
						<div class="flex-y-center justify-between w-full text-16">
							图解内容:
						</div>
					</template>
				</van-field>
			</div>

			<!-- 发布图解 -->
			<div
				class="w-300 lh-40 bg-primary color-#fff text-center rounded-8 mx-auto"
				@click="createExplanation"
			>
				发布图解
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import { toast, isLogin, redirect } from '@/modules/util'
	import { comment } from '@/api/picture'
	import { useLoginPopupStore } from '@/stores/loginPopup'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
		params: {
			type: Object,
			default: () => ({}),
		},
	})

	const descriptionInput = ref('')
	const titlePlaceholder = (() => {
		const title = _get(props.params, 'title', '')
		const period = _get(props.params, 'period', '')

		return title ? `第${period}期${title}图解` : ''
	})()
	const titleInput = ref(titlePlaceholder) //edison表示默認圖解title 不能改且為黑色

	const createExplanation = _throttle(() => {
		const issueId = _get(props.params, 'issueId', '')
		if (!isLogin()) {
			useLoginPopupStore().toggle()
			return
		}
		const description = descriptionInput.value

		if (!description || description.length < 10) {
			toast('图解内容最少输入十个字符')
			return
		}

		comment({
			postContent: description,
			issueId,
			postType: 'a',
		}).then((res) => {
			if (res.success) {
				toast('发布成功')
				setTimeout(() => {
					redirect('/pictureExplanation', {}, props.params)
				}, 500)
			}
		})
	}, 1000)
</script>

<style lang="scss" scoped>
	.van-field {
		padding: 0.625rem;
	}

	:deep() {
		.van-field__label {
			margin-bottom: 0.625rem;
		}

		.creation-title__field .van-field__value {
			display: flex;
			justify-content: space-between;
			color: #434343;
			.van-field__body {
				flex: 1;
			}
			.van-field__control {
				text-overflow: ellipsis;
				white-space: nowrap;
				display: block;
			}
		}

		.van-field__word-limit {
			color: #aeaeb1;
			font-size: 0.875rem;
		}

		input,
		textarea {
			font-size: 1rem;
		}

		textarea {
			height: 18.75rem !important;
		}
	}
</style>
