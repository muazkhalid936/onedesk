"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Bell,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import WorkspaceSelector from "./WorkspaceSelector";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "chats", label: "Chats", icon: MessageSquare },
  { id: "team", label: "Team", icon: Users },
];

export default function Sidebar({
  activeSection,
  onSectionChange,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser } = useWorkspaceStore();
  const { logout } = useAuthStore();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Auto-collapse on tablets
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsCollapsed(true);
      }
      // Close mobile menu when resizing to desktop
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    // Close mobile menu after selection
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
        transition-all duration-300 ease-in-out flex flex-col h-screen
        shadow-lg lg:shadow-none
        
        /* Mobile: Slide in from left */
        fixed lg:static inset-y-0 left-0 z-40
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        
        /* Desktop: Responsive width */
        ${isCollapsed ? "w-[77px]" : "w-64 lg:w-72"}
      `}
      >
        {/* Header with Workspace Selector */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {!isCollapsed ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OneDesk
                </h1>
                {/* Desktop collapse button with hover effect */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(true)}
                  className="hidden lg:flex p-2 h-auto hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </div>
              <WorkspaceSelector />
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              {/* Desktop expand button with hover effect */}
              <button
                onClick={() => setIsCollapsed(false)}
                className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </button>
              {/* Collapsed Workspace Selector */}
              <WorkspaceSelector isCollapsed={true} />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${
                    !isCollapsed && !isActive ? "group-hover:scale-110" : ""
                  }`}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium transition-all">
                    {item.label}
                  </span>
                )}
                {isActive && !isCollapsed && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Settings */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 flex-shrink-0">
          {!isCollapsed && currentUser && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                <span className="text-white text-xs font-bold">
                  {currentUser.avatar || currentUser.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {currentUser.role.replace("_", " ")}
                </p>
              </div>
            </div>
          )}

          {isCollapsed && currentUser && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                <span className="text-white text-xs font-bold">
                  {currentUser.avatar || currentUser.name.charAt(0)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => handleSectionChange("settings")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
              activeSection === "settings"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings
              className={`w-5 h-5 flex-shrink-0 transition-transform ${
                !isCollapsed && activeSection !== "settings"
                  ? "group-hover:rotate-90"
                  : ""
              }`}
            />
            {!isCollapsed && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
