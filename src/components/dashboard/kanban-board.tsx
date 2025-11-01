"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import KanbanColumn from "@/components/dashboard/kanban-column"
import KanbanTaskModal from "@/components/dashboard/kanban-task-modal"

export interface Developer {
  id: string
  name: string
  avatar: string
  color: string
}

export interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  assigneeId?: string
  dueDate?: string
  storyPoints?: number
  labels?: string[]
  columnId?: string
}

export interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

const DEVELOPERS: Developer[] = [
  { id: "1", name: "Alex Chen", avatar: "AC", color: "bg-blue-500" },
  { id: "2", name: "Sarah Johnson", avatar: "SJ", color: "bg-purple-500" },
  { id: "3", name: "Mike Brown", avatar: "MB", color: "bg-green-500" },
  { id: "4", name: "Emma Davis", avatar: "ED", color: "bg-pink-500" },
  { id: "5", name: "James Wilson", avatar: "JW", color: "bg-orange-500" },
]

const DEFAULT_COLUMNS: Column[] = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-slate-50 dark:bg-slate-900/30",
    tasks: [
      {
        id: "TASK-001",
        title: "Design new landing page",
        description: "Create responsive design for new product launch",
        priority: "high",
        assigneeId: "1",
        dueDate: "2025-01-20",
        storyPoints: 8,
        labels: ["design", "frontend"],
      },
      {
        id: "TASK-002",
        title: "Set up analytics dashboard",
        description: "Integrate analytics and create dashboard",
        priority: "medium",
        assigneeId: "2",
        dueDate: "2025-01-25",
        storyPoints: 5,
        labels: ["backend", "analytics"],
      },
      {
        id: "TASK-003",
        title: "Database migration",
        description: "Migrate from MongoDB to PostgreSQL",
        priority: "high",
        dueDate: "2025-01-22",
        storyPoints: 13,
        labels: ["database", "backend"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-blue-50 dark:bg-blue-900/20",
    tasks: [
      {
        id: "TASK-004",
        title: "Build user authentication",
        description: "Implement OAuth 2.0 and JWT authentication",
        priority: "high",
        assigneeId: "3",
        dueDate: "2025-01-18",
        storyPoints: 8,
        labels: ["auth", "backend"],
      },
      {
        id: "TASK-005",
        title: "API integration",
        description: "Connect frontend to backend REST API",
        priority: "medium",
        assigneeId: "4",
        storyPoints: 5,
        labels: ["frontend", "api"],
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "bg-amber-50 dark:bg-amber-900/20",
    tasks: [
      {
        id: "TASK-006",
        title: "Code review fixes",
        description: "Address feedback from team review",
        priority: "high",
        assigneeId: "5",
        storyPoints: 3,
        labels: ["review"],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-50 dark:bg-green-900/20",
    tasks: [
      {
        id: "TASK-007",
        title: "Project setup",
        description: "Initialize Next.js project with TypeScript",
        priority: "high",
        assigneeId: "1",
        storyPoints: 2,
        labels: ["setup"],
      },
      {
        id: "TASK-008",
        title: "Environment configuration",
        description: "Configure .env files and deployment settings",
        priority: "low",
        assigneeId: "2",
        storyPoints: 1,
        labels: ["devops"],
      },
    ],
  },
]

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS)
  const [draggedTask, setDraggedTask] = useState<{ task: Task; sourceColumnId: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalColumnId, setModalColumnId] = useState<string | null>(null)

  const filteredColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.id.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesPriority = !selectedPriority || task.priority === selectedPriority
        const matchesAssignee = !selectedAssignee || task.assigneeId === selectedAssignee

        return matchesSearch && matchesPriority && matchesAssignee
      }),
    }))
  }, [columns, searchQuery, selectedPriority, selectedAssignee])

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, sourceColumnId: columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return

    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.id === draggedTask.sourceColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== draggedTask.task.id),
          }
        }
        if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, draggedTask.task],
          }
        }
        return column
      }),
    )

    setDraggedTask(null)
  }

  const handleAddTask = (columnId: string) => {
    setModalColumnId(columnId)
    setIsModalOpen(true)
  }

  const handleCreateTask = (taskData: Omit<Task, "id">) => {
    if (!modalColumnId) return

    const newTask: Task = {
      ...taskData,
      id: `TASK-${String(Math.floor(Math.random() * 10000)).padStart(3, "0")}`,
    }

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === modalColumnId ? { ...column, tasks: [...column.tasks, newTask] } : column,
      ),
    )

    setIsModalOpen(false)
    setModalColumnId(null)
  }

  const handleUpdateTask = (columnId: string, taskId: string, updatedTask: Task) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.map((task) => (task.id === taskId ? updatedTask : task)),
            }
          : column,
      ),
    )
  }

  const handleDeleteTask = (columnId: string, taskId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            }
          : column,
      ),
    )
  }

  const totalPoints = useMemo(() => {
    return columns.reduce((sum, column) => {
      return sum + column.tasks.reduce((colSum, task) => colSum + (task.storyPoints || 0), 0)
    }, 0)
  }, [columns])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by task ID, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="text-sm font-semibold text-foreground">
            Total Story Points: <span className="text-primary">{totalPoints}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {["low", "medium", "high"].map((priority) => (
              <Badge
                key={priority}
                variant={selectedPriority === priority ? "default" : "outline"}
                onClick={() => setSelectedPriority(selectedPriority === priority ? null : priority)}
                className="cursor-pointer capitalize"
              >
                {priority}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {DEVELOPERS.map((dev) => (
              <Badge
                key={dev.id}
                variant={selectedAssignee === dev.id ? "default" : "outline"}
                onClick={() => setSelectedAssignee(selectedAssignee === dev.id ? null : dev.id)}
                className="cursor-pointer"
              >
                {dev.avatar}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg border border-border shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredColumns.map((column) => (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
              className="flex flex-col"
            >
              <KanbanColumn
                column={column}
                developers={DEVELOPERS}
                onDragStart={handleDragStart}
                onAddTask={() => handleAddTask(column.id)}
                onUpdateTask={(taskId, updatedTask) => handleUpdateTask(column.id, taskId, updatedTask)}
                onDeleteTask={(taskId) => handleDeleteTask(column.id, taskId)}
              />
            </div>
          ))}
        </div>
      </div>

      <KanbanTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setModalColumnId(null)
        }}
        onCreateTask={handleCreateTask}
        developers={DEVELOPERS}
      />
    </div>
  )
}
