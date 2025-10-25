"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  Smile, 
  MoreVertical,
  Download,
  Eye
} from 'lucide-react';
import { useWorkspaceStore, Chat } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
}

interface EnhancedChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  chatType: string;
}

export default function EnhancedChatModal({ isOpen, onClose, chatId, chatType }: EnhancedChatModalProps) {
  const { currentWorkspace, currentUser } = useWorkspaceStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = currentWorkspace?.chats.find(chat => chat.id === chatId);

  // Dummy messages for demonstration
  useEffect(() => {
    if (currentChat) {
      const dummyMessages: Message[] = [
        {
          id: '1',
          content: 'Hey team! How is the project coming along?',
          senderId: '2',
          senderName: 'Sarah Lead',
          timestamp: new Date('2024-01-20T09:00:00'),
          type: 'text'
        },
        {
          id: '2',
          content: 'Great progress! I just finished the authentication module.',
          senderId: '3',
          senderName: 'Mike Developer',
          timestamp: new Date('2024-01-20T09:15:00'),
          type: 'text'
        },
        {
          id: '3',
          content: 'Here are the latest wireframes for review',
          senderId: '4',
          senderName: 'Emma Developer',
          timestamp: new Date('2024-01-20T10:30:00'),
          type: 'file',
          fileName: 'wireframes_v2.pdf',
          fileSize: '2.4 MB',
          fileUrl: '#'
        },
        {
          id: '4',
          content: 'Dashboard screenshot with the new design',
          senderId: '3',
          senderName: 'Mike Developer',
          timestamp: new Date('2024-01-20T11:45:00'),
          type: 'image',
          fileName: 'dashboard_screenshot.png',
          fileSize: '1.2 MB',
          fileUrl: '#'
        }
      ];
      setMessages(dummyMessages);
    }
  }, [currentChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !currentChat) {
    console.log('EnhancedChatModal render check:', { isOpen, currentChat: !!currentChat, chatId });
    return null;
  }

  const handleSendMessage = () => {
    if (!message.trim() || !currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate a response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thanks for the update! Looking good.',
        senderId: '2',
        senderName: 'Sarah Lead',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    const fileMessage: Message = {
      id: Date.now().toString(),
      content: `Shared a file: ${file.name}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date(),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      fileUrl: URL.createObjectURL(file)
    };

    setMessages(prev => [...prev, fileMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = (msg: Message) => {
    const isOwnMessage = msg.senderId === currentUser?.id;
    
    return (
      <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
          {!isOwnMessage && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{msg.senderName}</p>
          )}
          
          <div className={`rounded-lg p-3 ${
            isOwnMessage 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}>
            {msg.type === 'text' && (
              <p className="text-sm">{msg.content}</p>
            )}
            
            {msg.type === 'file' && (
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{msg.fileName}</p>
                  <p className="text-xs opacity-75">{msg.fileSize}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {msg.type === 'image' && (
              <div>
                <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mb-2 flex items-center justify-center">
                  <Image className="h-12 w-12 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{msg.fileName}</p>
                    <p className="text-xs opacity-75">{msg.fileSize}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-400 mt-1 text-right">
            {formatTime(msg.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
              {currentChat.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{currentChat.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {chatType.replace('_', ' ')} • {currentChat.participants.length} members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-gray-700"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}