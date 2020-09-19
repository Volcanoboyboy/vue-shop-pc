<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cascader_row">
        <el-col>
          <span>选择商品分类:&nbsp;</span>
          <el-cascader
            :options="cateList"
            :props="cascaderProps"
            clearable
            @change="cascaderHandleChange"
            v-model="selectedCateKeys"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisable" @click="showAddDialog">添加参数</el-button>
          <el-table :data="manyTableData" style="width: 100%" border stripe class="propsTable">
            <!-- 扩展列 -->
            <el-table-column type="expand">
              <template #default="scop">
                <el-tag
                  class="params_tag"
                  v-for="(item, i) in scop.row.attr_vals"
                  :key="i"
                  closable
                  @close="clearTag(i, scop.row)"
                >{{item}}</el-tag>
                <!-- !!!这里用到的keyup原生事件是需要用native修饰符的 -->
                <el-input
                  v-model="scop.row.inputValue"
                  v-if="scop.row.inputVisible"
                  ref="newTagInputRef"
                  size="small"
                  class="add_tag_input"
                  @keyup.enter.native="addInputHandler(scop.row)"
                ></el-input>
                <el-button
                  v-else
                  type="primary"
                  class="button-new-tag"
                  size="small"
                  @click="addNewTag(scop.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisable">添加属性</el-button>
          <el-table :data="onlyTableData" style="width: 100%" border stripe class="propsTable">
            <el-table-column type="expand">
              <template #default="scop">
                <el-tag
                  class="params_tag"
                  v-for="(item, i) in scop.row.attr_vals"
                  :key="i"
                  closable
                  @close="clearTag(i, scop.row)"
                >{{item}}</el-tag>
                <!-- !!!这里用到的keyup原生事件是需要用native修饰符的 -->
                <el-input
                  v-model="scop.row.inputValue"
                  v-if="scop.row.inputVisible"
                  ref="newTagInputRef"
                  size="small"
                  class="add_tag_input"
                  @keyup.enter.native="addInputHandler(scop.row)"
                ></el-input>
                <el-button
                  v-else
                  type="primary"
                  class="button-new-tag"
                  size="small"
                  @click="addNewTag(scop.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      @close="closeParamsDialog"
    >
      <el-form :model="editForm" ref="editParamsFormRef" :rules="paramsFormRules">
        <el-form-item :label="titleText" label-width="80px" prop="attr_name">
          <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateParamsInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" @close="closeAddDialog">
      <el-form :model="addForm" ref="addParamsFormRef" :rules="addFormRules">
        <el-form-item :label="titleText" label-width="80px" prop="attr_name">
          <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "params",
  data() {
    return {
      //  所有商品分类
      cateList: [],
      //  联级选项配置
      cascaderProps: {
        label: "cat_name",
        children: "children",
        value: "cat_id",
      },

      // ----------选项卡数据
      activeName: "many",
      //  动态参数表格数据
      manyTableData: [],
      // 静态参数表格数据
      onlyTableData: [],
      //  联级选择器双向绑定的值
      selectedCateKeys: [],

      //----------编辑对话框数据
      // 编辑对话框是否可见
      editDialogVisible: false,
      // 编辑对话框参数或者属性
      editForm: {
        attr_name: "",
      },
      // 表单验证规则
      paramsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      //-----------添加对话框参数
      //  编辑对话框是否可见
      addDialogVisible: false,
      //  添加参数表单数据
      addForm: {
        attr_name: "",
      },
      // 验证规则
      addFormRules: {
        // 这里的验证规则名要和表单数据要验证的字段一致
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    }
  },
  computed: {
    //  添加标签是否禁用,因为只可以为三级分类设置相关参数
    isDisable() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 三级选项的id,因为绑定的值selectedCateKeys就是一个包含所有级别id的数组
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数"
      } else {
        return "静态属性"
      }
    },
  },
  created() {
    this.getCategories()
  },
  methods: {
    getCategories() {
      this.$axios
        .get("categories")
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取商品分类失败")
            return
          }
          this.cateList = res.data
        })
        .catch((err) => {
          this.$message.info("服务器错误")
        })
    },
    // 标签页触发事件
    tabHandleClick() {
      this.getParamsData()
    },
    // 联级选择器触发事件
    cascaderHandleChange() {
      // 可以看一下selectedCateKeys数组
      // console.log(this.selectedCateKeys)
      this.getParamsData()
    },

    //  获取参数列表,主要是要判断否是是三级参数,还有根据选项的卡绑定的值请求对应参数的数据
    //  注意判断id值和activeName,发起的请求需求是不一样的
    getParamsData() {
      // 判断不是三级属性,应为如果选中的是三级属性,那长度就是3,组件的属性就是这样
      if (this.selectedCateKeys.length !== 3) {
        this.manyTableData = []
        this.onlyTableData = []
        this.selectedCateKeys = []
        return
      }

      // 如果选的三级参数
      this.$axios
        .get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName,
          },
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取相关参数失败")
            return
          }
          //!!!!这里要把res.data数组里面的attr_vals 处理下一下,原本是用 “ ” 隔开的字符串字段,但是不便我们用标签显示,所以处理为数组
          //!!!!! 这里同时要给数据带上一个inputVisible的布尔值用于和New_Tagbutton交替显示,因为每一个扩展的input都是独立的,所以要分别给这个值,这样定义在每一行的数据上是最合理的
          //同样input的值也可以给每一行数据绑定一个属性,这样最方便

          // 处理row.attr_vals成数组便于显示
          res.data.forEach((item) => {
            // 这里要注意api文档里面的说明,many和only的attr_vals字符串连接是不一样的
            item.attr_vals = item.attr_vals
              ? this.activeName === "many"
                ? item.attr_vals.split(",")
                : item.attr_vals.split(" ")
              : []
            //    控制input框是否显示
            item.inputVisible = false
            //  用户绑定input的值
            item.inputValue = ""
          })
          // 根据不同选项卡渲染不同的表格
          if (this.activeName === "many") {
            this.manyTableData = res.data
          } else {
            this.onlyTableData = res.data
          }
        })
        .catch((err) => {
          this.$message.error("服务器错误")
        })
    },

    // 显示编辑对话框按钮事件
    showEditDialog(atrrId) {
      // 这里接口文档有一句: attr_vals:如果是 many 就需要填写值的选项，以逗号分隔
      this.$axios
        .get(`categories/${this.cateId}/attributes/${atrrId}`, {
          params: {
            attr_sel: this.activeName,
          },
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取参数失败")
            return
          }
          this.editForm = res.data
        })
        .catch((err) => {
          this.$message.info("服务器错误")
        })
      this.editDialogVisible = true
    },

    // 提交编辑参数修改结果
    updateParamsInfo() {
      this.$refs.editParamsFormRef
        .validate()
        .then((valida) => {
          return this.$axios.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName,
              attr_vals: "", //  可选参数
            }
          )
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            //
            this.$message.error("修改参数失败,不知道是接口错了还是什么")
            return
          }
          this.getParamsData()
          this.$message.success("修改参数成功")
        })
        .catch((err) => {
          this.$message.info("服务器错误")
        })
      this.editDialogVisible = false
    },

    // 监听编辑对话框关闭事件,重置表单
    closeParamsDialog() {
      // this.$refs.editParamsFormRef.resetFields()
    },

    // ---------添加参数事件等
    // 显示添加参数对话框
    showAddDialog() {
      this.addDialogVisible = true
    },

    // 提交新参数
    addParamsInfo() {
      this.$refs.addParamsFormRef
        .validate()
        .then((valida) => {
          return this.$axios.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          })
        })
        .then(({ data: res }) => {
          console.log(res, "params页面")
          if (res.meta.status !== 200) {
            this.$message.error("添加参数失败")
            return
          }
          this.getParamsData()
          this.$message.success("添加参数成功")
          //  千万要注意
        })
        .catch((err) => {
          this.$message.info("取消添加")
        })
      this.addDialogVisible = false
    },

    // 监听添加参数对话框关闭事件
    closeAddDialog() {
      this.$refs.addParamsFormRef.resetFields()
    },

    // 删除参数或属性按钮点击事件
    removeParams(id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return this.$axios.delete(
            `categories/${this.cateId}/attributes/${id}`
          )
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("删除参数失败")
            return
          }
          this.getParamsData()
          this.$message({
            type: "success",
            message: "删除成功!",
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          })
        })
    },

    // 标签清除事件
    clearTag(i, row) {
      row.attr_vals.splice(i, 1)
      this.putParams(row)
    },
    // 添加标签按钮处理事件
    addNewTag(row) {
      row.inputVisible = true
      // 这样虽然渲染了input但是没有自动focus
      // 自动聚焦要用到nextTick,不清楚先不写了哈哈哈哈
      this.$nextTick(() => {
        this.$refs.newTagInputRef.focus()
      })
    },
    //  添加标签
    addInputHandler(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ""
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.putParams(row)
      row.inputValue = ""
      row.inputVisible = false
    },

    // 编辑提交参数
    putParams(row) {
      this.$axios
        .put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals:
            row.attr_sel === "many"
              ? row.attr_vals.join(",")
              : row.attr_vals.join(" "),
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("编辑参数失败")
            return
          }
          // 这里可以不刷新
          // this.getParamsData()
          this.$message.success("编辑参数成功")
        })
        .catch((err) => {
          this.$message.info("服务器错误")
        })
    },
  },
}
</script>

<style lang="less" scoped>
.cascader_row {
  margin: 15px 0;
}
.propsTable {
  margin-top: 15px;
}
.add_tag_input {
  width: 120px;
}
.params_tag {
  margin-right: 10px;
}
</style>