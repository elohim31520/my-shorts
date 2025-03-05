<template>
	<div class="toolbar mb1r">
		<div class="avatar-ctn mb2r">
			<img
				class="avatar"
				:src="item.author?.avatar_168x168?.url_list?.[0]"
				alt=""
				v-click="() => bus.emit(EVENT_KEY.GO_USERINFO)"
			/>
			<transition name="fade">
				<div v-if="!item.isAttention" v-click="attention" class="options">
					<img class="no" src="/shorts/img/icon/add-light.png" alt="" />
					<img class="yes" src="/shorts/img/icon/ok-red.png" alt="" />
				</div>
			</transition>
		</div>
		<div class="message mb2r" v-click="collected">
			<SvgIcon
				v-if="item.isCollect"
				size="2.375rem"
				class="color-white"
				name="icon_collect_Click3"
			/>
			<SvgIcon v-else size="2.375rem" class="color-white" name="star" />
			<span>{{ _formatNumber(item.statistics.collect_count) }}</span>
		</div>

		<div class="message mb2r" v-click="showComments">
			<SvgIcon size="2.375rem" class="color-white" name="message-10" />

			<span>{{ _formatNumber(item.statistics.comment_count) }}</span>
		</div>

		<div class="love mb2r" v-click="loved">
			<div>
				<SvgIcon
					size="2.375rem"
					class="color-white"
					:name="item.isLoved ? 'like_click3' : 'like_click1'"
				/>
			</div>
			<span>{{ _formatNumber(item.statistics.digg_count) }}</span>
		</div>

		<div
			v-if="!props.isMy"
			class="share mb2r"
			v-click="() => bus.emit(EVENT_KEY.SHOW_SHARE)"
		>
			<img
				src="/shorts/img/icon/share-white-full.png"
				alt=""
				class="share-image"
			/>
			<span>{{ _formatNumber(item.statistics.share_count) }}</span>
		</div>
		<div
			v-else
			class="share mb2r"
			v-click="() => bus.emit(EVENT_KEY.SHOW_SHARE)"
		>
			<img src="/shorts/img/icon/menu-white.png" alt="" class="share-image" />
		</div>
		<BaseMusic :cover="item.music.cover" />
	</div>
</template>

<script setup lang="ts">
	import BaseMusic from '../BaseMusic.vue'
	import { _formatNumber } from '@/common/utils'
	import bus, { EVENT_KEY } from '@/modules/bus'
	import { useClick } from '@/views/shorts/hooks/useClick'
	import { inject } from 'vue'
	import SvgIcon from '@/components/SvgIcon/index.vue'

	const props = defineProps({
		isMy: {
			type: Boolean,
			default: () => {
				return false
			},
		},
		item: {
			type: Object,
			default: () => {
				return {}
			},
		},
	})

	const position = inject<any>('position')

	const emit = defineEmits([
		'update:item',
		'goUserInfo',
		'showComments',
		'showShare',
		'goMusic',
	])

	function _updateItem(props, key, val) {
		const old = _cloneDeep(props.item)
		old[key] = val
		emit('update:item', old)
		bus.emit(EVENT_KEY.UPDATE_ITEM, { position: position.value, item: old })
	}

	function loved() {
		setTimeout(() => {
			_updateItem(props, 'isLoved', !props.item.isLoved)
		}, 100)
		if (!props.item.isLoved) {
			// eslint-disable-next-line vue/no-mutating-props
			props.item.statistics.digg_count++
		} else {
			// eslint-disable-next-line vue/no-mutating-props
			props.item.statistics.digg_count--
		}
	}

	function collected() {
		setTimeout(() => {
			_updateItem(props, 'isCollect', !props.item.isCollect)
		}, 100)
		if (!props.item.isCollect) {
			// eslint-disable-next-line vue/no-mutating-props
			props.item.statistics.collect_count++
		} else {
			// eslint-disable-next-line vue/no-mutating-props
			props.item.statistics.collect_count--
		}
	}

	function attention(e) {
		e.currentTarget.classList.add('attention')
		setTimeout(() => {
			_updateItem(props, 'isAttention', true)
		}, 1000)
	}

	function showComments() {
		bus.emit(EVENT_KEY.OPEN_COMMENTS, props.item.aweme_id)
	}

	const vClick = useClick()
</script>

<style scoped lang="scss">
	.toolbar {
		//width: 40px;
		position: absolute;
		bottom: 0;
		right: 10px;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;

		.avatar-ctn {
			position: relative;

			$w: 45px;

			.avatar {
				width: $w;
				height: $w;
				border: 3px solid white;
				border-radius: 50%;
			}

			.options {
				position: absolute;
				border-radius: 50%;
				margin: auto;
				left: 0;
				right: 0;
				bottom: -5px;
				background: red;
				//background: black;
				width: 18px;
				height: 18px;
				display: flex;
				justify-content: center;
				align-items: center;
				transition: all 1s;

				img {
					position: absolute;
					width: 14px;
					height: 14px;
					transition: all 1s;
				}

				.yes {
					opacity: 0;
					transform: rotate(-180deg);
				}

				&.attention {
					background: white;

					.no {
						opacity: 0;
						transform: rotate(180deg);
					}

					.yes {
						opacity: 1;
						transform: rotate(0deg);
					}
				}
			}
		}

		.love,
		.message,
		.share {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			$width: 35px;

			img {
				width: $width;
				height: $width;
			}

			span {
				font-size: 12px;
			}
		}
	}
</style>
