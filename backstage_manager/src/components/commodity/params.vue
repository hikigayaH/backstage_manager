<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意！只允许向第三级分类设置相关属性" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="el-opt">
        <el-col>
          <span style="margin-right: 10px">选择商品分类:</span>
          <el-cascader
            :options="cateList"
            :props="cascaderProps"
            v-model="selectCate"
            @change="handleChange"
            style="width: 20%"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="changetabs">
        <el-tab-pane label="动态参数" name="many">
          <template>
            <el-button type="primary" :disabled="isdisabledadd" @click="addattri">添加参数</el-button>

            <el-table style="width: 100%" border stripe :data="manyList">
              <el-table-column type="expand" label width="50px">
                <template v-slot="{row}">
                  <el-tag
                    v-for="(item,index) in row.attr_vals"
                    :key="index"
                    closable
                    style="margin-right: 10px"
                    @close="closeTag(item,row)"
                    :disable-transitions="false"
                  >{{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#" width="50px"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template v-slot:default="{row}">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="modifyattr(row)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteattr(row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <template>
            <el-button type="primary" :disabled="isdisabledadd" @click="addattri">添加属性</el-button>

            <el-table style="width: 100%" border stripe :data="onlyList">
              <el-table-column type="expand" width="50px">
              <template v-slot="{row}">
                  <el-tag
                    v-for="(item,index) in row.attr_vals"
                    :key="index"
                    closable
                    style="margin-right: 10px"
                    @close="closeTag(item,row)"
                    :disable-transitions="false"
                  >{{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#" width="50px"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称"></el-table-column>
              <el-table-column label="操作">
                <template v-slot:default="{row}">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="modifyattr(row)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteattr(row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加' + titletext"
      :visible.sync="DialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-position="left"
        label-width="100px"
      >
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitattri">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改' + titletext"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeeditDialog"
    >
      <el-form
        :model="editForm"
        :rules="editFormrules"
        ref="editFormref"
        label-position="left"
        label-width="100px"
      >
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiteditattri">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      DialogVisible: false,
      editDialogVisible: false,
      cateList: [],
      cascaderProps: {
        expandTrigger: "hover",
        children: "children",
        value: "cat_id",
        label: "cat_name"
      },
      //级联选择框双向绑定的数组
      selectCate: [],
      activeName: "many",
      manyList: [],
      onlyList: [],
      addForm: {
        attr_name: ""
      },
      editForm: {
        attr_name: "",
        attr_id: 0,
        attr_sel: "many",
        cat_id: 0
      },
      addFormrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      editFormrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getcateList();
  },
  computed: {
    isdisabledadd() {
      if (this.selectCate.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    titletext() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  methods: {
    async getcateList() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败");
      }
      console.log(res.data);
      this.cateList = res.data;
    },
    handleChange() {
      if (this.selectCate.length !== 3) {
        this.selectCate = [];
        this.manyList = [];
        this.onlyList = [];
        return this.$message.error("只能选择三级分类");
      }
      this.getattrlist();
    },
    changetabs() {
      if (this.selectCate.length !== 3) {
        this.manyList = [];
        this.onlyList = [];
        return;
      }
      this.getattrlist();
    },
    async getattrlist() {
      const { data: res } = await this.$http.get(
        `categories/${this.selectCate[this.selectCate.length - 1]}/attributes`,
        {
          params: {
            id: this.selectCate[this.selectCate.length - 1],
            sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      res.data.forEach(item => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        item.inputVisible = false;
        item.inputValue = "";
      });
      if (this.activeName === "many") {
        this.manyList = res.data;
      } else {
        this.onlyList = res.data;
      }
      console.log(res.data);
    },

    addattri() {
      this.DialogVisible = true;
    },
    closeDialog() {
      this.$refs.addFormref.resetFields();
    },
    submitattri() {
      this.$refs.addFormref.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `categories/${
              this.selectCate[this.selectCate.length - 1]
            }/attributes`,
            {
              id: this.selectCate[this.selectCate.length - 1],
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          );
          if (res.meta.status !== 201) {
            return this.$message.error("创建参数失败");
          }
          this.$message.success("创建参数成功");
          this.getattrlist();
          this.DialogVisible = false;
        } else {
          return this.$message.error("参数验证失败");
        }
      });
    },
    async modifyattr(params) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(
        `categories/${this.selectCate[this.selectCate.length - 1]}/attributes/${
          params.attr_id
        }`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("查询参数失败");
      }
      // this.editForm = params;
      this.editForm = res.data;
    },

    deleteattr(attrid) {
      this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${
              this.selectCate[this.selectCate.length - 1]
            }/attributes/${attrid}`,
            { id: this.selectCate[this.selectCate.length - 1], attrid }
          );
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("删除属性失败");
          }
          this.$message.success("删除属性成功");
          this.getattrlist();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submiteditattri() {
      this.$refs.editFormref.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `categories/${
            this.selectCate[this.selectCate.length - 1]
          }/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败");
        }
        this.$message.success("修改参数成功");
        this.getattrlist();
        this.editDialogVisible = false;
      });
    },
    closeeditDialog() {
      this.$refs.editFormref.resetFields();
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      let attr_vals_str = row.attr_vals.join(' ');
      let params = {};
      params.attr_name = row.attr_name;
      params.attr_sel = row.attr_sel;
      params.attr_vals = attr_vals_str;
      params.id = this.selectCate[this.selectCate.length - 1];
      params.attr_id = row.attr_id;
      const {data: res} = await this.$http.put(`categories/${this.selectCate[this.selectCate.length - 1]}/attributes/${row.attr_id}`,params);
      if(res.meta.status !== 200){
        return this.$message.error('添加参数项失败');
      }
      row.inputValue = '';
      row.inputVisible = false;
      this.$message.success("添加参数项成功");
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async closeTag(item, row) {
      row.attr_vals.splice(row.attr_vals.indexOf(item), 1);
      let attr_vals_str = row.attr_vals.join(' ');
      let params = {};
      params.attr_name = row.attr_name;
      params.attr_sel = row.attr_sel;
      params.attr_vals = attr_vals_str;
      params.id = this.selectCate[this.selectCate.length - 1];
      params.attr_id = row.attr_id;
      const {data: res} = await this.$http.put(`categories/${this.selectCate[this.selectCate.length - 1]}/attributes/${row.attr_id}`,params);
      if(res.meta.status !== 200){
        return this.$message.error('删除参数项失败');
      }
      this.$message.success("删除参数项成功");
    }
  }
};
</script>

<style lang="less" scoped>
.el-opt {
  margin: 15px 0;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>