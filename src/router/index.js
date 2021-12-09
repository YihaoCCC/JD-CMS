import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import (
                /* webpackChunkName: "dashboard" */
                "../views/Dashboard.vue")
            }, {
                path: "/tableOfGoods",
                name: "basetable",
                meta: {
                    title: '商品管理'
                },
                component: () => import (
                /* webpackChunkName: "table" */
                "../views/TableGoods.vue")
            }, {
                path: '/tableOfOrder',
                name: 'tableOfOrder',
                meta: {
                    title: '订单管理'
                },
                component: ()=> import ('../views/TableOrder.vue')
            }, {
                path: "/charts",
                name: "basecharts",
                meta: {
                    title: '销售统计'
                },
                component: () => import (
                /* webpackChunkName: "charts" */
                "../views/BaseCharts.vue")
            }, {
                path: "/addGoodsForm",
                name: "addGoodsForm",
                meta: {
                    title: '新增商品'
                },
                component: () => import (
                /* webpackChunkName: "form" */
                "../views/AddGoodsForm.vue")
            },{
                path: "/tabs",
                name: "tabs",
                meta: {
                    title: '消息中心'
                },
                component: () => import (
                /* webpackChunkName: "tabs" */
                "../views/Tabs.vue")
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import (
        /* webpackChunkName: "login" */
        "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;