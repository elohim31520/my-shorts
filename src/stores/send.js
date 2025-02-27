import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSendStore = defineStore('send', () => {
	const show = ref(false)

	const defaultConfig = {
		bottom: '0rem',
		zIndex: 2000,
		showAttach: true, //是否顯示附件按鈕
		textRequired: false, //評論內容必填
	}

	const config = ref(defaultConfig)

	let doSend = async () => {}

	function toggle() {
		show.value = !show.value
	}

	function setConfig(configs) {
		const properties = _assignIn(defaultConfig, configs)
		for (let p in configs) config.value[p] = properties[p]
	}

	let triggerFirstComment = ref(false)

	function setFirstComment() {
		triggerFirstComment.value = true
	}

	function resetFirstComment() {
		triggerFirstComment.value = false
	}

	return {
		show,
		toggle,
		config,
		setConfig,
		doSend,
		triggerFirstComment,
		setFirstComment,
		resetFirstComment,
	}
})
