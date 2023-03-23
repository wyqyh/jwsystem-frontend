<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="800px"
    @close="closeDialog"
  >
    <el-form label-width="100px" :model="courseinfo" ref="courseInfoRef" :rules="rules">
      <el-divider>期班信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="期班号">
            <el-input v-model="classinfo.classno" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业名称">
            <el-input v-model="classinfo.majorname" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开课学期">
            <el-input v-model="classinfo.term" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训层次">
            <el-input v-model="classinfo.trainlevel" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="学员人数">
            <el-input v-model="classinfo.stunum" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务类别">
            <el-input v-model="classinfo.tasktype" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>课程信息</el-divider>
      <el-row>
        <el-col :span="10">
          <el-form-item label="课程名称" prop="coursename">
            <el-input placeholder="请输入课程名称" v-model="courseinfo.coursename"/>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="任课教员" prop="teacherids">
            <el-select v-model="courseinfo.teacherids" multiple
              placeholder="请选择任课教员" style="width: 100%">
              <el-option
                v-for="item in teachers"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.level2dept }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13">
          <el-form-item label="实践类别" prop="practicetype">
            <el-select v-model="courseinfo.practicetype" placeholder="请选择实践类别" 
              clearable size="medium"  style="width: 100%">
              <el-option
                v-for="item in practicetypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="主/辅讲" prop="prime">
            <el-select v-model="courseinfo.prime" multiple placeholder="请选择主/辅讲" clearable size="medium">
              <el-option key="1" label="主讲" value="1"/>
              <el-option key="0" label="辅讲" value="0"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="理论学时" prop="theroyhour">
            <el-input placeholder="请输入理论学时" v-model="courseinfo.theroyhour"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实践学时" prop="practicehour">
            <el-input placeholder="请输入实践学时" v-model="courseinfo.practicehour"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="批次系数" prop="batchcoeff">
            <el-input placeholder="请输入批次系数" v-model="courseinfo.batchcoeff"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>

import { getClassById } from "../../api/basicdata/class"
import { getTeachers } from "../../api/system/user"
import { addCourse } from "../../api/course/course"

export default {
  name: 'AddCourse',
  props: {
    practicetypes: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      open: false,
      title: '添加课程',
      classinfo: {},
      courseinfo: {
        uid: this.$store.getters.uid,
        classid: 0,
        teacherids: [],
        prime: []

      },
      rules: {
        coursename: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        practicetype: [
           { required: true, message: '请选择实践类别', trigger: 'change', type: 'number' }
        ],
        prime: [
           { required: true, message: '请选择主/辅讲', trigger: 'blur' }
        ],
        teacherids: [
          { required: true, message: '请选择任课教员', trigger: 'blur' }
        ],
        theroyhour: [
          { required: true, message: '请输入理论学时', trigger: 'blur' }
        ],
        practicehour: [
          { required: true, message: '请输入实践学时', trigger: 'blur' }
        ],
        batchcoeff: [
          { required: true, message: '请输入批次系数', trigger: 'blur' }
        ]
      },
      teachers: []
    }
  },
  created() {
    getTeachers().then(res => {
      this.teachers = res
    })
  },
  methods: {
    openDialog(classid) {
      if(classid > 0) {
        getClassById(classid).then(res => {
          this.courseinfo.classid = classid
          this.classinfo = res
          this.open = true
        })
      }
    },
    closeDialog() {
      this.classinfo = {}
      this.courseinfo = {}
      this.open = false
    },
    submitForm() {
      this.$refs.courseInfoRef.validate(valid => {
        console.log("123")
        if(valid) {
          let primes = this.courseinfo.prime
          if(primes && primes.length > 0) {
            if(primes.length > 1) { //同时选中了主讲和辅讲
              this.courseinfo.prime = 2
            } else {
              this.courseinfo.prime = Number(primes[0])
            }
          }
          this.courseinfo.uid = Number(this.courseinfo.uid)
          this.courseinfo.theroyhour = Number(this.courseinfo.theroyhour)
          this.courseinfo.practicehour = Number(this.courseinfo.practicehour)
          addCourse(this.courseinfo).then(res => {
            let code = res.code
            let msg = res.message
            if(code == 10) {
              this.$modal.msgError(msg)
            }  else if(code == 11) {
              this.$modal.msgSuccess(msg)
              this.closeDialog()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>