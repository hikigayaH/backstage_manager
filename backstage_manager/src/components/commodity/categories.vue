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
        class='treeTable'
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
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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
      ]
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
    addcate() {},
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getcatelist();
    },  
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getcatelist();
    }
  }
};
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}
</style>