<template>
	<div>
		<NormalHeader title="下载APP" />
		<div class="download">
			<div class="tabs">
				<div>
					<van-button
						@click="changeTab('android')"
						class="btn-tab"
						:class="{ active: currentTab === 'android' }"
						text="Android下载"
					></van-button>
				</div>
				<div>
					<van-button
						@click="changeTab('ios')"
						class="btn-tab"
						:class="{ active: currentTab === 'ios' }"
						text="IOS下载"
					></van-button>
				</div>
			</div>
			<!-- prettier-ignore -->
			<div class="text">
				请认准<span class="url">A6TK.COM</span>官方下载地址
			</div>
			<div v-if="officialUrl" class="qr-code">
				<QRCode :width="168" :text="officialUrl" :margin="0" />
			</div>
			<div v-if="currentTab === 'android'" class="android">
				<van-button
					@click="downloadFile(false)"
					type="success"
					color="#34c759"
					class="btn btn-download"
				>
					<div>Android下载</div>
					<div class="version">版本{{ downloadVersion }}日期:{{ date }}</div>
				</van-button>
			</div>
			<div v-else class="ios">
				<!-- <van-button
					@click="downloadFile(true)"
					type="success"
					color="#34c759"
					class="btn btn-download"
				>
					<div>IOS最新版下载</div>
					<div class="version">版本{{ iosNewVersion }}日期:{{ date }}</div>
				</van-button> -->
				<van-button
					@click="downloadFile(false)"
					type="success"
					color="#34c759"
					class="btn btn-download"
				>
					<div>IOS下载</div>
					<div class="version">版本{{ downloadVersion }}日期:{{ date }}</div>
				</van-button>
			</div>
			<div class="website" @click="goTo('website')">
				<div class="btn-website">
					<div>网页版</div>
					<div class="version">免下载,直接访问{{ getWebTitle() }}</div>
				</div>
			</div>

			<div class="tips">
				<div>1.建议使用Google浏览器打开进行下载。</div>
				<!-- prettier-ignore -->
				<div>
					2.华为手机安装被拦截需要修改设置，<span class="check" @click="goTo('steps')">查看步骤></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import NormalHeader from '@/components/NormalHeader/index.vue'
	import QRCode from '@/components/QRCode/index.vue'
	import { ref, onBeforeMount } from 'vue'
	import { safeOpen, getWebTitle } from '@/modules/util.js'
	import { getDownloadLink } from '@/api/download.js'
	import { getDomainList } from '@/api/website.js'

	const officialUrl = ref('tk.com')
	const downloadUrl = ref('')
	const downloadVersion = ref('')
	const date = ref('')
	const iosNewUrl = ref('')
	// const iosNewVersion = ref('')
	const currentTab = ref('android')
	const domainList = ref([])

	onBeforeMount(async () => {
		getDomainListData()
		const data = await getDownloadLink('android')
		setData(data)
	})

	function goTo(type) {
		let url = ''
		if (type === 'steps') url = 'https://a6tkapp1.com/cjms/index.html'
		if (type === 'website') url = _defaultTo(domainList.value[0].url, '')
		safeOpen(url)
	}
	function setData(data) {
		officialUrl.value = _get(data, 'officalUrl', '')
		downloadUrl.value = _get(data, 'url', '')
		downloadVersion.value = _get(data, 'version', '')
		date.value = _get(data, 'date', '')
		iosNewUrl.value = _get(data, 'newUrl', '')
		// iosNewVersion.value = _get(data, 'newVersion', '')
	}
	async function changeTab(type) {
		currentTab.value = type
		const data = await getDownloadLink(type)
		setData(data)
	}
	function downloadFile(newVersion) {
		let url = newVersion ? iosNewUrl.value : downloadUrl.value
		safeOpen(url)
	}
	async function getDomainListData() {
		const res = await getDomainList()
		const data = _defaultTo(res.data, [])
		domainList.value = Object.keys(data).map((key) => ({
			...data[key],
		}))
	}
</script>

<style lang="scss" scoped>
	.download {
		margin-top: 2.8125rem;
		background-color: #fafafa;
		min-height: calc(100dvh - 2.8125rem);
		.tabs {
			padding-top: 0.3rem;
			display: flex;
			justify-content: space-around;
			color: #656565;
			.btn-tab {
				width: 10.781rem;
				height: 1.875rem;
				border-radius: 0.625rem;
				font-size: 1rem;
			}
			.active {
				color: $primary-color;
				border: 0.1rem solid $primary-color;
				background-color: #f1fee6;
				font-weight: 600;
			}
		}
		.text {
			margin-top: 1.7rem;
			font-size: 1rem;
			font-weight: 600;
			text-align: center;
			.url {
				color: $primary-color;
			}
		}
		.qr-code {
			padding: 2.2rem 1.1rem 1.1rem 1.1rem;
			display: flex;
			justify-content: center;
		}
		.btn {
			margin-top: 1.8rem;
			// --van-button-radius: 2.5rem;
			width: 12.5rem;
			font-size: 1rem;
			height: 3.8125rem;
			white-space: nowrap;
			border-radius: 2.5rem;
		}
		.btn-download {
			font-size: 1.125rem;
		}
		.version {
			font-size: 0.75rem;
			font-weight: 400;
		}
		:deep(.van-image) {
			padding: 0.5rem 1.9375rem 0 1.9375rem;
		}
		.android,
		.ios,
		.website,
		.btn-website,
		.tips {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.website {
			margin-top: 1.2rem;
			.btn-website {
				color: $primary-color;
				border: 0.124rem solid $primary-color;
				background-color: #f1fee6;
				width: 12.5rem;
				font-size: 1rem;
				height: 3.8125rem;
				border-radius: 2.5rem;
				white-space: nowrap;
				font-weight: 600;
				cursor: pointer;
			}
		}
		.tips {
			margin-top: 1.5rem;
			color: #434343;
			font-size: 0.875rem;
			.check {
				color: $primary-color;
				font-weight: 600;
				border-bottom: 1px solid $primary-color;
				display: inline-block;
				cursor: pointer;
			}
		}
	}
</style>
