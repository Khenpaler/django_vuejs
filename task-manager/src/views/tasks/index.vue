<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Task Header -->
    <TaskHeader @new-task="handleNewTask" />

    <!-- Task List with all states -->
    <TaskList
      :tasks="tasksStore.tasks"
      :loading="tasksStore.loading"
      :error="tasksStore.error"
      @toggle-status="toggleTaskStatus"
      @edit-task="editTask"
      @delete-task="confirmDelete"
      @new-task="handleNewTask"
    />

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

    <!-- Modals -->
    <ModalsManager
      ref="modalsManager"
      @save-task="saveTask"
      @delete-task="deleteTask"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'

import TaskHeader from './components/TaskHeader.vue'
import TaskList from './components/TaskList.vue'
import ModalsManager from './components/modal/ModalsManager.vue'

import { useTasksManagement } from './useTasksManagement'

const {
  tasksStore,
  modalsManager,
  pages,
  toggleTaskStatus,
  handleNewTask,
  editTask,
  confirmDelete,
  saveTask,
  deleteTask,
  handlePageChange,
  goToPage,
  initializeTasks
} = useTasksManagement()

onMounted(initializeTasks)
</script> 