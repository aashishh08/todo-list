"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { createTodo } from "@/lib/api"
import type { User } from "@/lib/types"

interface AddTodoModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSuccess: () => void
  users: User[]
}

export default function AddTodoModal({ isOpen, onClose, userId, onSuccess, users }: AddTodoModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [tags, setTags] = useState("")
  const [assignedUsers, setAssignedUsers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      await createTodo(userId, {
        title,
        description,
        priority,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        assignedUsers,
      })

      onSuccess()
      onClose()
    } catch (err) {
      setError("Failed to create todo")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUserToggle = (userId: string) => {
    if (assignedUsers.includes(userId)) {
      setAssignedUsers(assignedUsers.filter((id) => id !== userId))
    } else {
      setAssignedUsers([...assignedUsers, userId])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Todo</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Priority</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={priority === "low"}
                  onChange={() => setPriority("low")}
                  className="mr-2"
                />
                Low
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="medium"
                  checked={priority === "medium"}
                  onChange={() => setPriority("medium")}
                  className="mr-2"
                />
                Medium
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={priority === "high"}
                  onChange={() => setPriority("high")}
                  className="mr-2"
                />
                High
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="block mb-1 text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="work, personal, coding"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Assign Users</label>
            <div className="flex flex-wrap gap-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center px-3 py-1 text-sm border rounded-full cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assignedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="mr-2"
                  />
                  @{user.username.toLowerCase().replace(/\s+/g, "_")}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Todo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
