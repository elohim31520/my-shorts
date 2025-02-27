<template>
	<div :class="`rounded-full overflow-hidden grid gap-2 ${layoutClass}`">
		<div
			v-for="(item, index) in renderedImages"
			:key="index"
			:style="item.style"
			:class="item.extraClass"
			class="h-100% w-100%"
			:filenames="filenames.join(',')"
		/>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, watch } from 'vue'
	import { getCdnUrl, rem2Px } from '@/modules/util'
	import { getEncryptImage } from '@/modules/imgCrypto.js'

	const props = defineProps({
		images: {
			type: Array,
			required: true,
		},
		config: {
			type: Object,
			default: () => {
				return {
					encrypt: Boolean(import.meta.env.PUBLIC_ENCRYPT_IMAGE_ENABLE),
					// 這個寬高是指，獲取圖片的尺寸，服務器端是剪裁
					width: 0,
					height: 0,
				}
			},
		},
	})

	// 存放每張圖片對應的 style、class、原始路徑等資訊
	const renderedImages = ref([])
	const filenames = ref([])

	const layoutClass = computed(() => {
		const len = props.images.length
		switch (len) {
			case 1:
				return 'grid-cols-1 grid-rows-1'
			case 2:
				return 'grid-cols-2 grid-rows-1'
			case 3:
			case 4:
				return 'grid-cols-2 grid-rows-2'
			default:
				return ''
		}
	})

	watch(
		() => props.images,
		(newVal) => {
			updateRenderedImages(newVal)
		}
	)

	const updateRenderedImages = async (images) => {
		const {
			encrypt = Boolean(import.meta.env.PUBLIC_ENCRYPT_IMAGE_ENABLE),
			width = 0,
			height = 0,
		} = props.config
		const len = images.length
		const processedImages = []

		for (let index = 0; index < len; index++) {
			const originalPath = images[index] // 原圖路徑
			let encryptedUrl =
				getCdnUrl(originalPath) ||
				'/public-assets/images/svg/default_avatar_man.png'

			// 加密圖片
			if (originalPath) {
				if (encrypt || width || height) {
					const encryptedImage = await getEncryptImage({
						path: originalPath,
						encrypt,
						width: rem2Px(width),
						height: rem2Px(height),
					})
					if (encryptedImage) {
						encryptedUrl = encryptedImage
					}
				}
				filenames.value.push(_last(_split(originalPath, '/')))
			}

			const styleObj = {
				backgroundImage: `url(${encryptedUrl})`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
			}

			const obj = {
				originalPath, // 原始圖片路徑
				encryptedUrl, // 加密後圖片 URL
				style: styleObj,
				extraClass: '',
			}

			// default圖調整: 只有一張圖 or 2張圖時 不做放大跟調整位置
			if (len > 2 && !originalPath) {
				obj.style.backgroundSize = '140%'
				obj.style.backgroundPosition = '80% 20%'
				if (index === 2) {
					obj.style.backgroundPosition = '70% 50%'
				}
			}

			// 兩張圖
			if (len === 2) {
				obj.style.backgroundSize = '250%'
				if (index === 0) {
					obj.style.backgroundPosition = '40% 50%'
				}
				if (index === 1) {
					obj.style.backgroundPosition = '50% 50%'
				}
			}

			// 3張圖
			if (len === 3) {
				if (index === 0) {
					obj.style.backgroundSize = '250%'
					obj.style.backgroundPosition = '40% 50%'
				}
				if (index === 1) {
					obj.style.backgroundSize = '150%'
					obj.style.backgroundPosition = '60% 30%'
				}
				if (index === 2) {
					obj.style.backgroundSize = '150%'
					obj.style.backgroundPosition = '60% 50%'
				}
			}

			// 4張圖
			if (len === 4) {
				obj.style.backgroundSize = '150%'
				if (index === 0) {
					obj.style.backgroundPosition = '20% 30%'
				}
				if (index === 1) {
					obj.style.backgroundPosition = '60% 30%'
				}
				if (index === 2) {
					obj.style.backgroundPosition = '20% 50%'
				}
				if (index === 3) {
					obj.style.backgroundPosition = '60% 50%'
				}
			}

			// 只有三個的時候 第一張要佔滿col-1
			if (len === 3 && index === 0) {
				obj.extraClass = 'col-span-1 row-span-2'
			}

			processedImages.push(obj)
		}

		renderedImages.value = processedImages
	}

	onMounted(() => {
		updateRenderedImages(props.images)
	})
</script>
