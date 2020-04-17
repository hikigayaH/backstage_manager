<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :active="activeName - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品信息"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeName"
          :before-leave="beforeLeave"
          @tab-click="tabclick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{ expandTrigger: 'hover', value:'cat_id',label:'cat_name' }"
                @change="handleChange"
                style="width: 20%"
                placeholder="必须选择三级分类"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(attr_val,index) in item.attr_vals"
                  :key="index"
                  :label="attr_val"
                  border
                  size="small"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="headers"
              :on-success="successaccept"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="submitadd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog :visible.sync="PreviewDialogVisible" title="图片预览" width="50%">
      <img :src="previewpath" style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      activeName: "0", //此处可以用@tab-click,获得index
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      addFormrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品种类", trigger: "blur" }
        ]
      },
      catelist: [],
      //动态参数列表
      manyTableData: [],
      onlyTableData: [],
      fileList: [],
      headers: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewpath: "",
      PreviewDialogVisible: false
    };
  },
  created() {
    this.getcatelist();
  },
  methods: {
    async getcatelist() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) {
        return this.$message.error("请求分类列表失败");
      }
      this.catelist = res.data;
    },
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeLeave(activeName, oldactiveName) {
      if (oldactiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.warning("商品分类选择不正确");
        return false;
      }
    },
    async tabclick() {
      if (this.activeName === "1") {
        const { data: res } = await this.$http.get(
          `categories/${
            this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
          }/attributes`,
          {
            params: {
              id: this.addForm.goods_cat[this.addForm.goods_cat.length - 1],
              sel: "many"
            }
          }
        );
        if (res.meta.status !== 200) {
          return;
        }
        this.manyTableData = res.data;
        this.manyTableData.forEach(item => {
          if (item.attr_vals !== "") {
            item.attr_vals = item.attr_vals.split(" ");
          }
        });
        console.log(this.manyTableData);
      } else if (this.activeName === "2") {
        const { data: res } = await this.$http.get(
          `categories/${
            this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
          }/attributes`,
          {
            params: {
              id: this.addForm.goods_cat[this.addForm.goods_cat.length - 1],
              sel: "only"
            }
          }
        );
        if (res.meta.status !== 200) {
          return;
        }
        this.onlyTableData = res.data;
        console.log(res);
      }
    },
    handleRemove(file, fileList) {
      const filePath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(item => item.pic === filePath);
      console.log(index);
      this.addForm.pics.splice(index, 1);
      console.log(this.addForm.pics);
    },
    handlePreview(file) {
      this.previewpath = file.response.data.url;
      this.PreviewDialogVisible = true;
    },
    successaccept(respone) {
      const picsinfo = { pic: respone.data.tmp_path };
      this.addForm.pics.push(picsinfo);
      console.log(this.addForm);
    },
    async submitadd() {
      console.log(this.addForm);
      this.$refs.addFormref.validate(valid => {
        if (!valid) {
          this.$message.error("必要信息不完整");
        }
      });
      this.manyTableData.forEach(item => {
        const manyinfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(" ")
        };
        this.addForm.attrs.push(manyinfo);
      });
      this.onlyTableData.forEach(item => {
        const onlyinfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
        this.addForm.attrs.push(onlyinfo);
      });
      const Form = _.cloneDeep(this.addForm);
      Form.goods_cat = Form.goods_cat.join();
      console.log(Form);
      const {data:res} = await this.$http.post('goods', Form);
      console.log(res);
      if(res.meta.status !== 201 ){
        return this.$message.error('添加商品失败')
      }
      this.$message.success('添加商品成功');
      this.$router.push('/goods');
    }
  }
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0px !important;
  margin-right: 10px !important;
}
</style>