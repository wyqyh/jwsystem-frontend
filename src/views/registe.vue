<template>
  <div class="registe">
    <el-form 
      class="registe-form" 
      :model="registeForm"
      status-icon
      ref="registeFormRef"
      style="width: 900px"
      label-width="auto"
      :rules="registeFormRule">
      <h3>新用户注册</h3>
      <el-row>
        <el-col :span="8">
          <el-form-item label="登录账号" prop="account">
            <el-input v-model="registeForm.account" placeholder="请输入登录账号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="真实姓名" prop="name">
            <el-input v-model="registeForm.name" placeholder="请输入真实姓名"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="密码" prop="password">
            <el-input v-model="registeForm.password" auto-complete="off" :type="passwordType" placeholder="请输入密码"/>
            <svg-icon slot="suffix" class="show-pwd" 
              @click="showPwd" :icon-class="passwordType === 'password' ? 'no_eye' : 'eye'"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="registeForm.sex" label="男" key="1">男</el-radio>
            <el-radio v-model="registeForm.sex" label="女" key="0">女</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="身份证号" prop="idcard">
            <el-input v-model="registeForm.idcard" placeholder="请输入身份证号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入校日期" prop="entrydate">
            <el-date-picker
              style="width: 100%"
              v-model="registeForm.entrydate"
              type="date"
              value-format="yyyy-MM"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="所在部门" prop="deptid">
             <tree-select 
              :options="depts" 
              :show-count="true"
              v-model="registeForm.deptid"
              :value="registeForm.deptid"></tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="座机号" prop="contact">
            <el-input v-model="registeForm.contact" placeholder="请输入座机号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="registeForm.phone" placeholder="请输入手机号"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="人员类别" prop="usertypeids">
            <el-select v-model="registeForm.usertypeids"  @change="usertypechange"
            placeholder="请选择人员类别" style="width: 100%" multiple>
              <el-option
                v-for="item in usertypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属分类" prop="categoryid">
            <el-select v-model="registeForm.categoryid" @change="categorychange"
              placeholder="请选择人员分类" style="width: 100%">
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件编号" prop="cardno">
            <el-input v-model="registeForm.cardno" placeholder="请输入证件编号"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isteacher">
        <el-col :span="8">
          <el-form-item label="职称" prop="jobtitleid">
            <el-select v-model="registeForm.jobtitleid" placeholder="请选择职称" style="width: 100%">
              <el-option
                v-for="item in jobtitles"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职称等级" prop="joblevelid">
            <el-select v-model="registeForm.joblevelid" placeholder="请选择职称等级" style="width: 100%">
              <el-option
                v-for="item in joblevels"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="取得职称日期" prop="jobdate">
            <el-date-picker
              style="width: 100%"
              v-model="registeForm.jobdate"
              type="date"
              value-format="yyyy-MM"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isteacher">
        <el-col :span="8">
          <el-form-item label="岗位等级" prop="postlevelid">
            <el-select v-model="registeForm.postlevelid" placeholder="请选择岗位等级" style="width: 100%">
              <el-option
                v-for="item in postlevels"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="技术等级" prop="skilllevelid">
            <el-select v-model="registeForm.skilllevelid" placeholder="请选择技术等级" style="width: 100%">
              <el-option
                v-for="item in skilllevels"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="取得技术等级日期" prop="skillleveldate">
              <el-date-picker
                style="width: 100%;"
                v-model="registeForm.skillleveldate"
                type="date"
                value-format="yyyy-MM"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
      </el-row>
      <el-row>
        <el-col :span="8" v-if="isofficer">
          <el-form-item label="军官衔级" prop="officerlevelid">
            <el-select v-model="registeForm.officerlevelid" placeholder="请选择军官衔级" style="width: 100%">
              <el-option
                v-for="item in officerlevels"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isnocommofficer">
          <el-form-item label="士官衔级" prop="nocommofficerlevelid">
            <el-select v-model="registeForm.nocommofficerlevelid" placeholder="请选择士官衔级" style="width: 100%">
              <el-option
                v-for="item in nocommofficerlevels"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入伍日期" prop="enlistdate">
            <el-date-picker
              style="width: 100%"
              v-model="registeForm.enlistdate"
              type="date"
              value-format="yyyy-MM"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: center">
          <el-button type="primary" @click="register">确定</el-button>
          <el-button @click="close">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>   
</template>

<script>

import { getTypeDataByTypenos } from "../api/basicdata/type"
import { getTree } from "../utils/commons"
import { getDept } from "../api/system/dept"
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { registe } from '../api/system/user'

