<template>
  <body>
    <el-container>
      <!-- 左侧 -->
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']" router>
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-message"></i>工单</template
            >
            <el-menu-item index="/workOrder/add/step1">
              <i class="el-icon-document-add"></i>提交工单
            </el-menu-item>
            <el-menu-item-group>
              <template slot="title">我的服务记录</template>

              <el-menu-item index="/workOrder/list?status=0"
                ><i class="el-icon-document"></i>所有工单
              </el-menu-item>
              <el-menu-item index="/workOrder/list?status=1">
                <i class="el-icon-document"></i>未完成的工单
              </el-menu-item>
              <el-menu-item index="/workOrder/list?status=2">
                <i class="el-icon-document-delete"></i
                >已关闭的工单</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <!-- 右侧头 -->
        <el-header style="text-align: right; font-size: 12px">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="(item, index) in list[0].meta"
              :key="index"
              :to="item.url"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <!-- 右侧body -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 底部 -->
    <!-- <el-footer>
      <div>
        <span>
          增值电信业务许可证: 京B2-20170892 ©
          版权所有：北京神州云动科技股份有限公司 京ICP备09016255-2号 京ICP证
          110683号 京公网安备110108008174号
        </span>
      </div>
    </el-footer> -->
  </body>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  methods: {
    //如果用户重新刷新页面，因为页面刷新$route没有变化(监听不到)所以要在页面刚进入的时候判断一下当前路由路径(然后再一次渲染)
    getMatched() {
      this.list = this.$route.matched;
      console.log(this.$route);
      if (this.$route.fullPath == "/workOrder/list?status=0") {
        this.list[0].meta = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "所有工单", url: "/workOrder/list?status=0" },
        ];
      }  else if (this.$route.path == "/workOrder/add/step1") {
        this.list[0].meta = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add/step1" },
        ];
      } else if (this.$route.path == "/workOrder/add/step2") {
        this.list[0].meta = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add/step2" },
        ];
      } else if (this.$route.path == "/workOrder/add/step4") {
        this.list[0].meta = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add/step4" },
        ];
      } else if (this.$route.fullPath == "/workOrder/list?status=1") {
        this.list[0].meta = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "未完成工单", url: "/workOrder/list?status=1" },
        ];
      } else if (this.$route.fullPath == "/workOrder/list?status=2") {
        this.list[0].meta = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "已关闭的工单", url: "/workOrder/list?status=2" },
        ];
      }
    },
  },
  created() {
    this.getMatched();
  },
  mounted() {},
  watch: {
    $route(to, from) {
      console.log(from); //从哪来
      console.log(to); //到哪去
      if (to.fullPath == "/workOrder/list?status=0") {
        this.list[0].meta = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "所有工单", url: "/workOrder/list?status=0" },
        ];
      } else if (
        to.path == "/workOrder/add/step1" ||
        to.path == "/workOrder/add/step2" ||
        to.path == "/workOrder/add/step4"
      ) {
        this.list[0].meta = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add/step1" },
        ];
      } else if (to.fullPath == "/workOrder/list?status=1") {
        this.list[0].meta = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "未完成工单", url: "/workOrder/list?status=1" },
        ];
      } else if (to.fullPath == "/workOrder/list?status=2") {
        this.list[0].meta = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "已关闭的工单", url: "/workOrder/list?status=2" },
        ];
      }
    },
  },
};
</script>

<style scoped>
</style>