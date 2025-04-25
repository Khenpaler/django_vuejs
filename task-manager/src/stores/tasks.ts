import { ref } from 'vue'

import { defineStore } from 'pinia'

import type { Task, TaskData, TaskPaginatedResponse } from '@/views/tasks/types'

import { createApiClient } from './utils/createApiClient'

export const useTasksStore = defineStore('tasks', () => {
  // Initialize API client
  const apiClient = createApiClient()

  // State
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(5)

  /**
   * Fetch paginated tasks from the server
   * @param page - Page number to fetch (defaults to 1)
   * 
   * Updates:
   * - tasks array with fetched results
   * - totalCount with total number of tasks
   * - currentPage with the fetched page number
   */
  async function fetchTasks(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/tasks/', { 
        params: {
          page,
          page_size: pageSize.value
        }
      })
      const data = response.data as TaskPaginatedResponse
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

  /**
   * Fetch a single task by ID
   * @param id - Task ID to fetch
   * 
   * Updates currentTask with the fetched task data
   * @returns The fetched task or null if failed
   */
  async function fetchTask(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get(`/tasks/${id}/`)
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

  /**
   * Create a new task
   * @param taskData - Task data without ID
   * 
   * On success:
   * - Creates task on server
   * - Refreshes the current page to show new task
   * @returns The created task or null if failed
   */
  async function createTask(taskData: TaskData) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/tasks/', taskData)
      // Refetch the current page to maintain proper pagination
      await fetchTasks(currentPage.value)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task'
      console.error('Error creating task:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing task
   * @param id - Task ID to update
   * @param taskData - Updated task data
   * 
   * On success:
   * - Updates task on server
   * - Refreshes the current page
   * - Updates currentTask if it's the same task
   * @returns The updated task or null if failed
   */
  async function updateTask(id: number, taskData: TaskData) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.put(`/tasks/${id}/`, taskData)
      // Refetch the current page to maintain proper pagination
      await fetchTasks(currentPage.value)
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

  /**
   * Delete a task
   * @param id - Task ID to delete
   * 
   * On success:
   * - Deletes task from server
   * - If it's the last task on the current page (except page 1), goes to previous page
   * - Otherwise refreshes current page
   * - Clears currentTask if it was the deleted task
   * @returns true if successful, false if failed
   */
  async function deleteTask(id: number) {
    loading.value = true
    error.value = null
    try {
      await apiClient.delete(`/tasks/${id}/`)
      
      // Calculate if we need to go to the previous page
      const isLastItemOnPage = tasks.value.length === 1
      const hasMorePages = currentPage.value > 1
      const shouldGoToPreviousPage = isLastItemOnPage && hasMorePages
      
      // If it's the last item on the current page (except page 1), go to previous page
      if (shouldGoToPreviousPage) {
        await fetchTasks(currentPage.value - 1)
      } else {
        // Otherwise just refresh the current page
        await fetchTasks(currentPage.value)
      }
      
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
    // State
    tasks,
    currentTask,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,

    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask
  }
}) 