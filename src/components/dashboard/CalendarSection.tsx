"use client";

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Video, 
  Clock, 
  Users, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  meetingLink?: string;
  type: 'scheduled' | 'recurring' | 'instant';
}

const dummyMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Daily Standup',
    description: 'Daily team sync and progress updates',
    startTime: new Date('2024-01-22T09:00:00'),
    endTime: new Date('2024-01-22T09:30:00'),
    attendees: ['Sarah Lead', 'Mike Developer', 'Emma Developer'],
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    type: 'recurring'
  },
  {
    id: '2',
    title: 'Sprint Planning',
    description: 'Planning for the next sprint cycle',
    startTime: new Date('2024-01-22T14:00:00'),
    endTime: new Date('2024-01-22T16:00:00'),
    attendees: ['Sarah Lead', 'Mike Developer', 'Emma Developer', 'Alex Developer'],
    meetingLink: 'https://meet.google.com/xyz-uvwx-yz',
    type: 'scheduled'
  },
  {
    id: '3',
    title: 'Code Review Session',
    description: 'Review authentication module implementation',
    startTime: new Date('2024-01-23T10:00:00'),
    endTime: new Date('2024-01-23T11:00:00'),
    attendees: ['Sarah Lead', 'Mike Developer'],
    meetingLink: 'https://meet.google.com/klm-nopq-rst',
    type: 'scheduled'
  },
  {
    id: '4',
    title: 'Client Demo',
    description: 'Demonstrate new features to the client',
    startTime: new Date('2024-01-24T15:00:00'),
    endTime: new Date('2024-01-24T16:30:00'),
    attendees: ['John Admin', 'Sarah Lead', 'Mike Developer'],
    meetingLink: 'https://meet.google.com/demo-client-xyz',
    type: 'scheduled'
  }
];

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [meetings] = useState<Meeting[]>(dummyMeetings);

  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => isSameDay(new Date(meeting.startTime), date));
  };

  const getUpcomingMeetings = () => {
    const now = new Date();
    return meetings
      .filter(meeting => new Date(meeting.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 3);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {meeting.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {meeting.description}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            meeting.type === 'recurring' 
              ? 'bg-blue-100 text-blue-800' 
              : meeting.type === 'instant'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {meeting.type}
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {formatTime(new Date(meeting.startTime))} - {formatTime(new Date(meeting.endTime))}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            <span>{meeting.attendees.length} attendees</span>
          </div>
        </div>
        
        {meeting.meetingLink && (
          <Button 
            size="sm" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={() => window.open(meeting.meetingLink, '_blank')}
          >
            <Video className="w-4 h-4" />
            <span>Join Meeting</span>
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const CreateMeetingForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      attendees: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Here you would typically create the meeting and generate a Google Meet link
      console.log('Creating meeting:', formData);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        attendees: ''
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schedule New Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Meeting Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Enter meeting title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm h-20"
                placeholder="Meeting agenda or description"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Attendees (comma-separated emails)</label>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Schedule Meeting
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  const calendarDays = generateCalendarDays();
  const selectedDateMeetings = getMeetingsForDate(selectedDate);
  const upcomingMeetings = getUpcomingMeetings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule and join Google Meet sessions
          </p>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </Button>
      </div>

      {/* Create Meeting Form */}
      {showCreateForm && <CreateMeetingForm />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentDay = isToday(day);
                  const dayMeetings = getMeetingsForDate(day);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 text-sm rounded-lg transition-colors relative ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : isCurrentDay
                          ? 'bg-blue-100 text-blue-600 font-semibold'
                          : isCurrentMonth
                          ? 'hover:bg-gray-100 text-gray-900'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {day.getDate()}
                      {dayMeetings.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {formatDate(selectedDate)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateMeetings.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateMeetings.map(meeting => (
                    <div key={meeting.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">{meeting.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatTime(new Date(meeting.startTime))} - {formatTime(new Date(meeting.endTime))}
                      </p>
                      {meeting.meetingLink && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 w-full"
                          onClick={() => window.open(meeting.meetingLink, '_blank')}
                        >
                          <Video className="w-3 h-3 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No meetings scheduled
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingMeetings.map(meeting => (
                    <div key={meeting.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">{meeting.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(meeting.startTime).toLocaleDateString()} at {formatTime(new Date(meeting.startTime))}
                      </p>
                      {meeting.meetingLink && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 w-full"
                          onClick={() => window.open(meeting.meetingLink, '_blank')}
                        >
                          <Video className="w-3 h-3 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming meetings
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}