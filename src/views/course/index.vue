<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="9" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>期班信息</span>
          </div>
          <el-input
            placeholder="输入期班信息"
            v-model="filterclass"
            size="small"
            style="margin-bottom: 20px">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <div v-infinite-scroll="loadClassinfo" style="overflow:auto">
            <el-checkbox v-for="classinfo in classinfos" 
              :label="classinfo.id" 
              v-model="selectedclsids"
              :key="classinfo.id">
              {{ classinfo.term }} + {{ classinfo.trainlevel }} + {{ classinfo.majorname }}  + ({{ classinfo.classno }})
            </el-checkbox>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>课程列表</span>
          </div>
          <course-list :selectedclsids="selectedclsids"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { listClass } from "../../api/basicdata/class"
import CourseList from "./courselist.vue"

export default {
  name: 'CourseIndex',
  components: {
    CourseList
  },
  data() {
    return {
      queryClassParams: {
        pagenum: 1,
        pagesize: 20
      },
      classinfos: [],
      filterclass: '',
      selectedclsids: [],
      infiniteloading: false,
      infinitefinished: false,
    }
  },
  methods: {
    loadClassinfo() {
      this.infiniteloading = true
      if(this.infinitefinished == false) {
        listClass(this.queryClassParams).then(res => {
          let classes = res.list
          if(res.hasNextPage) {
            this.queryClassParams.pagenum ++
          }
          if(classes.length > 0) {
            this.classinfos = this.classinfos.concat(classes)
            this.infiniteloading = false
            if(classes.length < this.queryClassParams.pagesize) {
              this.infinitefinished = true
            }
          } else {
            this.infiniteloading = false
            this.infinitefinished = true
          }
          this.infiniteloading = false
        })
      }
    }
  }
}
</script>

<style lang="less">

</style>