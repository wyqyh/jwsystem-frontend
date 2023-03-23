<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children, item)">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <item :icon="onlyOneChild.icon" :title="onlyOneChild.name" />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else :index="basePath">
      <template slot="title">
        <item :icon="item.icon" :title="item.name" />
      </template>
      <sidebar-item 
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      ></sidebar-item>
    </el-submenu>
  </div>
</template>

<script>
import Item from "./Item.vue"
import AppLink from "./Link.vue"
import path from 'path'
import {isExternal} from "../../../utils/validate"

export default {
  name: "SidebarItem",
  components: {
    Item,
    AppLink
  },
  props: {
    item: {
      type: Object,
      require: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    resolvePath(routerPath) {
      if(isExternal(routerPath)) {
        return routerPath;
      }
      if(isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routerPath)
    },
    hasOneShowingChild(children, item) {
      if(!children) {
        children = []
      }
      let showingChild = children.filter(child => {
        if(child.hidden) {
          return false
        } else {
          this.onlyOneChild = child
          return true
        }
      })
      if(showingChild.length === 1) {
        return true
      }
      if(showingChild.length === 0) {
        this.onlyOneChild = {
          ...item,
          path: ''
        }
        return true
      }
      return false
    }
  }

}
</script>

<style lang="less">

</style>