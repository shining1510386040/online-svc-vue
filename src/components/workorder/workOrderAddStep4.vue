<template>
  <div>
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="选择问题所属产品"></el-step>
      <el-step title="选择问题类型"></el-step>
      <el-step title="推荐解决方案"></el-step>
      <el-step title="创建工单"></el-step>
    </el-steps>
    <div>
      <el-form ref="form" :model="selectData" label-width="80px">
        <el-form-item label="您已选择">
          <el-input
            prop="productId"
            v-model="selectData.productId"
            type="hidden"
          ></el-input>
          <el-button type="info" plain>{{ selectData.productName }}</el-button>
          <i class="el-icon-arrow-right"></i>
          <el-button type="info" plain>{{ selectData.categoryName }}</el-button>
          <!-- <el-input v-model="selectData.productName" :disabled="true"></el-input> -->
          <el-input
            prop="categoryId"
            v-model="selectData.categoryId"
            type="hidden"
          ></el-input>
          <!-- <el-input v-model="selectData.categoryName" :disabled="true"></el-input> -->
        </el-form-item>
        <el-form-item label="优先级" prop="workOrderType">
          <el-radio-group v-model="selectData.workOrderType">
            <el-radio :label="0">重要</el-radio>
            <el-radio :label="1">普通</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input
            prop="content"
            v-model="selectData.content"
            type="textarea"
            rows="5"
            placeholder="请用一两句话描述您遇到的问题现象"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(selectData)"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import qs from "qs";

export default {
  data() {
    return {
      active: 4,
      selectData: {
        categoryId: "603cd0f7b399c319e47eaa3a",
        categoryName: "服务响应慢",
        productId: "603cd092b399c319e47eaa33",
        productName: "市场云",
        workOrderType: 0,
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 提交表单
    onSubmit(data) {
      console.log("====data:" + JSON.stringify(data));
      axios
        .post("/workOrder/save", qs.stringify(data))
        .then((result) => {
          if (result.status == 200) {
            this.$message({
              message: result.data.returnInfo,
              type: "success",
            });
            // 跳转到我的工单列表页
            this.$router.push({
              path: "/workOrder/list",
              query: {
                status: 0,
              },
            });
          }
        })
        .catch((err) => {});
    },
    // 初始化数据
    initData() {
      // 获取路由传递的参数
      let params = this.$route.query.selectData;
      this.selectData.categoryId = params.categoryId;
      this.selectData.categoryName = params.categoryName;
      this.selectData.productId = params.productId;
      this.selectData.productName = params.productName;
      this.selectData.workOrderType = 0;
      console.log(this.selectData);
    },
  },
};
</script>

<style lang="sass" scoped>
.el-textarea
  width: 50%
</style>
