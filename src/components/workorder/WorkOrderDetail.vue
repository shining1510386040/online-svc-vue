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
          <span>沟通记录</span>
        </div>
        <div
          style="padding: 15px"
          v-for="communicate in workOrderData.communicateRecordList"
          :key="communicate.communicateRecordId"
          class="q"
        >
          <div class="left">
            <div>
              <div>
                <span
                  ><el-avatar
                    :src="require('@/assets/img/icons8-woman.png')"
                  ></el-avatar
                ></span>
                &nbsp; <span>{{ communicate.feedbackAccount }}</span> &nbsp;
                <span>{{ communicate.feedbackTime | formatDate }}</span>
              </div>
              <div>
                <span>{{ communicate.leaveMessage }}</span>
              </div>
            </div>
          </div>
          <div class="right">
            <div>
              <div>
                <span
                  ><el-avatar
                    :src="require('@/assets/img/icons8-man.png')"
                  ></el-avatar
                ></span>
                &nbsp; <span>{{ communicate.replyAccount }}</span> &nbsp;
                <span>{{ communicate.replyTime | formatDate }}</span>
              </div>
              <div>
                <span>{{ communicate.replayMessage }}</span>
              </div>
            </div>
          </div>
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0) {
      //   if (rowIndex % 2 === 0) {
      //     return {
      //       rowspan: 2,
      //       colspan: 0,
      //     };
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0,
      //     };
      //   }
      // }
    },
  },
  mounted() {
    console.log(this.id);
    this.renderData();
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped>
.communicate {
  margin-top: 15px;
  padding: auto;
}

.q {
  height: 100%;
  overflow: hidden;
  > div {
    display: flex;
    height: 80px;
  }
  .left {
    align-items: flex-start;
    flex-wrap: wrap;
    flex-direction: column;
  }
  .right {
    align-items: flex-end;
    flex-wrap: wrap;
    flex-direction: column;
  }
}
</style>
  