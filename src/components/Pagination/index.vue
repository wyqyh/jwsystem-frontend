<template>
  <div class="pagination-container">
    <el-pagination
      :background="background"
      :total="total"
      :layout="layout"
      :page-sizes="pageSizes"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    total: {
      required: true,
      type: Number
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    background: {
      type: Boolean,
      default: true
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange() {
      this.$emit('pagination')
    },
    handleCurrentChange() {
      this.$emit('pagination')
    }
  }
}
</script>

<style lang="less">
.pagination-container {
  padding: 32px 16px;
}
</style>