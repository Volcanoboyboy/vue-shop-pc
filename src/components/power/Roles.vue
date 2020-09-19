<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-card>
      <!-- 添加角色 -->
      <el-button class="addRoleBtn" type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesTabelData" border stripe style="width: 100%">
        <el-table-column type="expand">
          <!-- 展开列表 -->
          <template slot-scope="scop">
            <el-row v-for="item1 in scop.row.children" :key="item1.id" class="expand_row">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scop.row.id, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限,通过嵌套row继续分配 -->
              <el-col :span="19">
                <el-row class="expand_row" v-for="item2 in item1.children" :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scop.row.id, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scop.row.id, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template #default="scop">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(scop.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoleById(scop.row.id)"
            >删除</el-button>
            <!-- 分配权限按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="dispatchRights(scop.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="closeAddRoleDialog"
    >
      <!-- 注意绑定数据对象和获取form对象 -->
      <el-form :model="addRoleForm" ref="addRoleFormRef" :rules="editFormRules">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoel">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible">
      <el-form :model="editRoleData" ref="editFormRef" :rules="editFormRules">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="editRoleData.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input v-model="editRoleData.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateEditForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dispatchDialogVisible" @close="closeRightsDialog">
      <el-tree
        :data="allRightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        :props="roleTreeProps"
        ref="rightsTreeRef"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dispatchDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dispatchRoleRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      // ---添加角色数据
      // 添加角色对话框是否可见
      addRoleDialogVisible: false,
      //
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      //  列表数据
      rolesTabelData: [],
      //  编辑对话框表单对象
      editRoleData: {},

      // 编辑对话框是否可见
      editDialogVisible: false,

      // 编辑表单验证规则
      editFormRules: {
        roleName: [
          { required: true, message: "请填写角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请填写角色描述", trigger: "blur" },
        ],
      },
      // 分配权限对话框显示状态
      dispatchDialogVisible: false,
      // 分配权限数据
      allRightsList: [],
      // 角色拥有的权限
      roleTreeProps: {
        children: "children",
        label: "authName",
      },
      //  默认选中的叶子节点,叶子节点选中后,所有父节点会相应选中
      defKeys: [],
      //  当前分配权限角色id
      roleId: "",
    }
  },
  created() {
    this.getRolesData()
  },
  methods: {
    getRolesData() {
      this.$axios
        .get("roles")
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取角色信息失败")
            return
          }
          this.rolesTabelData = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //  监听添加角色对话框关闭事件
    closeAddRoleDialog() {
      //重置表单域
      this.$refs.addRoleFormRef.resetFields()
    },
    //  添加加角色事件
    addRoel() {
      this.$axios
        .post("roles", this.addRoleForm)
        .then(({ data: res }) => {
          if (res.meta.status !== 201) {
            this.$message.error("添加角色失败")
            return
          }
          this.getRolesData()
          this.$message.success("添加角色成功")
        })
        .catch((err) => {
          console.log(err)
        })
      this.addRoleDialogVisible = false
    },
    // 根据权限id删除权限
    removeRightById(roleId, rightId) {
      //  删除这种危险的操作要先确认一下
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((conRes) => {
          return this.$axios.delete(`roles/${roleId}/rights/${rightIds}`)
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message({
              type: "error",
              message: "删除失败",
            })
            return
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          })
        })
        .catch((conErr) => {
          if (conErr === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            })
          }
        })
    },
    // 编辑按钮点击事件-显示对话框-渲染原数据
    editRoles(id) {
      this.$axios
        .get("roles/" + id)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取角色信息失败")
            return
          }
          this.editRoleData = res.data
        })
        .catch((err) => {
          this.$message.error("服务器请求失败")
        })
      this.editDialogVisible = true
    },
    // 确定提交按钮事件,更新角色
    updateEditForm() {
      this.$refs.editFormRef
        .validate()
        .then((valida) => {
          return this.$axios.put("roles/" + this.editRoleData.roleId, {
            roleName: this.editRoleData.roleName,
            roleDesc: this.editRoleData.roleDesc,
          })
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("服务器错误")
            return
          }
          this.getRolesData()
          this.$message.success("修改角色成功")
        })
        .catch((err) => {
          if (!err) {
            this.$message.error("修改角色失败")
          }
        })
      this.editDialogVisible = false
    },
    //  根据角色id删除角色
    deleteRoleById(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return this.$axios.delete(`roles/${id}`)
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("删除角色失败")
            return
          }
          this.getRolesData()
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
    dispatchRights(role) {
      //  拉起对话框时保存当前行id
      this.roleId = role.id
      this.$axios
        .get("rights/tree")
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("获取权限列表失败")
            return
          }
          this.allRightsList = res.data
          this.getLeafKey(role, this.defKeys)
          this.$message.success("获取权限列表成功")
        })
        .catch((err) => {
          this.$message.error("服务器错误")
        })

      this.dispatchDialogVisible = true
    },
    //  递归获取叶子节点
    getLeafKey(node, arr) {
      // 出口
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKey(item, arr))
    },
    // 监听对话框关闭事件
    closeRightsDialog() {
      this.defKeys = []
    },
    // 角色授权
    dispatchRoleRights() {
      const idArr = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
      ]
      const idStr = idArr.join(",")
      this.$axios
        .post(`roles/${this.roleId}/rights`, {
          rids: idStr,
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error("分配用户权限失败")
            return
          }
          this.getRolesData()
          this.$message.success("分配用户权限成功")
          this.dispatchDialogVisible = false
        })
        .catch((err) => {
          this.$message.error("服务器错误")
        })
    },
  },
}
</script>

<style lang="less" scoped>
.addRoleBtn {
  margin-bottom: 15px;
}
.expand_row {
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
</style>