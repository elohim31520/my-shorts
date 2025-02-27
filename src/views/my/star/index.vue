<template>
	<div>
		<MyScoreStar :textData="textData" />
	</div>
</template>

<script setup>
	import MyScoreStar from '@/components/MyScoreStar/index.vue'
	import { getStarsList } from '@/api/score.js'
	const textData = {
		creditType: '星星',
		backgroundUrl: '/public-assets/images/creditCenter/bg_Star.svg',
		backgroundColor: '#FEFFD9',
		getData: getStarsList,
		tips: '通过参与竞猜等活动，获得星星奖励！',
	}
</script>

<style lang="scss" scoped></style>
