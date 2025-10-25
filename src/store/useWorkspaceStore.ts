import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'team_lead' | 'developer';
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string; // user id
  assignedBy: string; // user id
  createdAt: Date;
  dueDate?: Date;
  workspaceId: string;
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'project' | 'channel' | 'private';
  participants: string[]; // user ids
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    timestamp: Date;
  };
  lastActivity: Date;
  unreadCount: number;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  members: User[];
  tasks: Task[];
  chats: Chat[];
  createdAt: Date;
}

interface WorkspaceStore {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  currentUser: User | null;
  
  setCurrentWorkspace: (workspace: Workspace) => void;
  setCurrentUser: (user: User) => void;
  switchUserRole: (userId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTasksForUser: (userId: string) => Task[];
  initializeDummyData: () => void;
  
  get chats(): Chat[];
}

// Dummy data
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@onedesk.com',
    role: 'admin',
    avatar: 'JA'
  },
  {
    id: '2',
    name: 'Sarah Lead',
    email: 'sarah@onedesk.com',
    role: 'team_lead',
    avatar: 'SL'
  },
  {
    id: '3',
    name: 'Mike Developer',
    email: 'mike@onedesk.com',
    role: 'developer',
    avatar: 'MD'
  },
  {
    id: '4',
    name: 'Emma Developer',
    email: 'emma@onedesk.com',
    role: 'developer',
    avatar: 'ED'
  },
  {
    id: '5',
    name: 'Alex Developer',
    email: 'alex@onedesk.com',
    role: 'developer',
    avatar: 'AD'
  }
];

const dummyTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Create login and signup functionality with JWT tokens',
    status: 'in_progress',
    priority: 'high',
    assignedTo: '3',
    assignedBy: '2',
    createdAt: new Date('2024-01-15'),
    dueDate: new Date('2024-01-25'),
    workspaceId: '1'
  },
  {
    id: '2',
    title: 'Design dashboard UI',
    description: 'Create responsive dashboard layout with sidebar navigation',
    status: 'todo',
    priority: 'medium',
    assignedTo: '4',
    assignedBy: '2',
    createdAt: new Date('2024-01-16'),
    dueDate: new Date('2024-01-30'),
    workspaceId: '1'
  },
  {
    id: '3',
    title: 'Setup database schema',
    description: 'Design and implement PostgreSQL database schema',
    status: 'done',
    priority: 'high',
    assignedTo: '5',
    assignedBy: '2',
    createdAt: new Date('2024-01-10'),
    dueDate: new Date('2024-01-20'),
    workspaceId: '1'
  },
  {
    id: '4',
    title: 'API documentation',
    description: 'Write comprehensive API documentation using Swagger',
    status: 'review',
    priority: 'low',
    assignedTo: '3',
    assignedBy: '2',
    createdAt: new Date('2024-01-18'),
    workspaceId: '1'
  },
  {
    id: '5',
    title: 'Mobile app wireframes',
    description: 'Create wireframes for mobile application',
    status: 'todo',
    priority: 'medium',
    assignedTo: '4',
    assignedBy: '2',
    createdAt: new Date('2024-01-20'),
    workspaceId: '2'
  }
];

const dummyChats: Chat[] = [
  {
    id: '1',
    name: 'General Discussion',
    type: 'group',
    participants: ['1', '2', '3', '4', '5'],
    lastMessage: {
      id: '1',
      content: 'Great work on the authentication module!',
      senderId: '2',
      timestamp: new Date('2024-01-20T10:30:00')
    },
    lastActivity: new Date('2024-01-20T10:30:00'),
    unreadCount: 2,
    workspaceId: '1'
  },
  {
    id: '2',
    name: 'Development Team',
    type: 'group',
    participants: ['2', '3', '4', '5'],
    lastMessage: {
      id: '2',
      content: 'The database schema is ready for review',
      senderId: '5',
      timestamp: new Date('2024-01-20T14:15:00')
    },
    lastActivity: new Date('2024-01-20T14:15:00'),
    unreadCount: 0,
    workspaceId: '1'
  },
  {
    id: '3',
    name: 'Mike & Sarah',
    type: 'direct',
    participants: ['2', '3'],
    lastMessage: {
      id: '3',
      content: 'Can we schedule a code review for tomorrow?',
      senderId: '3',
      timestamp: new Date('2024-01-20T16:45:00')
    },
    lastActivity: new Date('2024-01-20T16:45:00'),
    unreadCount: 1,
    workspaceId: '1'
  },
  {
    id: '4',
    name: 'Mobile Team',
    type: 'project',
    participants: ['2', '4'],
    lastMessage: {
      id: '4',
      content: 'Wireframes are looking good!',
      senderId: '2',
      timestamp: new Date('2024-01-20T11:20:00')
    },
    lastActivity: new Date('2024-01-20T11:20:00'),
    unreadCount: 0,
    workspaceId: '2'
  }
];

const dummyWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'OneDesk Web Platform',
    description: 'Main web application development workspace',
    members: dummyUsers,
    tasks: dummyTasks.filter(task => task.workspaceId === '1'),
    chats: dummyChats.filter(chat => chat.workspaceId === '1'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'OneDesk Mobile App',
    description: 'Mobile application development workspace',
    members: [dummyUsers[1], dummyUsers[3]], // Sarah and Emma
    tasks: dummyTasks.filter(task => task.workspaceId === '2'),
    chats: dummyChats.filter(chat => chat.workspaceId === '2'),
    createdAt: new Date('2024-01-05')
  },
  {
    id: '3',
    name: 'Marketing & Design',
    description: 'Marketing campaigns and design assets workspace',
    members: [dummyUsers[0], dummyUsers[1]], // John and Sarah
    tasks: [],
    chats: [],
    createdAt: new Date('2024-01-10')
  }
];

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  currentUser: null,

  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  
  setCurrentUser: (user) => set({ currentUser: user }),

  switchUserRole: (userId) => {
    const { workspaces } = get();
    const allUsers = workspaces.flatMap(workspace => workspace.members);
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      set({ currentUser: user });
    }
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    set((state) => ({
      workspaces: state.workspaces.map(workspace =>
        workspace.id === newTask.workspaceId
          ? { ...workspace, tasks: [...workspace.tasks, newTask] }
          : workspace
      ),
      currentWorkspace: state.currentWorkspace?.id === newTask.workspaceId
        ? { ...state.currentWorkspace, tasks: [...state.currentWorkspace.tasks, newTask] }
        : state.currentWorkspace
    }));
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      workspaces: state.workspaces.map(workspace => ({
        ...workspace,
        tasks: workspace.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),
      currentWorkspace: state.currentWorkspace ? {
        ...state.currentWorkspace,
        tasks: state.currentWorkspace.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      } : null
    }));
  },

  deleteTask: (taskId) => {
    set((state) => ({
      workspaces: state.workspaces.map(workspace => ({
        ...workspace,
        tasks: workspace.tasks.filter(task => task.id !== taskId)
      })),
      currentWorkspace: state.currentWorkspace ? {
        ...state.currentWorkspace,
        tasks: state.currentWorkspace.tasks.filter(task => task.id !== taskId)
      } : null
    }));
  },

  getTasksForUser: (userId) => {
    const { currentWorkspace, currentUser } = get();
    if (!currentWorkspace) return [];
    
    // Admin can see all tasks
    if (currentUser?.role === 'admin') {
      return currentWorkspace.tasks;
    }
    
    // Team lead can see all tasks in their workspace
    if (currentUser?.role === 'team_lead') {
      return currentWorkspace.tasks;
    }
    
    // Developer can only see tasks assigned to them
    return currentWorkspace.tasks.filter(task => task.assignedTo === userId);
  },

  initializeDummyData: () => {
    set({
      workspaces: dummyWorkspaces,
      currentWorkspace: dummyWorkspaces[0],
      currentUser: dummyUsers[2] // Default to Mike Developer for testing
    });
  },

  get chats() {
    const { currentWorkspace } = get();
    return currentWorkspace?.chats || [];
  }
}));