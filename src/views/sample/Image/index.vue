<template>
	<h1 class="color-red font-600">
		這是用來存取後台上傳的圖片，不是處理前端自己發佈的(/public-assets/....)
	</h1>

	<h2>默認不做lazy load，渲染後即馬上加載圖片</h2>
	<CdnImage
		path="/dev/newspaper/issue/2025014/5e531dfce8e940c4a19dcfad5e3d309d.jpg"
	/>

	<h2>使用lazy load，當進入可視範圍才加載圖片(看一下console觀察)</h2>
	<CdnImage
		path="/dev/bbs/forum/attachment/8236aa59f33b436f8fa88066c05b754d.png"
		lazy-load
	/>

	<h2>
		config="{ encrypt: true|false }" 控制是否加密，默認是看.env裡的全局配置
	</h2>
	<CdnImage
		path="/dev/bbs/forum/attachment/b43dee263c454f5caa2f7ae72e427de4.jpg"
		lazy-load
		:config="{ encrypt: false }"
	/>

	<h2>
		config="{ width|height: [Number, String] }"
		這個寬高不是指css的寬高，是指加載服務器圖片的尺寸，可以是數字 或 rem
	</h2>
	<CdnImage
		path="/dev/bbs/forum/attachment/1b2c6f59118745aa93d92fe49dcf06a9.jpg"
		lazy-load
		:config="{ encrypt: false, width: '10rem' }"
	/>
</template>

<script setup>
	import CdnImage from '@/components/CdnImage/index.vue'
</script>

<style lang="scss" scoped>
	h2 {
		color: #fff;
		background-color: rgb(255, 75, 75);
	}
</style>
