"use client"

import type React from "react"
import type { Todo } from "@/lib/types"
import { Search, Plus, ChevronLeft, ChevronRight, ArrowDown, ArrowUp } from "lucide-react"
import TodoItem from "./todo-item"
import { useState } from "react"

interface TodoListProps {
  todos: Todo[]
  loading: boolean
  error: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onSearch: (query: string) => void
  onAddTodo: () => void
  onEditTodo: (todo: Todo) => void
  onAddNote: (todo: Todo) => void
  onSortChange: (field: string) => void
  currentSortBy: string
  currentSortOrder: "ASC" | "DESC"
}

export default function TodoList({
  todos,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onAddTodo,
  onEditTodo,
  onAddNote,
  onSortChange,
  currentSortBy,
  currentSortOrder,
}: TodoListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const renderSortIcon = (field: string) => {
    if (currentSortBy !== field) return null

    return currentSortOrder === "ASC" ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={onAddTodo}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Todo
        </button>
        <form onSubmit={handleSearchSubmit} className="relative w-96">
          <input
            type="text"
            placeholder="Search todos..."
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="w-4 h-4 text-gray-500" />
          </button>
        </form>
      </div>

      <div className="mb-4 flex justify-end">
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">Sort by:</span>
          <button
            className={`px-2 py-1 flex items-center ${currentSortBy === "createdAt" ? "font-medium" : ""}`}
            onClick={() => onSortChange("createdAt")}
          >
            Date {renderSortIcon("createdAt")}
          </button>
          <button
            className={`px-2 py-1 flex items-center ${currentSortBy === "priority" ? "font-medium" : ""}`}
            onClick={() => onSortChange("priority")}
          >
            Priority {renderSortIcon("priority")}
          </button>
          <button
            className={`px-2 py-1 flex items-center ${currentSortBy === "title" ? "font-medium" : ""}`}
            onClick={() => onSortChange("title")}
          >
            Title {renderSortIcon("title")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      ) : todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-gray-500">No todos found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or create a new todo</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onEdit={() => onEditTodo(todo)} onAddNote={() => onAddNote(todo)} />
          ))}

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 text-sm font-medium rounded ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <div className="text-sm text-gray-700">
              {currentPage} / {totalPages || 1}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`flex items-center px-3 py-1 text-sm font-medium rounded ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
