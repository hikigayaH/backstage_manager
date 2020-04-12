<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightslist" stripe style="width: 100%" border>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="{row}">
            <el-tag :type="tag[row.level].type">{{tag[row.level].name}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightslist: [],
      tag: [
        { name: "一级", type: "" },
        { name: "二级", type: "success" },
        { name: "三级", type: "warning" }
      ]
    };
  },
  created() {
    this.getrightslist();
  },
  methods: {
    async getrightslist() {
      let type = "list";
      const { data: res } = await this.$http.get(`rights/${type}`, type);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("权限列表加载失败");
      }
      this.rightslist = res.data;
    }
  }
};
</script>

<style lang="less" scoped>
</style>