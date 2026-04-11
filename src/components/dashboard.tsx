
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag, useDrop } from 'react-dnd';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { 
  Brain, 
  Target, 
  Zap, 
  Plus, 
  Search, 
  BarChart3, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Send,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Users,
  Tag,
  Timer,
  Bell,
  CalendarDays,
  FileText,
  UserPlus,
  Hash
} from 'lucide-react';
import type { AppState, Task, User, Team } from '@/lib/types';

interface DashboardProps {
  appState: AppState;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateAppState: (updates: Partial<AppState>) => void;
}

interface TaskCardProps {
  task: Task;
  users: User[];
  teams: Team[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const AuraLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground dark:text-white">
        <path d="M12 4.75L19.25 19.25H4.75L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.4"/>
        <path d="M12 8L15.25 15.25H8.75L12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );

const TaskCard = ({ task, users, teams, onUpdateTask, onDeleteTask }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-amber-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const assignedUsers = users.filter(user => task.assignedTo?.includes(user.id));
  const team = teams.find(t => t.id === task.teamId);

  const handleSaveEdit = () => {
    onUpdateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    ) || [];
    onUpdateTask(task.id, { subtasks: updatedSubtasks });
  };

  return (
    <motion.div
      ref={drag as React.Ref<HTMLDivElement>}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`group cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="p-4 backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm leading-tight flex-1 mr-2">{task.title}</h4>
          <div className="flex items-center space-x-1">
            {task.estimatedTime && (
              <Badge variant="secondary" className="text-xs">
                <Timer className="w-3 h-3 mr-1" />
                {task.estimatedTime}h
              </Badge>
            )}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto">
                  <Edit3 className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-white/10 border-white/20">
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                      className="backdrop-blur-sm bg-white/5 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedTask.description}
                      onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                      className="backdrop-blur-sm bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={editedTask.priority} onValueChange={(value: any) => setEditedTask({ ...editedTask, priority: value })}>
                        <SelectTrigger className="backdrop-blur-sm bg-white/5 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={editedTask.dueDate || ''}
                        onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                        className="backdrop-blur-sm bg-white/5 border-white/20"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-400 hover:text-red-600 dark:text-red-300"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
        
        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Hash className="w-2 h-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-3 space-y-1">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => toggleSubtask(subtask.id)}
                  className="h-3 w-3"
                />
                <span className={`text-xs ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {subtask.title}
                </span>
              </div>
            ))}
            <div className="text-xs text-muted-foreground">
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} completed
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <Badge 
            className={`text-xs bg-gradient-to-r ${getPriorityColor(task.priority)} text-white border-0`}
          >
            {task.priority}
          </Badge>
          
          {task.dueDate && (
            <span className="text-xs text-muted-foreground flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Assigned users */}
        {assignedUsers.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {assignedUsers.slice(0, 3).map((user) => (
                <Avatar key={user.id} className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {assignedUsers.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{assignedUsers.length - 3}
                </div>
              )}
            </div>
            
            {team && (
              <Badge 
                variant="outline" 
                className="text-xs border-white/20"
                style={{ borderColor: team.color }}
              >
                {team.name}
              </Badge>
            )}
          </div>
        )}

        {task.aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
          >
            <div className="flex items-start">
              <Sparkles className="w-3 h-3 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-300">{task.aiSuggestion}</p>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

const DropZone = ({ status, children, onDrop }: { 
  status: Task['status']; 
  children: React.ReactNode; 
  onDrop: (taskId: string, newStatus: Task['status']) => void; 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string; status: Task['status'] }) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[500px] rounded-lg transition-colors duration-200 ${
        isOver ? 'bg-blue-500/10 border-2 border-blue-500/30' : ''
      }`}
    >
      {children}
    </div>
  );
};

export function Dashboard({ 
  appState, 
  onLogout, 
  onNavigate, 
  isDarkMode, 
  onUpdateTask, 
  onAddTask, 
  onDeleteTask,
  onUpdateAppState 
}: DashboardProps) {
  const [newTask, setNewTask] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'my-tasks' | 'team-tasks'>('all');
  
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      type: 'ai' as const,
      message: "Good morning! I've analyzed your schedule and found 3 hours of focused work time today. Should I block it for deep work?",
      timestamp: '9:15 AM'
    },
    {
      id: '2',
      type: 'user' as const,
      message: "Yes, please block it for the marketing strategy review",
      timestamp: '9:16 AM'
    },
    {
      id: '3',
      type: 'ai' as const,
      message: "Perfect! I've scheduled 'Review Q4 Marketing Strategy' from 10 AM - 1 PM. I've also identified 3 related documents you might need.",
      timestamp: '9:16 AM'
    }
  ]);

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
    assignedTo: [] as string[],
    tags: [] as string[],
    teamId: '',
    estimatedTime: 1
  });

  const todayStats = {
    completed: appState.tasks.filter(t => t.status === 'done').length,
    total: appState.tasks.length,
    focusTime: '3.2 hours',
    productivity: 87
  };

  const handleQuickAddTask = () => {
    if (!newTask.trim()) return;

    const task = {
      title: newTask,
      description: 'AI-parsed task description',
      status: 'inbox' as Task['status'],
      priority: 'medium' as Task['priority'],
      assignedTo: [appState.currentUser!.id],
      createdBy: appState.currentUser!.id,
      tags: []
    };

    onAddTask(task);
    setNewTask('');

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        message: `I've added "${newTask}" to your inbox. Based on your patterns, I recommend scheduling this for tomorrow morning.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  const handleAddTask = () => {
    if (!newTaskForm.title.trim()) return;

    const task = {
      ...newTaskForm,
      status: 'inbox' as Task['status'],
      assignedTo: newTaskForm.assignedTo.length > 0 ? newTaskForm.assignedTo : [appState.currentUser!.id],
      createdBy: appState.currentUser!.id
    };

    onAddTask(task);
    setNewTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: [],
      tags: [],
      teamId: '',
      estimatedTime: 1
    });
    setShowNewTaskDialog(false);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage('');

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: "I understand! Let me help you optimize that workflow. I'll analyze your data and provide recommendations in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  const handleDropTask = (taskId: string, newStatus: Task['status']) => {
    onUpdateTask(taskId, { status: newStatus });
  };

  const getFilteredTasks = (status: Task['status']) => {
    let tasks = appState.tasks.filter(task => task.status === status);
    
    if (searchTerm) {
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (selectedFilter === 'my-tasks') {
      tasks = tasks.filter(task => task.assignedTo?.includes(appState.currentUser!.id));
    } else if (selectedFilter === 'team-tasks') {
      tasks = tasks.filter(task => task.teamId);
    }

    return tasks;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <AuraLogo />
            </div>
            <div>
              <h1 className="text-lg font-medium">Aura AI Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {appState.currentUser?.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('calendar')}
              className="rounded-full"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Calendar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('team')}
              className="rounded-full"
            >
              <Users className="w-4 h-4 mr-2" />
              Team
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('analytics')}
              className="rounded-full"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('settings')}
              className="rounded-full p-2"
            >
              <Settings className="w-4 h-4" />
            </Button>

            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                {appState.currentUser?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="rounded-full p-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Pilot Panel */}
        <div className="w-80 border-r border-white/10 p-6 space-y-6 overflow-y-auto">
          {/* Today's Mission */}
          <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Today's Mission</h3>
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Tasks Completed</span>
                <span>{todayStats.completed}/{todayStats.total}</span>
              </div>
              <Progress value={(todayStats.completed / todayStats.total) * 100} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-2xl font-medium text-blue-400">{todayStats.focusTime}</div>
                  <div className="text-xs text-muted-foreground">Focus Time</div>
                </div>
                <div>
                  <div className="text-2xl font-medium text-green-400">{todayStats.productivity}%</div>
                  <div className="text-xs text-muted-foreground">Productivity</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Team Overview */}
          <Card className="p-4 backdrop-blur-sm bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Team Activity</h3>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            
            <div className="space-y-2">
              {appState.users.slice(0, 4).map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user.status === 'online' ? 'bg-green-400' : 
                    user.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Command */}
          <Card className="p-4 backdrop-blur-sm bg-white/5 border-white/10">
            <div className="flex items-center mb-3">
              <Zap className="w-4 h-4 text-yellow-400 mr-2" />
              <h3 className="font-medium text-sm">Quick Command</h3>
            </div>
            
            <div className="flex space-x-2 mb-3">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add task or ask Aura AI..."
                className="text-sm backdrop-blur-sm bg-white/5 border-white/20"
                onKeyPress={(e) => e.key === 'Enter' && handleQuickAddTask()}
              />
              <Button 
                size="sm" 
                onClick={handleQuickAddTask}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs backdrop-blur-sm bg-white/5 border-white/20">
                  <FileText className="w-3 h-3 mr-1" />
                  Detailed Task
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-white/10 border-white/20 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="taskTitle">Title</Label>
                      <Input
                        id="taskTitle"
                        value={newTaskForm.title}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                        placeholder="Task title..."
                        className="backdrop-blur-sm bg-white/5 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taskDescription">Description</Label>
                      <Textarea
                        id="taskDescription"
                        value={newTaskForm.description}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                        placeholder="Task description..."
                        className="backdrop-blur-sm bg-white/5 border-white/20"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="taskPriority">Priority</Label>
                        <Select value={newTaskForm.priority} onValueChange={(value: any) => setNewTaskForm({ ...newTaskForm, priority: value })}>
                          <SelectTrigger className="backdrop-blur-sm bg-white/5 border-white/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="taskDueDate">Due Date</Label>
                        <Input
                          id="taskDueDate"
                          type="date"
                          value={newTaskForm.dueDate}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                          className="backdrop-blur-sm bg-white/5 border-white/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taskEstimate">Estimated Hours</Label>
                        <Input
                          id="taskEstimate"
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={newTaskForm.estimatedTime}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, estimatedTime: parseFloat(e.target.value) })}
                          className="backdrop-blur-sm bg-white/5 border-white/20"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddTask}>Create Task</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        </div>

        {/* Center - Kanban Board */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Task Flow</h2>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 backdrop-blur-sm bg-white/5 border-white/20"
              />
              <Select value={selectedFilter} onValueChange={(v) => setSelectedFilter(v as any)}>
                <SelectTrigger className="w-40 backdrop-blur-sm bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="my-tasks">My Tasks</SelectItem>
                  <SelectItem value="team-tasks">Team Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 h-[calc(100%-80px)]">
            {/* Inbox */}
            <DropZone status="inbox" onDrop={handleDropTask}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Inbox
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {getFilteredTasks('inbox').length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {getFilteredTasks('inbox').map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        users={appState.users}
                        teams={appState.teams}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </DropZone>

            {/* In Progress */}
            <DropZone status="in-progress" onDrop={handleDropTask}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-yellow-400 uppercase tracking-wide">
                    In Progress
                  </h3>
                  <Badge className="text-xs bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    {getFilteredTasks('in-progress').length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {getFilteredTasks('in-progress').map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        users={appState.users}
                        teams={appState.teams}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </DropZone>

            {/* Done */}
            <DropZone status="done" onDrop={handleDropTask}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-green-400 uppercase tracking-wide">
                    Done
                  </h3>
                  <Badge className="text-xs bg-green-500/10 dark:bg-green-500/20 text-green-400 border-green-500/30">
                    {getFilteredTasks('done').length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {getFilteredTasks('done').map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        users={appState.users}
                        teams={appState.teams}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </DropZone>
          </div>
        </div>

        {/* Right Panel - AI Assistant */}
        <div className="w-80 border-l border-white/10 p-6 flex flex-col">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
              <Sparkles className="w-4 h-4 text-foreground dark:text-white" />
            </div>
            <div>
              <h3 className="font-medium">Aura AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Your AI co-pilot</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
            <AnimatePresence>
              {chatMessages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'backdrop-blur-sm bg-white/10 border border-white/20'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Actions */}
          <div className="mb-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs backdrop-blur-sm bg-white/5 border-white/20">
                <Clock className="w-3 h-3 mr-1" />
                Schedule
              </Button>
              <Button variant="outline" size="sm" className="text-xs backdrop-blur-sm bg-white/5 border-white/20">
                <Target className="w-3 h-3 mr-1" />
                Prioritize
              </Button>
              <Button variant="outline" size="sm" className="text-xs backdrop-blur-sm bg-white/5 border-white/20">
                <AlertCircle className="w-3 h-3 mr-1" />
                Review
              </Button>
              <Button variant="outline" size="sm" className="text-xs backdrop-blur-sm bg-white/5 border-white/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Complete
              </Button>
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask Aura AI anything..."
              className="text-sm backdrop-blur-sm bg-white/5 border-white/20"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              size="sm" 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

    