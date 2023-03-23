<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px" style="width: 50%">
    <el-form-item label="登录账号" prop="account">
      <el-input v-model="user.account" maxlength="30" disabled/>
    </el-form-item> 
    <el-form-item label="用户姓名" prop="name">
      <el-input v-model="user.name" maxlength="30" />
    </el-form-item> 
    <el-form-item label="座机号码" prop="contact">
      <el-input v-model="user.contact" maxlength="11" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="所属部门" prop="deptid">
        <tree-select 
          :options="deptSelectList" 
          :show-count="true"
          v-model="user.deptid"
          :value="deptName"></tree-select>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="男">男</el-radio>
        <el-radio label="女">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { getDept } from '../../../../api/system/dept'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { updateUser } from '../../../../api/system/user'

export default {
  name: 'UserBasicInfo',
  props: {
    user: {
      type: Object
    }
  },
  created() {
    //加载部门下拉选择树
    getDept().then(res => {
      this.deptSelectList = this.getTree(res)
    })
  },
  components: {
    TreeSelect
  },
  data() {
    return {
      deptSelectList: [],
      deptName: undefined,
      rules: {
        account: [
          { required: true, message: "登录账号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if(valid) {
          updateUser(this.user).then(() => {
            this.$emit('refreshUserInfo')
            this.$modal.notifySuccess('信息更新成功')
          })
        }
      });
    },
    close() {
      this.$tab.closePage();
    },
    getTree(tree = []) {
      let arr = [];
      if(tree.length !== 0) {
        tree.forEach(item => {
          let obj = {}
          obj.label = item.name
          obj.id = item.id
          /*
          if(item.id === this.user.deptid) {
            this.deptName = item.name
          }*/
          if(item.children) {
            obj.children = this.getTree(item.children)
          }
          arr.push(obj)
        })
      }
      return arr
    },
  }
}
</script>

<style lang="less">

</style>