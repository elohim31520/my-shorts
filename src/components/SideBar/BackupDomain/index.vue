<template>
	<div v-if="visibleBackupDomain" class="backup-domain">
		<div class="bd-header flex-center">
			<SvgIcon
				name="arrow_left"
				size="1.875rem"
				class="color-#434343"
				@click="emit('update:visibleBackupDomain', false)"
			/>
			<b>备用网址</b>
		</div>
		<div class="bd-content">
			<div class="bd-warning">
				强烈建议
				<span>【截图保存】</span>
				，方便后续找回
			</div>
			<div class="bd-outer">
				<div class="bd-title">官方永久域名</div>
				<ul>
					<li v-for="(item, index) in officialDomainList" :key="index">
						<span>http://{{ item.url }}</span>
						<SvgIcon
							class="color-#34c759"
							name="side-bar-copy"
							size="1.375rem"
							@click="doCopy(item.url, 'domain')"
						/>
					</li>
				</ul>
			</div>
			<div class="bd-outer">
				<div class="bd-title">官方备用域名</div>
				<ul>
					<li v-for="(item, index) in backupDomainList" :key="index">
						<span>http://{{ item.url }}</span>
						<SvgIcon
							class="color-#34c759"
							name="side-bar-copy"
							size="1.375rem"
							@click="doCopy(item.url, 'domain')"
						/>
					</li>
				</ul>
			</div>
			<div class="bd-outer">
				<div class="bd-title">官方邮件</div>
				<ul class="bd-mail">
					<li>
						<span>{{ officialMailList }}</span>
						<SvgIcon
							class="color-#34c759"
							name="side-bar-copy"
							size="1.375rem"
							@click="doCopy(officialMailList, 'mail')"
						/>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, watch } from 'vue'
	import { clipboard, toast } from '@/modules/util'
	import { getMailContact } from '@/api/website.js'

	const props = defineProps({
		visibleBackupDomain: {
			type: Boolean,
			required: true,
		},
		domainList: {
			type: Array,
			required: true,
		},
	})
	const emit = defineEmits(['update:visibleBackupDomain'])

	const officialDomainList = computed(() =>
		props.domainList.filter((item) => item.type === 'p')
	)

	const backupDomainList = computed(() =>
		props.domainList.filter((item) => item.type === 'b')
	)
	const officialMailList = ref('')

	function doCopy(url, type) {
		const copyText = type === 'domain' ? '已拷贝此域名' : '已拷贝官方邮件'
		clipboard(url, {
			onSuccess() {
				toast(copyText)
			},
		})
	}

	watch(
		() => props.visibleBackupDomain,
		(value) => {
			if (value && !officialMailList.value) {
				getMailContact().then((res) => {
					const data = _defaultTo(res.data, [])
					officialMailList.value = data.contactType
				})
			}
		}
	)
</script>

<style lang="scss" scoped>
	.backup-domain {
		width: 480px;
		height: 100dvh;
		position: fixed;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		z-index: 99;
		display: block;
		background: #fff;
		color: #656565;
		::-webkit-scrollbar {
			display: none;
		}
		.bd-header {
			padding: 0.5rem 1.25rem;
			svg {
				position: absolute;
				left: 0.5rem;
			}
			b {
				font-size: 1.25rem;
			}
		}
		.bd-content {
			overflow-y: auto;
			height: 100%;
			padding: 0 0.625rem;
			font-size: 1.125rem;
			background-color: #fff;
			.bd-title {
				color: #333;
				margin-bottom: 0.625rem;
			}
			ul {
				li {
					margin-bottom: 0.625rem;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
				li:last-child {
					margin-bottom: 0;
				}
			}
		}
		.bd-warning {
			margin: 0.625rem 0;
			text-align: center;
			span {
				color: $primary-color;
			}
		}
		.bd-outer {
			background-color: #fff;
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			padding: 1.25rem;
			margin-bottom: 0.625rem;
		}
	}
	@media (max-width: 480px) {
		.backup-domain {
			width: 100%;
			left: 0;
			transform: translateX(0);
		}
	}
</style>
