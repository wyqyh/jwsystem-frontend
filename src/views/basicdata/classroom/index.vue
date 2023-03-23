<template>
  <div class="app-container">
    <el-form :inline="true" ref="queryForm" :model="queryParams">
      <el-form-item label="教室位置" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="教室位置可以模糊搜索"
          size="small"
          style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          size="mini" 
          icon="el-icon-search"
          @click="loadClassroom">搜索</el-button>
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
          @click="handleAdd">添加教室</el-button>
      </el-col>
    </el-row>

    <el-table :data="classrooms" row-key="id" ref="classroomTable">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="教室门牌号" prop="roomno" width="250px"></el-table-column>
      <el-table-column label="所在位置" prop="location" width="250px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            icon="el-icon-delete">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :pageSizes="[10, 20, 30, 50]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="loadClassroom"></pagination>

    <el-dialog 
      :title="title" 
      :visible.sync="open"
      @close="cancel"
      width="600px">
      <el-form label-width="100px" :model="classroom" ref="classRoomRef" :rules="rules">
        <el-form-item label="教室门牌号" prop="roomno">
          <el-input placeholder="请输入教室门牌号" v-model="classroom.roomno"/>
        </el-form-item>
        <el-form-item label="教室位置" prop="locationid">
          <el-select v-model="classroom.locationid" style="width: 100%" placeholder="请选择">
            <el-option
                v-for="item in typedatas"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
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

import { addClassroom, listClassroom, updateClassroom, deleteClassroom } from '../../../api/basicdata/classroom'
import { getTypeDataByTypeno } from '../../../api/basicdata/type'

export default {
  name: 'ClassRoom',
  data() {
    return {
      queryParams: {
        location: '',
        pageNum: 1,
        pageSize: 15
      },
      classroom: {
        id: undefined,
        roomno: undefined,
        locationid: undefined
      },
      classrooms: [],
      total: 0,
      open: false,
      typedatas: [],
      rules: {
        roomno: [
          { required: true, message: '请输入教室门牌号', trigger: 'blur' }
        ],
        locationid: [
          { required: true, message: '请选择教室位置', trigger: 'blur' }
        ]
      },
      title: '添加教室',
      delroomids: []
    }
  },
  created() {
    this.loadClassroom();
    getTypeDataByTypeno({'typeno': '1009'}).then(res => {
      this.typedatas = res
    })
  },
  methods: {
    loadClassroom() {
      listClassroom(this.queryParams).then(res => {
        this.classrooms = res.list
        this.total = res.total
      })
    },
    submitForm() {
      this.$refs.classRoomRef.validate(valid => {
        if(valid) {
          if(this.classroom.id) {
            updateClassroom(this.classroom).then(() => {
              this.$modal.msgSuccess('教室更新成功')
              this.cancel()
              this.loadClassroom()
            })
          } else {
            addClassroom(this.classroom).then(() => {
              this.$modal.msgSuccess('教室添加成功')
              this.cancel()
              this.loadClassroom()
            })
          }
        }
      })
    },
    resetQuery() {
      this.resetForm('queryForm')
    },
    handleAdd() {
      this.open = true
    },
    cancel() {
      this.resetForm('classRoomRef')
      this.open = false
    },
    handleUpdate(row) {
      this.classroom.id = row.id
      this.classroom.roomno = row.roomno
      this.classroom.locationid = row.locationid
      this.title = '编辑教室'
      this.open = true
    },
    handleDelete(row) {
      this.delroomids.push(row.id)
      deleteClassroom(this.delroomids).then(() => {
        this.$modal.msgSuccess('教室删除成功')
        this.loadClassroom()
      })
    }
  }
}
</script>

<style lang="less">

</style>