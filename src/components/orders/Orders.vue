<template>
  <div class="orders">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索卡片区域 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model.trim="queryInfo.query"
            clearable
            @clear="clearHandel"
          >
            <!-- input的slot配置input的放置内容的位置 -->
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="oders.ordersTabelData" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="450"></el-table-column>
        <el-table-column prop="order_price" label="订单价格¥" width="100"></el-table-column>
        <el-table-column prop="is_send" label="是否付款" width="100">
          <template #default="scop">
            <el-tag v-if="scop.row.order_pay === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order_pay" label="是否发货" width="100">
          <template #default="scop">
            <span>{{ scop.row.is_send }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template #default="scop">
            <span>{{ scop.row.create_time | timeForemate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scop">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editOrderAddress(scop.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="getLocationLine(scop.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.total"
      ></el-pagination>
    </el-card>

    <!-- 编辑订单地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editData.editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editData.editFormData" ref="editFormRef" :rules="editData.editFormRules">
        <el-form-item
          label="省市区/县"
          label-width="90px"
          v-model="editData.editFormData.cityAddress"
          prop="cityAddress"
        >
          <el-cascader
            v-model="editData.selectedKeys"
            clearable
            :options="editData.cityDatas"
            :props="editData.cascaderProps"
            @change="cascaderChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          label-width="90px"
          v-model="editData.editFormData.address"
          prop="address"
        >
          <el-input v-model="editData.editFormData.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editData.editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataNewAddress">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="localDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityDatas from "../../plugins/citydata"
export default {
  name: "order",
  created() {
    this.getOderList()
  },
  data() {
    return {
      // 物流信息
      progressInfo: [],
      // 物流信息对话框是否可见
      localDialogVisible: false,
      // 城市列表
      editData: {
        //  修改地址对话框是否可见
        editDialogVisible: false,
        // 城市数据
        cityDatas,
        // 联级选择器的配置
        cascaderProps: {
          children: "children",
          label: "label",
          value: "value",
          expandTrigger: "hover",
        },
        // 选中时产生的数组
        selectedKeys: [],
        // 地址
        editFormData: {
          cityAddress: [],
          address: "",
        },
        // 验证规则
        editFormRules: {
          cityAddress: [
            { required: true, message: "请填写地址", trigger: "blur" },
          ],
          address: [{ required: true, message: "请填写地址", trigger: "blur" }],
        },
      },
      //  查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //  表单数据
      oders: {
        ordersTabelData: [],
      },
      //  页码数据
      pages: {
        total: 0,
      },
    }
  },
  filters: {
    //  时间格式化过滤器
    timeForemate(timeMin) {
      const date = new Date(timeMin)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let _date = date.getDate()
      // let day = date.getDay(); //  默认不输出礼拜
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let secondes = date.getSeconds()

      month = month < 10 ? "0" + month : month
      _date = _date < 10 ? "0" + _date : _date
      hours = hours < 10 ? "0" + hours : hours
      minutes = minutes < 10 ? "0" + minutes : minutes
      secondes = secondes < 10 ? "0" + secondes : secondes

      return `${year}-${month}-${_date} ${hours}:${minutes}:${secondes}`
    },
  },
  methods: {
    getOderList() {
      this.$axios
        .get("orders", {
          params: this.queryInfo,
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取订单列表失败")
            return
          }
          this.oders.ordersTabelData = res.data.goods
          this.pages.total = res.data.total
        })
        .catch((err) => {
          this.$message.info("订单加载失败")
        })
    },
    //  搜索框清除事件
    clearHandel() {
      // api查询参数没做
      this.queryInfo.query = ""
      this.getOderList()
    },
    //  搜索框搜索事件
    searchUser() {
      this.getOderList()
    },

    // 页码变更触发事件
    handleCurrentChange(newPagennum) {
      this.queryInfo.pagenum = newPagennum
      this.getOderList()
    },
    // 每页展示数变更触发事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOderList()
    },

    /*************编辑地址方法 */

    // 显示编辑对话框
    editOrderAddress(row) {
      this.editData.editDialogVisible = true
    },

    //  联级选择时触发的事件
    cascaderChange() {},

    //  确定按钮的点击事件提交地址修改
    updataNewAddress() {
      // 没有接口了
      this.editData.editDialogVisible = false
    },

    //  编辑地址对话框关闭事件
    editDialogClosed() {},

    getLocationLine(row) {
      this.$axios
        .get(`/kuaidi/1106975712662`)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取物流信息失败")
            return
          }
          this.progressInfo = res.data
        })
        .catch((err) => {
          this.$message.error("获取物流信息服务器错误")
        })
      this.localDialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
// 这是在弄啥呢??没反应阿
@import "../../plugins/timeline/timeline.css";
@import "../../plugins/timeline-item/timeline-item.css";
.el-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>