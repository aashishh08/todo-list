import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Mock data - same as in the todos route
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const todoIndex = todos.findIndex((t) => t.id === params.id && t.user.id === userId)

    if (todoIndex === -1) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    const body = await request.json()

    if (!body.content) {
      return NextResponse.json({ error: "Note content is required" }, { status: 400 })
    }

    const newNote = {
      id: Math.random().toString(36).substring(2, 11),
      content: body.content,
      createdAt: new Date().toISOString(),
    }

    todos[todoIndex].notes = [...(todos[todoIndex].notes || []), newNote]

    return NextResponse.json(newNote)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 })
  }
}
