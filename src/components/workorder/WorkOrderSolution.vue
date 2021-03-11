<template>
  <div>
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="已受理"></el-step>
      <el-step title="已处理"></el-step>
      <el-step title="已确认"></el-step>
      <el-step title="待您评价"></el-step>
    </el-steps>
    <div>
      <section>
        <el-table
          :show-header="false"
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          :cell-style="columnStyle"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column width="180" prop="name"></el-table-column>
          <el-table-column prop="amount1"></el-table-column>
          <el-table-column width="180" prop="amount2"></el-table-column>
          <el-table-column prop="amount3"></el-table-column>
          <el-table-column width="180" prop="amount4"></el-table-column>
          <el-table-column prop="amount5"></el-table-column>
        </el-table>
      </section>
    </div>
    <div class="communicate">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>提交解决方案</span>
        </div>
        <div>
          <el-form
            :model="solutionForm"
            :rules="rules"
            ref="solutionForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="解决方案标题" prop="solutionTitle">
              <el-input
                type="textarea"
                v-model="solutionForm.solutionTitle"
              ></el-input>
            </el-form-item>
            <el-form-item label="解决方案内容" prop="solutionContent">
              <el-input
                type="textarea"
                v-model="solutionForm.solutionContent"
              ></el-input>
            </el-form-item>
            <el-form-item label="设置为推荐" prop="isRecommended">
              <el-radio-group v-model="solutionForm.isRecommended">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('solutionForm')"
                >增加解决方案</el-button
              >
              <el-button @click="resetForm('solutionForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import qs from "qs";

import { formatDate } from "@/utils/common.js";

export default {
  data() {
    return {
      id: this.$route.query.id,
      // 到步骤几
      active: 3,
      workOrderData: {},
      solutionForm: {
        isRecommended: 0,
      },
      rules: {
        solutionTitle: [
          { required: true, message: "请输入解决方案标题", trigger: "blur" },
        ],
        solutionContent: [
          { required: true, message: "请输入解决方案内容", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    //因为数据用到了workOrderData中的数据，所以写在了computed中
    tableData() {
      return [
        {
          name: "问题描述",
          amount1: this.workOrderData.content,
          amount2: "工单编号",
          amount3: this.workOrderData.workOrderNo,
          amount4: "工单类型",
          amount5: this.workOrderData.workOrderType,
        },
        {
          name: "提交账号",
          amount1: this.workOrderData.submitAccount,
          amount2: "提交时间",
          amount3: formatDate(
            new Date(this.workOrderData.submitTime),
            "yyyy-MM-dd hh:mm:ss"
          ),
          amount4: "状态",
          amount5: this.workOrderData.workOrderStatus,
        },
      ];
    },
  },
  methods: {
    // 加载详情数据
    renderData() {
      axios
        .get("/workOrder/getDetail?id=" + this.id)
        .then((result) => {
          console.log(result.data.data);
          this.workOrderData = result.data.data;
        })
        .catch((err) => {});
    },
    // 自定义列背景色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1 || columnIndex == 3 || columnIndex == 5) {
        //第三第四列的背景色就改变了2和3都是列数的下标
        return "background:#f3f6fc;";
      } else {
        return "background:#ffffff;";
      }
    },
    // 和并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {},
    // 提交解决方案
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = new Object();
          params.id = this.id;
          params.solutionTitle = this.solutionForm.solutionTitle;
          params.solutionContent = this.solutionForm.solutionContent;
          params.isRecommended = this.solutionForm.isRecommended;
          console.log(params);
          axios
            .post("/workOrder/solveAndCloseWorkOrder", qs.stringify(params))
            .then((result) => {
              if (result.data.returnCode == "200") {
                this.$message({
                  showClose: true,
                  message: result.data.returnInfo,
                  type: "success",
                });
              } else if (result.data.returnCode == "500") {
                this.$message({
                  showClose: true,
                  message: result.data.returnInfo,
                  type: "warning",
                });
              }
            })
            .catch((err) => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  mounted() {
    console.log(this.id);
    this.renderData();
  },
  filters: {
    // 格式化日期
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
  