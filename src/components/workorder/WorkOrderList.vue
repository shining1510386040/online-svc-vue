<template>
  <div>
    <el-form :inline="true" :model="searchFormData" class="demo-form-inline">
      <el-form-item label="工单编号">
        <el-input
          prop="workOrderNo"
          v-model="searchFormData.workOrderNo"
          placeholder="工单编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker
          v-model="searchFormData.submitTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
        <!-- <el-date-picker
          prop="submitTimeStart"
          v-model="searchFormData.submitTimeStart"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
        至
        <el-date-picker
          prop="submitTimeEnd"
          v-model="searchFormData.submitTimeEnd"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker> -->
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click.native="searchData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        type="selection"
        fixed
        prop="index"
        label="行号"
        width="50"
      >
      </el-table-column>
      <el-table-column prop="workOrderNo" label="工单编号" width="150">
      </el-table-column>
      <el-table-column prop="content" label="问题内容" width="120">
      </el-table-column>
      <el-table-column
        prop="category.categoryName"
        label="问题分类"
        width="120"
      >
      </el-table-column>
      <el-table-column prop="submitAccount" label="提交账号" width="120">
      </el-table-column>
      <el-table-column
        prop="submitTime"
        label="提交时间"
        width="300"
        :formatter="dateFormat"
      >
      </el-table-column>
      <el-table-column prop="workOrderStatus" label="状态" width="120">
      </el-table-column>
      <el-table-column prop="workOrderType" label="工单类型" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showDetail(scope.$index, tableData)"
            type="text"
            size="small"
          >
            查看
          </el-button>
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small"
          >
            删除
          </el-button>
          <el-button
            @click.native.prevent="feedback(scope.$index, tableData)"
            type="text"
            size="small"
          >
            提交反馈
          </el-button>
          <el-button
            @click.native.prevent="replay(scope.$index, tableData)"
            type="text"
            size="small"
          >
            反馈回复
          </el-button>
          <el-button
            @click.native.prevent="evaluate(scope.$index, tableData)"
            type="text"
            size="small"
          >
            评价
          </el-button>
          <el-button
            @click.native.prevent="solveAndClose(scope.$index, tableData)"
            type="text"
            size="small"
          >
            关闭工单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center; margin-top: 30px">
      <el-pagination
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
        :current-page="currentPage"
        :page-sizes="[50, 100, 150, 200, 250, 300]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<style>
</style>

<script>
// 引入封装的axios
import axios from "@/utils/axios";
import qs from "qs";
import QueryString from "qs";

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
      status: this.$route.query.status,
      tableData: [],
      searchFormData: {
        workOrderNo: "",
        submitTime: [],
      },
      currentPage: 1,
      total: 400,
      pageSize: 50,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    // 初始化调用加载表格数据
    let params = new Object();
    params.pageNo = this.currentPage;
    params.pageSize = this.pageSize;
    params.status = this.status;
    this.getTableData(params);
  },
  methods: {
    // 删除
    deleteRow(index, rows) {
      //
      // console.log(index);
      // console.log(rows);
      let params = {
        workOrderNo: rows[index].workOrderNo,
      };
      axios.post("/workOrder/delete", qs.stringify(params)).then((result) => {
        if (result.status == 200) {
          this.$message({
            message: result.data.returnInfo,
            type: "success",
          });
          //重新加载数据
          this.searchData();
        }
      });
    },
    // 提交反馈
    feedback(index, rows) {
      let id = rows[index].id;
      // console.log(id);
      // console.log(this);
      this.$router.push({
        path: "/workOrder/feedback",
        query: {
          id: id,
        },
      });
    },
    // 反馈回复
    replay(index, rows) {
      let communicateRecordList = rows[index].communicateRecordList;
      console.log(rows[index]);
      // console.log(this);
      this.$router.push({
        path: "/workOrder/replay",
        query: {
          communicateRecordList: communicateRecordList,
        },
      });
    },

    // 查看详情
    showDetail(index, rows) {
      let id = rows[index].id;
      // console.log(id);
      // console.log(this);
      // 跳转到详情页面
      this.$router.push({
        path: "/workOrder/detail",
        query: {
          id: id,
        },
      });
    },
    // 解决和关闭工单
    solveAndClose(index, rows) {
      let id = rows[index].id;
      // console.log(id);
      // console.log(this);
      // 跳转到提交解决方案页面
      this.$router.push({
        path: "/workOrder/solution",
        query: {
          id: id,
        },
      });
    },
    // 评价
    evaluate(index, rows) {
      let params = new Object();
      params.id = rows[index].id;

      this.$prompt("请输入您的评价", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          params.evaluation = value;
          // 更新评价内容
          axios
            .post("/workOrder/evaluation", qs.stringify(params))
            .then((result) => {
              if (result.status == 200) {
                this.$message({
                  type: "success",
                  message: result.data.returnInfo,
                });
              }
            });
        })
        .catch(() => {});
    },
    // 加载数据表格
    getTableData(params) {
      axios.post("/workOrder/page", qs.stringify(params)).then((res) => {
        // console.log(res);
        this.tableData = res.data.data.content;
        this.total = res.data.data.size;
      });
    },
    // 日期格式化
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      let dt = new Date(date);
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1) +
        "-" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },
    // 改变每页条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // 重新加载数据
      this.searchData();
    },
    // 改变第几页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      // 重新加载数据
      this.searchData();
    },
    // 搜索
    searchData() {
      let params = new Object();
      params.pageNo = this.currentPage;
      params.pageSize = this.pageSize;
      params.status = getQueryString("status");
      params.workOrderNo = this.searchFormData.workOrderNo;
      if (null != this.searchFormData.submitTime) {
        params.submitTimeStart = this.searchFormData.submitTime[0];
        params.submitTimeEnd = this.searchFormData.submitTime[1];
      }

      this.getTableData(params);
    },
  },
};
</script>