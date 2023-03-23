<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <user-avatar/>
            </div>
            <ul class="user-info">
              <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhanghaoguanli"></use></svg> 登录账号<div class="user-right">{{ userinfo.account }}</div></li>
              <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-a-lujing10858"></use></svg> 用户名称 <div class="user-right">{{ userinfo.name }}</div></li>
              <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xingbie"></use></svg> 用户性别 <div class="user-right">{{ userinfo.sex }}</div></li>
              <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-zuoji"></use></svg> 座机号码 <div class="user-right">{{ userinfo.contact }}</div></li>
              <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shouji"></use></svg> 手机号码 <div class="user-right">{{ userinfo.phone }}</div></li>
              <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-bumen"></use></svg> 所属部门 <div class="user-right"> {{ userinfo.level2dept }}</div></li>
              <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-calendar"></use></svg> 注册时间 <div class="user-right"> {{ userinfo.createTime }}</div></li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本资料" name="first">
              <user-info :user="userinfo" @refreshUserInfo="loadUserInfo"/>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <reset-pwd/>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { isvalidPhone } from '../../../../utils/validate'
import UserInfo from './userInfo.vue'
import ResetPwd from './resetpwd.vue'
import UserAvatar from './userAvatar.vue'
import { getByUid } from '../../../../api/system/user'

export default {
  name: "UserCenter",
  components: {
    UserInfo,
    ResetPwd,
    UserAvatar
  },
  created() {
    this.loadUserInfo()
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
      userinfo: {},
      rules: {
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  methods: {
    loadUserInfo() {
      let uid = this.$store.getters.uid
      getByUid(uid).then(res => {
        this.userinfo = res
      })
    }
  }
}
</script>

<style lang="less">
.avatar-uploader-icon {
  font-size: 28px;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%
}
.user-info {
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;
    a {
      color: #317EF3;
    }
  }
}

.icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
