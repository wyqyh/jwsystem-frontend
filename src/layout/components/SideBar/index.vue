<template>
  <div>
    <logo :collapse="isCollapse"/>
    <el-scrollbar>
      <el-menu
        :background-color="variables.menuBackground"
        :text-color="variables.menuTextColor"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        unique-opened
        :default-active="activeMenu"
        mode="vertical"
        :collapse="isCollapse"
      >
        <sidebar-item v-for="route in sidebarRouters" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>

import Logo from "./Logo.vue"
import variables from "../../../assets/styles/variables.less"
import {mapGetters} from "vuex"
import SidebarItem from "./SidebarItem.vue"

export default {
  name: "SideBar",
  computed: {
    ...mapGetters(["sidebarRouters", 'sidebar']),
    activeMenu () {
      const route = this.$route
      const { path } = route
      return path
    },
    variables() {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  components: {
    Logo,
    SidebarItem
  }
}
</script>

<style lang="less">
.el-scrollbar {
  height: calc(100% - 50px);
}
</style>