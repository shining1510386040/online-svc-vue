<template>
  <div class="top" v-on:changeActiveData="next">
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="选择问题所属产品" @click.native="next(1)"></el-step>
      <el-step title="选择问题类型"></el-step>
      <el-step title="推荐解决方案"></el-step>
      <el-step title="创建工单"></el-step>
    </el-steps>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import WorkOrderAddStep1 from "@/components/workorder/WorkOrderAddStep1.vue";
import WorkOrderAddStep2 from "@/components/workorder/WorkOrderAddStep2.vue";
import WorkOrderAddStep4 from "@/components/workorder/workOrderAddStep4.vue";

export default {
  data() {
    return {
      // 当前的步骤 0-3
      active: 0,
    };
  },
  // 子组件vue
  components: {
    WorkOrderAddStep1,
    WorkOrderAddStep2,
    WorkOrderAddStep4,
  },
  methods: {
    // 步骤点击
    // 子组件vue修改父组件的值
    next(index) {
      console.log("===>this.active:" + this.active);
      console.log("===>index:" + index);
      // if (this.active++ > 3) this.active = 0;

      if (index == 1) {
        this.active = 1;
        this.$router.push("/workOrder/add/step1");
      } else if (index > 5) {
        this.active = 0;
      } else {
        this.active = index;
      }
    },
  },
};
</script>

<style scope>
/* .top{
    background: red;
}
.content{

} */
</style>