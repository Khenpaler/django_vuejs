<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Create Account</h1>
    
    <div v-if="authStore.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
      <p>{{ typeof authStore.error === 'string' ? authStore.error : Object.values(authStore.error).flat().join(', ') }}</p>
    </div>
    
    <form @submit.prevent="register" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input 
          id="username" 
          v-model="formData.username" 
          type="text" 
          required
          :disabled="authStore.loading"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
      </div>
      
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          id="email" 
          v-model="formData.email" 
          type="email" 
          required
          :disabled="authStore.loading"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
      </div>
      
      <div>
        <label for="first-name" class="block text-sm font-medium text-gray-700 mb-1">First name</label>
        <input 
          id="first-name" 
          v-model="formData.first_name" 
          type="text" 
          required
          :disabled="authStore.loading"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
      </div>
      
      <div>
        <label for="last-name" class="block text-sm font-medium text-gray-700 mb-1">Last name</label>
        <input 
          id="last-name" 
          v-model="formData.last_name" 
          type="text" 
          required
          :disabled="authStore.loading"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        >
      </div>
      
      <div>
        <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input 
          id="confirm-password" 
          v-model="formData.confirmPassword" 
          type="password" 
          required
          :disabled="authStore.loading"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
        <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">Passwords do not match</p>
      </div>
      
      <button 
        type="submit" 
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        :disabled="authStore.loading || passwordMismatch"
      >
        <span v-if="authStore.loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating account...
        </span>
        <span v-else>Create Account</span>
      </button>
    </form>
    
    <div class="mt-4 text-center text-sm text-gray-600">
      Already have an account? <router-link :to="{ name: 'login' }" class="text-blue-600 hover:underline font-medium">Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const formData = ref({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  confirmPassword: ''
})

const passwordMismatch = computed(() => {
  return formData.value.password && 
         formData.value.confirmPassword && 
         formData.value.password !== formData.value.confirmPassword
})

const register = async () => {
  if (passwordMismatch.value) return
  
  await authStore.register({
    username: formData.value.username,
    email: formData.value.email,
    first_name: formData.value.first_name,
    last_name: formData.value.last_name,
    password: formData.value.password,
    password2: formData.value.confirmPassword
  })
}
</script> 