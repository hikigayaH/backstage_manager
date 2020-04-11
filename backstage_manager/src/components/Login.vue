<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="@/assets/logo.png" />
      </div>
      <el-form
        label-width="0px"
        :rules="loginFormrules"
        ref="loginform"
        :model="loginform"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginform.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-password"
            v-model="loginform.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginform: {
        username: "admin",
        password: "123456"
      },
      loginFormrules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetform() {
      this.$refs["loginform"].resetFields();
    },
    login() {
      this.$refs["loginform"].validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginform);
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message({
            message: "登录失败",
            type: "error"
          });
        } else {
          let storage = window.sessionStorage;
          storage.setItem("token", res.data.token);
          this.$router.push("/home");
          this.$message({
            message: "登录成功",
            type: "success"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100vh;
  display: flex;
}
.login_box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  margin: auto;
  position: relative;
}
.avatar_box {
  background-color: #fff;
  padding: 10px;
  height: 130px;
  width: 130px;
  border-radius: 50%;
  box-shadow: 0 0 7px #ddd;
  position: absolute;
  left: 50%;
  top: 0px;
  transform: translate(-50%, -50%);
  img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: #eee;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
</style>