<template>
	<div class="check" @click.stop="change">
		<img
			v-show="!modelValue"
			src="/shorts/img/icon/components/check/round-gray.png"
			alt=""
		/>
		<img
			v-show="modelValue && mode === 'gray'"
			src="/shorts/img/icon/components/check/check-gray.png"
			alt=""
		/>
		<img
			v-show="modelValue && mode === 'red'"
			src="/shorts/img/icon/components/check/check-red.png"
			alt=""
		/>
	</div>
</template>
<script>
	export default {
		name: 'Check',
		props: {
			modelValue: {
				type: Boolean,
				default: false,
			},
			mode: {
				type: String,
				default: 'gray', //red
			},
		},
		data() {
			return {}
		},
		computed: {},
		created() {},
		methods: {
			change() {
				this.$emit('update:modelValue', !this.modelValue)
				this.$emit('change', !this.modelValue)
			},
		},
	}
</script>

<style scoped lang="scss">
	@import url('@/styles/shorts.scss');

	.check {
		$width: 14px;
		width: $width;
		height: $width;

		& > img {
			width: 100% !important;
			height: 100% !important;
		}
	}
</style>
