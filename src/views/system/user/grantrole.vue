<template>
  <div class="app-container">
      <h4 class="form-header">基本信息</h4>
      <el-form :model="user">
        <el-row type="flex" class="row-bg" justify="center" :gutter="15">
          <el-col :span="6">
            <el-form-item label="用户姓名">
              <el-input
                v-model="user.name"
                disabled
                size="small"
                style="width: 300px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="登录账号">
              <el-input
                v-model="user.account"
                disabled
                size="small"
                style="width: 300px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在部门">
              <el-input
                v-model="user.level2dept"
                disabled
                size="small"
                style="width: 300px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h4 class="form-header">角色信息</h4>
      <el-table :data="roleList" ref="roleListTableRef">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column type="selection" width="55px" align="center"></el-table-column>
        <el-table-column label="角色编号" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="权限字符" prop="key"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
      </el-table>
      <pagination
          :total="totalRoles"
          :pageSizes="[10, 20, 30, 50]"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="listRole"></pagination>
      <el-form style="text-align: center; margin-left: -120px; margin-top: 30px;">
        <el-form-item style="margin-left: 100px;">
          <el-button type="primary" @click="addUserRoles">提交</el-button>
          <el-button @click="close">返回</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>

import { getByUid } from '../../../api/system/user'
import { listRole } from '../../../api/system/role'
import { getRidsByUid, addUserRoles } from '../../../api/system/userRole'

export default {
  name: 'GrantRoles',
  data() {
    return {
      uid: undefined,
      user: {
        name: undefined,
        account: undefined,
        level2dept: undefined
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      userRoleIds: [],
      roleList: [],
      totalRoles: 0
    }
  },
  created() {
    this.uid = this.$route.params.uid
    getByUid(this.uid).then(res => {
      this.user = res
    })
    getRidsByUid(this.uid).then(res => {
      this.userRoleIds = res
      this.listRole()
    })
  },
  updated() {
    this.$refs.roleListTableRef.toggleRowSelection(this.roleList[1], true)
    this.roleList.forEach(row => {
      if(this.userRoleIds.indexOf(row.id) >= 0) {
        this.$refs.roleListTableRef.toggleRowSelection(row, true)
      }
    })
  },
  methods: {
    listRole(){
      listRole(this.queryParams).then(res => {
        this.roleList = res.list
        this.totalRoles = res.total
      })
    },
    addUserRoles() {
      let userRids = this.$refs.roleListTableRef.selection
      let rids = [];
      if(userRids && userRids.length > 0) {
        userRids.forEach(rid => rids.push(rid.id))
      }
      addUserRoles({'uid': this.uid, 'rids': rids}).then(() => {
        this.$modal.msgSuccess('用户分配角色成功')
      })
    },
    close() {
      this.$tab.closePage();
    }
  }
}
</script>

<style lang="less">
.form-header {
  font-size: 15px;
  color: #6379bb;
  border-bottom: 1px solid #ddd;
  margin: 8px 10px 25px 10px;
  padding-bottom: 5px;
}
h4 {
  display: block;
  margin-block-start: 1.33em;
  margin-block-end: 1.33em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
</style>