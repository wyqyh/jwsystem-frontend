<template>
  <div>
    <svg-icon icon-class="wechat" @click="goto"></svg-icon>
  </div>
</template>

<script>
export default {
  name: 'RuoYiDoc',
  methods: {
    goto() {
      window.open('www.baidu.com')
    }
  }
}
</script>

<style lang="less">

</style>