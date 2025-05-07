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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user")
    const format = searchParams.get("format") || "json"

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userTodos = todos.filter((todo) => todo.user.id === userId)

    if (format.toLowerCase() === "csv") {
      // Generate CSV
      const headers = ["id", "title", "description", "priority", "completed", "tags", "createdAt", "updatedAt"]
      const csvRows = [
        headers.join(","),
        ...userTodos.map((todo) => {
          return [
            todo.id,
            `"${todo.title.replace(/"/g, '""')}"`,
            `"${(todo.description || "").replace(/"/g, '""')}"`,
            todo.priority || "",
            todo.completed ? "true" : "false",
            `"${(todo.tags || []).join(";")}"`,
            todo.createdAt,
            todo.updatedAt,
          ].join(",")
        }),
      ]

      const csv = csvRows.join("\n")

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=todos.csv",
        },
      })
    } else {
      // Return JSON
      return NextResponse.json(userTodos)
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to export todos" }, { status: 500 })
  }
}
