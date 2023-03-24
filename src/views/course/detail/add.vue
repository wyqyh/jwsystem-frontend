<template>
  <div class="app-container">
  <el-row :gutter="40">
    <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="10" style="margin-bottom: 10px">
      <el-form label-width="100px" :model="detailinfo" ref="detailInfoRef" :rules="rules">
        <h4 class="form-header">期班信息</h4>
        <el-row>
          <el-col :span="10">
            <el-form-item label="期班号">
              <el-input v-model="classinfo.classno" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="专业名称">
              <el-input v-model="classinfo.majorname" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="开课学期">
              <el-input v-model="classinfo.term" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="培训层次">
              <el-input v-model="classinfo.trainlevel" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="任务类别">
              <el-input v-model="classinfo.tasktype" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学员人数">
              <el-input v-model="classinfo.stunum" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <h4 class="form-header">课程信息</h4>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程名称">
              <el-input v-model="courseinfo.coursename" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践类别">
              <el-input v-model="courseinfo.practicetype" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="理论学时">
              <el-input disabled v-model="courseinfo.theroyhour"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实践学时">
              <el-input disabled v-model="courseinfo.practicehour"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批次系数">
              <el-input disabled v-model="courseinfo.batchcoeff"/>
            </el-form-item>
          </el-col>
        </el-row>
        <h4 class="form-header">新增细化课表</h4>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任课教员" prop="teacherid">
              <el-select v-model="detailinfo.teacherid" placeholder="请选择任课教员" style="width: 100%">
                <el-option
                  v-for="item in teacIdNames"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.level2dept }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教学类型" prop="teachtypeid">
              <el-select v-model="detailinfo.teachtypeid" placeholder="请选择教学类型" style="width: 100%">
                <el-option
                  v-for="item in teachtypeids"
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
            <el-form-item label="主/辅讲" prop="prime">
              <el-radio v-model="detailinfo.prime" label="1" key="1">主讲</el-radio>
              <el-radio v-model="detailinfo.prime" label="0" key="0">辅讲</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课日期" prop="teachdate">
              <el-date-picker
                v-model="detailinfo.teachdate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="教学场所" prop="teachlocid">
              <el-select v-model="detailinfo.teachlocid" placeholder="请选择教学场所" style="width: 100%">
                <el-option
                  v-for="item in teachlocid"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课节次" prop="teachsessid">
              <el-select v-model="detailinfo.teachsessid" placeholder="请选择授课节次">
                <el-option
                  v-for="item in teachsessid"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="教学内容" prop="teachcontent">
              <el-input type="textarea" autosize placeholder="请输入教学内容" 
                v-model="detailinfo.teachcontent"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: center">
            <el-button type="primary" @click="submitForm" size="small">确定</el-button>
            <el-button @click="close" size="small">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="14" style="margin-bottom: 10px">
      <el-table :data="courseDetails">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="期班号" prop="classno"></el-table-column>
        <el-table-column label="开课学期" prop="term"></el-table-column>
        <el-table-column label="培训层次" prop="trainlevel"></el-table-column>
        <el-table-column label="专业名称" prop="majorname"></el-table-column>
        <el-table-column label="课程名称" prop="coursename"></el-table-column>
        <el-table-column label="任课教员" prop="teachername"></el-table-column>
        <el-table-column label="授课教室" prop="teachlocat"></el-table-column>
        <el-table-column label="授课节次" prop="teachsess"></el-table-column>
        <el-table-column label="授课日期" prop="teachdate"></el-table-column>
      </el-table>
      <pagination
        :total="total"
        :pageSizes="[10, 20, 30, 50]"
        :page.sync="queryParams.pagenum"
        :limit.sync="queryParams.pagesize"
        @pagination="loadCourseDetail"></pagination>
    </el-col>
  </el-row>
  <div v-if="conflict">
    <el-divider content-position="left"><span style="font-weight:bold;font-size: 20px;color: red">细化课表冲突详情</span></el-divider>
    <el-table :data="conflictCourseDetails" :cell-style="columnStyle">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="期班号" prop="classno"></el-table-column>
      <el-table-column label="开课学期" prop="term"></el-table-column>
      <el-table-column label="培训层次" prop="trainlevel"></el-table-column>
      <el-table-column label="专业名称" prop="majorname"></el-table-column>
      <el-table-column label="课程名称" prop="coursename"></el-table-column>
      <el-table-column label="任课教员" prop="teachername"></el-table-column>
      <el-table-column label="授课教室" prop="teachlocat"></el-table-column>
      <el-table-column label="授课节次" prop="teachsess"></el-table-column>
      <el-table-column label="授课日期" prop="teachdate"></el-table-column>
    </el-table>
  </div>
  </div>
