"use client"

import { useState, useEffect } from "react"
import Header from "./header"
import Sidebar from "./sidebar"
import TodoList from "./todo-list"
import AddTodoModal from "./add-todo-modal"
import EditTodoModal from "./edit-todo-modal"
import AddNoteModal from "./add-note-modal"
import UserSwitcher from "./user-switcher"
import type { Todo, User } from "@/lib/types"
import { fetchUsers, fetchUserTodos } from "@/lib/api"

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilters, setPriorityFilters] = useState({
    high: true,
    medium: false,
    low: false,
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC")

  // Modal states
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false)
  const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false)
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false)
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false)
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers()
        setUsers(usersData)
        if (usersData.length > 0 && !currentUser) {
          setCurrentUser(usersData[0])
        }
      } catch (err) {
        setError("Failed to load users")
      }
    }

    loadUsers()
  }, [])

  // Load todos when user changes
  useEffect(() => {
    if (!currentUser) return

    const loadTodos = async () => {
      try {
        setLoading(true)
        const response = await fetchUserTodos(currentUser.id, {
          page: currentPage,
          limit: 10,
          search: searchQuery,
          priority: getSelectedPriorities(),
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          sortBy,
          sortOrder,
        })
        setTodos(response.todos)
        setFilteredTodos(response.todos)
        setTotalPages(response.pagination.totalPages)
        setLoading(false)
      } catch (err) {
        setError("Failed to load todos")
        setLoading(false)
      }
    }

    loadTodos()
  }, [currentUser, currentPage, searchQuery, priorityFilters, selectedTags, sortBy, sortOrder])

  const getSelectedPriorities = () => {
    const priorities = []
    if (priorityFilters.high) priorities.push("high")
    if (priorityFilters.medium) priorities.push("medium")
    if (priorityFilters.low) priorities.push("low")
    return priorities.length > 0 ? priorities.join(",") : undefined
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePriorityChange = (priority: "high" | "medium" | "low") => {
    setPriorityFilters({
      ...priorityFilters,
      [priority]: !priorityFilters[priority],
    })
    setCurrentPage(1)
  }

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
    } else {
      setSortBy(field)
      setSortOrder("ASC")
    }
  }

  const handleAddTodo = () => {
    setIsAddTodoModalOpen(true)
  }

  const handleEditTodo = (todo: Todo) => {
    setCurrentTodo(todo)
    setIsEditTodoModalOpen(true)
  }

  const handleAddNote = (todo: Todo) => {
    setCurrentTodo(todo)
    setIsAddNoteModalOpen(true)
  }

  const handleUserSwitch = (user: User) => {
    setCurrentUser(user)
    setIsUserSwitcherOpen(false)
    setCurrentPage(1)
  }

  const refreshTodos = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const response = await fetchUserTodos(currentUser.id, {
        page: currentPage,
        limit: 10,
        search: searchQuery,
        priority: getSelectedPriorities(),
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        sortBy,
        sortOrder,
      })
      setTodos(response.todos)
      setFilteredTodos(response.todos)
      setTotalPages(response.pagination.totalPages)
      setLoading(false)
    } catch (err) {
      setError("Failed to load todos")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} onExport={refreshTodos} onUserClick={() => setIsUserSwitcherOpen(true)} />
      <div className="flex">
        <Sidebar
          priorityFilters={priorityFilters}
          onPriorityChange={handlePriorityChange}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />
        <TodoList
          todos={filteredTodos}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onAddTodo={handleAddTodo}
          onEditTodo={handleEditTodo}
          onAddNote={handleAddNote}
          onSortChange={handleSortChange}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </div>

      {isAddTodoModalOpen && currentUser && (
        <AddTodoModal
          isOpen={isAddTodoModalOpen}
          onClose={() => setIsAddTodoModalOpen(false)}
          userId={currentUser.id}
          onSuccess={refreshTodos}
          users={users}
        />
      )}

      {isEditTodoModalOpen && currentTodo && currentUser && (
        <EditTodoModal
          isOpen={isEditTodoModalOpen}
          onClose={() => setIsEditTodoModalOpen(false)}
          todo={currentTodo}
          userId={currentUser.id}
          onSuccess={refreshTodos}
          users={users}
        />
      )}

      {isAddNoteModalOpen && currentTodo && currentUser && (
        <AddNoteModal
          isOpen={isAddNoteModalOpen}
          onClose={() => setIsAddNoteModalOpen(false)}
          todoId={currentTodo.id}
          userId={currentUser.id}
          onSuccess={refreshTodos}
        />
      )}

      {isUserSwitcherOpen && (
        <UserSwitcher
          isOpen={isUserSwitcherOpen}
          onClose={() => setIsUserSwitcherOpen(false)}
          users={users}
          currentUser={currentUser}
          onUserSelect={handleUserSwitch}
        />
      )}
    </div>
  )
}
