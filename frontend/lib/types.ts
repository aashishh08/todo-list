export interface User {
  id: string
  username: string
  email: string
}

export interface Note {
  id: string
  content: string
  createdAt: string
  updatedAt?: string
}

export interface Todo {
  id: string
  title: string
  description?: string
  priority?: "low" | "medium" | "high"
  completed: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
  user?: User
  notes?: Note[]
}

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TodosResponse {
  todos: Todo[]
  pagination: PaginationInfo
}

export interface TodoFilters {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "ASC" | "DESC"
  status?: string
  priority?: string | string[]
  tags?: string | string[]
  search?: string
}
