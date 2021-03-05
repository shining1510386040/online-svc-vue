<template>
  <div>
    <el-collapse accordion>
      <el-collapse-item
        v-for="category in categoryList"
        :title="category.categoryName"
         @click.native="listSolution($event,category)"
        :categoryid="category.id"
      >
    
        <div v-for="solution in solutionList">
          {{ solution.solutionTitle }}
        </div>

        <el-button type="primary" @click="onSubmit">创建工单</el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
</style>

<script>
import axios from "@/utils/axios";
import qs from "qs";

// import { getQueryString } from "@/utils/common.js";

// 获取url
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export default {
  data() {
    return {
      categoryList: [
        
      ],
      solutionList: [],
      selectData:{},
    };
  },
  mounted() {
    this.renderData();
  },
  methods: {
    // 渲染数据(问题分类)
    renderData() {
      let params = {
        productId: getQueryString("productId"),
      };
      axios
        .post("/workOrder/belongCategory", qs.stringify(params))
        .then((res) => {
          // console.log(res.data.data);
          this.categoryList = res.data.data;
        });
    },
    // 加载推荐的解决方案：跳转到步骤3
    listSolution(val,category) {
      let params = {
        categoryId: category.id,
      };
      axios.post("/workOrder/listSolution", qs.stringify(params)).then((res) => {
        console.log(res.data.data);
        this.solutionList = res.data.data;
      });
      // 设置选择的值
      this.selectData.productId = category.product.id;
      this.selectData.productName = category.product.productName;
      this.selectData.categoryId = category.id;
      this.selectData.categoryName = category.categoryName
    },
    // 创建工单
    onSubmit(){
      // 跳转到步骤4
      // 路由传参
      this.$router.push({
        path: "/workOrder/add/step4",
        query:{
          selectData:this.selectData
        }
      }
      );
    }
  },
};
</script>