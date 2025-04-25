import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'

// Define types
interface User {
  id: number
  username: string
  email: string
}

interface UserData {
  username: string
  email: string
  password: string
  password2: string
  first_name: string
  last_name: string
}

interface Credentials {
  username: string
  password: string
}

interface ApiError {
  [key: string]: string[] | string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const isAuthenticated = computed(() => !!token.value)
  const loading = ref(false)
  const error = ref<string | ApiError | null>(null)

  async function register(userData: UserData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.register(userData)
      token.value = response.data.token
      if (token.value) {
        localStorage.setItem('token', token.value)
        await fetchUserProfile()
        router.push('/tasks')
      }
    } catch (err: any) {
      error.value = err.response?.data || 'Registration failed'
    } finally {
      loading.value = false
    }
  }

  async function login(credentials: Credentials) {
    loading.value = true
    error.value = null
    try {
      console.log('Attempting login...')
      const response = await api.login(credentials)
      console.log('Login response:', response.data)
      
      if (response.data && response.data.token) {
        const receivedToken = response.data.token as string
        token.value = receivedToken
        localStorage.setItem('token', receivedToken)
        console.log('Token stored, fetching profile...')
        
        await fetchUserProfile()
        console.log('Profile fetched, redirecting...')
        
        // Ensure we're authenticated before redirecting
        if (isAuthenticated.value) {
          await router.push('/tasks')
        } else {
          throw new Error('Authentication failed after successful login')
        }
      } else {
        throw new Error('No token received from server')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err.response?.data || err.message || 'Login failed'
      // Clear any partial auth state on error
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      if (token.value) {
        await api.logout()
      }
    } catch (err: any) {
      console.error('Logout error:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      loading.value = false
      router.push('/auth/login')
    }
  }

  async function fetchUserProfile() {
    if (!token.value) {
      console.log('No token available for profile fetch')
      return
    }
    
    loading.value = true
    try {
      console.log('Fetching user profile...')
      const response = await api.getProfile()
      console.log('Profile response:', response.data)
      user.value = response.data
    } catch (err: any) {
      console.error('Error fetching user profile:', err)
      // If token is invalid, clear auth
      if (err.response?.status === 401) {
        console.log('Unauthorized, clearing auth state')
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        router.push('/auth/login')
      }
      throw err // Propagate error to calling function
    } finally {
      loading.value = false
    }
  }

  return { 
    user, 
    token, 
    isAuthenticated, 
    loading, 
    error, 
    register, 
    login, 
    logout, 
    fetchUserProfile 
  }
}) 