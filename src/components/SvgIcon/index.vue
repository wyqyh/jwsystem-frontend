<template>
  <svg :class="svgClass" aria-hidden="true"  v-on="$listeners">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    className: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      require: true
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if(this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style lang="less">
.svg-icon {
  height: 1em;
  width: 1em;
  fill: currentColor;
}
</style>