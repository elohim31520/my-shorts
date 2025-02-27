<template>
	<div>
		<MyScoreStar :textData="textData" />
	</div>
</template>

<script setup>
	import MyScoreStar from '@/components/MyScoreStar/index.vue'
	import { getScoreList } from '@/api/score.js'

	const textData = {
		creditType: '积分',
		backgroundUrl: '/public-assets/images/creditCenter/bg_credit.svg',
		backgroundColor: '#FFF6EF',
		getData: getScoreList,
		tips: '通过发帖、点赞、评论、投票、收藏等互动方式获得积分，互动越多获得越多～',
	}
</script>

<style lang="scss" scoped></style>
