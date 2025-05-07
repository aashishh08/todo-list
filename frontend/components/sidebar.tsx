"use client"

interface SidebarProps {
  priorityFilters: {
    high: boolean
    medium: boolean
    low: boolean
  }
  onPriorityChange: (priority: "high" | "medium" | "low") => void
  selectedTags: string[]
  onTagSelect: (tag: string) => void
}

export default function Sidebar({ priorityFilters, onPriorityChange, selectedTags, onTagSelect }: SidebarProps) {
  // Sample tags - in a real app, these would come from the API
  const availableTags = ["work", "coding", "personal", "shopping", "health"]

  return (
    <aside className="w-64 p-6 bg-white border-r border-gray-200">
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Filters</h2>
        <div className="mb-6">
          <h3 className="mb-2 text-base font-medium text-gray-700">Priority</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={priorityFilters.high}
                onChange={() => onPriorityChange("high")}
              />
              <span className="ml-2 text-sm text-gray-700">High</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={priorityFilters.medium}
                onChange={() => onPriorityChange("medium")}
              />
              <span className="ml-2 text-sm text-gray-700">Medium</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={priorityFilters.low}
                onChange={() => onPriorityChange("low")}
              />
              <span className="ml-2 text-sm text-gray-700">Low</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-base font-medium text-gray-700">Tags</h3>
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <div
                key={tag}
                className={`px-4 py-2 text-sm rounded-full cursor-pointer ${
                  selectedTags.includes(tag)
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
