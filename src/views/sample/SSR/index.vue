<template>
	<div>
		<div>SSR demo</div>
		<div>ref {{ count }}</div>
		<div>store {{ count1 }}</div>
		<ul>
			<li v-for="vo in users" :key="vo.id">{{ vo.name }}</li>
		</ul>
		<h1>TODO :{{ todo.title }}</h1>
	</div>
</template>

<script setup>
	import { ref, onServerPrefetch } from 'vue'
	import { inject } from 'vue'
	const { users, todo } = inject('data')
	/**
	 * 在 SSR (伺服器端渲染) 和 CSR (客戶端渲染) 環境中都會執行 script setup hook 內的程式碼,
	 * hook 執行時間介於 beforeCreate 和 created 之間
	 */

	/**
	 * 在 SSR 中，`count` 在伺服器執行，每次頁面請求都會重新建立並初始化為 0
	 * 在 CSR 中，`count` 在客戶端執行，只在客戶端生命週期內持續存在，並可互動
	 * 注意：SSR 中設定的任何狀態（如此處的 `count`）不會自動傳遞到 CSR，除非顯式傳遞狀態
	 */
	const count = ref(0)

	// SSR 環境會執行一次，CSR 環境也會執行一次，不能在這個 hook 調用 API
	// count.value = 5

	/**
	 * 寫在 onServerPrefetch hook 裡面只會在 SSR 環境執行，在這裡面調用 API
	 * 但延伸一個問題，count 是在 script setup hook 初始化的
	 * 所以 SSR 的時候更新了它的值，到 CSR 的時候就會被重置
	 */
	onServerPrefetch(async () => {
		count.value = 5
	})

	/**
	 * 為維持 SSR 和 CSR 之間的資料一致性：在 SSR 環境時，使用 store 來存儲資料
	 * 獲取和儲存的狀態會在頁面渲染時被嵌入到 HTML中，然後在客戶端被重新啟用
	 * 保證了無論使用者是首次從伺服器接收頁面，還是之後在客戶端與頁面互動，應用的狀態都是一致的
	 */
	import { useSsrStore } from './store'
	import { storeToRefs } from 'pinia'

	const { count1 } = storeToRefs(useSsrStore())

	onServerPrefetch(async () => {
		count1.value = 5
	})
</script>

<style scoped></style>
