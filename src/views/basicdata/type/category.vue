<template>
  <div>
    <el-tree ref="tree" :data="typeList" show-checkbox empty-text="暂无查询到类别数据" node-key="id"
      @check="selectType" highlight-current default-expand-all :expand-on-click-node="false" :props="defaultProps">
      <span slot-scope="{ data }">
        {{data.name}}（{{data.no}}）
      </span>
    </el-tree>
    
    <el-dialog :visible.sync="showDialog" title="添加类别分类" @close="handleCloseDialog" width="500px">
      <el-form ref="addTypeFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类编号" prop="typeno">
          <el-input v-model="form.typeno" placeholder="请输入分类编号"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="typename">
          <el-input v-model="form.typename" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="handleCloseDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { addType, getAllType } from '../../../api/basicdata/type'

export default {
  name: 'TypeCategory',
  props: {
    addTypeOpen: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    addTypeOpen(oldVal, newVal) {
      this.showDialog = this.addTypeOpen
    }
  },
  data() {
    return {
      typeList: [],
      form: {
        typeno: '',
        typename: ''
      },
      showDialog: false,
      defaultProps: {
        label: 'name'
      },
      rules: {
        typename: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        typeno: [
            { required: true, message: '分类编号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadType()
  },
  methods: {
    loadType() {
      getAllType().then(res => {
        this.typeList = res
      })
    },
    selectType(node, key, halfNode, halfKey) {
      this.$emit('sendTypeids', key.checkedKeys)
    },
    submitForm() {
      this.$refs.addTypeFormRef.validate(valid => {
        if(valid) {
          addType({'typeno': this.form.typeno, 'name': this.form.typename}).then(() => {
            this.$modal.msgSuccess("添加类别分类成功")
            this.loadType()
            this.handleCloseDialog()
          })
        }
      })
    },
    handleCloseDialog() {
      this.resetForm('addTypeFormRef')
      this.showDialog = false
      this.$emit('closeAddType')
    }
  }
}
</script>

<style lang="less">

</style>