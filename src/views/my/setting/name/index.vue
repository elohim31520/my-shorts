<template>
	<div class="name-div mt-45">
		<Header title="修改昵称"></Header>
		<div class="pr-10 pl-10 pt-20 text-14 color-#656565">
			<div class="name-info shadow">
				<div class="pt-10 pb-10">
					<p class="pb-10 text-14 color-#656565">请输入您想要的个人昵称</p>
					<div class="relative frame">
						<div class="btn-name" :class="error ? 'error' : ''">
							<van-field
								id="input-name"
								class="absolute pt-0 btn-textarea"
								rows="1"
								autosize
								v-model="name"
								placeholder="目前的名称"
								type="textarea"
								maxlength="24"
								@input="onInput"
								@update:model-value="checkLength"
								:class="{
									error: error,
									'top-11': textareaRow === 1,
									'top-23': textareaRow === 2,
								}"
								ref="textareaDom"
								autocomplete="off"
							/>
						</div>
						<p class="absolute right-10 top-23 text-16 text-#AEAEB1">
							{{ getCharLength(name) }}/24
						</p>
					</div>
					<div class="h-18 text-#FF8F28 text-12 pt-10 pb-20">
						<p v-if="error">请设置2-24个字符，不包括@<>/等无效字符</p>
					</div>
				</div>
			</div>
			<div class="px-27.5 pt-30">
				<van-button @click="finish" class="btn-finish">完成</van-button>
			</div>
		</div>
	</div>
</template>
<script setup>
	import { useElementSize } from '@vueuse/core'
	import Header from '@/components/NormalHeader/index.vue'
	import { useUserStore } from '@/stores/user.js'
	import { storeToRefs } from 'pinia'
	import { editName } from '@/api/setting.js'
	import { isBlank, notify, useFontSize, back } from '@/modules/util.js'
	import { ref, watch, computed } from 'vue'
	const { data: user } = storeToRefs(useUserStore())
	const userStore = useUserStore()
	const name = ref(_defaultTo(user.value.nickname.replace(/[\r\n]+/g, ''), ''))
	const error = ref(false)
	const px24 = useFontSize(24)
	const px12 = useFontSize(12)
	const textareaRow = ref(1)
	const textareaDom = ref()
	if (!import.meta.env.SSR) {
		const { height } = useElementSize(textareaDom)
		watch(height, (newValue) => {
			if (newValue === Math.round(px24.value)) {
				textareaRow.value = 2
			} else {
				textareaRow.value = 1
			}
		})
	}
	const finish = async () => {
		checkLength(name.value)
		if (isBlank(name.value) || error.value) return
		const res = await editName(name.value)
		const success = _get(res, 'success')
		if (!success) return
		notify('更改成功')
		const data = _get(res, 'data', {})
		userStore.setUser(data)
		setTimeout(() => {
			back()
		}, 250)
	}
	function getCharLength(str) {
		let length = 0
		for (let char of str) {
			if (char.match(/[^\x00-\xff]/) || char.match(/[\uFF00-\uFFFF]/)) {
				length += 2 // 中文和全形字符算 2
			} else {
				length += 1 // 其他算 1
			}
		}
		return length
	}
	function checkLength(input) {
		const length = getCharLength(input)
		error.value = !(length >= 2 && length <= 24 && /^[^@<>/]+$/.test(input))
	}
	function onInput() {
		name.value = name.value.replace(/[\r\n]+/g, '')
		let length = getCharLength(name.value)
		if (length > 24) {
			while (getCharLength(name.value) > 24) {
				name.value = name.value.slice(0, -1) // 截去最後一個字元
			}
		}
		checkLength(name.value)
	}
</script>
<style lang="scss">
	.name-div {
		.van-field__control {
			width: 13.5rem;
		}
		.van-field__control::placeholder {
			color: #aeaeb1; /* 你想要的颜色 */
		}
		.name-info {
			background: #fff;
			border-radius: 10px;
			padding: 0.625rem 1.71875rem;
		}
		.btn-finish {
			width: 100%;
			border-radius: 10px;
			font-size: 1rem;
			color: white;
			background-color: $primary-color;
		}
		.change-count {
			color: $primary-color;
		}
		.frame {
			width: 18.75rem;
		}
		.btn-name {
			height: 4.375rem;
			width: 18.75rem;
			background-color: #fafafa;
			border-radius: 20px;
			overflow: hidden; /* 隐藏超出部分 */
		}
		.btn-textarea {
			line-height: 1.5rem;
			background-color: #fafafa;
			resize: none; /* 禁止手动调整 */
			padding-left: 1rem;
			padding-right: 4rem;
			padding-top: 0px;
			font-size: 1.125rem;
		}
		.error {
			background-color: #ffecec;
		}
		.shadow {
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
		}
	}
</style>
