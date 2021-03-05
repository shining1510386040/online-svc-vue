<template>
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
    <el-form-item label="优先级">
      <el-radio-group v-model="selectData.workOrderType">
        <el-radio name="workOrderType" label="0">重要</el-radio>
        <el-radio name="workOrderType" label="1">普通</el-radio>
      </el-radio-group>
      <!-- <div>加急处理：查看详情</div> -->
    </el-form-item>
    <el-form-item label="问题描述">
      <el-input
        prop="content"
        v-model="selectData.content"
        type="textarea"
        placeholder="请用一两句话描述您遇到的问题现象"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(selectData)">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "@/utils/axios";
import qs from "qs";

export default {
  data() {
    return {
      selectData: {},
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
          }
        })
        .catch((err) => {});
    },
    // 初始化数据
    initData() {
      // 获取路由传递的参数
      this.selectData = this.$route.query.selectData;
      this.selectData.workOrderType = 0;
    },
  },
};
</script>

<style>
</style>