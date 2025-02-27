<template>
	<van-image
		v-if="isMounted"
		:src="src"
		:class="{ 'com-van-image-error-fine': withDefaultImage }"
		:filename="filename"
		:size="size"
		ref="target"
	/>
</template>
<script setup>
	import {
		ref,
		onMounted,
		useAttrs,
		onBeforeMount,
		watch,
		onBeforeUnmount,
		computed,
		nextTick,
	} from 'vue'
	import { getCdnUrl, isBlank, rem2Px } from '@/modules/util.js'
	import { getEncryptImage } from '@/modules/imgCrypto.js'
	import { useIntersectionObserver } from '@vueuse/core'

	const props = defineProps({
		path: {
			type: String,
			required: false,
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
		rootMargin: {
			type: String,
			default: '',
		},
	})
	const emit = defineEmits(['error'])
	const attrs = useAttrs()
	const defaultImage = attrs['error-icon']
	const isMounted = ref(false)
	const withDefaultImage = !!defaultImage
	const src = ref(null)
	let unwatch = null
	const filename = computed(() => _last(_split(props.path, '/')))
	const size = computed(
		() => `${_get(props, 'config.width', 0)}x${_get(props, 'config.height', 0)}`
	)
	const target = ref(null)

	onMounted(() => {
		isMounted.value = true
		unwatch = watch(() => props.path, lazyHandler, { immediate: true })
	})

	onBeforeUnmount(() => {
		if (unwatch) unwatch()
	})

	function lazyHandler() {
		if (!attrs.hasOwnProperty('lazy-load')) {
			processImageSrc()
			return
		}
		const { stop } = useIntersectionObserver(
			target,
			([entry]) => {
				const isVisible = entry?.isIntersecting || false
				if (isVisible) {
					processImageSrc()
					stop()
				}
			},
			{
				rootMargin: props.rootMargin,
			}
		)
	}

	async function processImageSrc() {
		let {
			encrypt = Boolean(import.meta.env.PUBLIC_ENCRYPT_IMAGE_ENABLE),
			width = 0,
			height = 0,
		} = props.config

		if (!Boolean(import.meta.env.PUBLIC_SHRINK_IMAGE_ENABLE)) {
			width = height = 0
		}

		if (isBlank(props.path) || (!encrypt && width == 0 && height == 0)) {
			src.value = _defaultTo(getCdnUrl(props.path), defaultImage)
			return
		}
		const res = await getEncryptImage({
			path: props.path,
			encrypt,
			width: rem2Px(width),
			height: rem2Px(height),
		})
		if (isBlank(res)) {
			emit('error')
			src.value = defaultImage
			return
		}
		src.value = res
		//vant image loading效果未移除問題，手動觸發load事件
		await nextTick()
		setTimeout(() => {
			if (!target.value) return //maybe this component has been removed
			const img = target.value.$el.querySelector('img')
			if (img) img.dispatchEvent(new Event('load'))
		}, 100)
	}
</script>

<style lang="scss"></style>
