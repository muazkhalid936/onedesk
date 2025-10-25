"use client";

import { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Eye,
  MoreHorizontal,
  CheckSquare
} from 'lucide-react';
import { useWorkspaceStore, Task, User as UserType } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusColors = {
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600'
};

const statusIcons = {
  todo: Clock,
  in_progress: AlertCircle,
  review: Eye,
  done: CheckCircle2
};

export default function TasksSection() {
  const { currentWorkspace, currentUser, getTasksForUser, updateTask, addTask } = useWorkspaceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!currentWorkspace || !currentUser) {
    return <div>Loading...</div>;
  }

  const tasks = getTasksForUser(currentUser.id);
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getAssignedUserName = (userId: string): string => {
    const user = currentWorkspace.members.find(member => member.id === userId);
    return user?.name || 'Unknown User';
  };

  const canAssignTasks = currentUser.role === 'admin' || currentUser.role === 'team_lead';

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const StatusIcon = statusIcons[task.status];
    const assignedUser = currentWorkspace.members.find(member => member.id === task.assignedTo);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {task.description}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {task.status.replace('_', ' ')}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{assignedUser?.name || 'Unassigned'}</span>
              </div>
              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {canAssignTasks && (
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                className="text-xs border rounded px-1 py-0.5 bg-white dark:bg-gray-800"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CreateTaskForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      priority: 'medium' as Task['priority'],
      assignedTo: currentUser.id,
      dueDate: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addTask({
        ...formData,
        status: 'todo',
        assignedBy: currentUser.id,
        workspaceId: currentWorkspace.id,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
      });
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: currentUser.id,
        dueDate: ''
      });
      setShowCreateForm(false);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm h-20"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              {canAssignTasks && (
                <div>
                  <label className="block text-sm font-medium mb-1">Assign To</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    {currentWorkspace.members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Due Date (Optional)</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Create Task
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentUser.role === 'developer' 
              ? 'Your assigned tasks' 
              : `Manage tasks in ${currentWorkspace.name}`
            }
          </p>
        </div>
        
        {canAssignTasks && (
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
        
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Create Task Form */}
      {showCreateForm && <CreateTaskForm />}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters'
              : canAssignTasks 
                ? 'Create your first task to get started'
                : 'No tasks have been assigned to you yet'
            }
          </p>
        </div>
      )}
    </div>
  );
}