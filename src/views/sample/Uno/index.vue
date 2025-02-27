<template>
	<div class="p-4">
		<h1 class="text-lg font-bold mb-4">UnoCSS 樣式展示</h1>
		<div class="flex flex-col gap-2">
			<div class="bg-blue-500 text-white p-2 rounded">背景藍色，文字白色</div>
			<div class="border-2 border-solid border-black p-2">黑色實線邊框</div>
			<div class="text-red-500">紅色文字</div>
			<div class="mt-2 mb-2 text-green-500">上下邊距的綠色文字</div>
			<div class="font-bold text-xl">粗體大號文字</div>
		</div>
		<div class="mt-6">
			<a
				href="https://marketplace.cursorapi.com/items?itemName=antfu.unocss"
				class="text-lg font-bold"
			>
				UnoCSS 插件
			</a>
			<p>
				<a href="https://unocss.dev/interactive/" class="text-blue-500">
					UnoCSS 互動文檔
				</a>
			</p>
		</div>
		<div class="w-200px rounded-1/2 bg-#ff0 text-center lh-200px">
			寬高50圓型
		</div>
		<div class="w-200px truncate-2-lines">
			truncate-2-lines 自定義規則兩行省略 , uno.config.ts 中配置 ,
			自定義規則兩行省略 , uno.config.ts 中配置 , 自定義規則兩行省略 ,
			自定義規則兩行省略 , 自定義規則兩行省略 ,
		</div>
		<div class="w-200px truncate mt-10">
			truncate 默認樣式一行省略 , 默認樣式一行省略 , 默認樣式一行省略 ,
		</div>
		<div class="text-10">text-10 , 1 = 0.25rem , 10 = 2.5rem</div>
		<div class="text-10px">text-10px ,就是10px</div>

		<div>
			<h1 class="text-10/2 mb-10">計數</h1>
			<Counter
				:count="count"
				:increment="incrementCount"
				:decrement="decrementCount"
			/>
			<p class="text-10">{{ count }}</p>
		</div>
	</div>
</template>

<script setup>
	import Counter from './Counter.vue'
	import { useCounter } from './useCounter.js'

	const { count, incrementCount, decrementCount } = useCounter()
</script>

<style scoped></style>
