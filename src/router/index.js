import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Login from '@/page/login'
const Info = () =>
    import ('@/page/pages/Info');
const UpdatePwd = () =>
    import ('@/page/pages/updatePwd');
const Workermanage = () =>
    import ('@/page/pages/workermanage');
const WorkerDetail = () =>
    import ('@/page/pages/workerdetail');
const workerEdit = () =>
    import ('@/page/pages/workerEdit');
const WorkerRechacode = () =>
  import ("@/page/pages/WorkerRechacode");
const workerRechaFail = () =>
  import ("@/page/pages/workerRechaFail");
const workerRechaFaildelay = () =>
  import ("@/page/pages/workerRechaFaildelay");
const workerRechaRecharge = () =>
  import ("@/page/pages/workerRechaRecharge");
const workerRechaSuccess = () =>
  import ("@/page/pages/workerRechaSuccess");
const Money = () =>
  import ('@/page/pages/Money');
const moneyList = () =>
  import ('@/page/pages/moneyList');
const payment = () =>
  import ('@/page/pages/payment');
const paylist = () =>
  import ('@/page/pages/paylist');
const paylistWating = () =>
  import ('@/page/pages/paylistWating');
Vue.use(Router)
export default new Router({
    routes: [
      {path: "/", redirect: "/manage/workermanage"},
      {path: "/manage", redirect: "/manage/workermanage"},
      {
            path: '/manage',
            name: 'index',
            component: Index,
            children: [
                { path: '/manage/info', name: 'info', component: Info },
                { path: "/manage/info/updatepwd", name: 'updatepwd', component: UpdatePwd },
                { path: "/manage/workermanage", name: 'workermanage', component: Workermanage },
                { path: "/manage/workermanage/detail", name: 'workerDetail', component: WorkerDetail },
                { path: "/manage/workermanage/workerEdit", name: 'workerEdit', component: workerEdit },
                { path: "/manage/money", name: 'money', component:Money},
                { path: "/manage/money/moneyList", name: 'moneyList', component:moneyList },
                { path: "/manage/money/payment", name: 'payment', component:payment },
                { path: "/manage/money/paylist", name: 'paylist', component:paylist },
                { path: "/manage/workerRechaRecharge/paylistWating", name: 'paylistWating', component:paylistWating },
                { path: "/manage/WorkerRechacode", name: 'WorkerRechacode', component: WorkerRechacode },
                { path: "/manage/WorkerRechacode/workerRechaSuccess", name: 'workerRechaSuccess', component: workerRechaSuccess },
                { path: "/manage/WorkerRechacode/workerRechaRecharge", name: 'workerRechaRecharge', component: workerRechaRecharge },
                { path: "/manage/WorkerRechacode/workerRechaFail", name: 'workerRechaFail', component: workerRechaFail },
                { path: "/manage/WorkerRechacode/workerRechaFaildelay", name: 'workerRechaFaildelay', component: workerRechaFaildelay },

            ]
        },

        {
            path: '/login',
            name: 'login',
            component: Login
        },
    ]
})
