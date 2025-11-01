"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar } from "lucide-react"
import type { Task, Developer } from "./kanban-board"

interface KanbanCardProps {
  task: Task
  developers: Developer[]
  onDragStart: () => void
  onUpdate: (task: Task) => void
  onDelete: () => void
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300",
}

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export default function KanbanCard({ task, developers, onDragStart, onUpdate, onDelete }: KanbanCardProps) {
  const assignee = developers.find((dev) => dev.id === task.assigneeId)

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() : false

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      className="p-3 bg-card border-border shadow-md cursor-move hover:shadow-lg hover:border-primary/50 transition-all group"
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-bold text-primary">{task.id}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{task.title}</h3>

        {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}

        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 2).map((label, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs py-0">
                {label}
              </Badge>
            ))}
            {task.labels.length > 2 && (
              <Badge variant="secondary" className="text-xs py-0">
                +{task.labels.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            {task.storyPoints && (
              <div className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary text-xs font-bold">
                {task.storyPoints}
              </div>
            )}

            {task.dueDate && (
              <div
                className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${isOverdue ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200" : "bg-muted text-muted-foreground"}`}
              >
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>

          {assignee && (
            <div
              className={`${assignee.color} w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white`}
              title={assignee.name}
            >
              {assignee.avatar}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Badge variant="outline" className={`text-xs border ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </Badge>
        </div>
      </div>
    </Card>
  )
}
