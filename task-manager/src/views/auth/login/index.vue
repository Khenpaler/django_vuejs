<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Login</h1>
    
    <div v-if="authStore.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
      <p>{{ typeof authStore.error === 'string' ? authStore.error : Object.values(authStore.error).flat().join(', ') }}</p>
    </div>
    
    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input 
          id="username" 
          v-model="formData.username" 
          type="text" 
          required
          :disabled="authStore.loading"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your username"
        >
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          id="password" 
          v-model="formData.password" 
          type="password" 
          required
          :disabled="authStore.loading"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password"
        >
      </div>
      
      <button 
        type="submit" 
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        :disabled="authStore.loading"
      >
        <span v-if="authStore.loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging in...
        </span>
        <span v-else>Login</span>
      </button>
    </form>
    
    <div class="mt-4 text-center text-sm text-gray-600">
      Don't have an account? <router-link :to="{ name: 'register' }" class="text-blue-600 hover:underline font-medium">Register</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useToast } from 'vue-toastification'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const toast = useToast()

const formData = ref({
  username: '',
  password: ''
})

const login = async () => {
  try {
    const success = await authStore.login({
      username: formData.value.username,
      password: formData.value.password
    })
    
    // Only show success toast if login was successful
    if (success) {
      toast.success('Logged in successfully')
    }
  } catch (error) {
    toast.error(typeof authStore.error === 'string' 
      ? authStore.error 
      : 'Failed to login. Please check your credentials.')
  }
}
</script> 