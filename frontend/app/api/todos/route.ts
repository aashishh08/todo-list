import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Mock data
const todos = [
  {
    id: "1",
    title: "Complete the todo app assignment",
    description: "Finish building the todo application with all required features",
    priority: "high",
    completed: false,
    tags: ["work", "coding"],
    createdAt: "2023-05-01T10:00:00Z",
    updatedAt: "2023-05-01T10:00:00Z",
    user: {
      id: "1",
      username: "John Doe",
      email: "john@example.com",
    },
    notes: [
      {
        id: "101",
        content: "Started working on the UI components",
        createdAt: "2023-05-01T11:00:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Buy groceries",
    description: "Get milk, eggs, and bread",
    priority: "medium",
    completed: false,
    tags: ["personal", "shopping"],
    createdAt: "2023-05-02T09:00:00Z",
    updatedAt: "2023-05-02T09:00:00Z",
    user: {
      id: "1",
      username: "John Doe",
      email: "john@example.com",
    },
    notes: [],
  },
  {
    id: "3",
    title: "Go for a run",
    description: "Run for 30 minutes in the park",
    priority: "low",
    completed: true,
    tags: ["health", "personal"],
    createdAt: "2023-05-03T08:00:00Z",
    updatedAt: "2023-05-03T08:30:00Z",
    user: {
      id: "1",
      username: "John Doe",
      email: "john@example.com",
    },
    notes: [],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Reuse the same filtering logic as in the user todos endpoint
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "ASC"
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const tags = searchParams.get("tags")
    const search = searchParams.get("search")

    // Filter todos by user ID
    let filteredTodos = todos.filter((todo) => todo.user.id === userId)

    // Apply filters
    if (status) {
      const isCompleted = status.toLowerCase() === "completed"
      filteredTodos = filteredTodos.filter((todo) => todo.completed === isCompleted)
    }

    if (priority) {
      const priorities = priority.split(",")
      filteredTodos = filteredTodos.filter((todo) => todo.priority && priorities.includes(todo.priority))
    }

    if (tags) {
      const tagList = tags.split(",")
      filteredTodos = filteredTodos.filter((todo) => todo.tags && todo.tags.some((tag) => tagList.includes(tag)))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          (todo.description && todo.description.toLowerCase().includes(searchLower)),
      )
    }

    // Sort todos
    filteredTodos.sort((a: any, b: any) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (sortOrder.toUpperCase() === "ASC") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTodos = filteredTodos.slice(startIndex, endIndex)

    return NextResponse.json({
      todos: paginatedTodos,
      pagination: {
        total: filteredTodos.length,
        page,
        limit,
        totalPages: Math.ceil(filteredTodos.length / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const body = await request.json()

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const user = {
      id: userId,
      username: "John Doe", // In a real app, fetch the user from the database
      email: "john@example.com",
    }

    const newTodo = {
      id: (todos.length + 1).toString(),
      title: body.title,
      description: body.description || "",
      priority: body.priority || "medium",
      completed: false,
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user,
      notes: [],
    }

    todos.push(newTodo)

    return NextResponse.json(newTodo)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 })
  }
}
