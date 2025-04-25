import axios from 'axios'

export function createApiClient() {
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })

  // Request interceptor to add auth token to requests
  apiClient.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Token ${token}`
      }
      return config
    },
    error => {
      console.error('Request interceptor error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor to handle common errors
  apiClient.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', error.response?.data || error.message)
      return Promise.reject(error)
    }
  )

  return apiClient
} 