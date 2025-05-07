"use client"

import { X } from "lucide-react"
import type { User } from "@/lib/types"
import Image from "next/image"

interface UserSwitcherProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
  currentUser: User | null
  onUserSelect: (user: User) => void
}

export default function UserSwitcher({ isOpen, onClose, users, currentUser, onUserSelect }: UserSwitcherProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Switch User</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                currentUser?.id === user.id ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              onClick={() => onUserSelect(user)}
            >
              <div className="relative w-10 h-10 overflow-hidden bg-gray-200 rounded-full mr-3">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt={`${user.username} avatar`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              {currentUser?.id === user.id && (
                <div className="ml-auto px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Current
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
