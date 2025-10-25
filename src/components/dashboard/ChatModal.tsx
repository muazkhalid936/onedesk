"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  X,
  Users,
  Hash,
  Lock,
  Plus,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWorkspaceStore, Chat } from '@/store/useWorkspaceStore';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  reactions?: { emoji: string; users: string[] }[];
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const { chats } = useWorkspaceStore();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  // Dummy messages for the selected chat
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '2',
      senderName: 'Sarah Lead',
      senderAvatar: 'SL',
      content: 'Hey team! How&apos;s the progress on the authentication feature?',
      timestamp: new Date('2024-01-22T09:00:00'),
      type: 'text'
    },
    {
      id: '2',
      senderId: '3',
      senderName: 'Alex Developer',
      senderAvatar: 'AD',
      content: 'Almost done! Just working on the password reset functionality. Should be ready by EOD.',
      timestamp: new Date('2024-01-22T09:15:00'),
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John Developer',
      senderAvatar: 'JD',
      content: 'Great! I&apos;ve finished the frontend components. They&apos;re ready for integration.',
      timestamp: new Date('2024-01-22T09:30:00'),
      type: 'text'
    },
    {
      id: '4',
      senderId: '4',
      senderName: 'Emma Developer',
      senderAvatar: 'ED',
      content: 'I&apos;ve updated the database schema. The new tables are deployed to staging.',
      timestamp: new Date('2024-01-22T10:00:00'),
      type: 'text'
    },
    {
      id: '5',
      senderId: '2',
      senderName: 'Sarah Lead',
      senderAvatar: 'SL',
      content: 'Perfect! Let&apos;s schedule a quick demo for tomorrow morning.',
      timestamp: new Date('2024-01-22T10:15:00'),
      type: 'text'
    }
  ]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: '1', // Current user
      senderName: 'John Developer',
      senderAvatar: 'JD',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl h-[80vh] flex overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Chats</span>
              </h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedChatId === chat.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    {chat.type === 'direct' ? (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {chat.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        {chat.type === 'channel' ? (
                          <Hash className="w-5 h-5 text-white" />
                        ) : (
                          <Users className="w-5 h-5 text-white" />
                        )}
                      </div>
                    )}
                    {chat.type === 'private' && (
                      <Lock className="absolute -bottom-1 -right-1 w-3 h-3 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {getRelativeTime(chat.lastActivity)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {chat.lastMessage?.content || 'No messages yet'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {chat.participants.length} members
                      </span>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                      {selectedChat.type === 'channel' ? (
                        <Hash className="w-4 h-4 text-white" />
                      ) : (
                        <Users className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {selectedChat.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedChat.participants.length} members
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                {messages.map((message, index) => {
                  const isCurrentUser = message.senderId === '1';
                  const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                    >
                      {showAvatar && !isCurrentUser && (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {message.senderAvatar}
                          </span>
                        </div>
                      )}
                      
                      {!showAvatar && !isCurrentUser && (
                        <div className="w-8 h-8 flex-shrink-0"></div>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'ml-auto' : ''}`}>
                        {showAvatar && (
                          <div className={`text-xs text-gray-600 dark:text-gray-400 mb-1 ${
                            isCurrentUser ? 'text-right' : ''
                          }`}>
                            {!isCurrentUser && message.senderName} • {getRelativeTime(message.timestamp)}
                          </div>
                        )}
                        
                        <div className={`rounded-lg px-4 py-2 ${
                          isCurrentUser 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm" className="mb-2">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex-1">
                    <Input
                      placeholder={`Message ${selectedChat.name}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="resize-none"
                    />
                  </div>
                  
                  <Button variant="ghost" size="sm" className="mb-2">
                    <Smile className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="mb-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a chat to start messaging
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a conversation from the sidebar to begin chatting with your team.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}