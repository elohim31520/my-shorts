import { defineStore } from 'pinia'
import { ref, reactive, nextTick } from 'vue'
import { toast } from '@/modules/util'
import { toggleLike } from '@/api/common'
import { getCdnUrl } from '@/modules/util'
import { previewImage } from '@/modules/imgCrypto.js'

export const usePictureDetailStore = defineStore('pictureDetail', () => {
	const year = ref(0)
	const period = ref(0)
	const periodFull = ref('')
	const showStory = ref(false)
	const isPreviewVisible = ref(false)
	const postsKV = reactive([])
	const commentCount = ref(0)

	const setYear = (val) => (year.value = val)

	const setPeriod = (shortIssue) => {
		period.value = shortIssue
	}

	const setPeriodFull = (fullIssue) => {
		periodFull.value = fullIssue
	}

	const setCommentCount = (value) => {
		commentCount.value = value
	}
	const addCommentCount = (value) => {
		const parsedValue = Number(value)

		if (isNaN(parsedValue)) {
			console.error(`無效的數字: ${value}`)
			return
		}
		commentCount.value = +commentCount.value + parsedValue
	}

	const previewImg = async (input, useCdn = true) => {
		let urls = []

		if (_isArray(input)) {
			urls = _map(input, (img) => (useCdn ? getCdnUrl(img) : img))
		} else if (typeof input === 'string') {
			urls = [useCdn ? getCdnUrl(input) : input]
		}

		if (urls.length > 0) {
			isPreviewVisible.value = true
			previewImage({
				images: urls,
				showIndex: false,
				onClose: () => {
					isPreviewVisible.value = false
				},
				'class-name': 'tip-download',
			})
			const container = await getElement()
			if (!container) return
			const tip = document.createElement('div')
			tip.textContent = '长按保存'
			tip.setAttribute(
				'style',
				'color:#fff; font-size:.9rem; margin-top:.5rem; position:absolute; left: 50%; transform: translateX(-50%);'
			)
			container.appendChild(tip)
		}
	}

	const getElement = (tryCount = 1) => {
		return new Promise((resolve) => {
			if (tryCount > 50) return resolve(null)
			const el = document.querySelector(
				'.tip-download .van-image-preview__image'
			)
			if (el) {
				resolve(el)
				return
			}
			setTimeout(() => {
				resolve(getElement(++tryCount))
			}, 100)
		})
	}

	const doDownload = (url, useCdn = true) => {
		if (useCdn) url = getCdnUrl(url)
		const filename = _last(_split(url, '/'))
		fetch(`/api/download?file=${encodeURIComponent(url)}`).then((res) =>
			res.blob().then((blob) => {
				var a = document.createElement('a')
				var url = window.URL.createObjectURL(blob)
				a.href = url
				a.download = filename
				a.click()
				window.URL.revokeObjectURL(url)
			})
		)
	}

	const doLike = async (data, options = {}) => {
		const {
			targetIdKey,
			targetRefKey,
			statusKey,
			likeFlag,
			updateCount = true,
		} = options

		const targetId = data[targetIdKey]
		const targetRef = data[targetRefKey]

		if (!targetId) {
			toast('当前暂无数据')
			return
		}

		await toggleLike({
			targetId,
			targetRef,
			likeFlag,
		}).then((res) => {
			if (!res.success) return
			data[statusKey] = data[statusKey] == 'y' ? 'n' : 'y'
			if (updateCount) {
				handleCount(data, {
					increase: data[statusKey] == 'y',
					fields: ['likeCount', 'totalLikeCount'],
				})
			}
			const msg = data[statusKey] == 'y' ? '喜欢成功' : '取消喜欢成功'
			toast(msg)
		})
	}

	function handleCount(data, { increase = true, fields = [] } = {}) {
		_forEach(fields, (field) => {
			const value = increase ? 1 : -1
			data[field] = Math.max(Number(data[field]) + value, 0)
		})
	}

	function getIssueParam() {
		// 傳長的, 注意港彩長的也是短的
		return periodFull.value
	}

	return {
		year,
		period,
		periodFull,
		showStory,
		setYear,
		setPeriod,
		setPeriodFull,
		previewImg,
		isPreviewVisible,
		doLike,
		doDownload,
		postsKV,
		getIssueParam,
		commentCount,
		setCommentCount,
		addCommentCount,
	}
})
