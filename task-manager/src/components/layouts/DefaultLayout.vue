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
              <router-link to="/tasks" class="text-gray-700 hover:text-blue-600 font-medium">Tasks</router-link>
              <button @click.prevent="logout" class="text-gray-700 hover:text-blue-600 font-medium">Logout</button>
              <div class="text-sm text-gray-600 border-l pl-4 ml-2">
                Hello, <span class="font-semibold">{{ authStore.user?.username }}</span>
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

const authStore = useAuthStore()
const toast = useToast()

const logout = async () => {
  try {
    await authStore.logout()
    toast.success('Logged out successfully')
  } catch (error) {
    toast.error('Failed to logout')
  }
}
</script> 