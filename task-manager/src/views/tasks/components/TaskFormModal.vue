<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
      <div class="flex justify-between items-center border-b p-4">
        <h2 class="text-xl font-semibold text-gray-800">{{ isEditing ? 'Edit Task' : 'Create Task' }}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-4">
        <div class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              id="title" 
              v-model="form.title" 
              type="text" 
              required
              :disabled="loading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task title"
            >
          </div>
          
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              id="description" 
              v-model="form.description" 
              rows="3"
              :disabled="loading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task description"
            ></textarea>
          </div>
          
          <div>
            <label for="due-date" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input 
              id="due-date" 
              v-model="form.due_date" 
              type="date" 
              :disabled="loading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          
          <div class="flex items-center">
            <input 
              id="completed"
              type="checkbox" 
              v-model="form.completed"
              :disabled="loading"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
            <label for="completed" class="ml-2 text-sm text-gray-700">Mark as completed</label>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            :disabled="loading"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="loading || !form.title"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>{{ isEditing ? 'Update' : 'Create' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const isEditing = computed(() => !!props.task)

const form = ref({
  title: '',
  description: '',
  due_date: new Date().toISOString().split('T')[0],
  completed: false
})

// Initialize form with task data if editing
onMounted(() => {
  if (props.task) {
    form.value = {
      title: props.task.title,
      description: props.task.description || '',
      due_date: props.task.due_date ? new Date(props.task.due_date).toISOString().split('T')[0] : '',
      completed: props.task.completed
    }
  }
})

const handleSubmit = () => {
  emit('save', form.value)
}
</script> 