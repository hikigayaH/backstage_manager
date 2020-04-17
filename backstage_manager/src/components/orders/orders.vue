<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearsearch">
            <el-button slot="append" icon="el-icon-search" @click="getorderlist"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="{row}">
            <el-tag type="danger" v-if="row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="{row}">{{row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column width="180px" label="操作">
          <!-- 修改按钮 -->
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showbox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgbox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="modifyDialogVisible" width="50%" @close="closemodify">
      <el-form
        :model="addressForm"
        :rules="addressFormrules"
        ref="addressFormref"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitmodify">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="ProDialogVisible" width="50%" @close="closemodify">
      <el-form
        :model="addressForm"
        :rules="addressFormrules"
        ref="addressFormref"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
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
import cityData from "./citydata";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 20
      },
      addressForm: {
        address1: [],
        address2: ""
      },
      orderlist: [],
      total: 0,
      modifyDialogVisible: false,
      ProDialogVisible: false,
      addressFormrules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData
    };
  },
  created() {
    this.getorderlist();
  },
  methods: {
    clearsearch() {},
    async getorderlist() {
      const { data: res } = await this.$http.get(`orders`, {
        params: this.queryInfo
      });
      console.log(res);
      this.orderlist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getorderlist();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getorderlist();
    },
    submitmodify() {},
    closemodify() {
      this.$refs.addressFormref.resetFields();
    },
    showbox() {
      this.modifyDialogVisible = true;
    },
    showProgbox(){
      this.ProDialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>