</template>

<script>

import { getTypeDataByTypenos } from '../../../api/basicdata/type'
import { addCourseDetail, pageCourseDetail } from '../../../api/course/coursedetail'

export default {
  name: 'AddCourseDetail',
  data() {
    return {
      classinfo: {
        classno: undefined,
        term: undefined,
        trainlevel: undefined,
        majorname: undefined,
        stunum: undefined,
        tasktype: undefined
      },
      courseinfo: {
        coursename: undefined,
        practicetype: undefined,
        theroyhour: undefined,
        practicehour: undefined,
        batchcoeff: undefined
      },
      detailinfo: {
        classid: undefined,
        classno: undefined,
        courseid: undefined,
        teacherid: undefined,
        prime: '1',
        teachtypeid: undefined,
        teachdate: undefined,
        teachlocid: undefined,
        teachsessid: undefined,
        teachcontent: undefined,
        createrid: this.$store.getters.uid
      },
      teacIdNames: [],
      open: false,
      title: '添加细化课表',
      teachtypeids: [],
      teachlocid: [],
      teachsessid: [],
      conflict: false,
      conflictCourseDetails: [],
      courseDetails: [],
      rules: {
        teacherid: [
          { required: true, message: '请选择任课教员', trigger: 'blur' }
        ],
        prime: [
          { required: true, message: '选择主/辅讲', trigger: 'blur' }
        ],
        teachtypeid: [
          { required: true, message: '请选择教学类型', trigger: 'blur' }
        ],
        teachdate: [
          { required: true, message: '请选择授课日期', trigger: 'blur' }
        ],
        teachlocid: [
          { required: true, message: '请选择教学场所', trigger: 'blur' }
        ],
        teachsessid: [
          { required: true, message: '请选择授课节次', trigger: 'blur' }
        ],
        teachcontent: [
          { required: true, message: '请输入教学内容', trigger: 'blur' }
        ]
      },
      queryParams: {
        uid: Number(this.$store.getters.uid),
        classid: undefined,
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      queryrow: undefined
    }
  },
  created() {
    this.queryrow = this.$route.query.courseinfo
    this.detailinfo.courseid = this.queryrow.id
    this.detailinfo.classid = this.queryrow.classid
    this.detailinfo.classno = this.queryrow.classno
    Object.assign(this.classinfo, this.queryrow)
    Object.assign(this.courseinfo, this.queryrow)
    this.teacIdNames = this.queryrow.teacIdNames
    getTypeDataByTypenos(['1007', '1009', '1012']).then(res => {
      let result = eval(res)
      this.teachtypeids = result['1007']
      this.teachlocid = result['1009']
      this.teachsessid = result['1012']
    }),
    this.queryParams.classid = this.queryrow.classid
    this.loadCourseDetail();
  },
  methods: {
    close() {
      this.$tab.closePage();
    },
    loadCourseDetail() {
      pageCourseDetail(this.queryParams).then(res => {
        this.courseDetails = res.list
        this.total = res.total
      })
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if(columnIndex == 6) {
        return 'background:	#FFFF00;'
      } else if(columnIndex == 7) {
        return 'background:	#FFB6C1;'
      } else if(columnIndex == 8) {
        return 'background:	#40E0D0;'
      } else if(columnIndex == 9) {
        return 'background:	#7CFC00;'
      }
    },
    submitForm() {
      this.$refs.detailInfoRef.validate(valid => {
        if(valid) {
          addCourseDetail(this.detailinfo).then(res => {
            let code = res.code
            let msg = res.message
            if(code == 12) {
              //存在冲突
              this.$modal.notifyError(msg)
              this.conflictCourseDetails = res.courseDetailVos
              this.conflict = true
            } else if(code == 13) {
              this.courseDetails = res.pageCourseDetailVos.list
              this.total = res.pageCourseDetailVos.total
              this.conflict = false
              this.$modal.msgSuccess(msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.form-header {
  font-size: 15px;
  color: #6379bb;
  border-bottom: 1px solid #ddd;
  margin: 8px 5px 25px 0px;
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