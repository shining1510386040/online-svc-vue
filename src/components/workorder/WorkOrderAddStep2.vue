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

    <el-row :gutter="20">
      <el-col :span="12"
        ><div class="grid-content bg-purple">
          <el-collapse accordion>
            <el-collapse-item
              v-for="category in categoryList"
              :title="category.categoryName"
              @click.native="listSolution($event, category)"
              :categoryid="category.id"
            >
              <div v-for="solution in solutionList">
                <el-button type="text" @click="showSolutionContent(solution)">{{
                  solution.solutionTitle
                }}</el-button
                ><i class="el-icon-arrow-right"></i>
              </div>

              <el-button type="primary" @click="onSubmit">创建工单</el-button>
            </el-collapse-item>
          </el-collapse>
        </div></el-col
      >
      <el-col :span="12"
        ><div class="grid-content bg-purple">
          <el-card class="box-card" v-show="solutionContentShow">
            <div slot="header" class="clearfix">
              <span>{{ solution.solutionTitle }}</span>
            </div>
            {{ solution.solutionContent }}
          </el-card>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<style scoped>
.solutionContent {
  overflow: hidden;
}
</style>

<script>
import axios from "@/utils/axios";
import qs from "qs";

// import { getQueryString } from "@/utils/common.js";

// // 获取url
// function getQueryString(name) {
//   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//   var r = window.location.search.substr(1).match(reg);
//   if (r != null) return unescape(r[2]);
//   return null;
// }

export default {
  data() {
    return {
      categoryList: [],
      solutionList: [],
      selectData: {},
      solution: {
        solutionTitle: "解决方案",
        solutionContent: "重启服务器",
      },
      solutionContentShow: false,
      productId: this.$route.query.productId,
      active: 2,
    };
  },
  mounted() {
    this.renderData();
  },
  methods: {
    // 显示具体的解决方案
    showSolutionContent(solution) {
      console.log(solution);
      this.solution = solution;
      let msg = this.solution.solutionId;
      console.log(msg);
      if (
        Object.keys(msg).length !== 0 &&
        typeof msg !== "undefined" &&
        msg != 0
      ) {
        this.solutionContentShow = true;
      } else {
        this.solutionContentShow = false;
      }

      // 设置为步骤3
      this.active =3
    },
    // 渲染数据(问题分类)
    renderData() {
      let params = {
        productId: this.productId,
      };
      axios
        .post("/workOrder/belongCategory", qs.stringify(params))
        .then((res) => {
          // console.log(res.data.data);
          this.categoryList = res.data.data;
        });
    },
    // 加载推荐的解决方案：跳转到步骤3
    listSolution(val, category) {
      let params = {
        categoryId: category.id,
      };
      axios
        .post("/workOrder/listSolution", qs.stringify(params))
        .then((res) => {
          console.log(res.data.data);
          this.solutionList = res.data.data;
        });
      // 设置选择的值
      this.selectData.productId = category.product.id;
      this.selectData.productName = category.product.productName;
      this.selectData.categoryId = category.id;
      this.selectData.categoryName = category.categoryName;
    },
    // 创建工单
    onSubmit() {
      // 跳转到步骤4
      // 路由传参
      this.$router.push({
        path: "/workOrder/add/step4",
        query: {
          selectData: this.selectData,
        },
      });
    },
  },
};
</script>