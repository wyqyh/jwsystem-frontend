<template>
  <div class="app-container">
    <el-form :inline="true" ref="queryForm" :model="queryParams" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptname">
        <el-input
          v-model="queryParams.deptname"
          placeholder="请输入部门名称"
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
          v-hasPerm="['system:dept:add']"
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
      <right-toolbar :show-search.sync="showSearch" @refresh="listDepartment()" :controlColumn="false"></right-toolbar>
    </el-row>

    <el-table :data="departmentList" row-key="id" ref="deptTable">
      <el-table-column label="部门名称" prop="name" width="250px"></el-table-column>
      <el-table-column label="负责人" prop="charger" width="250px"></el-table-column>
      <el-table-column label="联系电话" prop="tel" width="250px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPerm="['system:dept:edit']"
            @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleAdd(scope.row)"
            v-hasPerm="['system:dept:add']"
            icon="el-icon-plus">
            新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPerm="['system:dept:delete']"
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
            <el-form-item label="部门名称" prop="deptName">
              <el-input placeholder="请输入部门名称" v-model="form.deptName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="fatherId">
              <tree-select 
                :options="deptSelectList" 
                :show-count="true"
                v-model="form.fatherId"
                :value="form.fatherId"></tree-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="charger">
              <el-input placeholder="请填写部门负责人" v-model="form.charger"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="tel">
              <el-input placeholder="请输入联系电话" v-model="form.tel"/>
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

import { addDept, updateDept, delDept, getDept } from '../../../api/system/dept'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '../../../components/IconPicker'


export default {
  name: "Department",
  components: {
    TreeSelect,
    IconSelect
  },
  data() {
    return {
      showSearch: true,
      queryParams: {
        deptname: ''
      },
      departmentList: [],
      roleList: [],
      deptSelectList: [],
      selectedVal: {},
      title: '',
      open: false,
      form: {
        deptId: undefined,
        deptName: '',
        fatherId: 1,
        charger: '',
        tel: ''
      },
      rules: {
        fatherId: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ]
      },
      isExpansion: false
    }
  },
  created() {
    //加载部门下拉选择树
    getDept().then(res => {
      this.deptSelectList = this.getTree(res)
    })
    this.listDepartment()
  },
  methods: {
    listDepartment() {
      getDept(this.queryParams).then(res => {
        this.departmentList = res
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
      this.toggleRowExpansionAll(this.departmentList, this.isExpansion)
    },
    toggleRowExpansionAll(data, isExpansion) {
      data.forEach((item) => {
        this.$refs.deptTable.toggleRowExpansion(item, isExpansion)
        if(item.children !== undefined && item.children !== null) {
          this.toggleRowExpansionAll(item.children, isExpansion)
        }
      })
    },
    handleQuery() {
      this.listDepartment();
    },
    resetQuery() {
      this.resetForm('queryForm')
    },
    handleUpdate(row) {
      this.form.deptId = row.id
      this.form.deptName = row.name
      this.form.fatherId = row.pid
      this.form.charger = row.charger
      this.form.tel = row.tel
      this.open = true
    },
    handleAdd(row) {
      this.reset()
      this.form.fatherId = row.id ? row.id : 1
      this.title = '新增部门'
      this.open = true
    },
    handleDelete(row) {
      this.$modal.confirm('确定删除【' + row.name + '】？').then(function() {
        delDept(row.id).then(() => {
          
        })
      }).then(() => {
        this.listDepartment()
        this.$modal.msgSuccess('删除成功')
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
          if(this.form.deptId !== undefined) {
            updateDept(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.listDepartment();
              this.open = false;
            })
          } else {
            addDept(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.listDepartment();
              this.open = false;
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>