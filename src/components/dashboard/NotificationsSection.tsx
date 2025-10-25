"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  MessageSquare,
  Calendar,
  CheckSquare,
  Users,
  X,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Notification {
  id: string;
  type: "task" | "meeting" | "message" | "system" | "mention";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  actionLabel?: string;
  sender?: {
    name: string;
    avatar: string;
  };
}

const dummyNotifications: Notification[] = [
  {
    id: "1",
    type: "task",
    title: "New task assigned",
    message: 'Sarah Lead assigned you "Implement user authentication" task',
    timestamp: new Date("2024-01-22T10:30:00"),
    isRead: false,
    priority: "high",
    actionUrl: "/tasks/1",
    actionLabel: "View Task",
    sender: {
      name: "Sarah Lead",
      avatar: "SL",
    },
  },
  {
    id: "2",
    type: "meeting",
    title: "Meeting starting soon",
    message: "Daily Standup meeting starts in 15 minutes",
    timestamp: new Date("2024-01-22T08:45:00"),
    isRead: false,
    priority: "medium",
    actionUrl: "/calendar",
    actionLabel: "Join Meeting",
  },
  {
    id: "3",
    type: "message",
    title: "New message in Development Team",
    message: 'Alex Developer: "The database schema is ready for review"',
    timestamp: new Date("2024-01-22T08:15:00"),
    isRead: true,
    priority: "low",
    actionUrl: "/chats/2",
    actionLabel: "View Chat",
    sender: {
      name: "Alex Developer",
      avatar: "AD",
    },
  },
  {
    id: "4",
    type: "mention",
    title: "You were mentioned",
    message:
      'Emma Developer mentioned you in "Design dashboard UI" task comments',
    timestamp: new Date("2024-01-21T16:20:00"),
    isRead: true,
    priority: "medium",
    actionUrl: "/tasks/2",
    actionLabel: "View Task",
    sender: {
      name: "Emma Developer",
      avatar: "ED",
    },
  },
  {
    id: "5",
    type: "system",
    title: "Workspace updated",
    message: "OneDesk Web Platform workspace settings have been updated",
    timestamp: new Date("2024-01-21T14:00:00"),
    isRead: true,
    priority: "low",
  },
  {
    id: "6",
    type: "task",
    title: "Task status changed",
    message: 'Your task "Setup database schema" has been moved to Done',
    timestamp: new Date("2024-01-21T11:30:00"),
    isRead: true,
    priority: "low",
    actionUrl: "/tasks/3",
    actionLabel: "View Task",
  },
  {
    id: "7",
    type: "meeting",
    title: "Meeting reminder",
    message: "Sprint Planning meeting tomorrow at 2:00 PM",
    timestamp: new Date("2024-01-21T09:00:00"),
    isRead: false,
    priority: "medium",
    actionUrl: "/calendar",
    actionLabel: "View Calendar",
  },
];

const notificationIcons = {
  task: CheckSquare,
  meeting: Calendar,
  message: MessageSquare,
  system: Info,
  mention: Users,
};

const priorityColors = {
  low: "border-l-gray-400",
  medium: "border-l-blue-400",
  high: "border-l-red-400",
};

export default function NotificationsSection() {
  const [notifications, setNotifications] =
    useState<Notification[]>(dummyNotifications);
  type FilterType = "all" | "unread" | "task" | "meeting" | "message";

  const [filter, setFilter] = useState<FilterType>("all");

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const NotificationCard = ({
    notification,
  }: {
    notification: Notification;
  }) => {
    const Icon = notificationIcons[notification.type];

    return (
      <Card
        className={`transition-all hover:shadow-md border-l-4 ${
          priorityColors[notification.priority]
        } ${!notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg ${
                notification.type === "task"
                  ? "bg-green-100 text-green-600"
                  : notification.type === "meeting"
                  ? "bg-blue-100 text-blue-600"
                  : notification.type === "message"
                  ? "bg-purple-100 text-purple-600"
                  : notification.type === "mention"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3
                  className={`text-sm font-medium ${
                    !notification.isRead
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {notification.title}
                </h3>

                <div className="flex items-center space-x-1 ml-2">
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {notification.message}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {notification.sender && (
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {notification.sender.avatar}
                        </span>
                      </div>
                      <span>{notification.sender.name}</span>
                      <span>•</span>
                    </div>
                  )}
                  <span>{getRelativeTime(notification.timestamp)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-auto p-1"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}

                  {notification.actionUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-auto px-2 py-1"
                      onClick={() => {
                        // Navigate to action URL
                        console.log("Navigate to:", notification.actionUrl);
                        markAsRead(notification.id);
                      }}
                    >
                      {notification.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Bell className="w-6 h-6" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with your workspace activities
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All", count: notifications.length },
          { key: "unread", label: "Unread", count: unreadCount },
          {
            key: "task",
            label: "Tasks",
            count: notifications.filter((n) => n.type === "task").length,
          },
          {
            key: "meeting",
            label: "Meetings",
            count: notifications.filter((n) => n.type === "meeting").length,
          },
          {
            key: "message",
            label: "Messages",
            count: notifications.filter((n) => n.type === "message").length,
          },
        ].map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key as FilterType)} // ✅ fixed
            className="flex items-center space-x-1"
          >
            <span>{label}</span>
            {count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className="group">
              <NotificationCard notification={notification} />
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "unread"
                  ? "You&apos;re all caught up! Check back later for new updates."
                  : "When you have notifications, they&apos;ll appear here."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {unreadCount}
              </div>
              <div className="text-sm text-gray-600">Unread</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter((n) => n.type === "task").length}
              </div>
              <div className="text-sm text-gray-600">Task Updates</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {notifications.filter((n) => n.type === "message").length}
              </div>
              <div className="text-sm text-gray-600">Messages</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {notifications.filter((n) => n.type === "meeting").length}
              </div>
              <div className="text-sm text-gray-600">Meetings</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
