import type { Todo, TodosResponse, TodoFilters, User, Note } from "./types"

const API_BASE_URL = "/api"

// Helper function to build query string
const buildQueryString = (params: Record<string, any>): string => {
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}=${value.join(",")}`
      }
      return `${key}=${encodeURIComponent(value)}`
    })
    .join("&")

  return query ? `?${query}` : ""
}

// User APIs
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`)
  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }
  return response.json()
}

export const fetchUser = async (userId: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found")
    }
    throw new Error("Failed to fetch user")
  }
  return response.json()
}

export const fetchUserTodos = async (userId: string, filters?: TodoFilters): Promise<TodosResponse> => {
  const queryString = filters ? buildQueryString(filters) : ""
  const response = await fetch(`${API_BASE_URL}/users/${userId}/todos${queryString}`)
  if (!response.ok) {
    throw new Error("Failed to fetch user todos")
  }
  return response.json()
}

// Todo APIs
export const fetchTodos = async (userId: string, filters?: TodoFilters): Promise<TodosResponse> => {
  const params = { user: userId, ...(filters || {}) }
  const queryString = buildQueryString(params)
  const response = await fetch(`${API_BASE_URL}/todos${queryString}`)
  if (!response.ok) {
    throw new Error("Failed to fetch todos")
  }
  return response.json()
}

export const fetchTodo = async (todoId: string, userId: string): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}?user=${userId}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Todo not found")
    }
    throw new Error("Failed to fetch todo")
  }
  return response.json()
}

export const createTodo = async (
  userId: string,
  todoData: {
    title: string
    description?: string
    priority?: string
    tags?: string[]
    assignedUsers?: string[]
  },
): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos?user=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create todo")
  }

  return response.json()
}

export const updateTodo = async (
  todoId: string,
  userId: string,
  todoData: {
    title?: string
    description?: string
    priority?: string
    completed?: boolean
    tags?: string[]
    assignedUsers?: string[]
  },
): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}?user=${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update todo")
  }

  return response.json()
}

export const deleteTodo = async (todoId: string, userId: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}?user=${userId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete todo")
  }

  return response.json()
}

export const addNoteToTodo = async (todoId: string, userId: string, content: string): Promise<Note> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}/notes?user=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to add note")
  }

  return response.json()
}

export const exportTodos = async (userId: string, format: "json" | "csv" = "json"): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/todos/export?user=${userId}&format=${format}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to export todos")
  }

  return response.blob()
}
