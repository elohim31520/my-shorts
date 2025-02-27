<template>
	<div
		class="drawing shadow-primary relative bg-#fff"
		ref="target"
		@click="selectedPicture = data"
	>
		<div
			class="absolute w-full h-full top-0 left-0 mask bd-#34c759-3 rounded-7"
			v-if="selectedPicture.issueId == data.issueId"
		></div>
		<div class="img-cover relative">
			<!-- 主圖 -->
			<div v-if="data.imgSrc && !isImageError">
				<img
					:data-src="data.imgSrc"
					ref="lazyImage"
					v-show="showImage"
					@error="isImageError = true"
				/>
			</div>
			<div
				class="no-image flex flex-col justify-center items-center w-55.5555% pt-25 mx-auto"
				v-else
			>
				<img src="/public-assets/images/no_picture.png" />
				<div class="font-size-14 line-height-19 my-6 color-#aeaeb1">
					暂无圖紙
				</div>
			</div>
			<!-- 縮圖，目前僅掏料－創作頁不顯示 -->
			<div class="small-imgs absolute left-0 w-full z-2 grid grid-cols-4 px-5">
				<div class="w-30 mx-auto" v-for="(vo, i) in filteredImgs" :key="i">
					<CdnImage :path="vo.imgPath" lazy-load class="w-full" />
				</div>
			</div>
		</div>
		<div
			class="drawing-content"
			:class="{
				'is-current-period': filteredImgs.length,
			}"
		>
			<div class="title text-left font-600 color-#434343">
				{{ articleTitle }}
			</div>

			<div
				class="content-bottom mt-4 color-#aeaeb1 flex justify-between items-center"
			>
				<div class="series truncate max-w-100">
					{{ data.seriesName }}
				</div>

				<div class="flex items-center color-#656565">
					<div class="favorite-icon">
						<SvgIcon name="icon_like" size="0.9375rem" />
					</div>
					<div class="ml-4 leading-none font-500 font-size-14 color-#aeaeb1">
						{{ +data.likeCount ? digitalConversion(data.likeCount) : '赞' }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'

	import { digitalConversion, isNotBlank, getCdnUrl } from '@/modules/util.js'
	import { useIntersectionObserver } from '@vueuse/core'
	import CdnImage from '@/components/CdnImage/index.vue'
	import { useSelector } from '../useSelector'
	import { getEncryptImage } from '@/modules/imgCrypto.js'

	const { selectedPicture } = useSelector()
	const target = ref(null)
	const lazyImage = ref(null)
	const isCrossCenter = ref(false)
	const showImage = ref(false)
	const isImageError = ref(false)

	const props = defineProps({
		data: {
			type: Object,
			required: true,
		},
		order: {
			type: Number,
			default: 0,
		},
		config: {
			type: Object,
			default: () => {
				return {
					encrypt: Boolean(import.meta.env.PUBLIC_ENCRYPT_IMAGE_ENABLE),
					//這個寬高是指，獲取圖片的尺寸，服務器端會剪裁 0表示按原始尺寸， 可以給 rem，會自動換算
					width: 0,
					height: 0,
				}
			},
		},
	})

	const articleTitle = _get(props.data, 'title', '')
	const filteredImgs = computed(() => {
		const imgs = _get(props, 'data.thumbnailImages', [])
		return imgs.filter((img) => isNotBlank(img.imgPath)).slice(0, 4)
	})

	function editIconHandler() {
		useIntersectionObserver(
			target,
			([{ isIntersecting }]) => {
				isCrossCenter.value = isIntersecting
			},
			{
				immediate: true,
				rootMargin: `0px 0px -${window.innerHeight / 2}px 0px`,
				threshold: 0,
			}
		)
	}

	function lazyLoadHandler() {
		const { stop } = useIntersectionObserver(
			lazyImage,
			async ([{ isIntersecting, target }]) => {
				if (target.getAttribute('loaded')) {
					stop()
					return
				}
				if (isIntersecting) {
					const { encrypt, width, height } = props.config
					const src = target.getAttribute('data-src')

					target.setAttribute('loaded', true)
					target.setAttribute('delay', delay.value)

					if (encrypt || width || height) {
						const res = await getEncryptImage({
							path: src,
							encrypt,
							width,
							height,
						})
						target.src = res
					} else {
						target.src = getCdnUrl(src)
					}
				}
			},
			{
				immediate: true,
			}
		)
	}

	const delay = computed(() => {
		if (props.order < 5) return Math.max(50, props.order * 150)
		return 1500
	})

	function delayHandler() {
		setTimeout(() => {
			showImage.value = true
		}, delay.value)
	}

	onMounted(() => {
		delayHandler()
		editIconHandler()
		lazyLoadHandler()
	})
</script>

<style lang="scss" scoped>
	.mask {
		background: rgba(#b0ffa0, 0.2);
		background-blend-mode: multiply;
		z-index: 1;
	}
	.drawing {
		.img-cover {
			position: relative;
			display: block;
			border-radius: 0.4375rem 0.4375rem 0 0;

			img {
				width: 100%;
				border-radius: 0.4375rem 0.4375rem 0 0;
			}

			.no-image {
				img {
					width: 83.235%;
				}
			}

			.edit {
				bottom: -1.03125rem;
				transform: translateX(-50%);
			}

			.small-imgs {
				bottom: -0.625rem;

				div {
					overflow: hidden;
					height: 1.875rem;
					border-radius: 0.25rem;
					box-shadow: 0.03125rem 0.0625rem 0.1875rem 0 #00000099;
					img {
						width: 100%;
						object-fit: contain;
					}
				}
			}
		}

		.drawing-content {
			padding: 0.625rem;

			&.is-current-period {
				padding: 1.25rem 0.625rem 0.625rem;
			}
			.title {
				line-height: 1.1875;
				letter-spacing: 0.02rem;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;

				.hot {
					height: 1.125rem;
					img {
						height: 100%;
					}
				}
			}

			.author-name {
				letter-spacing: 0.02rem;
				max-width: calc(100% - 1.75rem);
				line-height: 1.21875;
			}

			.content-bottom {
				height: 1.3125rem;

				.series {
					font-size: 0.875rem;
					letter-spacing: 0.0175rem;
					height: 1.4375rem;
					line-height: 1;
					display: flex;
					align-items: center;
				}
			}
		}
	}
</style>
