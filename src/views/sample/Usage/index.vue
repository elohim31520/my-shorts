<template>
	<div>
		這是 &lt;a&gt;
		<a href="/my/setting" v-redirect.auth.skip>點擊我去「設定頁」</a>
		<br />
		也可以用在其他元素例如： &lt;div&gt;
		<div v-redirect="'/website'">點擊我去「網址大全」</div>
		<h1>path param : {{ lastPath }}</h1>
		<h1>{{ store.count }}</h1>
		<van-space>
			<van-button type="primary" size="small" @click="doClick">
				Click
			</van-button>
			<van-button type="primary" size="small" @click="doToast">
				Toast
			</van-button>
			<van-button type="primary" size="small" @click="doAlert">
				Alert
			</van-button>
			<van-button type="primary" size="small" @click="doConfirm">
				Confirm
			</van-button>
			<van-button type="primary" size="small" @click="doNotify">
				Notify
			</van-button>
		</van-space>

		<QRCode :width="150" text="我是文字" :margin="0" />

		<van-divider />

		<van-space>
			<van-button type="primary" size="small" @click="setStorage">
				Set storage
			</van-button>
			<van-button type="primary" size="small" @click="delStorage">
				Delete storage
			</van-button>

			<van-button type="primary" size="small" @click="getStorage">
				Get storage
			</van-button>
		</van-space>

		<van-divider />

		這是vant icon
		<van-icon name="chat-o" />
		<br />
		這是自定義svg icon
		<SvgIcon class="cursor-pointer" name="fire" />

		<van-divider />

		開關：
		<van-switch v-model="checked" />

		<van-divider />

		輪播效果：
		<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
			<van-swipe-item>1</van-swipe-item>
			<van-swipe-item>2</van-swipe-item>
			<van-swipe-item>3</van-swipe-item>
			<van-swipe-item>4</van-swipe-item>
		</van-swipe>

		<Carousel :items="images"></Carousel>

		加載圖片：
		<img src="/public-assets/images/404-200x300.jpg" />

		<h2>日期時間方法</h2>
		<ul v-once>
			<li>當前日期時間: {{ getCurrent() }}</li>
			<li>當前日期: {{ getCurrentDate() }}</li>
			<li>當前時間: {{ getCurrentTime() }}</li>
		</ul>
		<h3>倒數計時器：{{ theCountdown }}</h3>

		<div
			class="py-2 px-5 inline-flex flex-justify-center border-2 border-solid border-#34c759 border-rounded-5 min-w-28 items-center"
		>
			澳門六
		</div>
		<div
			class="py-2 px-5 inline-flex flex-justify-center border-2 border-solid border-#3b82f6 border-rounded-5 min-w-28 items-center"
		>
			香港六
		</div>
		<van-divider />
		<span class="color-primary">UnoCss shortcut</span>
		<span class="bg-primary color-white ml-4 p-2">UnoCss shortcut</span>
	</div>
</template>

<script setup>
	import { ref, inject } from 'vue'
	import { toast, dialog, confirmDialog, notify } from '@/modules/util'
	import { useCounterStore } from '@/stores/counter.js'
	import { current, currentDate, currentTime, Countdown } from '@/modules/date'
	import { addHours } from 'date-fns'
	import Carousel from '@/components/Carousel/index.vue'
	import lscache from 'lscache'
	import QRCode from '@/components/QRCode/index.vue'

	const count = ref(0)
	const checked = ref(false)
	const store = useCounterStore()
	const theCountdown = ref('')
	const deadline = addHours(new Date(), 1)
	const countdown = new Countdown(deadline)
	const images = ref([
		{ src: 'https://picsum.photos/id/237/400/200' },
		{ src: 'https://picsum.photos/400/200?grayscale' },
	])

	const timer = setInterval(() => {
		theCountdown.value = countdown.get()
		if (!theCountdown.value) clearInterval(timer)
	}, 1000)

	const pathname = _get(inject('data'), 'pathname', '')

	function doClick() {
		store.increment()
	}

	function doToast() {
		toast('這是吐司')
	}
	function doAlert() {
		dialog('這是彈窗信息', { title: '這是標題' })
	}

	function getCurrent() {
		return current()
	}
	function getCurrentDate() {
		return currentDate()
	}
	function getCurrentTime() {
		return currentTime()
	}

	function doConfirm() {
		confirmDialog('XXXX', { title: '我是標題' })
	}

	function doNotify() {
		notify('通知你', { type: 'danger' })
	}

	function setStorage() {
		lscache.set('my-key', 'hello', 5) //單位秒
	}

	function delStorage() {
		lscache.remove('my-key')
	}

	function getStorage() {
		toast(lscache.get('my-key'))
	}

	const lastPath = _last(pathname.split('/'))
</script>

<style lang="scss">
	.my-swipe {
		.van-swipe-item {
			color: #fff;
			font-size: 20px;
			line-height: 150px;
			text-align: center;
			background-color: #39a9ed;
		}
	}
</style>
