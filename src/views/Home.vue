<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/pig.jpg" alt class="logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 视图 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 折叠按钮 -->
          <div class="toggle-button" @click="toggleMenu">|||</div>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuIcons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
              @click="saveNavStatu('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      menuList: [],
      menuIcons: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      // 可以利用这种方式更简便 this.activeMenuIndex = location.hash.slice(2);
      activePath: sessionStorage.getItem("activePath"),
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    //  退出登录
    logout() {
      window.sessionStorage.removeItem("token")
      this.$router.push({ name: "login" })
    },
    async getMenuList() {
      const { data: res } = await this.$axios.get("menus")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活的状态
    saveNavStatu(activePath) {
      window.sessionStorage.setItem("activePath", activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    padding-left: 0;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div {
      display: flex;
      align-items: center;
      .logo {
        width: 60px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background: #333744;
    .toggle-button {
      background-color: #4a5064;
      font-size: 12px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border: none;
      .iconfont {
        margin-right: 10px;
      }
    }
  }
  .el-main {
    background: #eaedf1;
  }
}
</style>