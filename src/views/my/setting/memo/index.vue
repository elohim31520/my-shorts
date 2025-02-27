<template>
	<div>
		<NormalHeader title="编辑简介" />
		<div class="content-wrapper bg-#fafafa mt-45 pb-80">
			<div class="form-wrapper mt-10 px-10 pt-5">
				<div class="p-10 bg-#fff mt-10 border-radius-10 box-shadow h-390">
					<div class="form-group">
						<h3>简介内容：</h3>
						<textarea
							v-model="content"
							maxlength="100"
							class="w-full"
							rows="14"
							placeholder="请填写兴趣爱好,特色等个人简介"
						/>
					</div>
					<div class="font-size-14 color-#aeaeb1 text-right mt-5 word-count">
						<span>{{ content.length }}</span>
						/100
					</div>
				</div>
			</div>
		</div>
		<div
			class="footer fixed bottom-0 w-full max-w-480px bg-#fafafa h-60 flex items-center justify-center px-30"
		>
			<van-button
				color="#34c759"
				size="large"
				class="btn btn-publish"
				@click="handleSubmit"
			>
				保存
			</van-button>
		</div>
	</div>
</template>

<script setup>
	import { useUserStore } from '@/stores/user.js'
	import { ref } from 'vue'
	import { storeToRefs } from 'pinia'
	import { notify, back } from '@/modules/util'
	import { updateMemo } from '@/api/setting.js'
	import NormalHeader from '@/components/NormalHeader/index.vue'
	const { data: user } = storeToRefs(useUserStore())
	const userStore = useUserStore()
	const content = ref(user.value.userMemo)
	const handleSubmit = async () => {
		const res = await updateMemo(content.value === '' ? '*' : content.value)
		const success = _get(res, 'success')
		if (!success) return
		notify('更改成功')
		const data = _get(res, 'data', {})
		userStore.setUser(data)
		setTimeout(() => {
			back()
		}, 250)
	}
</script>

<style lang="scss" scoped>
	.border-radius-10 {
		border-radius: 0.625rem;
	}
	.content-wrapper {
		min-height: calc(100vh - 2.8125rem);

		.selected-platform {
			line-height: 1.5625rem;
		}

		.form-wrapper {
			.form-group {
				line-height: 1.375;
				letter-spacing: 0.02rem;
				h3 {
					color: #434343;
					margin-bottom: 0.625rem;
				}
				input,
				textarea {
					background-color: transparent;
					border: 0;
					width: 100%;
					border: 0;
					color: #434343;
					&::placeholder {
						color: #aeaeb1;
						opacity: 1;
					}
				}

				textarea {
					min-height: 3.625rem;
				}
			}
			.word-count {
				letter-spacing: 0.0175rem;
				line-height: 1.375rem;
			}
		}
	}

	.footer {
		left: 50%;
		transform: translateX(-50%);

		.btn {
			border-radius: 0.5rem;
			line-height: 2.5;
			height: 2.5rem;
			font-size: 1.125rem;
			font-weight: 600;

			&.btn-publish {
				flex: 1;
				border: 1px solid $primary-color !important;
			}
		}
	}
	.box-shadow {
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	}
</style>
