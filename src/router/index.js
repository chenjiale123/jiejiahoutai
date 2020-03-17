import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    noCache: true                if set true, the page will no be cached(default is false)
    icon: 'svg-name'             the icon show in the sidebar
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/role',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限控制',
      icon: 'lock'
    },
    children: [{
      path: 'role',
      component: () => import('@/views/permission/role'),
      name: 'RolePermission',
      meta: {
        title: '角色权限控制'
      }
    }]
  },

  // {
  //   //   path: '/production',
  //   //   component: Layout,
  //   //   redirect: '/production/list',
  //   //   alwaysShow: true, // will always show the root menu
  //   //   name: 'production',
  //   //   meta: {
  //   //     title: '商品管理',
  //   //     icon: 'lock'
  //   //   },
  //   //   children: [{
  //   //     path: 'list',
  //   //     component: () => import('@/views/production/index'),
  //   //     name: 'productionList',
  //   //     meta: {
  //   //       title: '商品'
  //   //     }
  //   //   }]
  //   // },

  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    alwaysShow: true, // will always show the root menu
    name: '商品模块',
    meta: {
      title: '商品管理', icon: 'product'
    },
    children: [
      {
        path: 'product',
        name: '商品列表',
        component: () => import('@/views/pms/product/index'),
        meta: { title: '商品列表', icon: 'product-list' }
      },
      {
        path: 'productCate',
        name: 'productCate',
        component: () => import('@/views/pms/productType/index'),
        meta: { title: '商品分类', icon: 'product-cate' }
      }
    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    alwaysShow: true, // will always show the root menu
    name: 'oms',
    meta: {
      title: '订单管理',
      icon: 'order'
    },
    children: [{
      path: 'order',
      component: () => import('@/views/oms/order/index'),
      name: 'order',
      meta: {
        title: '订单列表',
        icon: 'product-list'
      }
    }]
  },
  {
    path: '/sms',
    component: Layout,
    redirect: '/sms/coupon',
    alwaysShow: true, // will always show the root menu
    name: 'sms',
    meta: {
      title: '营销管理',
      icon: 'sms'
    },
    children: [
      {
        path: 'activity',
        name: 'activity',
        component: () => import('@/views/sms/activity/index'),
        meta: { title: '活动列表', icon: 'sms-activity' }
      },
      {
        path: 'coupon',
        component: () => import('@/views/sms/coupon/index'),
        name: 'coupon',
        meta: {
          title: '优惠券列表',
          icon: 'sms-coupon'
        }
      },
      {
        path: 'banner',
        name: 'banner',
        component: () => import('@/views/sms/banner/index'),
        meta: { title: '轮播列表', icon: 'sms-banner' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes.concat(asyncRoutes)
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
