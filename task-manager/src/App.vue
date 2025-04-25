<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import DefaultLayout from './components/layouts/DefaultLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Use the new checkAuth method
  authStore.checkAuth()
})  
</script>

<template>
  <DefaultLayout>
    <RouterView v-slot="{ Component }">
      <Transition 
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </DefaultLayout>
</template>