<template>
  <div class="app-container">
    <el-form :inline="true" ref="queryForm" :model="queryParams" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.permName"
          placeholder="请输入菜单名称"
          size="small"
          style="width: 240px"></el-input>
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
          v-hasPerm="['system:permission:add']"
          @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button 
          type="info" 
          size="mini" 
          icon="el-icon-sort"
          @click="handleExpand"
          plain>展开/折叠</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @refresh="listPermission()" :controlColumn="false"></right-toolbar>
    </el-row>

    <el-table :data="permissionList" row-key="id" ref="permTable">
      <el-table-column label="菜单名称" prop="name" width="250px"></el-table-column>
      <el-table-column label="图标" width="100px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column label="权限标识" prop="key" width="250px"></el-table-column>
      <el-table-column label="组件路径" prop="component" width="300px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPerm="['system:permission:edit']"
            @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-hasPerm="['system:permission:add']"
            @click="handleAdd(scope.row)"
            icon="el-icon-plus">
            新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-hasPerm="['system:permission:delete']"
            @click="handleDelete(scope.row)"
            icon="el-icon-delete">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog 
      :title="title" 
      :visible.sync="open"
      width="600px">
      <el-form label-width="100px" :model="form" ref="form" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级权限" prop="fatherId">
              <tree-select 
                :options="permSelectList" 
                :show-count="true"
                v-model="form.fatherId"
                :value="form.fatherId"></tree-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="权限类型" prop="permType">
              <el-radio v-model="form.permType" label="0">目录</el-radio>
              <el-radio v-model="form.permType" label="1">菜单</el-radio>
              <el-radio v-model="form.permType" label="2">按钮</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="权限图标" prop="iconName">
              <el-popover
                placement="bottom-start"
                width="450"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.iconName" style="width: 450px;" placeholder="点击选择图标" readonly>
                  <svg-icon v-if="form.iconName" slot="prefix" :icon-class="form.iconName" class="el-input__icon" style="height: 32px;width: 16px;" />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="权限名称" prop="permName">
              <el-input placeholder="请输入权限名称" v-model="form.permName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限字符" prop="key">
              <span slot="label">
                <el-tooltip content="权限类型为按钮时填写" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
              <el-input placeholder="请输入权限字符" v-model="form.key"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input placeholder="请输入组件路径" v-model="form.component"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input placeholder="请输入路由地址" v-model="form.path"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示状态" prop="hidden">
              <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
              <el-radio v-model="form.hidden" :label="false">显示</el-radio>
              <el-radio v-model="form.hidden" :label="true">隐藏</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: right">
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>

import { listPermission, addPermission, deletePermission, updatePermission } from '../../../api/system/permission'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '../../../components/IconPicker'


export default {
  name: "Permission",
  components: {
    TreeSelect,
    IconSelect
  },
  data() {
    return {
      showSearch: true,
      queryParams: {
        permName: ''
      },
      permissionList: [],
      permSelectList: [],
      selectedVal: {},
      title: '',
      open: false,
      form: {
        permId: undefined,
        permName: '',
        fatherId: 0,
        iconName: '',
        path: '',
        component: '',
        key: '',
        permType: "0",
        hidden: false
      },
      rules: {
        fatherId: [
          { required: true, message: '上级权限不能为空', trigger: 'blur' }
        ],
        permType: [
          { required: true, message: '选择权限类型', trigger: 'blur' }
        ],
        permName: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        hidden: [
          { required: true, message: '请选择显示状态', trigger: 'blur' }
        ]
      },
      isExpansion: false
    }
  },
  created() {
    //加载权限下拉选项树
    this.listPermission()
  },
  methods: {
    listPermission() {
      listPermission(this.queryParams).then(res => {
        this.permissionList = res
        let perms = [{ 'id': 0, 'name': '主类目', 'children': res }]
        this.permSelectList = this.getTree(perms)
      })
    },
    getTree(tree = []) {
      let arr = [];
      if(tree.length !== 0) {
        tree.forEach(item => {
          let obj = {}
          obj.label = item.name
          obj.id = item.id
          if(item.children) {
            obj.children = this.getTree(item.children)
          }
          arr.push(obj)
        })
      }
      return arr
    },
    handleExpand() {
      this.isExpansion = !this.isExpansion
      this.toggleRowExpansionAll(this.permissionList, this.isExpansion)
    },
    toggleRowExpansionAll(data, isExpansion) {
      data.forEach((item) => {
        this.$refs.permTable.toggleRowExpansion(item, isExpansion)
        if(item.children !== undefined && item.children !== null) {
          this.toggleRowExpansionAll(item.children, isExpansion)
        }
      })
    },
    handleQuery() {
      this.listPermission();
    },
    resetQuery() {
      this.resetForm('queryForm')
    },
    handleUpdate(row) {
      this.form.permId = row.id
      this.form.permName = row.name
      this.form.fatherId = row.pid
      this.form.iconName = row.icon
      this.form.path = row.path
      this.form.component = row.component
      this.form.key = row.key
      this.form.permType = row.type.toString()
      this.open = true
    },
    handleAdd(row) {
      this.reset()
      this.form.fatherId = row.id ? row.id : 0
      this.title = '新增权限'
      this.open = true
    },
    handleDelete(row) {
      let permid = row.id
      deletePermission(permid).then(() => {
        this.$modal.msgSuccess('删除成功')
        this.listPermission();
      })
    },
    cancel() {
      this.reset();
      this.open = false
    },
    reset() {
      this.resetForm('form')
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if(valid) {
          if(this.form.permId !== undefined) {
            updatePermission(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.listPermission();
              this.open = false;
            })
          } else {
            addPermission(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.listPermission();
              this.open = false;
            })
          }
        }
      })
    },
    // 选中图标
    selected(name) {
      this.form.iconName = name
    }
  }
}
</script>

<style lang="less">

</style>