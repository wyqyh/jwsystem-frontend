<template>
  <div class="app-container">
    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>类别分类</span>
            <span style="float: right">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-tooltip class="item" effect="dark" content="添加类别" placement="top">
                    <svg class="icon" aria-hidden="true" @click="handleOpenAddType"><use xlink:href="#icon-tianjia"></use></svg>
                  </el-tooltip>
                </el-col>
                <el-col :span="10">
                  <el-tooltip class="item" effect="dark" content="删除类别" placement="top">
                    <svg class="icon" aria-hidden="true" @click="handleDeleteType"><use xlink:href="#icon-shanchu"></use></svg>
                  </el-tooltip>
                </el-col>
              </el-row>
            </span>
          </div>
          <type-category :addTypeOpen="openAddType" ref="typeCategoryRef"
            @closeAddType="handleClose" @sendTypeids="getTypeids"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="10" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>类别信息</span>
            <span style="float: right">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-tooltip class="item" effect="dark" content="添加类别" placement="top">
                    <svg class="icon" aria-hidden="true" @click="handleOpenAddData"><use xlink:href="#icon-tianjia"></use></svg>
                  </el-tooltip>
                </el-col>
                <el-col :span="10">
                  <el-tooltip class="item" effect="dark" content="删除类别" placement="top">
                    <svg class="icon" aria-hidden="true" @click="handleDeleteData"><use xlink:href="#icon-shanchu"></use></svg>
                  </el-tooltip>
                </el-col>
              </el-row>
            </span>
          </div>
          <el-scrollbar style="height: 100%; overflow-x: hidden;">
            <type-data :addDataOpen="openAddData" :typeIdArr="selectedTypeids" ref="typeDataRef"
                @closeAddDataDialog="handleCloseAddData" @sendSelectedData="getSelectedTypeDataids"/>
          </el-scrollbar>
          
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import TypeCategory from './category.vue'
import TypeData from './typedata.vue'
import { deleteTypeByIds } from '../../../api/basicdata/type'
import {  deleteTypeDataByIds } from '../../../api/basicdata/type'

export default {
  name: 'TypeManage',
  components: {
    TypeCategory,
    TypeData
  },
  data() {
    return {
      openAddType: false,
      openAddData: false,
      selectedTypeids: [],
      selectedDataids: []
    }
  },
  methods: {
    handleOpenAddType() {
      this.openAddType = true
    },
    handleClose() {
      this.openAddType = false
    },
    getTypeids(typeIds) {
      this.selectedTypeids = typeIds
    },
    handleDeleteType() {
      if(this.selectedTypeids.length <= 0) {
        this.$modal.msgWarning('请先选择类别分类')
      } else {
        deleteTypeByIds(this.selectedTypeids).then(() => {
          this.$modal.msgError("删除成功")
          this.$refs.typeCategoryRef.loadType()
        })
      }
      
    },
    handleOpenAddData() {
      this.openAddData = true
    },
    handleCloseAddData() {
      this.openAddData = false
    },
    getSelectedTypeDataids(typeDataids) {
      this.selectedDataids = typeDataids
    },
    handleDeleteData() {
      if(this.selectedDataids.length <= 0) {
        this.$modal.msgWarning('请先选择类别信息')
      } else {
        deleteTypeDataByIds(this.selectedDataids).then(() => {
          this.$modal.msgError("删除成功")
          this.$refs.typeDataRef.loadTypeData()
        })
      }
    }
  }
}
</script>

<style lang="less">
.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>