// Vue imports
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// Store imports
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'

// Types
import type { Task, TaskFormData } from './types'

/**
 * Tasks Management Composable
 * 
 * Handles the business logic for task operations and pagination,
 * coordinating between the UI components and the tasks store.
 */
export function useTasksManagement() {
  // Dependencies
  const router = useRouter()
  const tasksStore = useTasksStore()
  const authStore = useAuthStore()
  const modalsManager = ref()
  const toast = useToast()

  /**
   * Calculate total number of pages based on total tasks and page size
   */
  const totalPages = computed(() => 
    Math.ceil(tasksStore.totalCount / tasksStore.pageSize)
  )

  /**
   * Generate array of page numbers to display in pagination
   * Shows:
   * - Always first page
   * - 2 pages before and after current page
   * - Always last page
   * - Sorts and removes duplicates
   */
  const pages = computed(() => {
    const total = totalPages.value
    const current = tasksStore.currentPage
    const items: number[] = []

    // Always show first page
    items.push(1)

    // Calculate range around current page
    for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
      items.push(i)
    }

    // Always show last page if there is more than one page
    if (total > 1) {
      items.push(total)
    }

    return [...new Set(items)].sort((a, b) => a - b)
  })

  // Task Operations

  /**
   * Toggle the completion status of a task
   * @param task - The task to toggle
   */
  const toggleTaskStatus = async (task: Task) => {
    try {
      await tasksStore.updateTask(task.id, {
        ...task,
        completed: !task.completed
      })
      toast.success(`Task "${task.title}" ${!task.completed ? 'completed' : 'uncompleted'}`)
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  /**
   * Open modal for creating a new task
   */
  const handleNewTask = () => {
    modalsManager.value.showModal('taskForm', { task: null, loading: false })
  }

  /**
   * Open modal for editing an existing task
   * @param task - The task to edit
   */
  const editTask = (task: Task) => {
    modalsManager.value.showModal('taskForm', { task, loading: false })
  }

  /**
   * Open confirmation modal for deleting a task
   * @param id - ID of the task to delete
   */
  const confirmDelete = (id: number) => {
    modalsManager.value.showModal('deleteConfirmation', { taskId: id, loading: false })
  }

  /**
   * Save a task (create or update)
   * @param formData - Task form data
   * 
   * If formData has an ID, updates existing task
   * Otherwise creates a new task
   */
  const saveTask = async (formData: TaskFormData) => {
    try {
      if (formData.id) {
        await tasksStore.updateTask(formData.id, formData)
        toast.success(`Task "${formData.title}" updated successfully`)
      } else {
        const result = await tasksStore.createTask(formData)
        if (!result) {
          throw new Error('Failed to create task')
        }
        toast.success(`Task "${formData.title}" created successfully`)
      }
    } catch (error) {
      console.error('Error saving task:', error)
      toast.error(formData.id ? 'Failed to update task' : 'Failed to create task')
    }
  }

  /**
   * Delete a task
   * @param taskId - ID of the task to delete
   */
  const deleteTask = async (taskId: number) => {
    try {
      const taskTitle = tasksStore.tasks.find(t => t.id === taskId)?.title
      await tasksStore.deleteTask(taskId)
      toast.success(taskTitle ? `Task "${taskTitle}" deleted` : 'Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  // Pagination Operations

  /**
   * Handle page change from pagination component
   * @param page - Page number to navigate to
   */
  const handlePageChange = async (page: number) => {
    await goToPage(page)
  }

  /**
   * Navigate to a specific page
   * @param page - Target page number
   * 
   * Validates page number is within bounds before fetching
   */
  const goToPage = async (page: number) => {
    if (page < 1 || page > totalPages.value) return
    try {
      await tasksStore.fetchTasks(page)
    } catch (error) {
      toast.error('Failed to load tasks')
    }
  }

  /**
   * Initialize tasks view
   * 
   * - Checks authentication status
   * - Redirects to login if not authenticated
   * - Fetches first page of tasks if authenticated
   */
  const initializeTasks = async () => {
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return
    }
    try {
      await tasksStore.fetchTasks(1)
    } catch (error) {
      toast.error('Failed to load tasks')
    }
  }

  // Watchers

  /**
   * Watch for tasks changes
   * Useful for debugging and tracking task updates
   */
  watch(() => tasksStore.tasks, (newTasks) => {
    console.log('Tasks array changed:', newTasks)
  }, { deep: true })

  return {
    // Store references
    tasksStore,
    modalsManager,

    // Computed properties
    totalPages,
    pages,

    // Task operations
    toggleTaskStatus,
    handleNewTask,
    editTask,
    confirmDelete,
    saveTask,
    deleteTask,

    // Pagination operations
    handlePageChange,
    goToPage,

    // Initialization
    initializeTasks
  }
} 