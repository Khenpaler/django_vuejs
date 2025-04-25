import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Always allow loading page
  if (to.path === '/loading') {
    next()
    return
  }

  // Handle protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Protected route accessed without auth, redirecting to login')
    next('/auth/login')
    return
  }

  // Handle guest-only routes (login/register)
  if (to.meta.requiresGuest && isAuthenticated) {
    console.log('Guest route accessed while authenticated, redirecting to tasks')
    next('/tasks')
    return
  }

  next()
})

export default router
