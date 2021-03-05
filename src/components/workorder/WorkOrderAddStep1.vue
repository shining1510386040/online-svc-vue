<template>
  <div>
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
  // // 接收父组件的值
  // props:{
  //   active: Number,
  // },
  components:{},
  data() {
    return {
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
      this.$router.push("/workOrder/add/step2?productId=" + id);
      
      // 修改父vue的值（事件，参数）
      this.$emit("changeActiveData",2);
    },
  },
};
</script>