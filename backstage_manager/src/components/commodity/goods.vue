<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearsearch">
            <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(1)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addgoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="200px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="200px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200px">
          <template v-slot="{row}">{{row.add_time | dateFormat}}</template>
        </el-table-column>

        <el-table-column width="180px" label="操作">
          <!-- 修改按钮 -->
          <template v-slot:default="{row}">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="modifygoods(row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deletegoods(row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="编辑商品" :visible.sync="editgoodsVisible" width="50%">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      total: 0,
      editgoodsVisible: false
    };
  },
  created() {
    this.getgoodslist();
  },
  methods: {
    clearsearch() {},
    async getgoodslist() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status !== 200) {
      }
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newpagesize) {
      console.log(newpagesize);
      this.queryInfo.pagesize = newpagesize;
      this.getgoodslist();
    },
    handleCurrentChange(newpagenum) {
      console.log(newpagenum);
      this.queryInfo.pagenum = newpagenum;
      this.getgoodslist();
    },
    clearsearch() {
      this.getgoodslist();
    },
    deletegoods(goodsid) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${goodsid}`, {
            goodsid
          });
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.$message.success("删除成功");
          this.getgoodslist();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addgoods(){
      this.$router.push({name:'addgoods'})
    },
    async modifygoods(goods_id){
      this.editgoodsVisible = true;
      await this.$http.get(`goods/${goods_id}`,{params: {id: goods_id}})
    }
  }
};
</script>

<style lang="less" scoped>
</style>