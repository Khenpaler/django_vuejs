<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Delete Task</h2>
      <p class="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
      <div class="flex justify-end space-x-3">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button 
          @click="$emit('confirm')"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          :disabled="loading"
        >
          <span v-if="loading" class="flex items-center">
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
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
}>()

defineEmits(['close', 'confirm'])
</script> 