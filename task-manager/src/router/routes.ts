import type { RouteRecordRaw } from 'vue-router'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/loading',
    name: 'loading',
    component: () => import('../views/LoadingView.vue')
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../views/auth/login/index.vue'),
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('../views/auth/register/index.vue'),
  }
]

export const protectedRoutes: RouteRecordRaw[] = [
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/tasks/index.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...protectedRoutes,
  {
    path: '/',
    redirect: '/tasks'
  }
]

export default routes 