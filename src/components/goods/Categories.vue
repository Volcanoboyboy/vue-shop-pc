<template>
  <div class="cate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'hoem' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button class="addCatebtn" type="primary" @click="showAddDialog">添加分类</el-button>
      <!-- 表格视图区 -->
      <el-table
        :data="cateList"
        border
        style="width: 100%"
        stripe
        row-key="cat_id"
        :tree-props="treeProp"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">
          <!-- 是否有效 -->
          <template #default="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen;"
            ></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template #default="scop">
            <el-tag v-if="scop.row.cat_level === 0" size="medium">一级</el-tag>
            <el-tag v-else-if="scop.row.cat_level === 1" size="medium" type="success">二级</el-tag>
            <el-tag v-else size="medium" type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scop">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scop.row)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleteDialog(scop.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addFormData" ref="addFormRef" :rules="addFormRules">
        <el-form-item label="分类名称:" label-width="90px" prop="cat_name">
          <el-input v-model="addFormData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" label-width="90px">
          <el-cascader
            v-model="selectedKeys"
            clearable
            :options="fatherCateList"
            :props="cascaderProps"
            @change="cascaderChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewCate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editFormData" ref="editFormRef" :rules="addFormRules">
        <el-form-item label="分类名称:" label-width="90px" prop="cat_name">
          <el-input v-model="editFormData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "cate",
  created() {
    this.getCateList()
  },
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 总数量
      total: 0,
      // 树表嵌套配置
      treeProp: {
        children: "children",
        hasChildren: "hasChildren",
      },

      //  添加分类对话框数据
      addFormData: {
        // 父类id
        cat_pid: "",
        //  分类名称
        cat_name: "",
        //  分类层级
        cat_level: "",
      },
      // 父级分类数据
      fatherCateList: [],
      //  添加分类对话框是否可见
      addDialogVisible: false,
      //  联级选择器组件配置项
      cascaderProps: {
        children: "children",
        label: "cat_name",
        value: "cat_id",
        expandTrigger: "hover",
      },
      // 联级选择器选中时获得的值数组
      selectedKeys: [],
      //  添加分类表单验证规则
      addFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },

      // ------ 修改分类名数据
      editFormData: {},
      //  修改对话框是否可见
      editDialogVisible: false,
    }
  },
  methods: {
    // 获取商品分类列表数据
    getCateList() {
      this.$axios
        .get("categories", {
          params: this.queryInfo,
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取商品分类列表失败")
            return
          }
          this.cateList = res.data.result
          this.total = res.data.total
        })
        .catch((err) => {
          this.$message.success("服务器错误")
        })
    },
    //  这里定义的分页是指定size的,所以可以不用更新size
    handleSizeChange(newSize) {},
    // 切换页码会触发这个函数,并传回当前新页码值
    handleCurrentChange(curPage) {
      this.queryInfo.pagenum = curPage
      this.getCateList()
    },

    // 显示添加分类对话框
    showAddDialog() {
      this.getFatherCate()
      this.addDialogVisible = true
    },
    // 获取二级分类,实际情况应该是动态添加不同分类
    getFatherCate() {
      this.$axios
        .get("categories", {
          params: {
            type: 2,
          },
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取父级分类失败")
            return
          }
          this.fatherCateList = res.data
        })
        .catch((err) => {
          this.$message.info("获取父级分类时,服务器错误")
        })
    },

    // 联级选择器触发的事件
    cascaderChange() {
      if (this.selectedKeys.length > 0) {
        // 这样写便于维护,在这个demo中其实就是第二位的id和levle1
        this.addFormData.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addFormData.cat_level = this.selectedKeys.length - 1
      } else {
        this.addFormData.cat_pid = 0
        this.addFormData.cat_level = 0
      }
    },

    //  对话框确定按钮点击事件触发,添加新分类
    // 想要使用validata方法就必须要为input配置验证规则否则,逻辑上也没有必要验证
    addNewCate() {
      this.$refs.addFormRef
        .validate()
        .then(() => {
          return this.$axios.post("categories", this.addFormData)
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 201) {
            this.$message.error("添加分类失败")
            return
          }
          this.getCateList()
          this.$message.success("添加分类成功")
        })
        .catch((err) => {
          this.$message.info("取消添加分类")
        })
      this.addDialogVisible = false
    },

    // 监听添加分类对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    //-------编辑按钮点击事件
    showEditDialog(row) {
      this.$axios
        .get(`categories/${row.cat_id}`)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取分类失败")
            return
          }
          this.editFormData = res.data
        })
        .catch((err) => {
          this.$message.info("获取分类时服务器错误")
        })
      this.editDialogVisible = true
    },

    //  编辑表单确定按钮点击事件,提交编辑分类
    updataCate() {
      this.$refs.editFormRef
        .validate()
        .then(() => {
          return this.$axios.put(`categories/${this.editFormData.cat_id}`, {
            cat_name: this.editFormData.cat_name,
          })
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("修改分类失败")
            return
          }
          this.getCateList()
          this.$message.success("修改分类成功")
        })
        .catch((err) => {
          this.$message.error("修改分类失败,未填写分类!")
        })
      this.editDialogVisible = false
    },

    //  监听修改分类名对话框关闭事件
    editDialogClosed() {
      // 这里不能重置表单,重置会先于异步执行,导致cat_name被清空
    },

    //--------删除按钮点击事件
    showDeleteDialog(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return this.$axios.delete(`categories/${row.cat_id}`)
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("删除分类失败")
          }
          this.getCateList()
          this.$message({
            type: "success",
            message: "删除分类成功!",
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          })
        })
    },
  },
}
</script>

<style lang="less" scoped>
.addCatebtn {
  margin-bottom: 15px;
}

.el-cascader {
  width: 100%;
}
</style>