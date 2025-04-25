import { ref, computed } from 'vue'

import { defineStore } from 'pinia'

import router from '@/router'

import type { UserData, Credentials, UserProfile } from '@/views/auth/types'

import { createApiClient } from './utils/createApiClient'

interface ApiError {
  [key: string]: string[] | string
}

export const useAuthStore = defineStore('auth', () => {
  // Initialize API client
  const apiClient = createApiClient()

  // State
  const user = ref<UserProfile | null>(null)
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref<string | ApiError | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value)

  /**
   * Register a new user
   * @param userData - User registration data including username, email, and passwords
   * 
   * On success:
   * - Stores the authentication token
   * - Fetches the user profile
   * - Redirects to tasks page
   */
  async function register(userData: UserData) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/auth/register/', userData)
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

  /**
   * Log in an existing user
   * @param credentials - User login credentials (username and password)
   * 
   * On success:
   * - Stores the authentication token
   * - Fetches the user profile
   * - Redirects to tasks page
   * 
   * On failure:
   * - Clears any partial authentication state
   * - Sets appropriate error message
   */
  async function login(credentials: Credentials) {
    loading.value = true
    error.value = null
    try {
      console.log('Attempting login...')
      const response = await apiClient.post('/auth/login/', credentials)
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

  /**
   * Log out the current user
   * 
   * - Attempts to logout on the server
   * - Clears local authentication state
   * - Redirects to login page
   * - Continues with local logout even if server logout fails
   */
  async function logout() {
    loading.value = true
    try {
      if (token.value) {
        await apiClient.post('/auth/logout/')
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

  /**
   * Fetch the current user's profile
   * 
   * - Called after login/registration
   * - Updates the user state with profile information
   * - Handles unauthorized errors by clearing auth state
   * 
   * @throws Error if token is invalid or request fails
   */
  async function fetchUserProfile() {
    if (!token.value) {
      console.log('No token available for profile fetch')
      return
    }
    
    loading.value = true
    try {
      console.log('Fetching user profile...')
      const response = await apiClient.get('/auth/profile/')
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