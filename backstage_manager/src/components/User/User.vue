<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearsearch">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>

        <el-table-column label="状态">
          <template v-slot:default="{row}">
            <el-switch v-model="row.mg_state" @change="changestate(row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column width="180px" label="操作">
          <!-- 修改按钮 -->
          <template v-slot:default="{row}">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyuser(row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteuser(row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closedialog">
      <el-form
        :model="adduser"
        :rules="adduserrules"
        ref="adduserref"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adduser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adduser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adduser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="adduser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduserDia">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户" :visible.sync="modifyDialogVisible" width="50%" @close="closemodify">
      <el-form
        :model="modifyuserdata"
        :rules="modifyuserrules"
        ref="modifyuserref"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="modifyuserdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modifyuserdata.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="modifyuserdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitmodify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkemail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    var checkmobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      modifyDialogVisible: false,
      adduser: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      adduserrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" }
        ]
      },
      modifyuserdata: {
        username: "",
        email: "",
        mobile: ""
      },
      modifyuserrules: {
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getuserlist();
  },
  methods: {
    async getuserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户数据失败");
      } else {
        this.userlist = res.data.users;
        this.total = res.data.total;
        // return this.$message.success('获取用户数据成功')
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getuserlist();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getuserlist();
    },
    async changestate(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state;
        return this.$message.error("状态更改失败");
      }
      return this.$message.success("状态更改成功");
    },
    clearsearch() {
      this.queryInfo.query = "";
      this.getuserlist();
      // console.log('输出')
      // console.log(this.$data)
    },
    closedialog() {
      this.$refs["adduserref"].resetFields();
    },
    adduserDia() {
      this.$refs["adduserref"].validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.adduser);

        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");

        this.addDialogVisible = false;
        this.getuserlist();
      });
    },
    async modifyuser(id) {
      this.modifyDialogVisible = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.modifyuserdata = res.data;
    },
    closemodify() {
      this.$refs["modifyuserref"].resetFields();
    },
    submitmodify() {
      this.$refs["modifyuserref"].validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `users/${this.modifyuserdata.id}`,
          this.modifyuserdata
        );
        this.getuserlist();
        this.$message.success("用户信息修改成功");
        this.modifyDialogVisible = false;
      });
    },
    deleteuser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete(`users/${id}`, id)
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getuserlist();
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "删除失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>