<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>我要反馈</span>
      </div>
      <el-form
        :model="feedbackForm"
        :rules="rules"
        ref="feedbackForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="留言(必填项)" prop="leaveMessage">
          <el-input
            type="textarea"
             rows="5"
            v-model="feedbackForm.leaveMessage"
          ></el-input>
        </el-form-item>
        <el-form-item label="机密信息" prop="secretInfo">
          <el-input
            type="textarea"
            rows="5"
            v-model="feedbackForm.secretInfo"
          ></el-input>
        </el-form-item>

        <el-form-item label="上传附件" prop="">
          <el-upload
            class="upload-demo"
            action="http://localhost:8002/workOrder/feedback/multiUpload"
            :before-upload="beforeUpload"
            :data="{ id: id }"
            :on-remove="fileRemove"
            :on-success="uploadSuccess"
            multiple
            :limit="5"
            :on-exceed="exceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb;每次反馈最多只能上传5个附件；
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('feedbackForm')"
            >立即反馈</el-button
          >
          <el-button @click="resetForm('feedbackForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import qs from "qs";

export default {
  data() {
    return {
      id: this.$route.query.id,
      feedbackForm: {
        feedbackAccount:"zhangsan111@cloudcc.com"
      },
      rules: {
        leaveMessage: [
          { required: true, message: "请输入留言", trigger: "blur" },
          {
            min: 3,
            max: 200,
            message: "长度在 3 到 200 个字符",
            trigger: "blur",
          },
        ],
      },
      fileList: [
        // {
        //   name: "food.jpeg",
        //   workOrderId:"",
        //   attach1:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
        // {
        //   attach1: "food2.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
      ],
    };
  },
  mounted() {},
  methods: {
    // // 覆盖默认的上传行为；:http-request="uploadAction"
    // uploadAction(param, type) {
    //   let formData = new FormData();
    //   formData.append("file", param.file);
    //   // 额外参数： 工单id
    //   formData.append("id", this.id);

    //   axios
    //     .post("/workOrder/feedback/multiUpload", qs.stringify(formData))
    //     .then((result) => {
    //       if(result.status == 200){
    //         console.log(result.data);
    //         // todo

    //       }
    //     })
    //     .catch((err) => {});
    // },
    // 上传图片超出数量限制时的钩子
    exceed(files, fileList) {
      this.$message.error("最多上传5张图片哦！");
    },
    // 文件上传前的钩子，数为上传的文件
    beforeUpload(file) {
      // 判断图片是否大于2M
      const isLt2M = file.size / 1024 / 1024 < 2;
      // const fileType = file.name.substring(file.name.lastIndexOf('.')+1)
      // 判断图片的类型
      const isJpg =
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png" ||
        file.type == "image/gif";
      if (!isJpg) {
        this.$message.error("只能上传jpg, jpeg, png, gif格式的图片！");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
    },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      // console.log(res);
      // console.log(file);
      console.log(fileList);
      if (res.returnCode !== "200") {
        return this.$message.error(res.returnInfo);
      }
      // // todo
      // let current = new Object();
      // current.name = file.name;
      // current.url = res.data.attach1;
      // current.workOrderId = res.data.workOrderId;
      // this.fileList.push(current);
      // console.log(this.fileList);
      this.fileList = fileList;
    },
    // 文件列表移除文件时的钩子
    fileRemove(file, fileList) {
      // console.log(file);
      // console.log(this.fileList);
      // console.log(fileList);
      this.fileList = fileList;
    },
    // 提交反馈
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = new Object();
          params.id = this.id;
          params.leaveMessage = this.feedbackForm.leaveMessage;
          params.feedbackAccount = this.feedbackForm.feedbackAccount;
          params.secretInfo = this.feedbackForm.secretInfo;
          console.log(this.fileList);
          this.fileList.forEach((item, index) => {
            params["attach" + (index + 1)] = item.response.data.attach1;
          });

          console.log(params);
          axios
            .post("/workOrder/feedback", qs.stringify(params))
            .then((result) => {
              if (result.status == 200) {
                this.$message({
                  showClose: true,
                  message: result.data.returnInfo,
                  type: "success",
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
};
</script>

<style lang="scss" scoped>
.el-textarea{
  width: 50%;
}
</style>