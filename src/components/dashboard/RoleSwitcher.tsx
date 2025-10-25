"use client";

import { useState } from 'react';
import { User, Settings } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';

export default function RoleSwitcher() {
  const { currentUser, currentWorkspace, switchUserRole } = useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentWorkspace) return null;

  const availableUsers = currentWorkspace.members;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Switch Role
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">Switch User Role</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Test different user perspectives</p>
          </div>
          <div className="p-2">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  switchUserRole(user.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  currentUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''
                }`}
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {user.avatar || user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user.role.replace('_', ' ')}
                  </div>
                </div>
                {currentUser?.id === user.id && (
                  <User className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}