<template>
	<div class="information">
		<InformationHeader />
		<ActivityPanel />
		<ChatGroup />
		<MyChatList />
		<Discover />
		<Footer :active="1" :showIcon="true" />
	</div>
</template>

<script setup>
	import Footer from '@/components/Footer/index.vue'
	import InformationHeader from '@/components/InformationHeader/index.vue'
	import ActivityPanel from './ActivityPanel/index.vue'
	import ChatGroup from './ChatGroup/index.vue'
	import MyChatList from './MyChatList/index.vue'
	import Discover from './Discover/index.vue'
	import { provide } from 'vue'

	const props = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
	})

	provide('data', props.data)
</script>
