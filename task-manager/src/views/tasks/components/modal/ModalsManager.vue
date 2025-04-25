<template>
  <!-- Task Form Modal -->
  <Suspense v-if="isModalVisible('taskForm')">
    <template #default>
      <AsyncTaskFormModal
        :task="modalData.taskForm?.task"
        :loading="modalData.taskForm?.loading"
        @close="closeModal('taskForm')"
        @save="handleTaskSave"
      />
    </template>
    <template #fallback>
      <div v-html="LoadingModalComponent"></div>
    </template>
  </Suspense>

  <!-- Delete Confirmation Modal -->
  <Suspense v-if="isModalVisible('deleteConfirmation')">
    <template #default>
      <DeleteConfirmationModal
        :loading="modalData.deleteConfirmation?.loading"
        @close="closeModal('deleteConfirmation')"
        @confirm="handleTaskDelete"
      />
    </template>
    <template #fallback>
      <div v-html="LoadingModalComponent"></div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, h } from 'vue'

const DeleteConfirmationModal = defineAsyncComponent(() =>
  import('./DeleteConfirmationModal.vue')
)

const AsyncTaskFormModal = defineAsyncComponent(() =>
  import('./TaskFormModal.vue')
)

interface ModalState {
  taskForm?: {
    task: any | null
    loading: boolean
  }
  deleteConfirmation?: {
    taskId: number
    loading: boolean
  }
}

const LoadingModalComponent = `
<div class="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-lg shadow-xl p-8 flex items-center gap-3">
    <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>Loading...</span>
  </div>
</div>
`

const visibleModals = ref<Set<string>>(new Set())
const modalData = ref<ModalState>({})

const isModalVisible = (modalName: string): boolean => {
  return visibleModals.value.has(modalName)
}

const isAnyModalVisible = computed(() => visibleModals.value.size > 0)

const showModal = (modalName: string, data?: any) => {
  visibleModals.value.add(modalName)
  if (data) {
    modalData.value[modalName] = data
  }
}

const closeModal = (modalName: string) => {
  visibleModals.value.delete(modalName)
  delete modalData.value[modalName]
}

const handleTaskSave = async (formData: any) => {
  emit('saveTask', formData)
  closeModal('taskForm')
}

const handleTaskDelete = async () => {
  const taskId = modalData.value.deleteConfirmation?.taskId
  if (taskId) {
    emit('deleteTask', taskId)
    closeModal('deleteConfirmation')
  }
}

const emit = defineEmits(['saveTask', 'deleteTask'])

defineExpose({
  showModal,
  closeModal
})
</script> 