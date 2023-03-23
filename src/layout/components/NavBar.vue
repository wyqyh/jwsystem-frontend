<template>
  <div class="navbar">
    <hamburger class="hamburger-container" @toggleClick="toggleSideBar" :is-active="sidebar.opened"></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="right-menu">
      <header-search id="header-search" class="right-menu-item"></header-search>
      <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screen-full id="screenfull" class="right-menu-item" />
        </el-tooltip>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/center" style="text-decoration: none;">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout()">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>

import Hamburger from '../../components/Hamburger/index'
import Breadcrumb  from '../../components/Breadcrumb/index'
import { mapGetters } from 'vuex'
import HeaderSearch from "../../components/HeaderSearch"
import ScreenFull from "../../components/ScreenFull"

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  components: {
    Hamburger,
    Breadcrumb,
    HeaderSearch,
    ScreenFull
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$confirm('确实注销并退出登录？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('Logout').then(() => {
          location.href = '/'
        }) 
      })
    }
  }
}
</script>

<style lang="less">
.navbar {
  height: 50px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  background: #fff;
}
.hamburger-container {
  height: 100%;
  line-height: 46px;
  float: left;
  padding: 0 15px;
  cursor: pointer;
}
.breadcrumb-container {
  float: left;
  height: 100%;
  margin-left: 8px;
}
.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;
  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;
  }
  .avatar-container {
    margin-right: 30px;
    .avatar-wrapper {
      margin-top: 5px;
      .user-avatar {
        width: 40px;
        height: 40px;
        cursor: pointer;
        border-radius: 10px;
      } 
    }
  }
}

</style>
