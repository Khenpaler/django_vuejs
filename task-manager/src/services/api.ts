import axios from 'axios'

// Define types
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

interface Task {
  id: number
  title: string
  description?: string
  due_date?: string
  completed: boolean
}

type TaskData = Omit<Task, 'id'>

interface TaskParams {
  page?: number
  page_size?: number
}

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

const getTasks = (params?: TaskParams) => {
  return apiClient.get('/tasks/', { params })
}

export default {
  // Auth endpoints
  register(userData: UserData) {
    return apiClient.post('/auth/register/', userData)
  },
  async login(credentials: Credentials) {
    try {
      const response = await apiClient.post('/auth/login/', credentials)
      return response
    } catch (error) {
      console.error('Login API error:', error)
      throw error
    }
  },
  logout() {
    return apiClient.post('/auth/logout/')
  },
  getProfile() {
    return apiClient.get('/auth/profile/')
  },

  // Task endpoints
  getTasks,
  getTask(id: number) {
    return apiClient.get(`/tasks/${id}/`)
  },
  createTask(taskData: TaskData) {
    return apiClient.post('/tasks/', taskData)
  },
  updateTask(id: number, taskData: TaskData) {
    return apiClient.put(`/tasks/${id}/`, taskData)
  },
  deleteTask(id: number) {
    return apiClient.delete(`/tasks/${id}/`)
  }
} 