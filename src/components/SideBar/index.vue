<template>
	<div>
		<div
			class="overlayer"
			:class="{ 'is-open': visible }"
			@click="visible = false"
		></div>
		<div class="side-bar" :class="{ 'is-open': visible }">
			<div class="sb-menu w-280">
				<!-- <div class="sb-header">
					<div class="sb-logo">
						<b>
							<span>A6TK01</span>
							<span>.COM</span>
						</b>
					</div>
					<div class="sb-backup-url">备用网址</div>
				</div> -->
				<div class="sb-domain" :class="{ 'mt-40': !domainListBoard.length }">
					<ul>
						<li
							v-for="(item, index) in domainListBoard"
							:key="index"
							class="justify-between"
						>
							<span :href="item.href">
								<SvgIcon :name="`side-bar-no${index + 1}`" size="1.375rem" />
								{{ item.url }}
							</span>
							<span class="color-#434343 sb-cp">
								<span class="sb-quality"></span>
								<SvgIcon
									name="side-bar-copy"
									size="1.375rem"
									@click="doCopy(item.url)"
								/>
							</span>
						</li>
					</ul>
					<div class="more-domain" @click="openBackupDomain">
						<span class="color-#34c759">更多备用域名</span>
						<SvgIcon
							class="color-#34c759"
							name="arrow_right_green"
							size="1.375rem"
						/>
					</div>
				</div>
				<div class="sb-content">
					<ul class="divide">
						<li v-for="(item, index) in sideBarListV" :key="index">
							<SvgIcon
								class="sb-icon"
								:name="`side-bar-${item.icon}`"
								size="1.375rem"
							/>
							<a
								:href="item.href"
								@click.prevent="
									() => {
										doClick(item)
										visible = false
									}
								"
							>
								{{ item.name }}
							</a>
						</li>
					</ul>
					<div class="sb-login-col">
						<div class="sb-login">
							<a v-if="!isLogin()" class="color-#34c759" href="/login">
								<SvgIcon name="side-bar-login" />
								登录
							</a>
						</div>
						<!-- <div class="sb-share">
							<a class="color-#34c759" href="javascript:;">
								<SvgIcon name="side-bar-share" />
								分享
							</a>
						</div> -->
					</div>
					<ul class="sb-horizontal">
						<li v-for="(item, index) in sideBarListH" :key="index">
							<a :href="item.href" @click.prevent="doClick(item)">
								<div class="sb-hr-icon">
									<SvgIcon
										class="sb-icon"
										:name="`side-bar-${item.icon}`"
										size="1.375rem"
									/>
								</div>
								<div class="sb-hr-name">
									{{ item.name }}
								</div>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<BackupDomain
			:visibleBackupDomain="visibleBackupDomain"
			v-model:visibleBackupDomain="visibleBackupDomain"
			:domainList="domainList"
		/>
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue'
	import { storeToRefs } from 'pinia'
	import { clipboard, isLogin, redirect, toast } from '@/modules/util'
	import { getDomainList } from '@/api/website.js'
	import { useSidebarStore } from '@/stores/sidebar.js'
	import BackupDomain from './BackupDomain/index.vue'
	const { visible } = storeToRefs(useSidebarStore())

	watch(visible, async (value) => {
		if (value) {
			document.querySelector('body').classList.add('com-body-overlay')
			if (!domainList.value.length) getDomainListData()
		} else {
			document.querySelector('body').classList.remove('com-body-overlay')
		}
	})

	const sideBarListV = [
		{
			name: '浏览记录',
			href: '/activityHistory/gallery',
			icon: 'record',
		},
		{ name: '资料大全', href: '/corpus', icon: 'material' },
		{ name: '资讯统计', href: '/statistic', icon: 'statistics' },
		{ name: '查询工具', href: '/consultation', icon: 'query' },
		{ name: '幽默猜测', href: '/humorVote', icon: 'humor' },
		{ name: '工具宝箱', href: '/toolbox', icon: 'tool' },
		// { name: '聊天室', href: '/voiceChat', icon: 'chat' },
	]
	const sideBarListH = [
		{ name: '客服', href: '/cs', icon: 'service', auth: false },
		{ name: '设置', href: '/my/setting', icon: 'system', auth: true },
		{ name: '投诉', href: '/feedback', icon: 'opinion', auth: false },
	]
	const domainList = ref([])
	const domainListBoard = ref([])
	const visibleBackupDomain = ref(false)
	const openBackupDomain = () => {
		visibleBackupDomain.value = true
	}

	function getDomainListData() {
		getDomainList().then((res) => {
			const data = _defaultTo(res.data, [])
			domainList.value = Object.keys(data).map((key) => ({
				...data[key],
			}))
			domainListBoard.value = domainList.value
				.filter((item) => item.type === 'b')
				.slice(0, 3)
		})
	}

	function doClick(vo) {
		redirect(vo.href, { auth: vo.auth })
	}

	function doCopy(url) {
		clipboard(url, {
			onSuccess() {
				toast('已拷贝此域名')
			},
		})
	}
