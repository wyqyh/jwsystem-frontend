<template>
  <div class="app-container">
    <h4 class="form-header">期班信息</h4>
    <el-form :model="classinfo">
      <el-row type="flex" class="row-bg" justify="center" :gutter="15">
        <el-col :span="6">
          <el-form-item label="期班号">
            <el-input
              v-model="classinfo.classno"
              disabled
              size="small"
              style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学员人数">
            <el-input
              v-model="classinfo.stunum"
              disabled
              size="small"
              style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开课学期">
            <el-input
              v-model="classinfo.term"
              disabled
              size="small"
              style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="管理部门">
            <el-input
              v-model="classinfo.deptname"
              disabled
              size="small"
              style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center" :gutter="15">
        <el-col :span="6">
          <el-form-item label="培训专业">
            <el-input
              v-model="classinfo.majorname"
              disabled
              size="small"
              style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="培训层次">
            <el-input
              v-model="classinfo.trainlevel"
              disabled
              size="small"
              style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="任务类别">
            <el-input
              v-model="classinfo.tasktype"
              disabled
              size="small"
              style="width: 300px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h4 class="form-header">学生列表</h4>
    <el-table :data="students" ref="roleListTableRef">
      <el-table-column label="序号" type="index" :index="table_index"></el-table-column>
      <el-table-column label="学号" prop="stuno"></el-table-column>
      <el-table-column label="姓名" prop="stuname"></el-table-column>
      <el-table-column label="性别" prop="sex"></el-table-column>
      <el-table-column label="籍贯" prop="origin"></el-table-column>
      <el-table-column label="政治面貌" prop="political"></el-table-column>
      <el-table-column label="联系电话" prop="tel"></el-table-column>
      <el-table-column label="身份证号" prop="idcard" width="200px"></el-table-column>
      <el-table-column label="家庭住址" prop="address" width="550px"></el-table-column>
    </el-table>
    <pagination
        :total="total"
        :pageSizes="[10, 20, 30, 50]"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="listStudent"></pagination>
  </div>
</template>

<script>

import { pageGetStudent } from '../../../api/basicdata/student'

export default {
  name: 'GrantRoles',
  data() {
    return {
      classinfo: {
        id: undefined,
        classno: undefined,
        stunum: undefined,
        termid: undefined,
        term: undefined,
        deptid: undefined,
        deptname: undefined,
        majorid: undefined,
        majorname: undefined,
        trainlevelid: undefined,
        trainlevel: undefined,
        tasktypeid: undefined,
        tasktype: undefined,
        createTime: undefined
      },
      queryParams: {
        classid: 0,
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      students: []
    }
  },
  created() {
    this.classinfo = this.$route.query.classinfo
    this.queryParams.classid = this.classinfo.id
    this.listStudent()
  },
  methods: {
    listStudent() {
      pageGetStudent(this.queryParams).then(res => {
        this.students = res.list
        this.total = res.total
      })
    },
    table_index(index) {
      return (this.queryParams.pageNum-1)*this.queryParams.pageSize + index + 1
    }
  }
}
</script>

<style lang="less">
.form-header {
  font-size: 15px;
  color: #6379bb;
  border-bottom: 1px solid #ddd;
  margin: 8px 10px 25px 0px;
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