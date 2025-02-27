<template>
	<div class="px-10 my-10">
		<div v-for="(item, index) in messageList" :key="index">
			<div
				v-if="['s', 't'].includes(item.type)"
				class="w-1/1 px-10 py-10 flex justify-between items-center gap-5 bottom-line"
				@click="goTo(item)"
			>
				<div class="h-50 w-50 bg-gray-200 rounded-full">
					<CdnImage
						:path="item.img"
						fit="cover"
						position="center"
						width="3.125rem"
						height="3.125rem"
						round
						error-icon="/public-assets/images/information.svg"
					/>
				</div>

				<div class="w-80% py-3 flex-1 flex flex-col justify-center items-start">
					<div class="w-1/1 flex flex-row justify-between items-center">
						<div class="w-82% max-w-82% flex font-600">
							<p class="color-#434343 truncate relative pr-8">
								{{ item.title }}
								<i
									class="w-5 h-5 absolute bg-#FF3B3B rounded-full top-0 right-0"
									v-if="isMounted && isUnRead(item)"
								></i>
							</p>
						</div>

						<div
							class="w-18% my-3 color-#aeaeb1 text-12 font-400 text-align-right"
						>
							{{ formatTimestamp(item.msgTime, 'MM-dd') }}
						</div>
					</div>
					<div class="w-1/1 flex flex-row justify-between items-center">
						<div class="w-87% max-w-81% truncate-1-lines">
							<HtmlRenderer :htmlContent="item.content" />
						</div>
						<div
							class="w-13% my-3 px-5 rounded-10 bg-#F4FFE8 color-primary text-12 font-400"
						>
							消息
						</div>
					</div>
				</div>
			</div>

			<div
				v-if="item.type === 'r'"
				class="w-1/1 px-10 py-10 flex justify-between items-center gap-5 bottom-line"
			>
				<div class="w-88% flex justify-between items-center gap-5">
					<CdnImage
						:path="item.img"
						fit="cover"
						position="center"
						width="3.125rem"
						height="3.125rem"
						round
						error-icon="/public-assets/images/default_chat_avatar.png"
					/>

					<div class="w-81% py-5">
						<div class="font-600 color-#434343 flex flex-start items-center">
							<p class="max-w-81% truncate">
								{{ item.title }}
							</p>
							<p>
								{{ `(${item.personNum})` }}
							</p>
						</div>
						<p class="color-#656565 font-400 font-size-12 truncate">
							{{ item.content }}
						</p>
					</div>
				</div>

				<div class="h-42 text-12 flex flex-col items-center justify-start">
					<div class="mb-4 font-400 color-#aeaeb1 whitespace-nowrap">
						{{ formatTimestamp(item.msgTime, 'MM-dd') }}
					</div>
					<div
						v-if="item.unreadCount && !item.hasInvite && !item.isMuted"
						class="bg-#FA2A42 rounded-50% w-20 h-20 color-#fff flex-y-center justify-center"
					>
						{{ item.unreadCount }}
					</div>
					<SvgIcon
						v-if="!item.hasInvite && item.isMuted"
						size="1.25rem"
						name="icon_muted"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import CdnImage from '@/components/CdnImage/index.vue'
	import HtmlRenderer from '@/components/HtmlRenderer/index.vue'

	import { redirect } from '@/modules/util.js'
	import { formatTimestamp } from '@/modules/date.js'
	import { useUserStore } from '@/stores/user.js'
	import { ref, inject, reactive, onMounted } from 'vue'
	import { localStore } from '@/modules/storage.js'
	import { storeToRefs } from 'pinia'

	const useStore = useUserStore()
	const { data: user, isLogin } = storeToRefs(useStore)
	const messageList = ref(_get(inject('data'), 'data.list', []))
	const readIds = reactive(new Set(localStore.readIds || []))
	const isMounted = ref(false)

	onMounted(() => (isMounted.value = true))

	function isUnRead(vo) {
		if (isLogin.value) return !vo.isRead
		return !readIds.has(vo.msgId)
	}

	function goTo(vo) {
		redirect(`/newsList?title=${vo.title}&type=${vo.type}`)
	}
</script>

<style lang="scss" scoped>
	.chat-group-badge {
		min-width: 0.3125rem;
		--van-badge-dot-size: 0.3125rem;
		--van-badge-dot-color: linear-gradient(to left, #ff3a75 100%, #f82430 0%);
	}
	.bottom-line {
		border-bottom: 1px solid #e7e7e7;
	}
</style>