</script>

<style lang="scss" scoped>
	.overlayer {
		background-color: rgba(0, 0, 0, 0.55);
		position: fixed;
		left: 50%;
		top: 0;
		z-index: 50;
		width: 480px;
		height: 100vh;
		-webkit-backdrop-filter: blur(1.5px);
		backdrop-filter: blur(1.5px);
		transform: translateX(-50%);
		display: none;
	}
	.side-bar {
		width: 480px;
		height: calc(100 * var(--height-unit));
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		position: fixed;
		overflow: hidden;
		z-index: 60;
		pointer-events: none;
		::-webkit-scrollbar {
			display: none;
		}
		.sb-menu {
			background: #fff;
			height: 100%;
			overflow-y: auto;
			border-radius: 0 10px 10px 0;
			position: fixed;
			left: -17.5rem;
			top: 0;
			z-index: 90;
			pointer-events: fill;
			transition: all ease 0.4s;
			padding: 0 1.15rem;
			.sb-header {
				background-color: #1eb52d;
				text-align: center;
				color: #fff;
				padding: 0.3125rem 0;
				border-radius: 0 10px 0 0;
				.sb-logo {
					font-size: 1.125rem;
					span:first-child {
						color: #fff741;
					}
				}
				.sb-backup-url {
					font-size: 1rem;
				}
			}
			.sb-domain {
				ul {
					// height: 7.125rem;
					li {
						font-size: 0.8125rem;
						.sb-cp {
							.sb-quality {
								margin-right: 0.125rem;
							}
							::before {
								display: inline-block;
								color: #fff;
								border-radius: 5px;
								font-size: 0.625rem;
								padding: 0rem 0.375rem;
								margin-right: 0.15rem;
							}
						}
					}
					li:nth-child(1) {
						.sb-cp {
							:before {
								content: '极速';
								background-color: #66c8ff;
							}
						}
					}
					li:nth-child(2) {
						.sb-cp {
							:before {
								content: '高速';
								background-color: #e86ae3;
							}
						}
					}
					li:nth-child(3) {
						.sb-cp {
							:before {
								content: '快速';
								background-color: #efb441;
							}
						}
					}
				}
				svg {
					display: inline-block;
					color: $primary-color;
				}
				.more-domain {
					display: inline-flex;
					align-items: center;
					font-size: 1rem;
					color: #656565;
					margin-bottom: 1rem;
				}
			}
			.sb-content {
				padding-bottom: 1rem;
				.sb-login-col {
					// display: flex;
					// justify-content: space-around;
					margin: 1.25rem 0;
					> div {
						width: 100%;
						a {
							font-size: 1.25rem;
							width: 100%;
							display: block;
							display: flex;
							align-items: center;
							svg {
								display: inline-block;
								margin-right: 0.625rem;
								width: 1.375rem !important;
								height: 1.375rem !important;
							}
						}
					}
					.sb-login {
						color: #343434;
					}
					.sb-share {
						color: $primary-color;
					}
				}
			}
			ul {
				li {
					color: #434343;
					font-size: 1.125rem;
					margin: 1rem 0;
					display: flex;
					align-items: center;
					// padding-left: 0.75rem;
					a {
						font-size: 1.125rem;
					}
				}
			}
			ul.sb-horizontal {
				display: flex;
				justify-content: center;
				justify-content: space-around;
				width: 100%;
				left: 0;
				bottom: 0;
				padding: 0 1.25rem 1.25rem;
				li {
					margin-right: 0.425rem;
					display: block;
					text-align: center;
					margin: 0;
					flex: 1;
					a {
						.sb-hr-name {
							margin-top: 0.25rem;
						}
						.sb-icon {
							margin-right: 0;
						}
					}
				}
			}
			.divide {
				border-top: 1px solid #e6e7ec;
				// border-bottom: 1px solid #e6e7ec;
			}
			.sb-icon {
				display: inline-block;
				margin-right: 0.625rem;
				width: 1.375rem !important;
				height: 1.375rem !important;
			}
		}
	}
	.is-open.overlayer {
		display: block;
	}
	.is-open {
		.sb-menu {
			left: 0;
		}
	}
	@media (max-width: 480px) {
		.overlayer {
			width: 100%;
		}
		.side-bar {
			width: 100%;
			left: 0;
			transform: translateX(0);
			ul.sb-horizontal {
				position: absolute;
			}
		}
		.is-open {
			.sb-menu {
				left: 0;
			}
		}
	}
</style>
