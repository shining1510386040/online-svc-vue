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

    <el-tag
      v-for="product in productList"
      :key="product.id"
      @click="ask($event, product.id)"
      type="success"
    >
      {{ product.productName }}
      提问
    </el-tag>
  </div>
</template>

<style scoped>
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
    };
  },
  mounted() {
    this.renderData();
  },
  methods: {
    // 渲染数据
    renderData() {
      let params = {};
      axios.get("/workOrder/belongProduct", params).then((res) => {
        // console.log(res.data.data);
        this.productList = res.data.data;
      });
    },
    // 提问按钮
    ask(e, id) {
      // 跳转到step2
      this.$router.push({
        path: "/workOrder/add/step2",
        query: {
          productId: id,
          index: 2,
        },
      });

      // 修改父vue的值（事件，参数）
      // this.$emit("changeActiveData",2,id);
    },
  },
};
</script>