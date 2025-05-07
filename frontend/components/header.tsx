"use client"

import type { User } from "@/lib/types"
import { FileDown, ChevronDown } from "lucide-react"
import Image from "next/image"
import { exportTodos } from "@/lib/api"

interface HeaderProps {
  user: User | null
  onExport: () => void
  onUserClick: () => void
}

export default function Header({ user, onExport, onUserClick }: HeaderProps) {
  if (!user) return null

  const handleExport = async () => {
    try {
      const format = window.confirm("Click OK to export as JSON, Cancel for CSV") ? "json" : "csv"
      const blob = await exportTodos(user.id, format)

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `todos-${user.username.toLowerCase().replace(/\s+/g, "-")}.${format}`
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      onExport()
    } catch (error) {
      console.error("Failed to export todos:", error)
      alert("Failed to export todos")
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
      <div className="flex items-center space-x-4">
        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
          onClick={handleExport}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export
        </button>
        <div className="flex items-center cursor-pointer" onClick={onUserClick}>
          <div className="flex items-center mr-6">
            <span className="mr-2">{user.username}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="relative w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="User avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
