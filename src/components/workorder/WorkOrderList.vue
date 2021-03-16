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
    <div ref="tableCot">
      <el-table :data="tableData" style="width: 100%" :height="Height">
        <el-table-column
          type="selection"
          fixed
          prop="index"
          label="行号"
          width="50"
        >
        </el-table-column>
        <el-table-column prop="workOrderNo" label="工单编号" width="90" align="left">
        </el-table-column>
        <el-table-column prop="content" label="问题内容" width="100" align="left" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="belongProduct.productName"
          label="问题分类"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="submitAccount" label="提交账号" width="170" align="left">
        </el-table-column>
        <el-table-column
          prop="submitTime"
          label="提交时间"
          width="200"
          :formatter="dateFormat"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="workOrderStatus" label="状态" width="100" align="left" :formatter="workOrderStatusConvert">
        </el-table-column>
        <el-table-column prop="workOrderType" label="工单类型" width="100" align="left" :formatter="workOrderTypeConvert">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="showDetail(scope.$index, tableData)"
              type="text"
            >
              查看
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
            >
              删除
            </el-button>
            <el-button
              @click.native.prevent="feedback(scope.$index, tableData)"
              type="text"
              v-if="clientOpShow"
            >
              提交反馈
            </el-button>
            <el-button
              @click.native.prevent="replay(scope.$index, tableData)"
              type="text"
              v-if="postsaleOpShow"
            >
              反馈回复
            </el-button>
            <el-button
              @click.native.prevent="evaluate(scope.$index, tableData)"
              type="text"
              v-if="clientOpShow"
            >
              评价
            </el-button>
            <el-button
              @click.native.prevent="solveAndClose(scope.$index, tableData)"
              type="text"
              v-if="postsaleOpShow"
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
  </div>
</template>

<style lang="sass" scoped>
</style>

<script>
// 引入封装的axios
import axios from "@/utils/axios";
import qs from "qs";
import QueryString from "qs";
import store from "@/store/index";

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
      // table的高度
      Height: 510,
      status: getQueryString("status"),
      tableData: [],
      searchFormData: {
        workOrderNo: "",
        submitTime: [],
      },
      currentPage: 1,
      // 客户操作按钮显示
      clientOpShow: false,
      // 售后工程师操作按钮显示
      postsaleOpShow: false,
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
  created() {
    //  this.$nextTick(function () {
    //   const that = this;
    //   window.onresize = () => {
    //     return (() => {
    //       console.log(that.$refs.tableCot);
    //       let heightStyle = that.$refs.tableCot.offsetHeight;
    //       that.Height = heightStyle;
    //     })();
    //   };
    // });
  },
  mounted() {
    // 初始化调用加载表格数据
    let params = new Object();
    params.pageNo = this.currentPage;
    params.pageSize = this.pageSize;
    params.status = this.status;
    this.getTableData(params);

    // 设置操作按钮显示
    let loginType = localStorage.getItem("loginType");
    if (loginType == "client") {
      // 客户
      this.clientOpShow = true;
      this.postsaleOpShow = false;
    } else {
      this.clientOpShow = false;
      this.postsaleOpShow = true;
    }
    // 设置table的高度自适应外部div高度
    // this.$nextTick(function () {
    //   const that = this;
    //   window.onresize = () => {
    //     return (() => {
    //       console.log("============>>offsetHeight:"+that.$refs.tableCot.offsetHeight);
    //       let heightStyle = that.$refs.tableCot.offsetHeight-100;
    //       that.Height = heightStyle;
    //     })();
    //   };
    // });
  },
  //   .执行到它的时候时候是数据发生变化且界面更新完毕
  // .所有的数据发生变化都会调用
  // .每次触发的代码都是同一个
  updated() {
    // // status 数据更新之后，重新加载数据表格（触发一次）
    // var flag = true;
    // if (flag) {
    //   let params = new Object();
    //   params.pageNo = this.currentPage;
    //   params.pageSize = this.pageSize;
    //   params.status = this.status;
    //   this.getTableData(params);
    //   flag = false;
    // } else {
    //   return;
    // }
  },
  // 数据发生改变的时候会侦听到
  watch: {
    //监听status数据的变化
    status(newVal, oldVal) {
      let params = new Object();
      params.pageNo = this.currentPage;
      params.pageSize = this.pageSize;
      params.status = this.status;
      this.getTableData(params);
    },
    // 监听路由url变化
    "$route.fullPath": function (newPath, oldPath) {
      console.log("oldPath:" + oldPath);
      console.log("newPath:" + newPath);
      // // 当前页面刷新一次
      // if (location.href.indexOf("#reloaded") == -1 && newPath.includes("status=")) {
      //   location.href = location.href + "#reloaded";
      //   // 更新vuex中loginType的值
      //   //  this.$store.dispatch("updateUserinfo", localStorage.getItem("loginType"));
      //   location.reload();
      // }
      // 设置为新路由的status值
      this.status = getQueryString("status");
    },
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
      // let communicateRecordList = rows[index].communicateRecordList;
      let id = rows[index].id;
      console.log(rows[index]);
      // console.log(this);
      this.$router.push({
        path: "/workOrder/replay",
        query: {
          id: id,
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
    // 工单类型转化
    workOrderTypeConvert(row, column, cellValue, index){
      // console.log(cellValue);
      if(cellValue == 0){
        return "重要工单";
      }else if(cellValue == 1){
        return "普通工单";
      }else{
        return "";
      }
    },
    // 工单状态转化
    workOrderStatusConvert(row, column, cellValue, index){
      // console.log(cellValue);
      if(cellValue == 0){
        return "已创建";
      }else if(cellValue == 1){
        return "待反馈";
      }else if(cellValue == 2){
        return "已反馈";
      }else if(cellValue == 3){
        return "处理中";
      }else if(cellValue == 4){
        return "待评价";
      }else if(cellValue == 5){
        return "已评价";
      }else if(cellValue == 6){
        return "已关闭";
      }else{
        return "";
      }
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
      params.status = this.status;
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