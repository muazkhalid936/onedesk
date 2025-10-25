"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft,
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  Smile, 
  MoreVertical,
  Download,
  Eye,
  Users,
  Phone,
  Video
} from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

interface ChatScreenProps {
  chatId: string;
  onBack: () => void;
}

export default function ChatScreen({ chatId, onBack }: ChatScreenProps) {
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
          content: 'Hey team! How\'s the progress on the authentication module?',
          senderId: '2',
          senderName: 'Sarah Lead',
          timestamp: new Date('2024-01-20T09:00:00'),
          type: 'text'
        },
        {
          id: '2',
          content: 'Going well! I\'ve implemented the JWT token system and working on the refresh logic.',
          senderId: '3',
          senderName: 'Mike Developer',
          timestamp: new Date('2024-01-20T09:15:00'),
          type: 'text'
        },
        {
          id: '3',
          content: 'Great! Here\'s the updated API documentation.',
          senderId: '2',
          senderName: 'Sarah Lead',
          timestamp: new Date('2024-01-20T09:30:00'),
          type: 'file',
          fileName: 'api_docs_v2.pdf',
          fileSize: '2.1 MB',
          fileUrl: '#'
        },
        {
          id: '4',
          content: 'Perfect timing! I was just about to ask for that.',
          senderId: '4',
          senderName: 'Emma Developer',
          timestamp: new Date('2024-01-20T09:45:00'),
          type: 'text'
        },
        {
          id: '5',
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

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500">Chat not found</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
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

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const participants = currentWorkspace?.members.filter(member => 
    currentChat.participants.includes(member.id)
  ) || [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentChat.type === 'project' ? 'bg-blue-100 text-blue-600' :
              currentChat.type === 'channel' ? 'bg-green-100 text-green-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              {currentChat.type === 'project' ? '📁' : currentChat.type === 'channel' ? '#' : '💬'}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{currentChat.name}</h2>
              <p className="text-sm text-gray-500">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </p>
            </div>
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
            <Users className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${
              msg.senderId === currentUser?.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            } rounded-lg p-3`}>
              {msg.senderId !== currentUser?.id && (
                <p className="text-xs font-medium mb-1 opacity-70">{msg.senderName}</p>
              )}
              
              {msg.type === 'text' && (
                <p className="text-sm">{msg.content}</p>
              )}
              
              {msg.type === 'file' && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{msg.fileName}</p>
                    <p className="text-xs opacity-70">{msg.fileSize}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="p-1">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              {msg.type === 'image' && (
                <div className="space-y-2">
                  <div className="bg-gray-200 rounded p-4 flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{msg.fileName}</p>
                      <p className="text-xs opacity-70">{msg.fileSize}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="p-1">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-xs opacity-70 mt-1">{formatTime(msg.timestamp)}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
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
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg focus-within:border-blue-500">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 resize-none border-none outline-none text-sm"
                rows={1}
                style={{ minHeight: '20px', maxHeight: '100px' }}
              />
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFileUpload}
                  className="p-1"
                >
                  <Paperclip className="w-4 h-4 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <Smile className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          // Handle file upload logic here
          console.log('File selected:', e.target.files?.[0]);
        }}
      />
    </div>
  );
}