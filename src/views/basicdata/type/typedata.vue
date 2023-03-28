<template>
  <div>
    <el-table :data="typedatas" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px" align="center"></el-table-column>
        <el-table-column label="类别信息" prop="name" width="200px"></el-table-column>
        <el-table-column label="所属分类" prop="typename" width="200px"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-hasPerm="['basicdata:type:edit']"
                @click="handleUpdate(scope.row)">
                修改
            </el-button>
            <el-button
                size="mini"
                type="text"
                v-hasPerm="['basicdata:type:delete']"
                @click="handleDelete(scope.row)"
                icon="el-icon-delete">
                删除
            </el-button>
          </template>
        </el-table-column>
    </el-table>

    <el-dialog :title="title"
        :visible.sync="showDialog"
        @close="handleCloseDialog"
         width="450px">
      <el-form ref="addTypeDataFormRef" :model="typedata" :rules="rules" label-width="80px">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="typedata.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="所属类别" prop="typeid">
          <el-select v-model="typedata.typeid" style="width: 100%" placeholder="请选择">
            <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
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

import { addTypeData, getAllType, getTypeDataByTypeids, updateTypeDataById, deleteTypeDataByIds } from '../../../api/basicdata/type'

export default {
  name: 'TypeData',
  props: {
    addDataOpen: {
      type: Boolean,
      default: false
    },
    typeIdArr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    addDataOpen(oldVal, newVal) {
      this.showDialog = this.addDataOpen
      if(this.addDataOpen) {
        this.title = "添加类别信息"
      }
    },
    typeIdArr(oldVal, newVal) {
      this.typeids = this.typeIdArr
      this.loadTypeData()
    }
  },
  created() {
    getAllType().then(res => {
      this.types = res
    })
    this.loadTypeData()
  },
  data() {
    return {
      title: '',
      typedatas: [],
      types: [],
      showDialog: false,
      typedata: {
        dataid: undefined,
        typeid: undefined,
        typeno: undefined,
        name: undefined
      },
      typeids: [],
      rules: {
        name: [
            { required: true, message: '类别名称不能为空', trigger: 'blur' }
        ],
        typeid: [
            { required: true, message: '请选择所属类别', trigger: 'blur' }
        ]
      },
      selectedIds: []
    }
  },
  methods: {
    loadTypeData() {
      this.typedatas = []
      if(this.typeids.length > 0) {
        getTypeDataByTypeids(this.typeids).then(res => {
          if(res) {
            this.typedatas = res
          }
        })
      } 
    },
    handleCloseDialog() {
      this.typedata = { 
        dataid: undefined,
        typeid: undefined,
        typeno: undefined,
        name: undefined
      }
      this.showDialog = false
      this.$emit('closeAddDataDialog')
    },
    submitForm() {
      this.$refs.addTypeDataFormRef.validate(valid => {
        if(valid) {
          if(this.typedata.dataid > 0) {
            updateTypeDataById(this.typedata).then(() => {
              this.$modal.msgSuccess("类别信息修改成功")
              this.handleCloseDialog()
              this.loadTypeData()
            })
          } else {
            let typeno = this.getTypenoById(this.typedata.typeid)
            this.typedata.typeno = typeno
            addTypeData(this.typedata).then(() => {
              this.$modal.msgSuccess("类别信息添加成功")
              this.handleCloseDialog()
              this.loadTypeData()
            })
          }
          
        }
      })
    },
    getTypenoById(typeid) {
      if(this.types.length > 0) {
        for(let item of this.types) {
          if(typeid === item.id) {
            return item.no
          }
        }
      }
    },
    handleSelectionChange(val) {
      this.selectedIds = val.map(item => item.id)
      this.$emit('sendSelectedData', this.selectedIds)
    },
    handleUpdate(row) {
      this.title = "修改类别信息"
      this.showDialog = true
      this.typedata.dataid = row.id
      this.typedata.typeno = row.typeno
      this.typedata.name = row.name
      this.typedata.typeid = row.typeid
    },
    handleDelete(row) {
      this.selectedIds.push(row.id)
      deleteTypeDataByIds(this.selectedIds).then(() => {
        this.$modal.msgError("删除成功")
        this.loadTypeData()
      })
    }
  }
}
</script>

<style lang="less">

</style>