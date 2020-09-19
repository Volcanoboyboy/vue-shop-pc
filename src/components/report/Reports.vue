<template>
  <div class="reports">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts"

// 引入lodash merge方法合并对象
import _ from "lodash"
export default {
  data() {
    return {
      // echarts配置项
      option: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    }
  },
  name: "report",
  created() {},
  mounted() {
    const myChart = echarts.init(document.getElementById("main"))

    // 还有一部分要合并的配置,由后台返回
    this.$axios
      .get(`reports/type/1`)
      .then(({ data: res }) => {
        if (res.meta.status !== 200) {
          this.$message.error("获取数据配置失败")
          return
        }
        this.option = _.merge(this.option, res.data)
        myChart.setOption(this.option)
        this.$notify.success("获取配置成功")
      })
      .catch((err) => {
        this.$notify.error({
          title: "错误",
          message: "这是一条错误的提示消息",
        })
      })
  },
}
</script>

<style>
</style>