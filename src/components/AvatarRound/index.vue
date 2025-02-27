<template>
	<div
		class="rounded-full bg-skeleton"
		:style="{ width: avatarWidth, height: avatarWidth }"
	>
		<CdnImage
			:path="path"
			:fit="fit"
			:position="position"
			:width="avatarWidth"
			:height="avatarWidth"
			:error-icon="errorIcon"
			:class="avatarClass"
			round
			:config="{ width: avatarWidth }"
		/>
	</div>
</template>

<script setup>
	import CdnImage from '@/components/CdnImage/index.vue'
	const props = defineProps({
		path: {
			type: String,
			default: '',
			require: true,
		},
		fit: {
			type: String,
			default: 'cover',
		},
		position: {
			type: String,
			default: 'center',
		},
		avatarWidth: {
			type: String,
			require: true,
		},
		avatarClass: {
			type: String,
			default: '',
		},
		errorIcon: {
			type: String,
			default: '/public-assets/images/svg/default_avatar_man.png',
		},
	})
</script>
