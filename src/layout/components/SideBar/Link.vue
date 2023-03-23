<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot/>
  </component>
</template>

<script>

import {isExternal} from "../../../utils/validate"

export default {
  name: "AppLink",
  props: {
    to: {
      type: String,
      require: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if(this.isExternal) {
        return 'a'
      } else {
        return 'router-link'
      }
    }
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          href: url,
          target: '_blank'
        }
      }
      return {
        to: url
      }
    }
  }
}
</script>

<style lang="less">

</style>