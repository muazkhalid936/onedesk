"use client";

import { useState } from "react";
import { ChevronDown, Plus, Building2 } from "lucide-react";
import { useWorkspaceStore, Workspace } from "@/store/useWorkspaceStore";
import { Button } from "@/components/ui/button";

interface WorkspaceSelectorProps {
  isCollapsed?: boolean;
}

export default function WorkspaceSelector({
  isCollapsed = false,
}: WorkspaceSelectorProps) {
  const { workspaces, currentWorkspace, setCurrentWorkspace } =
    useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleWorkspaceChange = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setIsOpen(false);
  };

  // Collapsed icon-only version
  if (isCollapsed) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow group"
          title={currentWorkspace?.name || "Select Workspace"}
        >
          <Building2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>

        {isOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Dropdown positioned to the right of collapsed sidebar */}
            <div className="fixed left-20 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto w-64">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2 py-1">
                  Workspaces
                </div>
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleWorkspaceChange(workspace)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      currentWorkspace?.id === workspace.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <Building2 className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {workspace.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {workspace.members.length} members
                      </p>
                    </div>
                    {currentWorkspace?.id === workspace.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <button className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <div className="w-6 h-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </div>
                    <span className="text-sm">Create workspace</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Normal expanded version
  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="w-full justify-between p-3 h-auto text-left hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {currentWorkspace?.name || "Select Workspace"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {currentWorkspace?.members.length || 0} members
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2 py-1">
              Workspaces
            </div>
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleWorkspaceChange(workspace)}
                className={`w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentWorkspace?.id === workspace.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <Building2 className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {workspace.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {workspace.members.length} members
                  </p>
                </div>
                {currentWorkspace?.id === workspace.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              <button className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                <div className="w-6 h-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </div>
                <span className="text-sm">Create workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
