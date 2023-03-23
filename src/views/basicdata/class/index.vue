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
      <el-form-item label="管理机构" prop="depts">
        <tree-select 
          :multiple="true"
          :options="depts" 
          :show-count="true"
          v-model="queryParams.deptids"
          :value="queryParams.deptids"></tree-select>
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
      <el-form-item>
        <el-button 
          type="primary" 
          size="mini" 
          icon="el-icon-search"
          @click="loadClass">搜索</el-button>
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
          @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button 
          type="warning" 
          size="mini" 
          icon="el-icon-files"
          plain 
          :disabled="!single"
          @click="handleImport">学员导入</el-button>
      </el-col>
    </el-row>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        action=""
        :disabled="upload.isUploading"
        :auto-upload="false"
        :http-request="uploadStuinfo"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" 
            :href="exportXlsModeUrl">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <add-class :classnos="classnos" :terms="terms" :depts="depts" :majors="majors"
      :tasktypes="tasktypes" :trainlevels="trainlevels" ref="addClassDialog"/>

    <el-table :data="classes" row-key="id" ref="classTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px" align="center"></el-table-column>
      <el-table-column label="期班号" prop="classno" width="100px"></el-table-column>
      <el-table-column label="学员人数" prop="stunum" width="80px"></el-table-column>
      <el-table-column label="开课学期" prop="term" width="150px"></el-table-column>
      <el-table-column label="管理机构" prop="deptname" width="350px"></el-table-column>
      <el-table-column label="培训层次" prop="trainlevel" width="150px"></el-table-column>
      <el-table-column label="培训专业" prop="majorname" width="150px"></el-table-column>
      <el-table-column label="任务类别" prop="tasktype" width="150px"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="150px"></el-table-column>
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
      @pagination="loadClass"></pagination>
  </div>
</template>

<script>

import { getDept } from "../../../api/system/dept"
import { getTypeDataByTypenos } from "../../../api/basicdata/type"
import { getClassno, listClass, deleteClass } from "../../../api/basicdata/class" 
import { uploadStuinfo } from "../../../api/basicdata/student"
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import AddClass from "./addclass.vue"

export default {
  name: 'CourseManage',
  components: {
    TreeSelect,
    AddClass
  },
  data() {
    return {
      classnos: [],
      terms: [],
      depts: [],
      majors: [],
      trainlevels: [],
      tasktypes: [],
      queryParams: {
        classnos: [],
        termids: [],
        deptids: [],
        majorids: [],
        trainlevelids: [],
        tasktypeids: [],
        pagenum: 1,
        pagesize: 10

      },
      total: 0,
      exportXlsModeUrl: 'http://localhost:8083/stu/export/xlsmodel',
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: ""
      },
      classes: [],
      selectedIds: [],
      single: false
    }
  },
  created() {
    getClassno().then(res => {
      this.classnos = res
    })
    getDept().then(res => {
      this.depts = this.getTree(res)
    })
    getTypeDataByTypenos(['1001', '1002', '1010', '1011']).then(res => {
      let result = eval(res)
      this.trainlevels = result['1001']
      this.tasktypes = result['1002']
      this.majors = result['1010']
      this.terms = result['1011']
    }),
    this.loadClass()
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
    handleImport() {
      this.upload.title = "学员信息导入";
      this.upload.open = true;
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 提交上传文件
    uploadStuinfo(param) {
      let formData = new FormData()
      let stuxls = param.file
      formData.append('stuinfo', stuxls, stuxls.filename)
      formData.append('classid', this.selectedIds[0])
      uploadStuinfo(formData).then(res => {
        let msg = res.message
        this.$modal.notifySuccess(msg)
        this.upload.open = false;
        this.$refs.upload.clearFiles();
      })
    },
    handleAdd() {
      this.$refs.addClassDialog.openDialog()
    },
    resetQuery() {
      this.queryParams = { 'pagenum': 1, 'pagesize': 10 }
    },
    loadClass() {
      listClass(this.queryParams).then(res => {
        this.classes = res.list
        this.total = res.total
      })
    },
    handleUpdate(row) {
      this.$refs.addClassDialog.editClass(row)
    },
    handleDelete(row) {
      // 删除某行
      if(row) {
        this.selectedIds.push(row.id)
      }
      deleteClass(this.selectedIds).then(() => {
        this.$modal.msgSuccess("删除成功")
      })
    },
    handleSelectionChange(val) {
      this.selectedIds = val.map(item => item.id)
      this.single = this.selectedIds.length == 1
    },
    viewStudent(row) {
      this.$router.push({ path: '/class/student', query: {classinfo: row} })
    }
  }
}
</script>

<style lang="less">

.vue-treeselect {
  width: 250px;
  line-height: 28px;
  padding-top: 3px;
  .vue-treeselect__placeholder {
    line-height: 28px;
  }
  .vue-treeselect__control {
    height: 35px !important;
    .vue-treeselect__value-container {
      line-height: 20px;
    }
  }
}

</style>