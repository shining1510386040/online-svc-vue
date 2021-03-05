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
            <el-menu-item index="/workOrder/add">
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
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
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
export default {};
</script>

<style scoped>
</style>