<template>
  <div class="app-container">
    <el-form :inline="true" ref="queryForm" :model="queryParams">
      <el-form-item label="期班号" prop="classnos">
        <el-select v-model="queryParams.classnos" multiple placeholder="请选择" clearable size="medium">
          <el-option v-for="item in classnos" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="开课学期" prop="terms">
       <el-select v-model="queryParams.termids" multiple placeholder="请选择" clearable size="medium">
          <el-option
            v-for="item in terms"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程名称" prop="coursenames">
       <el-select v-model="queryParams.coursenames" multiple placeholder="请选择" clearable size="medium">
          <el-option
            v-for="item in coursenames"
            :key="item.id"
            :label="item.coursename"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业名称" prop="majors">
        <el-select v-model="queryParams.majorids" multiple placeholder="请选择" clearable size="medium">
          <el-option
            v-for="item in majors"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="培训层次" prop="trainlevels">
       <el-select v-model="queryParams.trainlevels" multiple placeholder="请选择" clearable size="medium">
          <el-option
            v-for="item in trainlevels"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务类别" prop="tasktypes">
        <el-select v-model="queryParams.tasktypeids" multiple placeholder="请选择" clearable size="medium">
          <el-option
            v-for="item in tasktypes"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="实践类别" prop="practicetypes">
        <el-select v-model="queryParams.practicetypes" multiple placeholder="请选择" clearable size="medium">
          <el-option
            v-for="item in practicetypes"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          size="mini" 
          icon="el-icon-search"
          @click="loadCourse">搜索</el-button>
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
          icon="el-icon-circle-plus-outline"
          plain
          :disabled="!singleClass"
          @click="addCourse">添加课程</el-button>
      </el-col>
    </el-row>
    <el-table :data="courses" row-key="id" ref="courseTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px" align="center"></el-table-column>
      <el-table-column label="期班号" prop="classno" width="100px"></el-table-column>
      <el-table-column label="开课学期" prop="term" width="100px"></el-table-column>
      <el-table-column label="培训层次" prop="trainlevel" width="100px"></el-table-column>
      <el-table-column label="课程名称" prop="coursename" width="100px"></el-table-column>
      <el-table-column label="培训专业" prop="majorname" width="100px"></el-table-column>
      <el-table-column label="学员人数" prop="stunum" width="80px"></el-table-column>
      <el-table-column label="任课教员" prop="teachername" width="100px"></el-table-column>
      <el-table-column label="任务类别" prop="tasktype" width="100px"></el-table-column>
      <el-table-column label="实践类别" prop="practicetype" width="100px"></el-table-column>
      <el-table-column label="理论学时" prop="theroyhour" width="100px"></el-table-column>
      <el-table-column label="实践学时" prop="practicehour" width="100px"></el-table-column>
      <el-table-column label="主/辅讲" prop="prime" width="100px"></el-table-column>
      <el-table-column label="批次系数" prop="batchcoeff" width="100px"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="100px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="viewStudent(scope.row)"
            icon="el-icon-view">
            查看学员
          </el-button>
          <el-button
            type="warning" 
            size="mini" 
            icon="el-icon-circle-plus-outline"
            plain 
            class="detailcourse"
            @click="addCourseSchedule(scope.row)">
            添加细化课表
          </el-button>
          <el-button
            size="mini"
            type="danger"
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
      :page.sync="queryParams.pagenum"
      :limit.sync="queryParams.pagesize"
      @pagination="loadCourse"></pagination>

    <add-course ref="addCourseRef" :practicetypes="practicetypes" :classid="classid"/>
  </div>
</template>

<script>

import { getTypeDataByTypenos } from "../../api/basicdata/type"
import { getClassno } from "../../api/basicdata/class" 
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listCourse, getCoursename } from "../../api/course/course"
import AddCourse from "./add.vue"

export default {
  name: "CourseList",
  components: {
    TreeSelect,
    AddCourse
  },
  props: {
    selectedclsids: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      classnos: [],
      terms: [],
      majors: [],
      trainlevels: [],
      tasktypes: [],
      practicetypes: [],
      coursenames: [],
      queryParams: {
        classnos: [],
        termids: [],
        majorids: [],
        trainlevelids: [],
        tasktypeids: [],
        practicetypes: [],
        coursenames: [],
        pagenum: 1,
        pagesize: 15
      },
      courses: [],
      total: 0,
      selectedIds: [],
      singleClass: false,
      classid: 0
    }
  },
  created() {
    getClassno().then(res => {
      this.classnos = res
    }),
    getTypeDataByTypenos(['1001', '1002', '1006', '1010', '1011']).then(res => {
      let result = eval(res)
      this.trainlevels = result['1001']
      this.tasktypes = result['1002']
      this.majors = result['1010']
      this.terms = result['1011']
      this.practicetypes = result['1006']
    }),
    getCoursename().then(res => {
      this.coursenames = res
    })
    this.loadCourse()
  },
  watch: {
    selectedclsids() {
      this.singleClass = (this.selectedclsids && this.selectedclsids.length == 1)
    }
  },
  methods: {
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
    resetQuery() {
      this.queryParams = { 'pagenum': 1, 'pagesize': 10 }
    },
    loadCourse() {
      listCourse(this.queryParams).then(res => {
        this.courses = res.list
        this.total = res.total
      })
    },
    handleSelectionChange(val) {
      this.selectedIds = val.map(item => item.id)
    },
    viewStudent(row) {
      this.$router.push({ path: '/class/student', query: {classinfo: row} })
    },
    addCourse() {
      if(this.singleClass) {
        this.classid = this.selectedclsids[0]
        this.$refs.addCourseRef.openDialog(this.classid)
      }
    },
    addCourseSchedule(row) {
      this.$router.push({ path: '/course/detail/add', query: {courseinfo: row} })
    },
    handleUpdate(row) {
      
    },
    handleDelete(row) {
      
    }
  }
}
</script>

<style lang="less">
//显示时按钮样式
.detailcourse { //需要更改的按钮类型
  color: #754d26 !important;
  background: #ecbd87 !important;
  border-color: #ecbd87 !important;
}
//移入时按钮样式
.detailcourse:hover {
  background: #f78401 !important;
  border-color: #f78401 !important;
  color: #FFF !important;
}
</style>