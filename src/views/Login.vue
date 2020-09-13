<template>
  <div class="login">
    <div class="login_content">
      <!-- 头像区域 -->
      <div class="avatar_content">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <!-- 账号 -->
      <!-- 给form表单绑定一个form对象,然后数据就绑定在这个对象的属性上面 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 登录和重置 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    //重置
    resetLoginFrom() {
      this.$refs.loginFormRef.resetFields()
    },
    //登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post("login", this.loginForm)
        if (res.meta.status !== 200)
          return this.$message({
            type: "error",
            message: "登录失败",
          })
        this.$message({
          type: "success",
          message: "登录成功",
        })

        //保存token到SessionStorage
        //除了登录API其他接口都需要在登录以后访问,而且只在登录期间有效,所以存在sessionStorege中
        window.sessionStorage.setItem("token", res.data.token)
        this.$router.push({ name: "home" })
      })
    },
    loginHandle() {
      this.login()
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
  .login_content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    width: 450px;
    height: 300px;
    background-color: #fff;

    .avatar_content {
      box-sizing: border-box;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 1px solid #eee;
      background-color: #fff;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
