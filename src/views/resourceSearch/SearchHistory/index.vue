<template>
	<div>
		<div class="flex-y-center justify-between mb-10">
			<h2 class="font-600 text-18">历史搜索</h2>
			<div class="flex-y-center">
				<template v-if="isEditing">
					<div class="flex-center color-#656565">
						<button @click="showDeleteConfirm">全部删除</button>
						<div class="br-#656565 h-16 mx-10"></div>
						<button class="mr-10" @click="handleCancel">返回</button>
					</div>
				</template>
				<SvgIcon
					v-else
					size="1.375rem"
					name="icon_Search_Delete"
					@click="isEditing = true"
				/>
			</div>
		</div>

		<transition-group
			name="history-list"
			tag="div"
			class="mt-3 flex flex-wrap relative"
		>
			<div
				v-for="(item, index) in searchHistory"
				:key="item"
				class="relative cursor-pointer bd-#AEAEB1 bg-#fafafa rounded-15 pl-10 py-4 mr-5 mb-5 min-w-60 text-center"
				:class="[isEditing ? 'pr-32' : 'pr-10']"
				@click="handleItemClick(item)"
			>
				<p class="truncate">{{ item }}</p>
				<SvgIcon
					v-if="isEditing"
					name="icon_button_closure"
					size="1.875rem"
					class="absolute right-0 top-1/2 -translate-y-1/2"
					@click.stop="deleteItem(index)"
				/>
			</div>
		</transition-group>

		<van-popup
			v-model:show="showDialog"
			class="rounded-10 p-20 text-center"
			:close-on-click-overlay="false"
		>
			<h3 class="font-600 text-18 mb-20">提示</h3>
			<p class="color-#656565 text-18 mb-54">删除全部搜索历史</p>

			<div class="flex justify-between">
				<van-button class="cancel-button" @click="showDialog = false">
					取消
				</van-button>
				<van-button class="confirm-button" @click="handleClearAll">
					确定
				</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script setup>
	import { ref } from 'vue'

	const props = defineProps({
		searchHistory: {
			type: Array,
			default: () => [],
		},
	})

	const emits = defineEmits(['clearHistory', 'historyClick'])

	const isEditing = ref(false)
	const showDialog = ref(false)

	const handleItemClick = (item) => {
		if (!isEditing.value) {
			emits('historyClick', item)
		}
	}

	const handleCancel = () => {
		isEditing.value = false
	}

	const showDeleteConfirm = () => {
		showDialog.value = true
	}

	const handleClearAll = () => {
		emits('clearHistory')
		isEditing.value = false
		showDialog.value = false
	}

	const deleteItem = (index) => {
		emits('clearHistory', index)
	}
</script>

<style lang="scss" scoped>
	.van-popup {
		width: 18.75rem;
	}

	.van-button {
		width: 7.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		border: none;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.cancel-button {
		background-color: #f2f2f2;
	}

	.confirm-button {
		background-color: #34c759;
		color: #fff;
	}

	.history-list-move,
	.history-list-enter-active,
	.history-list-leave-active {
		transition: transform 0.3s ease;
	}

	.history-list-enter-from,
	.history-list-leave-to {
		opacity: 0;
		transform: translateX(-0.625rem);
	}

	.history-list-leave-active {
		position: absolute;
		z-index: -1;
	}
</style>
