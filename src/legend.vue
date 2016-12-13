<template lang="jade">
#legend
	.gradient
		.limit
	.labels
		.label(style="bottom: 100%") 100
		.label(style="bottom: 75%") 75
		.label.limit(style="bottom: 50%") 50
		.label(style="bottom: 25%") 25
		.label(style="bottom: 0%") 0 µg/m³
</template>
<script>
export default {
	components: {},
	data () {
		return {
		}
	},
	computed: {},
	created () {},
	mounted () {
		this.$nextTick(() => {
		})
	},
	methods: {}
}
</script>
<style lang="stylus">
@import '~_settings'
/*valueDomain: [20, 40, 60, 90],
colorRange: ['#00796B', '#F9A825', '#E65100', '#DD2C00'],*/
#legend
	position fixed
	left 12px
	bottom 12px
	z-index 1000
	pointer-events none
	height 200px
	display flex
	.gradient
		opacity 0.6
		width 20px
		background linear-gradient(to top, rgba(0,121,107,1) 0%, rgba(0,121,107,1) 20%, rgba(249,168,37,1) 40%, rgba(230,81,0,1) 60%, rgba(221,44,0,1) 90%, rgba(221,44,0,1) 100%)
		position relative
		.limit
			height 2px
			width 42px
			background-color $clr-red-a700
			position absolute
			left -10px
			bottom calc(50% - 1px)
	.labels
		width 150px
		position relative
		.label
			position absolute
			transform translateY(50%)
			&:before
				content '– '
			
			&.limit
				color $clr-red-a700
</style>
