<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addroles">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleslist" style="width: 100%" border stripe>
        <el-table-column type="expand" label width="50px">
          <template v-slot="{row}">
            <el-row
              v-for="(item1,index1) in row.children"
              :key="item1.id"
              :class="['firstrights','border-bottom',index1 === 0? 'border-top' : '']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removetag(row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                  :class="['secondrights',index2 === item1.children.length-1? '' : 'border-bottom']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removetag(row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="removetag(row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色叙述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="{row}">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="modifyroles(row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteroles(row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRightDialog(row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addrolesVisible" width="50%" @close="closeadddialog">
      <el-form
        :model="rolesForm"
        :rules="addrolesrules"
        ref="addrolesref"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色叙述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addrolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitaddroles">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改角色"
      :visible.sync="modifyrolesVisible"
      width="50%"
      @close="closemodifydialog"
    >
      <el-form
        :model="modifyrolesForm"
        :rules="modifyrolesrules"
        ref="modifyrolesref"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="modifyrolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色叙述" prop="roleDesc">
          <el-input v-model="modifyrolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyrolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitmodifyroles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限  -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisiable"
      width="50%"
      @close="resetrightsdef"
    >
      <el-tree
        ref="rightstreeref"
        :data="rightstree"
        :default-checked-keys="defKey"
        :props="rightsprops"
        show-checkbox
        node-key="id"
        default-expand-all
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //默认勾选数组
      defKey: [],
      rightsprops: {
        label: "authName",
        children: "children"
      },
      rightstree: [],
      roleslist: [],
      rolesForm: {
        roleName: "",
        roleDesc: ""
      },
      modifyrolesForm: {
        roleName: "",
        roleDesc: ""
      },
      addrolesVisible: false,
      modifyrolesVisible: false,
      setRightDialogVisiable: false,
      addrolesrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      modifyrolesrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getroleslist();
  },
  methods: {
    async getroleslist() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("加载角色列表出错");
      }
      this.roleslist = res.data;
    },
    addroles() {
      this.addrolesVisible = true;
    },
    closeadddialog() {
      this.$refs["addrolesref"].resetFields();
    },
    async submitaddroles() {
      const { data: res } = await this.$http.post("roles", this.rolesForm);
      if (res.meta.status !== 201) {
        return this.$message.error("添加角色失败");
      }
      this.getroleslist();
      this.$message.success("添加角色成功");
      this.addrolesVisible = false;
    },
    async modifyroles(id) {
      this.modifyrolesVisible = true;
      const { data: res } = await this.$http.get(`roles/${id}`, id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色信息失败");
      }
      this.modifyrolesForm = res.data;
    },
    async submitmodifyroles() {
      const { data: res } = await this.$http.put(
        `roles/${this.modifyrolesForm.roleId}`,
        this.modifyrolesForm
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("修改失败");
      }
      this.getroleslist();
      this.$message.success("修改成功");
      this.modifyrolesVisible = false;
    },
    closemodifydialog() {
      this.$refs["modifyrolesref"].resetFields();
    },
    deleteroles(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$http
            .delete(`roles/${id}`, id)
            .then(res => {
              console.log(res);
              this.$message.success("删除成功");
              this.getroleslist();
            })
            .catch(() => {
              return this.$message.warning("删除失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    removetag(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "删除权限", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then(res => {
              console.log(role);
              role.children = res.data.data;
              this.$message.success("删除权限成功");
            })
            .catch(() => {
              return this.$message.error("删除权限失败");
            });
        })
        .catch(() => {
          return this.$message.info("已取消删除该权限");
        });
    },
    showRightDialog(role) {
      this.roleId = role.id;//保存当前修改角色的id
      //获取所有权限
      this.$http
        .get("rights/tree", "tree")
        .then(res => {
          this.rightstree = res.data.data;
          this.getLeafKeys(role, this.defKey);
          this.setRightDialogVisiable = true;
        })
        .catch(() => {
          return this.$message.error("获取权限列表失败");
        });
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      } else {
        node.children.forEach(element => {
          this.getLeafKeys(element, arr);
        });
      }
    },
    resetrightsdef() {
      this.defKey = [];
    },
    allotRights() {
      const keys = [
        ...this.$refs["rightstreeref"].getCheckedKeys(),...this.$refs["rightstreeref"].getHalfCheckedKeys()
      ];
      const idStr = keys.join(',');
      this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}).then((res)=>{
        this.$message.success('分配权限成功');
        this.setRightDialogVisiable = false;
      }).catch(()=>{
        this.$message.error('分配权限失败');
      })
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.border-top {
  border-top: 1px solid #eee;
}
.firstrights {
  display: flex;
  align-items: center;
}
.secondrights {
  display: flex;
  align-items: center;
}
</style>