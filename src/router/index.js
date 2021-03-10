import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import NotFound from '@/components/error/notFound.vue'
import Login from '@/components/login/login.vue'
import HOME from '@/views/home/index.vue' //主页
import WorkOrderAddStep1 from '@/components/workorder/WorkOrderAddStep1.vue'

import WorkOrderAddStep2 from '@/components/workorder/WorkOrderAddStep2.vue'
import WorkOrderAddStep4 from '@/components/workorder/workOrderAddStep4.vue'
import WorkOrderList from '@/components/workorder/WorkOrderList.vue'
import WorkOrderDetail from '@/components/workorder/WorkOrderDetail.vue'
import WorkOrderSolution from '@/components/workorder/WorkOrderSolution.vue'
import WorkOrderFeedback from '@/components/workorder/WorkOrderFeedback.vue'
import WorkOrderReplay from '@/components/workorder/WorkOrderReplay.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/toLogin',
    component: Login
  },
  {
    path: '/',
    component: HOME,
    children: [
      {
        path: "/workOrder/add/step1",
        component: WorkOrderAddStep1
      }, {
        path: "/workOrder/add/step2",
        component: WorkOrderAddStep2
      }, {
        path: "/workOrder/add/step4",
        component: WorkOrderAddStep4
      },
      {
        path: '/workOrder/list',
        component: WorkOrderList
      },
      {
        path: "/workOrder/detail",
        component: WorkOrderDetail
      }
      ,
      {
        path: "/workOrder/feedback",
        component: WorkOrderFeedback
      }
      ,
      {
        path: "/workOrder/replay",
        component: WorkOrderReplay
      }
      ,
      {
        path: "/workOrder/solution",
        component: WorkOrderSolution
      }
      ,
      {
        path: "/workOrder/replay",
        component: WorkOrderReplay
      }
    ]
  },

  { // 404页面：必须位于最后，否则其它的路由地址都会使用 NotFound 组件
    path: '*',
    component: NotFound
  }
]

const router = new VueRouter({
  // history 改为hash
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
