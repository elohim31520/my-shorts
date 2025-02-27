<template>
	<div class="channel-follow bg-#fafafa -mt-10 min-h-56.5dvh pb-50">
		<FollowFansList :isFans="false" :hasSearchBar="false" />
	</div>
</template>

<script setup>
	import FollowFansList from '@/views/my/channel/FollowFansList/index.vue'
</script>
