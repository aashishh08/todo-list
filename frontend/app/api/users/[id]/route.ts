import { NextResponse } from "next/server"

// Mock data
const users = [
  {
    id: "1",
    username: "John Doe",
    email: "john@example.com",
  },
  {
    id: "2",
    username: "Jane Smith",
    email: "jane@example.com",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = users.find((u) => u.id === params.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
