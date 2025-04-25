<template>
  <div class="min-h-screen flex flex-col bg-gray-50 font-sans antialiased text-gray-800">
    <header class="bg-white shadow">
      <nav class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-900">
              Task Manager
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <div class="relative">
                <button 
                  @click="isDropdownOpen = !isDropdownOpen" 
                  class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  <span class="font-semibold">{{ authStore.user?.username }}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 transition-transform" 
                    :class="{ 'rotate-180': isDropdownOpen }"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <!-- Dropdown Menu -->
                <div 
                  v-if="isDropdownOpen" 
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                >
                  <div class="px-4 py-2 text-sm text-gray-500">
                    Signed in as <span class="block font-medium text-gray-900 mt-0.5">{{ authStore.user?.username }}</span>
                  </div>
                  <button 
                    @click="logout" 
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <router-link to="/auth/login" class="text-gray-700 hover:text-blue-600 font-medium">Login</router-link>
              <router-link to="/auth/register" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition font-medium">Register</router-link>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-grow container mx-auto px-4 py-8">
      <router-view />
    </main>

    <footer class="bg-gray-800 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p>&copy; {{ new Date().getFullYear() }} Task Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { ref } from 'vue'

const authStore = useAuthStore()
const toast = useToast()
const isDropdownOpen = ref(false)

const logout = async () => {
  try {
    await authStore.logout()
    isDropdownOpen.value = false
    toast.success('Logged out successfully')
  } catch (error) {
    toast.error('Failed to logout')
  }
}
</script> 