<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input
          placeholder="输入部门名称"
          v-model="deptName"
          size="small"
          style="margin-bottom: 20px">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>

        <el-tree
          class="filter-tree"
          :data="deptTree"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="deptTreeRef"
          @node-click="clickNode">
        </el-tree>
      </el-col>
      <el-col :span="20">
        <el-form :inline="true" ref="queryForm" :model="queryParams" v-show="showSearch">
          <el-form-item label="用户名称">
            <el-input
              v-model="queryParams.uname"
              placeholder="请输入用户姓名"
              size="small"
              style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              size="mini" 
              icon="el-icon-search"
              @click="loadUsers">搜索</el-button>
            <el-button 
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button 
              type="primary" 
              size="mini" 
              icon="el-icon-plus"
              plain
              v-hasPerm="['system:user:add']"
              @click="handleAdd">新增</el-button>
          </el-col>
          <!--
          <el-col :span="1.5">
            <el-button 
              type="success" 
              size="mini" 
              :disabled="single"
              icon="el-icon-edit"
              @click="handleUpdate"
              plain>修改</el-button>
          </el-col>
          -->
          <el-col :span="1.5">
            <el-button 
              type="danger" 
              size="mini"
              :disabled="multiple" 
              @click="handleDelete"
              icon="el-icon-delete"
              v-hasPerm="['system:user:delete']"
              plain>删除</el-button>
          </el-col>
          <right-toolbar :show-search.sync="showSearch" @refresh="loadUsers()" :controlColumn="false"></right-toolbar>
        </el-row>

        <el-table :data="users" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55px" align="center"></el-table-column>
          <el-table-column label="用户姓名" prop="name" width="200px"></el-table-column>
          <el-table-column label="所在部门" prop="level2dept" width="300px"></el-table-column>
          <el-table-column label="联系方式" prop="contact" width="200px"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-hasPerm="['system:user:edit']"
                @click="handleUpdate(scope.row)">
                修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
                v-hasPerm="['system:user:delete']"
                icon="el-icon-delete">
                删除
              </el-button>
              <el-dropdown
                szie="mini"
                type="text"
                v-hasPerm="['system:user:edit']"
                icon="el-icon-edit">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right"></i>更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-circle-check">数据权限</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-user" @click.native="grantRoles(scope.row.id)">分配角色</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total="total"
          :pageSizes="[10, 20, 30, 50]"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="loadUsers"></pagination>
        
        <el-dialog 
          :title="title" 
          :visible.sync="open"
          width="600px">
          <el-form label-width="100px" :model="form" ref="addUserFormRef" :rules="rules">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户姓名" prop="name">
                  <el-input placeholder="请输入用户姓名" v-model="form.name"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系方式" prop="contact">
                  <el-input placeholder="请输入联系方式" v-model="form.contact"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所在部门" prop="deptid">
                  <tree-select 
                    :options="deptSelectList" 
                    :show-count="true"
                    v-model="form.deptid"
                    :value="form.deptid"></tree-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色" prop="roleIds">
                  <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
                    <el-option
                      v-for="item in roleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="登录账号" prop="account">
                  <el-input placeholder="请输入登录账号" v-model="form.account"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户密码" prop="password" v-if="showPassInput">
                  <el-input placeholder="请输入密码" :type="pwdInputType" class="pwd-input" v-model="form.password">
                    <i slot="suffix" class="icon-style" autocomplete="auto" @click="flag = !flag" :class="elIcon"/>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer">
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getDept } from "../../../api/system/dept"
import { listRole } from "../../../api/system/role"
import { getUsers, updateUser, addUser, delUser} from "../../../api/system/user"
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getTree } from '../../../utils/commons'

export default {
  name: "User",
  components: {
    TreeSelect
  },
  data() {
    return {
      deptTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      deptName: '',
      users: [],
      queryParams: {
        uname: '',
        deptid: 0,
        pageNum: 1,
        pageSize: 10
      },
      showSearch: true,
      flag: false,
      form: {
        id: 0,
        name: '',
        account: '',
        password: '',
        deptid: 1,
        contact: '',
        roleIds: []
      },
      deptSelectList: [],
      roleList: [],
      open: false,
      title: '',
      total: 0,
      selectedNames: [],
      selectedIds: [],
      single: true,
      multiple: true,
      showPassInput: false,
      rules: {
        name: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '登录账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' }
        ],
        deptid: [
          { required: true, message: '所在部门不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getDept().then(res => {
      this.deptTree = res
      this.deptSelectList = getTree(res)
    })
    //角色数据不超过10000，代替查询全部角色
    listRole({'pageSize': 10000}).then(res => {
      this.roleList = res.list
    })
    this.loadUsers()
  },
  computed: {
    pwdInputType() {
      return this.flag ? 'text' : 'password'
    },
    elIcon() {
      return "el-icon-view"
    }
  },
  watch: {
    deptName(val) {
      this.$refs.deptTreeRef.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    loadUsers() {
      getUsers(this.queryParams).then(res => {
        this.users = res.list
        this.total = res.total
      })
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.loadUsers();
    },
    handleAdd() {
      this.title = '新增用户'
      this.reset()
      this.showPassInput = true
      this.open = true
    },
    handleUpdate(row) {
      this.title = '修改用户'
      this.form = Object.assign({}, row)
      this.showPassInput = false
      this.open = true
    },
    handleDelete() {
      let delUserIds = this.selectedIds
      this.$modal.confirm('确定删除【' + this.selectedNames.join() + '】？').then(function() {
        delUser(delUserIds).then(() => {
          
        })
      }).then(() => {
        this.$modal.msgSuccess('删除成功')
        this.loadUsers()
      })
    },
    submitForm() {
      this.$refs.addUserFormRef.validate(valid => {
        if(valid) {
          if(this.form.id !== undefined && this.form.id > 0) {
            updateUser(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.loadUsers();
              this.open = false;
            })
          } else {
            addUser(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.loadUsers();
              this.open = false;
            })
          }
        }
      })
    },
    handleSelectionChange(val) {
      this.selectedIds = val.map(item => item.id)
      this.selectedNames = val.map(item => item.name)
      this.single = this.selectedIds.length !== 1
      this.multiple = !this.selectedIds.length
    },
    cancel() {
      this.reset();
      this.open = false
    },
    reset() {
      this.resetForm('addUserFormRef')
      this.form = {
        deptid: 1
      }
    },
    clickNode(data) {
      this.queryParams.deptid = data.id
      this.loadUsers()
    },
    grantRoles(uid) {
      this.$router.push({path: '/user/grantrole/' + uid})
    }
  }
}
</script>

<style lang="less">
.icon-style {
  margin-top: 8px;
  font-size: 18px;
}
.pwd-input {
  border: 1px solid #fff;
}
</style>