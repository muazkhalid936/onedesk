"use client";

import { useState } from "react";
import { CheckSquare, Bell, MessageSquare, Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import Sidebar from "./Sidebar";
import TasksSection from "./TasksSection";
import CalendarSection from "./CalendarSection";
import NotificationsSection from "./NotificationsSection";
import RoleSwitcher from "./RoleSwitcher";
import ChatSelectionModal from "./ChatSelectionModal";
import ChatScreen from "./ChatScreen";

type DashboardSection =
  | "dashboard"
  | "tasks"
  | "calendar"
  | "notifications"
  | "chats"
  | "team"
  | "chat";

export default function DashboardLayout() {
  const { currentWorkspace, currentUser } = useWorkspaceStore();
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("dashboard");
  const [isChatSelectionOpen, setIsChatSelectionOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChatType, setSelectedChatType] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentWorkspace || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  const renderDashboardOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="text-sm sm:text-base text-blue-100">
          You&apos;re working in <strong>{currentWorkspace.name}</strong>{" "}
          workspace
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-3 md:space-x-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg mb-2 sm:mb-0">
                <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Active Tasks
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {
                    currentWorkspace.tasks.filter((t) => t.status !== "done")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-3 md:space-x-4">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg mb-2 sm:mb-0">
                <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Completed
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {
                    currentWorkspace.tasks.filter((t) => t.status === "done")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-3 md:space-x-4">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg mb-2 sm:mb-0">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Active Chats
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {currentWorkspace.chats.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-3 md:space-x-4">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg mb-2 sm:mb-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Team Members
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {currentWorkspace.members.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Recent Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {currentWorkspace.tasks
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 5)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {task.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        Assigned to{" "}
                        {
                          currentWorkspace.members.find(
                            (m) => m.id === task.assignedTo
                          )?.name
                        }
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        task.status === "done"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : task.status === "review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Recent Chats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {currentWorkspace.chats
                .sort(
                  (a, b) =>
                    new Date(b.lastActivity).getTime() -
                    new Date(a.lastActivity).getTime()
                )
                .slice(0, 5)
                .map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedChatId(chat.id);
                      setSelectedChatType(chat.type);
                      setActiveSection("chat");
                    }}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs sm:text-sm font-bold">
                        {chat.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {chat.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {chat.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboardOverview();
      case "tasks":
        return <TasksSection />;
      case "calendar":
        return <CalendarSection />;
      case "notifications":
        return <NotificationsSection />;
      case "chats":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Chats
              </h1>
              <Button
                onClick={() => setIsChatSelectionOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {currentWorkspace.chats.map((chat) => (
                <Card
                  key={chat.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedChatId(chat.id);
                    setSelectedChatType(chat.type);
                    setActiveSection("chat");
                  }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            chat.type === "project"
                              ? "bg-blue-100 text-blue-600"
                              : chat.type === "channel"
                              ? "bg-green-100 text-green-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {chat.type === "project"
                            ? "📁"
                            : chat.type === "channel"
                            ? "#"
                            : "💬"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                            {chat.name}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">
                            {chat.type} chat
                          </p>
                        </div>
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {chat.lastMessage?.content || "No messages yet"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate">
                          {chat.participants.length} participants
                        </span>
                        <span className="whitespace-nowrap ml-2">
                          {new Date(chat.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {currentWorkspace.chats.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No chats yet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                  Start a conversation with your team
                </p>
                <Button
                  onClick={() => setIsChatSelectionOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Your First Chat
                </Button>
              </div>
            )}
          </div>
        );
      case "chat":
        return selectedChatId ? (
          <ChatScreen
            chatId={selectedChatId}
            onBack={() => setActiveSection("chats")}
          />
        ) : null;
      case "team":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Team Members
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {currentWorkspace.members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-white text-base sm:text-lg font-bold">
                        {member.avatar ||
                          member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {member.email}
                    </p>
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        member.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : member.role === "team_lead"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {member.role.replace("_", " ")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Sidebar - Fully responsive, handles its own state */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section: string) =>
          setActiveSection(section as DashboardSection)
        }
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area - Responsive to sidebar */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize truncate">
                  {activeSection === "dashboard" ? "Dashboard" : activeSection}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {currentWorkspace.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <div className="hidden sm:block">
                <RoleSwitcher />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatSelectionOpen(true)}
                className="relative p-2"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                {currentWorkspace.chats.some(
                  (chat) => chat.unreadCount > 0
                ) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
                )}
              </Button>

              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area with responsive padding */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-3 sm:p-4 md:p-6 mx-auto w-full">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Chat Modals */}
      <ChatSelectionModal
        isOpen={isChatSelectionOpen}
        onClose={() => setIsChatSelectionOpen(false)}
        onChatSelect={(chatId, chatType) => {
          setSelectedChatId(chatId);
          setSelectedChatType(chatType);
        }}
      />
    </div>
  );
}
