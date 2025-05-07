"use client"

import type { Todo } from "@/lib/types"
import { MessageSquare, Edit, Trash } from "lucide-react"
import { deleteTodo, updateTodo } from "@/lib/api"
import { useState } from "react"

interface TodoItemProps {
  todo: Todo
  onEdit: () => void
  onAddNote: () => void
}

export default function TodoItem({ todo, onEdit, onAddNote }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return

    try {
      setIsDeleting(true)
      await deleteTodo(todo.id, todo.user?.id || "")
      window.location.reload() // Simple refresh for now
    } catch (error) {
      console.error("Failed to delete todo:", error)
      alert("Failed to delete todo")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleComplete = async () => {
    try {
      setIsUpdating(true)
      await updateTodo(todo.id, todo.user?.id || "", {
        completed: !todo.completed,
      })
      window.location.reload() // Simple refresh for now
    } catch (error) {
      console.error("Failed to update todo:", error)
      alert("Failed to update todo")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="flex items-start">
        <input
          type="checkbox"
          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={isUpdating}
        />
        <div className="flex-1 ml-3">
          <h3 className={`text-lg font-medium ${todo.completed ? "text-gray-500 line-through" : "text-gray-800"}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? "text-gray-400" : "text-gray-600"}`}>{todo.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {todo.priority && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  todo.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : todo.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {todo.priority}
              </span>
            )}
            {todo.tags &&
              todo.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
                  {tag}
                </span>
              ))}
            {todo.user && (
              <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                @{todo.user.username.toLowerCase().replace(/\s+/g, "_")}
              </span>
            )}
          </div>
          {todo.notes && todo.notes.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {todo.notes.length} note{todo.notes.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button className="p-1 text-gray-500 rounded hover:bg-gray-100" onClick={onAddNote} title="Add note">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-1 text-gray-500 rounded hover:bg-gray-100" onClick={onEdit} title="Edit todo">
            <Edit className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 rounded hover:bg-gray-100"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete todo"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
