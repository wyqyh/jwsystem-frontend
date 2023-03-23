<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    @close="closeForm"
    width="600px">
      <el-form label-width="100px" :model="classinfo" ref="addClassFormRef" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="期班号" prop="classno">
              <el-input placeholder="请输入期班号" v-model="classinfo.classno"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学期" prop="termid">
              <el-select v-model="classinfo.termid" placeholder="请选择">
                <el-option
                  v-for="item in terms"
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
            <el-form-item label="学员人数" prop="stunum">
              <el-input placeholder="请输入学员人数" v-model="classinfo.stunum"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类别" prop="tasktypeid">
              <el-select v-model="classinfo.tasktypeid" placeholder="请选择">
                <el-option
                  v-for="item in tasktypes"
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
            <el-form-item label="培训层次" prop="trainlevelid">
              <el-select v-model="classinfo.trainlevelid" placeholder="请选择">
                <el-option
                  v-for="item in trainlevels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训专业" prop="majorid">
              <el-select v-model="classinfo.majorid" placeholder="请选择">
                <el-option
                  v-for="item in majors"
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
            <el-form-item label="管理机构" prop="deptid">
              <tree-select 
                :options="depts" 
                :show-count="true"
                v-model="classinfo.deptid"
                :value="classinfo.deptid"></tree-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: right">
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="closeForm">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
  </el-dialog>
</template>

<script>

import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { addClass, updateClass } from '../../../api/basicdata/class'

export default {
  name: 'AddClass',
  components: {
    TreeSelect
  },
  props: {
    classnos: {
      type: Array,
      default() {
        return []
      }
    },
    terms: {
      type: Array,
      default() {
        return []
      }
    },
    depts: {
      type: Array,
      default() {
        return []
      }
    },
    majors: {
      type: Array,
      default() {
        return []
      }
    },
    trainlevels: {
      type: Array,
      default() {
        return []
      }
    },
    tasktypes: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      title: '添加期班',
      open: false,
      classinfo: {
        id: undefined,
        classno: undefined,
        stunum: undefined,
        termid: undefined,
        deptid: undefined,
        majorid: undefined,
        trainlevelid: undefined,
        tasktypeid: undefined
      },
      rules: {
        classno: [
          { required: true, message: '期班号不能为空', trigger: 'blur' }
        ],
        stunum: [
          { required: true, message: '请填写学员人数', trigger: 'blur' }
        ],
        termid: [
          { required: true, message: '请选择开课学期', trigger: 'change', type: 'number' }
        ],
        deptid: [
          { required: true, message: '请选择管理机构', trigger: 'change', type: 'number' }
        ],
        majorid: [
          { required: true, message: '请选择培训专业', trigger: 'change', type: 'number' }
        ],
        trainlevelid: [
          { required: true, message: '请选择培训层次', trigger: 'change', type: 'number' }
        ],
        tasktypeid: [
          { required: true, message: '请选择任务类别', trigger: 'change', type: 'number' }
        ]
      }
    }
  },
  methods: {
    closeForm() {
      this.classinfo = {}
      this.resetForm('addClassFormRef')
      this.open = false
    },
    editClass(row) {
      this.title = "编辑期班信息"
      Object.assign(this.classinfo, row)
      this.open = true
    },
    openDialog() {
      this.open = true
    },
    submitForm() {
      this.$refs.addClassFormRef.validate(valid => {
        if(valid) {
          this.classinfo.stunum = Number(this.classinfo.stunum)
          this.classinfo.termid = Number(this.classinfo.termid)
          this.classinfo.deptid = Number(this.classinfo.deptid)
          this.classinfo.majorid = Number(this.classinfo.majorid)
          this.classinfo.trainlevelid = Number(this.classinfo.trainlevelid)
          this.classinfo.tasktypeid = Number(this.classinfo.tasktypeid)
          if(this.classinfo.id > 0) {
            updateClass(this.classinfo).then(() => {
              let msg = res.message
              let code = res.code
              if(code == 7) {
                this.$modal.notifyError(msg)
              } else if(code == 9) {
                this.$modal.msgSuccess(msg)
                this.closeForm()
              }
            })
          } else {
            addClass(this.classinfo).then(res => {
              let msg = res.message
              let code = res.code
              if(code == 7) {
                this.$modal.notifyError(msg)
              } else if(code == 8) {
                this.$modal.msgSuccess(msg)
                this.closeForm()
              }
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