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
      <el-row :gutter="14">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="clearHandel">
            <!-- input的slot配置input的放置内容的位置 -->
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <!-- 这里给table指定数据数组,然后在列指定属性,然后table就会自动按数组项生成行 -->
      <el-table border stripe :data="userList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!--这里利用作用域插槽的row属性可以拿到当前行的内容 -->
            <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scop">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserInfo(scop.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scop.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">
      <!-- 注意绑定数据对象和获取form对象 -->
      <el-form :model="addForm" ref="addFormRef" :rules="userInfoFormRules">
        <el-form-item label="用户名" label-width="70px" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="70px" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="70px" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="EditdialogVisible" @close="closeEditDialog">
      <el-form :model="editForm" ref="editFormRef" :rules="userInfoFormRules">
        <el-form-item label="用户名" label-width="70px">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="70px" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="70px" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersInfo()
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        callback()
      }
      callback(new Error("请输入正确的邮箱"))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        callback()
      }
      callback(new Error("请输入正确的手机号"))
    }
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      //  用户
      userList: [],
      //  总数据条
      total: 0,
      //  添加用户对话框是否可见
      addDialogVisible: false,

      // 修改用户信息对话框不可见
      EditdialogVisible: false,
      // 新增管理员信息
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //  修改用户信息
      editForm: {},
      //  添加用户表单验证规则,理论上是可以通用的,我就不重新写了
      userInfoFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    }
  },
  methods: {
    async getUsersInfo() {
      // 注意这里传参格式
      const { data: res } = await this.$axios.get("users", {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "获取管理员数据失败",
        })
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    async changeUserState(userInfo) {
      //  发起put请求修改状态,这里要求带在地址中
      const { data: res } = await this.$axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error("更新状态失败")
      }
      this.$message.success("更新状态成功")
    },
    //  每页显示内容改变回调
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersInfo()
    },
    //  当前页改变回调
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getUsersInfo()
    },
    //  搜索用户
    searchUser() {
      this.getUsersInfo()
    },
    //  清除搜索的时候重新渲染全部数据
    clearHandel() {
      this.getUsersInfo()
    },
    //  添加用户对话框关闭事件
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
    },
    //  对话框确认事件--发起请求添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post("users", this.addForm)
        if (res.meta.status !== 201) return this.$message.error("添加用户失败")
        this.$message.success("添加用户成功")
        this.getUsersInfo()
        this.closeDialog()
        this.dialogFormVisible = false
      })
    },
    // 修改按钮点击事件
    async editUserInfo(id) {
      const { data: res } = await this.$axios.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败")
      }
      this.editForm = res.data
      this.EditdialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    closeEditDialog() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改用户信息
    updateUserInfo() {
      this.$refs.editFormRef
        .validate()
        .then((valida) => {
          return this.$axios.put("users/" + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          })
        })
        .then(({ data: res }) => {
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error("更新用户信息失败")
            return
          }
          this.EditdialogVisible = false
          this.getUsersInfo()
          this.$message.success("更新用户信息成功")
        })
        .catch((valida) => {
          // this.$message.error("请输入正确的信息")
        })
    },
    //  根据id删除用户,给一个confirm,删除写在comfir的回调里面
    removeUserById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((resConfirm) => {
          this.$axios.delete("users/" + id).then(({ data: res }) => {
            if (res.meta.status !== 200) {
              this.$message.error("删除失败")
            }
            this.getUsersInfo()
            this.$message.success("删除成功")
          })
        })
        .catch((errConfirm) => {
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
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>