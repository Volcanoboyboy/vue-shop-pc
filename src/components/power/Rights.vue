<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-card>
      <el-table :data="rightsListData" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scop">
            <el-tag v-if="scop.row.level === '0'">标签一</el-tag>
            <el-tag type="success" v-else-if="scop.row.level === '1'">标签二</el-tag>
            <el-tag type="warning" v-else>标签四</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "rights",
  created() {
    this.getRightsList()
  },
  data() {
    return {
      //  权限列表
      rightsListData: [],
    }
  },
  methods: {
    getRightsList() {
      this.$axios
        .get(`rights/list`)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取权限列表失败")
            return
          }
          this.rightsListData = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style lang="less" scoped>
</style>