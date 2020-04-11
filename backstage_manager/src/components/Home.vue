<template>
  <div>
    <!-- <el-button type="primary" @click="exit">退出</el-button> -->
    <el-container class="page">
      <el-header class="header">
        <div class="avatar">
          <el-avatar icon="el-icon-user-solid"></el-avatar>
          <span style="color:#fff; vertical-align: middle; font-size:22px ">电商后台管理系统</span>
        </div>

        <el-button type="info" @click="exit" class="exit_btn">退出</el-button>
      </el-header>
      <el-container class="body">
        <el-aside :width="asidewidth" class="asider">
          <div class="toggle-button" @click="toggleCollapse">
            <i class="el-icon-more" style="font-size: 25px; color: #fff; margin: auto"></i>
          </div>
          <el-menu
            :collapse-transition="false"
            :collapse="iscollapse"
            background-color="#323744"
            text-color="#fff"
            active-text-color="#369BFF"
            :unique-opened="true"
            style="border-right: 0"
            router
            :default-active="$route.path"
          >
            <el-submenu
              v-for="(firstitem, firstindex) in menuslist"
              :key="firstitem.id"
              :index="firstindex + ''"
            >
              <template slot="title">
                <i :class="['iconfont',iconlist[firstitem.id]]"></i>
                <span style="margin-left: 10px">{{firstitem.authName}}</span>
              </template>
              <el-menu-item
                :index="'/'+seconditem.path"
                v-for="(seconditem) in firstitem.children"
                :key="seconditem.id"
              >
                <template>
                  <i class="el-icon-menu"></i>
                  <span>{{seconditem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuslist: [],
      iconlist: {
        "125": "icon-member",
        "103": "icon-lifangtilitiduomiantifangkuai",
        "101": "icon-shangpingouwudai2",
        "102": "icon-danju-tianchong",
        "145": "icon-baobiao"
      },
      iscollapse: true,
      asidewidth: "64px"
    };
  },
  created() {
    this.getmenuslist();
  },
  methods: {
    exit() {
      window.sessionStorage.clear();
      this.$router.replace("/login");
    },
    async getmenuslist() {
      const { data: res } = await this.$http.get("menus");
      console.log(res);
      if (res.meta.status === 200) {
        this.menuslist = res.data;
      } else {
        return this.$message.error(res.meta.msg);
      }
    },
    //侧边栏折叠展开
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
      if (this.iscollapse) {
        this.asidewidth = 64 + "px";
      } else {
        this.asidewidth = 200 + "px";
      }
    }
  }
};
</script>

<style lang='less' scoped>
.page {
  height: 100vh;
}
.header {
  background-color: #373c41;
  display: flex;
  position: relative;
}
.avatar {
  display: inline-block;
  margin: auto 0;
}
.el-avatar {
  vertical-align: middle;
  margin-right: 20px;
}
.el-aside {
  background-color: #323744;
}
.el-main {
  background-color: #eaedf2;
}
.exit_btn {
  //   margin: auto 0;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-20px, -50%);
}
.toggle-button {
  display: flex;
  background-color: #4a5063;
  height: 30px;
}
</style>