<template>
  <div class="user">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索卡片区域 -->
      <el-row :gutter="12">
        <el-col :span="7">
          <el-card>总是显示</el-card>
        </el-col>
        <el-col :span="4">
          <el-card>鼠标悬浮时显示</el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>