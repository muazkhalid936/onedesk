"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Column, Task, Developer } from "./kanban-board"
import KanbanCard from "./kanban-card"

interface KanbanColumnProps {
  column: Column
  developers: Developer[]
  onDragStart: (task: Task, columnId: string) => void
  onAddTask: () => void
  onUpdateTask: (taskId: string, updatedTask: Task) => void
  onDeleteTask: (taskId: string) => void
}

export default function KanbanColumn({
  column,
  developers,
  onDragStart,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const storyPointsSum = column.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">{column.title}</h2>
          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{storyPointsSum > 0 && `${storyPointsSum} points`}</p>
      </div>

      <div className={`${column.color} rounded-lg p-3 flex-1 min-h-96 space-y-3 overflow-y-auto`}>
        {column.tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">No tasks yet</div>
        ) : (
          column.tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              developers={developers}
              onDragStart={() => onDragStart(task, column.id)}
              onUpdate={(updatedTask) => onUpdateTask(task.id, updatedTask)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))
        )}
      </div>

      <Button onClick={onAddTask} variant="outline" className="w-full mt-3 gap-2 bg-background hover:bg-accent">
        <Plus className="w-4 h-4" />
        Add Task
      </Button>
    </div>
  )
}
