<template>
  <el-select 
    ref="selectTree" 
    style="width: 100%"
    :value="value" 
    v-model="valueName"
    :multiple="multiple" 
    :clearable="clearable"
    @clear="clearHandle"
    @change="changeValue">
    <el-option :value="valueName" class="options">
      <el-tree 
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
        @node-click="handleNodeClick">
        <span slot-scope="{ data }">
          <span>{{ data.name }}{{ data.children ? '(' + data.children.length + ')' : '' }}</span>
        </span>
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'TreeSelect',
  props: {
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id',
          label: 'name',
          children: 'children'
        }
      }
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    valueMultiple: {
      type: Array,
      default: () => {
        return []
      }
    },
    clearable: {
      type: Boolean,
      default: true
    },
    //自动收起
    accordion: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resultValue: [],
      valueName: this.multiple ? [] : ''
    }
  },
  watch: {
    value() {
      this.resultValue = this.multiple ? this.valueMultiple : this.value
      this.initHandle()
    }
  },
  mounted() {
    this.resultValue = this.multiple ? this.valueMultiple : this.value
    this.initHandle()
  },
  methods: {
    initHandle() {
      if(this.resultValue) {
        if(this.multiple) {
          this.resultValue.forEach(item => this.valueName.push(item.name))
        } else {
          this.valueName = this.resultValue.name
        }
      }
      this.initScroll()
    },
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => ele.style.width = 0)
      })
    },
    //切换选项
    handleNodeClick(node) {
      if(node.children == null || node.children == undefined) {
        if(this.multiple) {
          let num = 0
          this.valueName.forEach(item => {
            item == node[this.props.label] ? num++ : num
          })
          if(num == 0) {
            this.valueName.push(node[this.props.label])
            this.resultValue.push(node)
          }
        } else {
          this.$refs.selectTree.blur();
          this.valueName = node[this.props.label]
          this.resultValue = node
        }
        this.$emit('getValue', this.resultValue)
      }
    },
    changeValue(val) {
      if(this.multiple) {
        this.resultValue.map((item, index) => {
          let i = val.indexOf(item.name)
          if(i == -1) {
            this.resultValue.splice(index, 1)
          }
        })
        this.$emit('getValue', this.resultValue)
      } else {
        this.$emit('getValue', val)
      }
    },
    //清楚选中
    clearHandle() {
      this.valueName = this.multiple ? [] : ''
      this.resultValue = []
      this.clearSelected()
      this.$emit('getValue', this.resultValue)
    },
    //清空选中样式
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach(ele => ele.classList.remove('is-current'))
    }
  }
}
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 300px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>>.el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409EFF;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__childrent .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.el-popper {
  z-index: 9999;
}
.ification_col {
  width: 20px;
  height: 10px;
  display: inline-block;
}
</style>