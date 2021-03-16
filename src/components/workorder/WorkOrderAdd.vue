<template>
  <div>
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-top: 10px"
    >
      <el-step title="选择问题类型"></el-step>
      <!-- <el-step title="推荐解决方案"></el-step> -->
      <el-step title="创建工单"></el-step>
    </el-steps>
    <div class="qq" v-if="active == 1">
      <div v-for="product in productList" :key="product.id" class="flatContent">
        <div>
          <span>{{ product.productName }}</span>
        </div>
        <div>
          <el-button type="plain" plain @click="ask(product)"
            >提问</el-button
          >
        </div>
      </div>
    </div>
    <div class="selectDataForm" v-if="active == 2">
      
      <el-form ref="form" :model="selectData" label-width="80px">
        <span class="sp">您已选择   问题类型 : {{selectData.productName}}</span>
        <el-input
            prop="productId"
            v-model="selectData.productId"
            type="hidden"
          ></el-input>
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

<style  lang="scss" scoped>
.flatContent {
  width: 32%;
  height: 100%;
  align-items: center;
  background: rgb(247, 243, 243);
  display: flex;
  margin-top: 4px;
  justify-content: space-between;
  > div {
    display: flex;
  }
  margin: 10px 0;
}
.qq {
  display: flex;
  flex: 1;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: space-between;
}
.selectDataForm{
  margin: 10vh 13vh 13vh 7vh;
}
.el-textarea{
    width: 50%
}
.sp{
    font-size: 14px;
    color: #606266;
    padding: 0 4vh;
}
</style>

<script>
import axios from "@/utils/axios";
import qs from "qs";

export default {
  components: {},
  data() {
    return {
      active: 1,
      productList: [
        { id: "603cd092b399c319e47eaa34", productName: "社交云" },
        { id: "603cd092b399c319e47eaa44", productName: "服务云" },
      ],
      selectData: {
        productId: "603cd092b399c319e47eaa33",
        productName: "市场云",
        workOrderType: 0,
      },
    };
  },
  mounted() {
    this.renderData();
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
    // 渲染数据
    renderData() {
      let params = {};
      axios.get("/workOrder/belongProduct", params).then((res) => {
        // console.log(res.data.data);
        this.productList = res.data.data;
      });
    },
    // 提问按钮
    ask(product) {
      console.log(product);
      this.active = 2;
      this.selectData.productId = product.id;
      this.selectData.productName = product.productName;
    },
  },
};
</script>