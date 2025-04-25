<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">My Tasks</h1>
        <p class="text-gray-600 mt-1">Manage your tasks and stay organized</p>
      </div>
      <button 
        @click="showCreateTaskModal = true" 
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        New Task
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="tasksStore.error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ tasksStore.error }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="tasksStore.loading && !tasksStore.tasks.length" class="text-center py-12">
      <svg class="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-gray-600">Loading your tasks...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!tasksStore.tasks.length" class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
      <p class="mt-2 text-gray-600">Get started by creating your first task</p>
      <button 
        @click="showCreateTaskModal = true"
        class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
      >
        Create Task
      </button>
    </div>

    <!-- Task List -->
    <div v-else class="space-y-4">
      <div 
        v-for="task in tasksStore.tasks" 
        :key="task.id" 
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        :class="{ 'opacity-75': task.completed }"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 pt-1">
              <input 
                type="checkbox" 
                :checked="task.completed" 
                @change="toggleTaskStatus(task)"
                :disabled="tasksStore.loading"
                class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              >
            </div>
            <div class="ml-3 flex-1">
              <h3 
                class="text-lg font-medium text-gray-900"
                :class="{ 'line-through text-gray-500': task.completed }"
              >
                {{ task.title }}
              </h3>
              <p 
                v-if="task.description"
                class="mt-1 text-gray-600"
                :class="{ 'text-gray-400': task.completed }"
              >
                {{ task.description }}
              </p>
              <div class="mt-2 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(task.due_date) }}
              </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex space-x-2">
              <button 
                @click="editTask(task)" 
                class="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200"
                title="Edit task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button 
                @click="confirmDelete(task.id)" 
                class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200"
                title="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8">
        <Pagination
          :total-items="tasksStore.totalCount"
          :items-per-page="tasksStore.pageSize"
          :current-page="tasksStore.currentPage"
          @update:page="handlePageChange"
        >
          <PaginationContent>
            <PaginationItem
              v-for="page in pages"
              :key="page"
              :value="page"
              :is-active="page === tasksStore.currentPage"
              @click="goToPage(page)"
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>

    <!-- Task Form Modal -->
    <TaskFormModal
      v-if="showCreateTaskModal || editingTask"
      :task="editingTask"
      :loading="tasksStore.loading"
      @close="closeTaskModal"
      @save="saveTask"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Delete Task</h2>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button 
            @click="deleteTask"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            :disabled="tasksStore.loading"
          >
            <span v-if="tasksStore.loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import TaskFormModal from './components/TaskFormModal.vue'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'

const router = useRouter()
const tasksStore = useTasksStore()
const authStore = useAuthStore()

// UI state
const showCreateTaskModal = ref(false)
const editingTask = ref(null)
const showDeleteModal = ref(false)
const taskToDeleteId = ref(null)

// Pagination computed properties
const totalPages = computed(() => 
  Math.ceil(tasksStore.totalCount / tasksStore.pageSize)
)

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

const handlePageChange = async (page: number) => {
  await goToPage(page)
}

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  await tasksStore.fetchTasks(page)
}

// Check authentication and fetch tasks
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await tasksStore.fetchTasks(1)
})

// Format date for display
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No due date'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Task actions
const toggleTaskStatus = async (task: any) => {
  await tasksStore.updateTask(task.id, {
    ...task,
    completed: !task.completed
  })
}

const editTask = (task: any) => {
  editingTask.value = task
}

const closeTaskModal = () => {
  showCreateTaskModal.value = false
  editingTask.value = null
}

const saveTask = async (formData: any) => {
  try {
    if (editingTask.value) {
      await tasksStore.updateTask(editingTask.value.id, formData)
    } else {
      console.log('Creating new task with data:', formData)
      const result = await tasksStore.createTask(formData)
      console.log('Create task result:', result)
      if (!result) {
        throw new Error('Failed to create task')
      }
    }
    closeTaskModal()
  } catch (error) {
    console.error('Error saving task:', error)
  }
}

const confirmDelete = (id: number) => {
  taskToDeleteId.value = id
  showDeleteModal.value = true
}

const deleteTask = async () => {
  await tasksStore.deleteTask(taskToDeleteId.value)
  showDeleteModal.value = false
  taskToDeleteId.value = null
}

// Add this after your store declarations
watch(() => tasksStore.tasks, (newTasks) => {
  console.log('Tasks array changed:', newTasks)
}, { deep: true })
</script> 