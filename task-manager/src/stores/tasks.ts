import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

// Define types
interface Task {
  id: number
  title: string
  description?: string
  due_date?: string
  completed: boolean
}

interface PaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: Task[]
}

type TaskData = Omit<Task, 'id'>

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(5)

  async function fetchTasks(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await api.getTasks({
        page,
        page_size: pageSize.value
      })
      const data = response.data as PaginatedResponse
      tasks.value = data.results
      totalCount.value = data.count
      currentPage.value = page
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      console.error('Error fetching tasks:', err)
      tasks.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchTask(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await api.getTask(id)
      currentTask.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data || 'Failed to fetch task'
      console.error(`Error fetching task ${id}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createTask(taskData: TaskData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.createTask(taskData)
      console.log('Created task response:', response.data)
      
      // Ensure tasks.value is initialized
      if (!Array.isArray(tasks.value)) {
        tasks.value = []
      }
      
      // Add new task to the array
      tasks.value = [...tasks.value, response.data]
      console.log('Updated tasks array:', tasks.value)
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task'
      console.error('Error creating task:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: number, taskData: TaskData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.updateTask(id, taskData)
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data || 'Failed to update task'
      console.error(`Error updating task ${id}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.deleteTask(id)
      tasks.value = tasks.value.filter(task => task.id !== id)
      if (currentTask.value?.id === id) {
        currentTask.value = null
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data || 'Failed to delete task'
      console.error(`Error deleting task ${id}:`, err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    currentTask,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask
  }
}) 