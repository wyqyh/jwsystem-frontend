<template>
  <div class="app-container">
    <el-form :inline="true" ref="queryForm" :model="queryParams" v-show="showSearch">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          size="small"
          style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          size="small"
          style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          size="small"
          style="width: 240px"></el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="small"
          style="width: 240px"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          size="mini" 
          icon="el-icon-search"
          @click="handleQuery">搜索</el-button>
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
          v-hasPerm="['system:role:add']"
          @click="handleAdd">新增</el-button>
      </el-col>
      <!--
      <el-col :span="1.5">
        <el-button 
          type="success" 
          size="mini" 
          :disabled="single"
          icon="el-icon-edit"
          v-hasPerm="['system:role:edit']"
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
          v-hasPerm="['system:role:delete']"
          plain>删除</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @refresh="getRoleList()" :columns="columns" :controlColumn="true"></right-toolbar>
    </el-row>

    <el-table :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px" align="center"></el-table-column>
      <el-table-column label="角色编号" prop="id" width="120px" v-if="columns[0].visible"></el-table-column>
      <el-table-column label="角色名称" prop="name" width="150px" v-if="columns[1].visible"></el-table-column>
      <el-table-column label="权限字符" prop="key" width="150px" v-if="columns[2].visible"></el-table-column>
      <el-table-column label="显示顺序" prop="sort" width="120px" v-if="columns[3].visible"></el-table-column>
      <el-table-column label="状态" width="100px" v-if="columns[4].visible">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="updateRoleStatus(scope.row)"
            active-value="1"
            inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" width="180px" v-if="columns[5].visible"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPerm="['system:role:edit']"
            @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-hasPerm="['system:role:delete']"
            @click="handleDelete(scope.row)"
            icon="el-icon-delete">
            删除
          </el-button>
          <el-dropdown
            szie="mini"
            type="text"
            icon="el-icon-edit">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-circle-check">数据权限</el-dropdown-item>
              <el-dropdown-item icon="el-icon-user">分配用户</el-dropdown-item>
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
      @pagination="getRoleList"></pagination>
    
    <el-dialog 
      :title="title" 
      :visible.sync="open"
      width="500px">
      <el-form label-width="100px" :model="form" ref="addRoleFormRef" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="form.roleName"/>
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input placeholder="请输入权限字符" v-model="form.roleKey"/>
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number controls-position="right" :min="0" v-model="form.roleSort"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value">
              {{dict.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree 
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!menuCheckStrictly"
            class="tree-border"
            :props="defaultProps"
            empty-text="加载中，请稍后"></el-tree>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input placeholder="请输入内容" type="textarea" v-model="form.remark"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { listRole, addRole, getRole, updateRole, deleteRole, updateRoleStatus } from "../../../api/system/role"
import { treeselect as menuTreeSelect} from "../../../api/system/menu"
import { getPermissionByRoleId } from "../../../api/system/rolePermission"


export default {
  name: "Role",
  data() {
    return {
      dateRange: [],
      queryParams: {
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 10
      },
      roleList: [],
      total: 0,
      title: '',
      open: false,
      form: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      },
      menuOptions: [],
      menuExpand: false,
      menuNodeAll: false,
      menuCheckStrictly: true,
      selectedIds: [],
      selectedNames: [],
      single: true,
      multiple: true,
      showSearch: true,
      columns: [
        {key: 0, label: '角色编号', visible: true},
        {key: 1, label: '角色名称', visible: true},
        {key: 2, label: '权限字符', visible: true},
        {key: 3, label: '显示顺序', visible: true},
        {key: 4, label: '状态', visible: true},
        {key: 5, label: '创建时间', visible: true}
      ]
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    handleUpdate(row) {
      this.reset();
      let roleId = row.id || this.selectedIds
      // 获取所有的菜单列表
      this.getMenuTreeSelect()
      getRole(roleId).then(res => {
        this.$set(this.form, 'roleId', res.id)
        this.$set(this.form, 'roleName', res.name)
        this.$set(this.form, 'roleKey', res.key)
        this.$set(this.form, 'roleSort', res.sort)
        this.$set(this.form, 'remark', res.remark)
        this.$set(this.form, 'status', Number(res.status))
        this.open = true
        // 获取当前角色已分配的菜单列表
        getPermissionByRoleId(roleId).then(result => {
          let checkedKeys = result
          checkedKeys.forEach(v => {
            this.$refs.menu.setChecked(v, true, false)
          });
        })
      })
    },
    getRoleList() {
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.roleList = response.list
        this.total = response.total
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getRoleList();
    },
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery();
    },
    handleAdd() {
      this.reset();
      this.getMenuTreeSelect();
      this.title = '添加角色'
      this.open = true
    },
    handleDelete(row) {
      if(row != undefined && row != null && row.id != null) {
        this.selectedIds.push(row.id)
      }
      let roleIds = this.selectedIds
      this.$modal.confirm('确定删除角色【' + this.selectedNames.join() + '】？').then(function() {
        deleteRole(roleIds).then(() => {
          
        })
      }).then(() => {
          this.$modal.msgSuccess('删除成功')
          this.selectedIds = []
          this.getRoleList()
      }) 
    },
    cancel() {
      this.reset();
      this.open = false
    },
    submitForm() {
      this.$refs.addRoleFormRef.validate(valid => {
        if(valid) {
          let menuIds = this.getMenuAllCheckedKeys()
          if(menuIds != null && menuIds.length > 0) {
            this.form.permIds = menuIds
          }
          if(this.form.roleId !== undefined) {
            updateRole(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.getRoleList();
              this.open = false;
            })
          } else {
            addRole(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.getRoleList();
              this.open = false;
            })
          }
        }
      })
    },
    getMenuAllCheckedKeys() {
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    reset() {
      this.form = {
        permIds: [],
        status: 1,
        roleSort: 0
      }
      this.resetForm('addRoleFormRef')
    },
    getMenuTreeSelect() {
      menuTreeSelect().then(response => {
        this.menuOptions = response
      })
    },
    handleCheckedTreeExpand(val, type) {
      if(type === 'menu') {
        let treeList = this.menuOptions
        for(let i=0;i<treeList.length;i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = val
        }
        
      }
    },
    handleCheckedTreeNodeAll(val, type) {
      if(type === 'menu') {
        this.$refs.menu.setCheckedNodes(val ? this.menuOptions : [])
      }
    },
    handleCheckedTreeConnect(val, type) {
      if(type === 'menu') {
        this.menuCheckStrictly = val
      }
    },
    handleSelectionChange(val) {
      this.selectedIds = val.map(item => item.id)
      this.selectedNames = val.map(item => item.name)
      this.single = this.selectedIds.length !== 1
      this.multiple = !this.selectedIds.length
    },
    updateRoleStatus(row) {
      let data = {
        'roleId' : row.id,
        'status' : row.status
      }
      updateRoleStatus(data).then(() => {
        this.$modal.msgSuccess('角色状态修改成功')
      })
    }
  }
}
</script>

<style lang="less">

</style>