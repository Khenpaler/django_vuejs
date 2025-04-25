<template>
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">My Tasks</h1>
      <p class="text-gray-600 mt-1">Manage your tasks and stay organized</p>
    </div>
    <button 
      @click="$emit('newTask')" 
      class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      New Task
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits(['newTask'])
</script> 