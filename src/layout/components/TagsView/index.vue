<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :to="{path: tag.path}"
        :key="tag.path"
        tag="span"
        :class="isActive(tag) ? 'active' : ''"
        class="tags-view-item"
        ref="tag"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.stop="closeSelectedTag(tag)"></span>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <!-- <li @click="refreshSelectedTag(selectedTag)"><i class="el-icon-refresh-right"></i> 刷新页面</li>-->
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)"><i class="el-icon-close"></i> 关闭当前</li>
      <li @click="closeOthersTags"><i class="el-icon-circle-close"></i> 关闭其他</li>
      <li v-if="!isFirstView()" @click="closeLeftTags"><i class="el-icon-back"></i> 关闭左侧</li>
      <li v-if="!isLastView()" @click="closeRightTags"><i class="el-icon-right"></i> 关闭右侧</li>
      <li @click="closeAllTags(selectedTag)"><i class="el-icon-circle-close"></i> 全部关闭</li>
    </ul>
  </div>
</template>

<script>

import ScrollPane from "./ScrollPane"
import path from 'path'

export default {
  name: "TagsView",
  data() {
    return {
      top: 0,
      left: 0,
      visible: false,
      selectedTag: {},
      affixTags: []
    }
  },
  components: {
    ScrollPane
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.sidebarRouters
    },
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  methods: {
    addTags() {
      const {name} = this.$route
      if(name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(( {visitedViews} ) => {
        if(this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    toLastView(visitedViews, view) {
      const lastestView = visitedViews.slice(-1)[0]
      if(lastestView) {
        this.$router.push(lastestView.fullPath)
      }
    },
    isAffix(tag) {
      return tag.affix
    },
    refreshSelectedTag(view) {
      this.$tab.refreshPage(view);
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    closeRightTags() {
      this.$tab.closeRightPage(this.selectedTag).then(visitedViews => {
        if (!visitedViews.find(i => i.fullPath === this.$route.fullPath)) {
          this.toLastView(visitedViews)
        }
      })
    },
    closeLeftTags() {
      this.$tab.closeLeftPage(this.selectedTag).then(visitedViews => {
        if (!visitedViews.find(i => i.fullPath === this.$route.fullPath)) {
          this.toLastView(visitedViews)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag).catch(()=>{});
      this.$tab.closeOtherPage(this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$tab.closeAllPage().then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === this.$route.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === '首页') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    isFirstView() {
      try {
        return this.selectedTag.fullPath === '/' || this.selectedTag.fullPath === this.visitedViews[1].fullPath
      } catch (err) {
        return false
      }
    },
    isLastView() {
      try {
        return this.selectedTag.fullPath === this.visitedViews[this.visitedViews.length - 1].fullPath
      } catch (err) {
        return false
      }
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 215 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY + 20
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="less">

.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(232, 228, 228, 0.01), 0 0 3px 0 rgb(168, 165, 165, 0.01);
  .tags-view-wrapper {
    height: 100%;
    .el-scrollbar__wrap {
      overflow: hidden;
    }
    .tags-view-item {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      padding: 0 8px;
      margin-left: 5px;
      margin-top: 4px;
      font-size: 12px;
      cursor: pointer;
      color: #495060;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #0088ff;
        color: #fff;
        border-color: #0088ff;
        &::before {
          content: '';
          background: #fff;
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 50%;
          margin-right: 2px;
        }
      }
      .el-icon-close {
        border-radius: 50%;
        width: 16px;
        height: 16px;
        text-align: center;
        vertical-align: 2px;
        &::before {
          transform: scale(0.6);
          vertical-align: -2px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}

</style>