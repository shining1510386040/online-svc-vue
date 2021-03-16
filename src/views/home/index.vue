<template>
  <body>
    <el-container class="topAndMain">
      <!-- 左侧 -->
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :background-color="menuBgColor"
          text-color="#555D6D"
          active-text-color="#5DA1FF"
          :default-active="activePath"
          @select="selectMenu"
        >
          <Menutree :data="menuList" :active="menuSelect" />
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <!-- 右侧头 -->
        <el-header style="text-align: right; font-size: 12px">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumbData"
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

    <div class="foot1">
      <span>
        增值电信业务许可证: 京B2-20170892 ©
        版权所有：北京神州云动科技股份有限公司 京ICP备09016255-2号 京ICP证
        110683号 京公网安备110108008174号
      </span>
    </div>
  </body>
</template>

<script>
import Menutree from "@/components/MenuTree.vue";
// 缓存
import store from "@/store/index";

export default {
  components: { Menutree },
  props: {
    menuBgColor: {
      type: String,
      default: "#F3F6F9",
    },
  },
  data() {
    return {
      //当前所在菜单
      activePath: this.$route.path,
      //选择的菜单
      menuSelect: "",
      // 菜单数据
      menuList: [],
      // 面包屑数据
      breadcrumbData: [],
      minHeight: 0,
    };
  },
  updated() {
    this.$nextTick(() => {
      this.setActivePath(this.menuList, this.$route.path);
    });
  },
  methods: {
    //如果用户重新刷新页面，因为页面刷新$route没有变化(监听不到)所以要在页面刚进入的时候判断一下当前路由路径(然后再一次渲染)
    getMatched() {
      this.breadcrumbData = this.$route.matched[0].meta;
      console.log(this.$route);
      if (this.$route.fullPath == "/workOrder/list?status=0") {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "所有工单", url: "/workOrder/list?status=0" },
        ];
      } else if (this.$route.path == "/workOrder/add") {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add" },
        ];
      } else if (this.$route.path == "/workOrder/add/step1") {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add/step1" },
        ];
      } else if (this.$route.path == "/workOrder/add/step2") {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add/step2" },
        ];
      } else if (this.$route.path == "/workOrder/add/step4") {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add/step4" },
        ];
      } else if (this.$route.fullPath == "/workOrder/list?status=1") {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "未完成工单", url: "/workOrder/list?status=1" },
        ];
      } else if (this.$route.fullPath == "/workOrder/list?status=2") {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "已关闭的工单", url: "/workOrder/list?status=2" },
        ];
      }
    },
    setActivePath(links, path) {
      links.some((item, index) => {
        if (path === item.path) {
          this.activePath = item.path + "," + item.permissionId;
          return true;
        }
        if (item.actives) {
          if (item.actives.indexOf(path) > -1) {
            this.activePath = item.path + "," + item.permissionId;
            return true;
          }
        }
        if (item.children && item.children.length) {
          this.setActivePath(item.children, path);
        }
        return false;
      });
    },
    selectMenu(item, indexPath) {
      this.menuSelect = item;
      const arr = item.split(",");
      if (arr[0] !== "undefined") {
        console.log(arr);
        this.$router.push({ path: arr[0] });
      }
    },
    // 底部footerdiv紧靠底部，动态计算其兄弟div的高度
    caculateHeight() {
      this.minHeight = document.documentElement.clientHeight - 80;
      var that = this;
      window.onresize = function () {
        that.minHeight = document.documentElement.clientHeight - 80;
      };
    },
  },
  created() {
    this.getMatched();
  },
  mounted() {
    // this.caculateHeight();
    // 若请求路由fullpath中包含loginType则赋值
    if (this.$route.fullPath.includes("loginType")) {
      // store.state.loginType = this.$route.query.loginType;
      // this.$store.commit("setUserInfo", this.$route.query.loginType);
      localStorage.setItem("loginType", this.$route.query.loginType);
    }
    // this.$store.dispatch("updateUserinfo",this.$route.query.loginType);
    // console.log("====>store.state.loginType:" + store.state.loginType);
    // 根据loginType 渲染不同的菜单（权限）
    let loginType = localStorage.getItem("loginType");
    if (loginType == "postsale") {
      // 售后工程师 postsale
      this.menuList = [
        {
          path: "",
          title: "我的服务记录",
          icon: "",
          children: [
            {
              path: "/workOrder/list?status=0",
              title: "所有工单",
              icon: "",
            },
            {
              path: "/workOrder/list?status=1",
              title: "未完成的工单",
              icon: "",
            },
            {
              path: "/workOrder/list?status=2",
              title: "已关闭的工单",
              icon: "",
            },
          ],
        },
      ];
    } else {
      // 客户
      this.menuList = [
        {
          // path: "/workOrder/add/step1",
          path: "/workOrder/add",
          title: "提交工单",
          icon: "",
          children: [],
        },
        {
          path: "",
          title: "我的服务记录",
          icon: "",
          children: [
            {
              path: "/workOrder/list?status=0",
              title: "所有工单",
              icon: "",
            },
            {
              path: "/workOrder/list?status=1",
              title: "未完成的工单",
              icon: "",
            },
            {
              path: "/workOrder/list?status=2",
              title: "已关闭的工单",
              icon: "",
            },
          ],
        },
      ];
    }
    // 初次跳转到主页默认显示我的工单
    if (
      this.$route.fullPath.includes("loginType") ||
      this.$route.fullPath == "/"
    ) {
      // 默认显示我的工单
      this.$router.push({
        path: "/workOrder/list",
        query: {
          status: 0,
        },
      });
      // 设置选择的菜单
      this.setActivePath(this.menuList, "/workOrder/list?status=0");
    }
  },
  watch: {
    // 监听路由，处理面包屑
    $route(to, from) {
      console.log(from); //从哪来
      console.log(to); //到哪去
      // 处理工单列表刷新
      // 当前页面刷新一次
      // if (
      //   location.href.indexOf("#reloaded") == -1 &&
      //   to.fullPath.includes("status=")
      // ) {
      //   location.href = location.href + "#reloaded";
      //   // 更新vuex中loginType的值
      //   //  this.$store.dispatch("updateUserinfo", localStorage.getItem("loginType"));
      //   location.reload();
      // }
      // 处理面包屑
      // 包含
      if (to.fullPath.includes("/workOrder/list?status=0")) {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "所有工单", url: "/workOrder/list?status=0" },
        ];
      } else if (to.path == "/workOrder/add") {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add" },
        ];
      } else if (
        to.path == "/workOrder/add/step1" ||
        to.path == "/workOrder/add/step2" ||
        to.path == "/workOrder/add/step4"
      ) {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "提交工单", url: "/workOrder/add/step1" },
        ];
      } else if (to.fullPath.includes("/workOrder/list?status=1")) {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "未完成工单", url: "/workOrder/list?status=1" },
        ];
      } else if (to.fullPath.includes("/workOrder/list?status=2")) {
        this.breadcrumbData = [
          { title: "工单" },
          { title: "我的服务记录" },
          { title: "已关闭的工单", url: "/workOrder/list?status=2" },
        ];
      }
    },
  },
};
</script>

<style lang="scss">
.el-submenu {
  .is-active {
    border-right: 3px solid #3d7169;
  }
  .el-menu-item {
    height: 40px !important;
    line-height: 40px !important;

    &:hover {
      background-color: #f3f6f9 !important;
    }
  }
  .el-submenu__title {
    &:hover {
      background-color: #f3f6f9 !important;
    }
    .el-submenu__icon-arrow {
      color: #b4b8c5;
    }
  }
}
.menuTree {
  .el-menu-item {
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
  }
  .el-submenu__title {
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
  }
}

.foot1 {
  position: fixed;
  bottom: 0;
  width: 100vw;
  margin: 0 auto;
  text-align: center;
  background-color: rgb(241, 237, 237);
}
.topAndMain {
  height: 48vw;
}
</style>