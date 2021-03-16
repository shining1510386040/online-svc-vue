<template>
  <div>
    <el-table :data="tableData" style="width: 100%;" height="630">
      <el-table-column
        type="selection"
        fixed
        prop="index"
        label="行号"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="belongRepairOrder"
        label="工单Id"
        width="150"
        v-if="false"
      >
      </el-table-column>
      <el-table-column
        prop="communicateRecordId"
        label="沟通记录Id"
        width="150"
        v-if="false"
      >
      </el-table-column>
      <el-table-column prop="feedbackAccount" label="反馈账号" width="120" align="left"  :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="leaveMessage" label="反馈留言" width="120" align="left"  :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="feedbackTime"
        label="反馈时间"
        width="150"
        :formatter="dateFormat"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="secretInfo" label="机密信息" width="120" align="left"  :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="附件" width="200" align="left">
        <template scope="scope">
          <el-image
            :src="scope.row.attach1"
            :preview-src-list="[scope.row.attach1]"
            style="width: 40px; height: 40px"
            class="head_pic"
            v-if="scope.row.attach1 != null"
          ></el-image>
          &nbsp; &nbsp;
          <el-image
            :src="scope.row.attach2"
            :preview-src-list="[scope.row.attach2]"
            style="width: 40px; height: 40px"
            class="head_pic"
            v-if="scope.row.attach2 != null"
          ></el-image
          >&nbsp; &nbsp;
          <el-image
            :src="scope.row.attach3"
            :preview-src-list="[scope.row.attach3]"
            style="width: 40px; height: 40px"
            class="head_pic"
            v-if="scope.row.attach3 != null"
          ></el-image
          >&nbsp; &nbsp;
          <el-image
            :src="scope.row.attach4"
            :preview-src-list="[scope.row.attach4]"
            style="width: 40px; height: 40px"
            class="head_pic"
            v-if="scope.row.attach4 != null"
          ></el-image
          >&nbsp; &nbsp;
          <el-image
            :src="scope.row.attach5"
            :preview-src-list="[scope.row.attach5]"
            style="width: 40px; height: 40px"
            class="head_pic"
            v-if="scope.row.attach5 != null"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="replayMessage" label="回复消息" width="120" align="left"  :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="replyAccount" label="回复账号" width="120" align="left"  :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="replyTime"
        label="回复时间"
        width="150"
        :formatter="dateFormat"
        align="left"
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="replayMsg(scope.$index, tableData)"
            type="text"
          >
            回复
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="反馈回复"
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
      class="edit-form"
      :before-close="handleClose"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="rules"
        ref="editForm"
      >
        <el-form-item label="工单Id" prop="id" v-if="false">
          <el-input v-model="editForm.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="沟通记录Id"
          prop="communicateRecordId"
          v-if="false"
        >
          <el-input
            v-model="editForm.communicateRecordId"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="回复消息" prop="replayMessage">
          <el-input
            v-model="editForm.replayMessage"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="回复账号" prop="replyAccount">
          <el-input
            v-model="editForm.replyAccount"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel('editForm')">取消</el-button>
        <el-button type="primary" @click.native="submitForm('editForm')"
          >确认回复</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<style>
</style>

<script>
// 引入封装的axios
import axios from "@/utils/axios";
import qs from "qs";

export default {
  data() {
    return {
      id: this.$route.query.id,
      tableData: [],
      editForm: {},
      editFormVisible: false,
      rules: {
        replayMessage: [
          { required: true, message: "请输入回复消息", trigger: "blur" },
        ],
        replyAccount: [
          { required: true, message: "请输入回复账号", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    //加载数据
    this.renderData();
  },
  methods: {
    // 加载沟通记录数据
    renderData() {
      axios
        .get("/workOrder/getDetail?id=" + this.id)
        .then((result) => {
          console.log(result.data.data);
          this.tableData = result.data.data.communicateRecordList;
        })
        .catch((err) => {});
    },
    // 点击回复
    replayMsg(index, rows) {
      this.editFormVisible = true;
      this.editForm = rows[index];
      this.editForm.id = rows[index].belongRepairOrder;
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
    //点击关闭dialog
    handleClose(done) {
      this.editFormVisible = false;
    },
    //点击取消
    handleCancel(formName) {
      this.editFormVisible = false;
    },
    // 确认回复
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.editForm);
          let params = {
            id: this.editForm.id,
            replayMessage: this.editForm.replayMessage,
            communicateRecordId: this.editForm.communicateRecordId,
            replyAccount: this.editForm.replyAccount,
          };
          axios
            .post("/workOrder/feedback/replay", qs.stringify(params))
            .then((result) => {
              if (result.status == 200) {
                this.$message({
                  showClose: true,
                  message: result.data.returnInfo,
                  type: "success",
                });
                this.editFormVisible = false;
                // 重新加载table数据
                this.renderData();
              }
            })
            .catch((err) => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>