<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addcate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- <el-table  style="width: 100%" border :header-row-style="{'background-color': '#000'}" >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效"></el-table-column>
        <el-table-column prop="cat_level" label="排序"></el-table-column>
        <el-table-column label="操作">
          <template>
          </template>
        </el-table-column>
      </el-table>-->

      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        children-prop="children"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效列 -->
        <template v-slot:isactive="{row}">
          <i
            class="el-icon-success"
            v-if="!row.cat_deleted"
            style="color: #67C23A; font-size: 15px"
          ></i>
          <i class="el-icon-error" v-if="row.cat_deleted" style="color: #F56C6C; font-size: 15px"></i>
        </template>
        <!-- 排序列 -->
        <template v-slot:level="{row}">
          <el-tag v-if="row.cat_level===0">一级</el-tag>
          <el-tag v-if="row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-if="row.cat_level===2" type="warning">三级</el-tag>
        </template>

        <template v-slot:option="{row}">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="modifyCate(row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryinfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addcateVisible" width="50%" @close="closeaddCatedialog">
      <el-form
        :model="addcateForm"
        :rules="addcaterules"
        ref="addcateref"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addcateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedparentid"
            :options="Parentcatelist"
            :props="cascaderProps"
            placeholder="默认为一级分类"
            clearable
            @change="ParentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcateVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitaddcate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="修改分类" :visible.sync="modifyCateVisible" width="50%" @close="closemodify">
      <el-form
        :model="modifyCateForm"
        :rules="modifyCaterules"
        ref="modifyCateref"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="modifyCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitmodify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [],
      total: 0,

      addcateVisible: false,
      modifyCateVisible: false,

      //tree-table的columns配置数组。
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isactive"
        },
        {
          label: "排序",
          type: "template",
          template: "level"
        },
        {
          label: "操作",
          type: "template",
          template: "option"
        }
      ],

      addcateForm: {
        cat_name: "",
        cat_pid: 0,
        //默认添加到一级分类
        cat_level: 0
      },

      addcaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      },

      Parentcatelist: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      selectedparentid: [],

      //以上是添加分类所需要的数据

      modifyCateForm: {
        cat_name: "",
        cat_id: 0,
        cat_pid: 0,
        cat_level: 0
      },

      modifyCaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getcatelist();
  },
  methods: {
    async getcatelist() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.queryinfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      console.log(res);
      this.total = res.data.total;
      this.catelist = res.data.result;
    },
    addcate() {
      this.getparentlist();
      this.addcateVisible = true;
    },

    //页面变化处理
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getcatelist();
    },
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getcatelist();
    },

    submitaddcate() {
      this.$refs["addcateref"].validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            "categories",
            this.addcateForm
          );
          if (res.meta.status !== 201) {
            return this.$message.error("添加分类失败");
          }
          this.$message.success("添加分类成功");
          this.$refs.addcateref.resetFields();
          this.selectedparentid = [];
          this.addcateForm.cat_pid = 0;
          this.addcateForm.cat_level = 0;
          this.getcatelist();
        } else {
          return this.$message.error("表单验证失败");
        }
      });
      console.log(this.addcateForm);
    },
    closeaddCatedialog() {
      this.$refs.addcateref.resetFields();
      this.selectedparentid = [];
      this.addcateForm.cat_pid = 0;
      this.addcateForm.cat_level = 0;
    },
    //获取父级分类数据列表
    async getparentlist() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求父级分类数据列表失败");
      }
      this.Parentcatelist = res.data;
    },
    ParentCateChange() {
      if (this.selectedparentid.length > 0) {
        //有父级分类,获取父级分类id
        this.addcateForm.cat_pid = this.selectedparentid[
          this.selectedparentid.length - 1
        ];
        this.addcateForm.cat_level = this.selectedparentid.length;
      } else {
        //clearable之后并不会重置值，所以要重新设定，或者你在clear事件中重置
        this.addcateForm.cat_pid = 0;
        this.addcateForm.cat_level = 0;
      }
    },

    //以上为添加分类操作的响应函数
    closemodify() {
      this.$refs.modifyCateref.resetFields();
    },

    async modifyCate(id) {
      this.modifyCateVisible = true;
      const { data: res } = await this.$http.get(`categories/${id}`, {
        params: { id }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("查询该分类失败");
      }
      this.modifyCateForm = res.data;
    },

    async submitmodify() {
      const {
        data: res
      } = await this.$http.put(`categories/${this.modifyCateForm.cat_id}`, {
        id: this.modifyCateForm.cat_pid,
        cat_name: this.modifyCateForm.cat_name
      });
      if (res.meta.status !== 200) {
        return this.$message.error("更新失败");
      }
      this.$message.success("更新成功");
      this.getcatelist();
      this.modifyCateVisible = false;
    },

    //以上为编辑分类操作的响应函数

    deleteCate(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          const {data: res} = await this.$http.delete(`categories/${id}`,{id});
          if(res.meta.status !== 200){
            return this.$message.error('删除失败');
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getcatelist();
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
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>