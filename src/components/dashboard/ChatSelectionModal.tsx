"use client";

import { useState } from 'react';
import { X, Users, MessageCircle, Briefcase, Hash } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';

interface ChatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatSelect: (chatId: string, chatType: string) => void;
}

export default function ChatSelectionModal({ isOpen, onClose, onChatSelect }: ChatSelectionModalProps) {
  const { chats, currentWorkspace } = useWorkspaceStore();
  const [selectedType, setSelectedType] = useState<'all' | 'project' | 'group' | 'direct'>('all');

  if (!isOpen) return null;

  const filteredChats = selectedType === 'all' 
    ? chats 
    : chats.filter(chat => chat.type === selectedType);

  const getChatIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'group':
        return <Users className="h-5 w-5 text-green-600" />;
      case 'direct':
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case 'channel':
        return <Hash className="h-5 w-5 text-orange-600" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getChatTypeLabel = (type: string) => {
    switch (type) {
      case 'project':
        return 'Project Chat';
      case 'group':
        return 'Team Chat';
      case 'direct':
        return 'Direct Message';
      case 'channel':
        return 'Channel';
      default:
        return 'Chat';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Chat</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choose a chat to open from {currentWorkspace?.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Type Filter */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All Chats
            </Button>
            <Button
              variant={selectedType === 'project' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('project')}
              className="flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Project
            </Button>
            <Button
              variant={selectedType === 'group' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('group')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Team
            </Button>
            <Button
              variant={selectedType === 'direct' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('direct')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Direct
            </Button>
          </div>
        </div>

        {/* Chat List */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No {selectedType === 'all' ? '' : selectedType} chats found
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    onChatSelect(chat.id, chat.type);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getChatIcon(chat.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {chat.name}
                      </h3>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                      <span className="text-xs text-gray-400 ml-2">
                        {getChatTypeLabel(chat.type)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredChats.length} chat{filteredChats.length !== 1 ? 's' : ''} available
            </p>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}