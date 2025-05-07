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

export async function GET() {
  try {
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