export default {
  name: 'Registe',
  components: {
    TreeSelect
  },
  created() {
    getTypeDataByTypenos(['1013', '1014', '1015', '1016', '1017', '1018', '1019', '1020']).then(res => {
      let result = eval(res)
      this.categorys = result['1013']
      this.usertypes = result['1014']
      this.jobtitles = result['1015']
      this.joblevels = result['1016']
      this.skilllevels = result['1017']
      this.postlevels = result['1018']
      this.officerlevels = result['1019']
      this.nocommofficerlevels = result['1020']
    }),
    getDept().then(res => {
      this.depts = getTree(res)
    })
  },
  data() {
    const idcardSexValid=(rule, idcard, callback) => {
      if(!idcard) {
        return callback(new Error('请输入身份证号'))
      } else {
        let last2num = idcard.slice(-2, -1)
        let sex = this.registeForm.sex
        if((last2num === '1' && sex === '女') || (last2num === '2' && sex === '男')) {
          return callback(new Error('身份证号与性别信息不相符'))
        } else {
          callback()
        }
      } 
    }
    return {
      usertypes: [],
      categorys: [],
      jobtitles: [],
      joblevels: [],
      skilllevels: [],
      postlevels: [],
      officerlevels: [],
      depts: [],
      nocommofficerlevels: [],
      isteacher: false,
      isofficer: false,
      isnocommofficer: false,
      passwordType: 'password',
      registeForm: {
        account: '',
        name: '',
        password: '',
        sex: '男',
        idcard: '',
        deptid: undefined,
        contact: '',
        phone: '',
        entrydate: '',
        cardno: '',
        categoryid: undefined,
        usertypeids: [],
        jobtitleid: undefined,
        joblevelid: undefined,
        jobdate: '',
        skilllevelid: undefined,
        skillleveldate: '',
        postlevelid: undefined,
        officerlevelid: undefined,
        nocommofficerlevelid: undefined,
        enlistdate: '',
      },
      registeFormRule: {
        account: [
          { required: true, message: "登录账号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "请选择性别", trigger: "blur" }
        ],
        idcard: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: idcardSexValid, trigger: "blur"}
        ],
        deptid: [
          { required: true, message: "请选择所在部门", trigger: "blur" }
        ],
        entrydate: [
          { required: true, message: "请选择入校日期", trigger: "blur" }
        ],
        usertypeids: [
          { required: true, message: "请选择所属分类", trigger: "blur" }
        ],
        categoryid: [
          { required: true, message: "请选择入校日期", trigger: "blur" }
        ],
        cardno: [
          { required: true, message: "证件号码，军官证/士官证/文职证", trigger: "blur" }
        ],
        jobtitleid: [
          { required: true, message: "请选择职称", trigger: "blur" }
        ],
        joblevelid: [
          { required: true, message: "请选择职称等级", trigger: "blur" }
        ],
        jobdate: [
          { required: true, message: "请选择取得职称日期", trigger: "blur" }
        ],
        postlevelid: [
          { required: true, message: "请选择入校日期", trigger: "blur" }
        ],
        skilllevelid: [
          { required: true, message: "请选择取得技术等级日期", trigger: "blur" }
        ],
        skillleveldate: [
          { required: true, message: "请选择入校日期", trigger: "blur" }
        ],
        officerlevelid: [
          { required: true, message: "请选择军官衔级", trigger: "blur" }
        ],
        nocommofficerlevelid: [
          { required: true, message: "请选择士官衔级", trigger: "blur" }
        ],
        enlistdate: [
          { required: true, message: "请选择入伍日期", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    categorychange(val) {
      let categoryname = this.categorys.find(ele => ele.id === val).name   
      if(categoryname === '现役军官') {
        this.isofficer = true
        this.isnocommofficer = false
      } else if(categoryname === '现役士官') {
        this.isnocommofficer = true
        this.isofficer = false
      } else {
        this.isofficer = false
        this.isnocommofficer = false
      }
    },
    usertypechange(val) {
      let usernames = val.map(uid => (this.usertypes.find(ele => ele.id === uid).name))
      if(usernames.indexOf('任课教员') >= 0) {
        this.isteacher = true
      } else {
        this.isteacher = false
      }
    },
    showPwd() {
      if(this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    close() {
      this.$router.push({path: "/login"})
    },
    register() {
      this.$refs.registeFormRef.validate(valid => {
        if(valid) {
          registe(this.registeForm).then(res => {
            let code = res.code
            let msg = res.message
            if(code === 14) {
              this.$modal.notifyError(msg)
            } else {
              this.$modal.msgSuccess(msg)
              this.close()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.registe{
  display: flex;
  height: 100%;
  background-image: url("../assets/images/background.webp");
  background-size: cover;
  justify-content: center;
  align-items: center;
}
.registe-form {
  width: 400px;
  border-radius: 6px;
  background: #fff;
  padding: 25px 25px 5px 25px;
}
.show-pwd {
  text-align: center;
  padding-right: 10px;
  padding-top: 15px;
  display: inline-flex;
}
</style>