// Task Types
export interface Task {
  id: number
  title: string
  description?: string
  due_date?: string
  completed: boolean
}

export type TaskData = Omit<Task, 'id'>

export interface TaskParams {
  page?: number
  page_size?: number
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type TaskPaginatedResponse = PaginatedResponse<Task>

// Form Types
export interface TaskFormData {
  id?: number
  title: string
  description?: string
  due_date?: string
  completed: boolean
}

// Modal Types
export interface TaskModalProps {
  task: Task | null
  loading: boolean
}

export interface DeleteModalProps {
  taskId: number
  loading: boolean
}
