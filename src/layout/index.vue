<template>
  <div class="app-wrapper" :class="objClass">
    <side-bar class="sidebar-container"></side-bar>
    <div class="main-container">
      <div>
        <nav-bar></nav-bar>
        <tags-view></tags-view>
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>

import SideBar from "./components/SideBar/index.vue"
import NavBar from "./components/NavBar.vue"
import TagsView from "./components/TagsView/index.vue"
import AppMain from "./components/AppMain.vue"
import { mapState } from 'vuex'

export default {
  name: "Layout",
  components: {
    SideBar,
    NavBar,
    TagsView,
    AppMain
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    }),
    objClass () {
      return {
        hideSidebar: !this.sidebar.opened
      }
    }
  }
}
</script>

<style lang="less">

.app-wrapper{
  width: 100%;
  height: 100%;
}

</style>
