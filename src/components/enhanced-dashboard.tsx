
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrop } from 'react-dnd';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { 
  Menu,
  Target, 
  Zap, 
  Plus, 
  Search, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles,
  Timer,
  CalendarDays,
  FileText,
  Play,
  CheckCircle2,
  UserCheck,
  UserX,
  Bell,
  Activity as ActivityIcon,
  Send,
  Loader2,
  ArrowLeft,
  BrainCircuit,
  TrendingUp,
  Workflow,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Edit3,
  Trash2,
  Users,
  Clock
} from 'lucide-react';
import type { Task, User, Team, Activity } from '@/lib/types';
import { conversationalAgent } from '@/ai/flows/conversational-agent-flow';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { AiFeaturesPanel } from './ai-features-panel';
import { useAppContext } from '@/context/AppContext';
import { useTimer } from '@/hooks/use-timer';

// Helper function to render simple markdown (bold and lists)
const renderFormattedMessage = (text: string | undefined) => {
  if (!text) return null;

  const renderPart = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </>
    );
  };

  const blocks = text.split('\n');
  const renderedBlocks: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const endList = () => {
    if (listItems.length > 0) {
      renderedBlocks.push(
        <ul key={renderedBlocks.length} className="list-disc space-y-1 pl-5 my-2">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  blocks.forEach((block) => {
    if (block.trim().startsWith('- ') || block.trim().startsWith('* ')) {
      listItems.push(
        <li key={listItems.length}>{renderPart(block.trim().substring(2))}</li>
      );
    } else {
      endList();
      if (block.trim()) {
        renderedBlocks.push(<p key={renderedBlocks.length}>{renderPart(block)}</p>);
      }
    }
  });

  endList();

  return <div className="text-sm space-y-2">{renderedBlocks}</div>;
};

interface TaskCardProps {
  task: Task;
}

const AuraLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground dark:text-white">
      <path d="M12 4.75L19.25 19.25H4.75L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.4"/>
      <path d="M12 8L15.25 15.25H8.75L12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);

const ChatTaskCard = ({ taskId }: { taskId:string }) => {
    const { tasks } = useAppContext();
    const task = tasks.find(t => t.id === taskId);

    if (!task) return null;
    
    const priorityClasses = {
      high: 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300 border-red-500/30',
      medium: 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
      low: 'bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
    };

    return (
        <Card className="mt-2 p-3 bg-card/50 border-border">
            <h5 className="font-semibold text-sm">{task.title}</h5>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
            <div className="flex items-center justify-between mt-2 text-xs">
                <Badge
                    variant="outline"
                    className={`capitalize border-0 px-2 py-0.5 font-normal ${priorityClasses[task.priority]}`}
                >
                    {task.priority}
                </Badge>
                {task.dueDate && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{format(new Date(task.dueDate), "MMM d")}</span>
                    </div>
                )}
            </div>
        </Card>
    );
};

const formatTime = (seconds: number) => {
    if (seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
  
const TaskCard = ({ task }: TaskCardProps) => {
  const { users, teams, currentUser, handleUpdateTask, handleDeleteTask } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const { toast } = useToast();
  const { timeRemaining, isRunning } = useTimer(task);

  const canModify = currentUser?.role === 'admin' || task.createdBy === currentUser?.id;

  const isAssignedToCurrentUser = task.assignedTo?.includes(currentUser?.id || '') ?? false;

  const assignedUsers = users.filter(user => task.assignedTo?.includes(user.id));
  const team = teams.find(t => t.id === task.teamId);

  const handleSaveEdit = () => {
    handleUpdateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleStart = () => {
    if (task.teamId && !isAssignedToCurrentUser) {
      toast({ variant: "destructive", title: "Action not allowed", description: "Only assigned users can start this task."});
      return;
    }
    handleUpdateTask(task.id, { status: 'in-progress' });
  };
  
  const handleComplete = () => {
     if (task.teamId && !isAssignedToCurrentUser) {
      toast({ variant: "destructive", title: "Action not allowed", description: "Only assigned users can complete this task."});
      return;
    }
    const timeSpent = (task.estimatedTime ? task.estimatedTime * 3600 : 0) - timeRemaining;

    handleUpdateTask(task.id, { 
      status: 'done',
      timeSpent: timeSpent > 0 ? timeSpent : task.timeSpent || 0
    });
  };

  const handleDelete = () => {
    if (!canModify) {
      toast({
        variant: 'destructive',
        title: "Permission Denied",
        description: "You do not have permission to delete this task."
      });
      return;
    }
    handleDeleteTask(task.id);
  };
  
  const priorityClasses = {
      high: 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300',
      medium: 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
      low: 'bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <VisuallyHidden><DialogTitle>Edit Task</DialogTitle></VisuallyHidden>
            <DialogContent className="backdrop-blur-xl bg-background/80 border-border">
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
                    className="backdrop-blur-sm bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    className="backdrop-blur-sm bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={editedTask.status} onValueChange={(value: any) => setEditedTask({ ...editedTask, status: value })}>
                      <SelectTrigger className="backdrop-blur-sm bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inbox">Inbox</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={editedTask.priority} onValueChange={(value: any) => setEditedTask({ ...editedTask, priority: value })}>
                      <SelectTrigger className="backdrop-blur-sm bg-background">
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editedTask.dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editedTask.dueDate ? format(new Date(editedTask.dueDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                          onSelect={(date) => setEditedTask({ ...editedTask, dueDate: date ? format(date, 'yyyy-MM-dd') : undefined })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
              </div>
            </DialogContent>
        </Dialog>
        
        <Card 
            onClick={() => canModify && setIsEditing(true)}
            className={cn(
                "p-5 backdrop-blur-3xl bg-card/40 border-border/40 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between h-full rounded-[1.25rem] group overflow-hidden relative",
                canModify && "cursor-pointer"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[1.25rem] pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm leading-tight flex-1 pr-2">{task.title}</h4>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-6 h-6 shrink-0 -mr-2 -mt-1 opacity-50 group-hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            {canModify ? (
                                <>
                                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                        <Edit3 className="w-4 h-4 mr-2"/>
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(); }} className="text-red-400">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem disabled>
                                    You can't edit this task
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
            </div>

            <div className="space-y-3 mt-auto">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge
                        variant="outline"
                        className={`capitalize border-0 px-2 py-0.5 font-normal ${priorityClasses[task.priority]}`}
                    >
                        {task.priority}
                    </Badge>
                     {task.status === 'in-progress' && isRunning && task.estimatedTime ? (
                        <div className="flex items-center gap-1 text-yellow-700 dark:text-yellow-300">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(timeRemaining)}</span>
                        </div>
                    ) : task.dueDate ? (
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{format(new Date(task.dueDate), "MMM d")}</span>
                        </div>
                    ) : null}
                    {task.estimatedTime && (
                        <div className="flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            <span>{task.estimatedTime}h</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {assignedUsers.slice(0, 3).map((user) => (
                        <Avatar key={user.id} className="w-6 h-6 border-2 border-background">
                            {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            {user.name.charAt(0)}
                            </AvatarFallback>
                        )}
                        </Avatar>
                    ))}
                    {assignedUsers.length > 3 && (
                        <Avatar className="w-6 h-6 border-2 border-background">
                        <AvatarFallback className="text-[10px]">+{assignedUsers.length - 3}</AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                    {team && (
                        <Badge 
                        variant="outline" 
                        className="text-xs font-normal border-dashed max-w-[100px]"
                        style={{ borderColor: team.color, color: team.color }}
                        >
                        <p className="truncate">{team.name}</p>
                        </Badge>
                    )}
                </div>

                {task.status !== 'done' && (
                    <div className="pt-4 border-t border-border/40">
                    {task.status === 'in-progress' ? (
                        <Button size="sm" className="w-full h-9 bg-green-500/10 hover:bg-green-500/10 dark:bg-green-500/20 text-green-400 border border-green-500/30 hover:border-green-500/50 font-semibold transition-all duration-200" onClick={(e) => { e.stopPropagation(); handleComplete(); }}>
                            <CheckCircle2 className="w-[16px] h-[16px] mr-2"/>
                            Mark as Complete
                        </Button>
                    ) : (
                        <Button size="sm" className="w-full h-9 font-semibold bg-transparent border border-foreground/30 text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200" onClick={(e) => { e.stopPropagation(); handleStart(); }}>
                            <Play className="w-[16px] h-[16px] mr-2"/>
                            Start Task
                        </Button>
                    )}
                    </div>
                )}
            </div>
        </Card>
    </motion.div>
  );
};

const DropZone = ({ status, children, className }: { 
  status: Task['status']; 
  children: React.ReactNode; 
  className?: string;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string; status: Task['status'] }) => {
      // This logic is now handled by buttons, but we keep the drop zone for potential future use or other draggable items.
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={cn(
        `h-full rounded-lg transition-colors duration-200`,
        isOver ? 'bg-blue-500/10' : '',
        className
      )}
    >
      {children}
    </div>
  );
};

const PilotPanel = () => {
    const { currentUser, tasks, handleAddTask, activities, handleColleagueRequest, handleTeamInvite, handleNavigate } = useAppContext();
    const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
    
    const [newTaskForm, setNewTaskForm] = useState({
        title: '',
        description: '',
        priority: 'medium' as Task['priority'],
        dueDate: '',
        tags: [] as string[],
        estimatedTime: 1
    });

    const navItems = [
        { page: 'calendar', label: 'Calendar', icon: CalendarDays },
        { page: 'colleagues', label: 'Colleagues', icon: Users },
        { page: 'team', label: 'Groups', icon: Users },
        { page: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    const todayStats = {
      completed: tasks.filter((t: Task) => t.status === 'done').length,
      total: tasks.length,
      productivity: tasks.length > 0 ? Math.round((tasks.filter((t: Task) => t.status === 'done').length / tasks.length) * 100) : 0,
    };

    const handleAddTaskSubmit = () => {
        if (!newTaskForm.title.trim() || !currentUser) return;

        const task = {
          ...newTaskForm,
          status: 'inbox' as const,
          createdBy: currentUser.id,
          assignedTo: [currentUser.id],
          tags: newTaskForm.tags,
          timeSpent: 0,
        };

        handleAddTask(task);
        setNewTaskForm({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
          tags: [],
          estimatedTime: 1
        });
        setShowNewTaskDialog(false);
    };

    return (
        <div className="p-6 space-y-6 overflow-y-auto w-full max-w-sm mx-auto">
            <div className="space-y-2">
                <p className="text-[10.5px] font-bold text-muted-foreground/80 dark:text-muted-foreground/50 uppercase tracking-[0.2em] px-3 mb-3">Menu</p>
                <div className="space-y-1">
                    {navItems.map(item => (
                        <Button
                          key={item.page}
                          variant="ghost"
                          className="w-full justify-start text-[13.5px] font-semibold rounded-xl h-10 hover:bg-primary/8 hover:text-primary transition-all duration-200 text-foreground/70"
                          onClick={() => handleNavigate(item.page)}
                        >
                            <item.icon className="w-4 h-4 mr-3 opacity-60" />
                            {item.label}
                        </Button>
                    ))}
                </div>
            </div>

            <Card className="p-6 backdrop-blur-3xl bg-card/40 border-border/40 shadow-xl rounded-[1.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mt-10 -mr-10 transition-transform group-hover:scale-110"></div>
                <div className="flex items-center justify-between mb-5 relative z-10">
                    <h3 className="font-semibold tracking-tight text-[15px]">Today's Goals</h3>
                    <Target className="w-[18px] h-[18px] text-blue-400 drop-shadow-sm" />
                </div>
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between text-[13.5px] font-medium text-muted-foreground">
                        <span>Tasks Completed</span>
                        <span>{todayStats.completed} / {todayStats.total}</span>
                    </div>
                    <Progress value={todayStats.total > 0 ? (todayStats.completed / todayStats.total) * 100 : 0} className="h-1.5" />
                    <div className="text-center pt-3 pb-1">
                        <div className="text-[34px] leading-tight font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">{todayStats.productivity}%</div>
                        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Productivity</div>
                    </div>
                </div>
            </Card>

            <Sheet>
                <VisuallyHidden><SheetTitle>Activity Feed</SheetTitle></VisuallyHidden>
                <SheetTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start px-2 text-muted-foreground hover:text-foreground">
                        <ActivityIcon className="w-4 h-4 mr-2" />
                        Activity Feed
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>Activity Feed</SheetTitle>
                    <SheetDescription>
                        Recent activities across your workspace.
                    </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-3 mt-4 max-h-[80vh] overflow-y-auto">
                        {activities.map((activity: Activity) => (
                            <div key={activity.id} className="text-sm p-3 rounded-md bg-card border-border">
                                {activity.action === 'colleague_request' && activity.status === 'pending' ? (
                                    <>
                                        <p><span className="font-bold">{activity.fromUser?.name}</span> sent you a colleague request.</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" className="h-7 text-xs" onClick={() => handleColleagueRequest(activity, 'accept')}>
                                                <UserCheck className="w-3 h-3 mr-1" /> Accept
                                            </Button>
                                            <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleColleagueRequest(activity, 'reject')}>
                                                <UserX className="w-3 h-3 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    </>
                                ) : (activity as any).action === 'team_invite' ? null : activity.action === 'colleague_accepted' ? (
                                    <p>You are now colleagues with <span className="font-bold">{activity.targetName}</span>.</p>
                                ) : activity.action === 'colleague_rejected' ? (
                                    <p><span className="font-bold">{activity.targetName}</span> rejected your colleague request.</p>
                                ) : activity.action === 'completed_task' ? (
                                    <p><span className="font-bold">{activity.fromUser?.name || 'Someone'}</span> completed task: <span className="font-bold">{activity.targetName}</span>.</p>
                                ) : (
                                    <p>You {activity.action.replace(/_/g, ' ')} <span className="font-bold">{activity.targetName}</span></p>
                                )}
                                 <p className="text-xs text-muted-foreground mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>

            <Card className="p-5 backdrop-blur-3xl bg-card/40 border-border/40 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                      <Zap className="w-4 h-4 text-foreground dark:text-white" />
                    </div>
                    <h3 className="font-semibold text-[13.5px] tracking-tight">Quick Create</h3>
                </div>
                <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full text-xs backdrop-blur-sm bg-background">
                            <FileText className="w-3 h-3 mr-1" />
                            Create a Detailed Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="backdrop-blur-xl bg-background/80 border-border max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="taskTitle">Title</Label>
                                <Input id="taskTitle" value={newTaskForm.title} onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })} placeholder="Task title..." className="backdrop-blur-sm bg-background" />
                            </div>
                            <div>
                                <Label htmlFor="taskDescription">Description</Label>
                                <Textarea id="taskDescription" value={newTaskForm.description} onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })} placeholder="Task description..." className="backdrop-blur-sm bg-background" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="taskPriority">Priority</Label>
                                    <Select value={newTaskForm.priority} onValueChange={(value: any) => setNewTaskForm({ ...newTaskForm, priority: value })}>
                                    <SelectTrigger className="backdrop-blur-sm bg-background"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="taskDueDate">Due Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !newTaskForm.dueDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {newTaskForm.dueDate ? format(new Date(newTaskForm.dueDate), "PPP") : <span>Pick a date</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={newTaskForm.dueDate ? new Date(newTaskForm.dueDate) : undefined}
                                            onSelect={(date) => setNewTaskForm({ ...newTaskForm, dueDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="taskEstimate">Estimated Hours</Label>
                                <Input
                                id="taskEstimate"
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={newTaskForm.estimatedTime}
                                onChange={(e) => setNewTaskForm({ ...newTaskForm, estimatedTime: parseFloat(e.target.value) || 0 })}
                                className="backdrop-blur-sm bg-background"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>Cancel</Button>
                                <Button onClick={handleAddTaskSubmit}>Create Task</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    );
}

const allFeatures = [
    { id: 'task-prioritizer', title: "Prioritizer", icon: BrainCircuit },
    { id: 'project-assistant', title: "Team Sync", icon: Users },
    { id: 'flowchart-summary', title: "Summarizer", icon: Workflow },
    { id: 'progress-tracker', title: "Analytics", icon: TrendingUp },
];

const AuraAssistantPanel = ({ isAiThinking, handleAiAction, chatMessages }: {isAiThinking: boolean, handleAiAction: (message: string) => void, chatMessages: any[]}) => {
    const { tasks, users, teams } = useAppContext();
    const [chatMessage, setChatMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [activeFeature, setActiveFeature] = useState<string|null>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSend = () => {
        handleAiAction(chatMessage);
        setChatMessage('');
    };

    return (
        <div className="p-6 flex flex-col h-full">
            <Dialog open={!!activeFeature} onOpenChange={(isOpen) => !isOpen && setActiveFeature(null)}>
              <VisuallyHidden>
                <DialogTitle>AI Toolkit Feature</DialogTitle>
              </VisuallyHidden>
                <DialogContent className="max-w-4xl bg-background/95 p-0 border-border">
                    <AiFeaturesPanel featureId={activeFeature || undefined} onFeatureSelect={setActiveFeature} />
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_4px_14px_rgba(99,102,241,0.4)]">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2L13.5 13H2.5L8 2Z" fill="white" opacity="0.3"/>
                          <path d="M8 5L11 11H5L8 5Z" fill="white"/>
                        </svg>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background" />
                  </div>
                  <div>
                      <h3 className="font-bold tracking-tight text-[15px] leading-none">Aura</h3>
                      <p className="text-[11.5px] text-muted-foreground font-medium mt-0.5 leading-none">AI Assistant · Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active</span>
                </div>
            </div>

            <div ref={chatContainerRef} className="flex-1 space-y-4 mb-4 overflow-y-auto pr-2 -mr-2">
                <AnimatePresence>
                {chatMessages.map((message: any) => (
                    <motion.div
                        key={message.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-3 rounded-lg ${
                            message.type === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                            : 'bg-card'
                        }`}>
                            {renderFormattedMessage(message.message)}
                            {message.prioritizedTaskIds && (
                                <div className="mt-3 space-y-2">
                                    {message.prioritizedTaskIds.map((taskId: string) => (
                                        <ChatTaskCard key={taskId} taskId={taskId} />
                                    ))}
                                </div>
                            )}
                            {message.dayPlan && (
                                <div className="mt-4 space-y-2">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="11" rx="2" stroke="white" strokeWidth="1.5"/><path d="M1 6h14" stroke="white" strokeWidth="1.5"/><path d="M5 1v4M11 1v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                    </div>
                                    <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">Today's Schedule</span>
                                  </div>
                                  {message.dayPlan.timeBlocks.map((block: any, index: number) => {
                                    const isOpen = block.activity.toLowerCase().includes('open');
                                    const isOverdue = block.activity.toLowerCase().includes('overdue') || index === 0;
                                    const blockColors = [
                                      { bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400', time: 'text-red-400', badge: 'bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20' },
                                      { bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-400', time: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                                      { bg: 'bg-purple-500/10', border: 'border-purple-500/30', dot: 'bg-purple-400', time: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
                                      { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400', time: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
                                    ];
                                    const color = isOpen ? blockColors[3] : blockColors[index % 3];
                                    return (
                                      <div key={index} className={`relative flex gap-3 p-3.5 rounded-[14px] border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] cursor-default ${color.bg} ${color.border}`}>
                                        <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${color.dot} shrink-0 shadow-[0_0_6px_2px] shadow-current mt-2`} />
                                        <div className="flex-1 min-w-0">
                                          <div className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${color.time}`}>{block.time}</div>
                                          <div className="text-[13px] font-semibold leading-snug text-foreground/90">{block.activity}</div>
                                        </div>
                                        {isOpen && (
                                          <div className={`self-center ml-2 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${color.badge} shrink-0`}>Free</div>
                                        )}
                                        {!isOpen && index === 0 && (
                                          <div className="self-center ml-2 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20 shrink-0">Overdue</div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                            )}
                            {message.suggestions && Array.isArray(message.suggestions) && message.suggestions.length > 0 && (
                                <div className="mt-3 grid gap-2">
                                    {message.suggestions.map((suggestion: string, index: number) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-start text-left h-auto py-1.5 px-3 bg-background/50 hover:bg-background"
                                            onClick={() => handleAiAction(suggestion)}
                                        >
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                 {isAiThinking && (
                     <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                     >
                        <div className="max-w-[85%] p-3 rounded-lg bg-card flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground"/>
                            <p className="text-sm text-muted-foreground">Aura is thinking...</p>
                        </div>
                     </motion.div>
                 )}
                </AnimatePresence>
            </div>
            
            <div className="flex space-x-3 pt-3 border-t border-border/40 mt-auto items-center">
                <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask Aura AI anything..."
                className="text-[14.5px] bg-card/40 backdrop-blur-xl border-border/50 h-11 rounded-xl focus:border-blue-500/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isAiThinking}
                />
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" variant="outline" className="shrink-0 h-11 w-11 rounded-xl bg-background/50 border-border/50 hover:bg-background/80">
                            <Zap className="w-5 h-5 text-blue-400"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2 mb-2 rounded-xl backdrop-blur-3xl bg-background/90" align="end">
                        <div className="grid grid-cols-2 gap-1">
                            {allFeatures.map(feature => {
                                const Icon = feature.icon;
                                return (
                                    <Button key={feature.id} variant="ghost" className="flex-col h-16 p-1 text-center w-20 rounded-lg" onClick={() => setActiveFeature(feature.id)}>
                                        <Icon className="w-5 h-5 mb-1 text-primary"/>
                                        <span className="text-[11px] font-medium leading-tight break-words w-full">{feature.title}</span>
                                    </Button>
                                )
                            })}
                        </div>
                    </PopoverContent>
                </Popover>
                <Button 
                    size="icon" 
                    onClick={handleSend}
                    className="h-11 w-11 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/20 shrink-0"
                    disabled={isAiThinking || !chatMessage.trim()}
                >
                <Send className="w-[18px] h-[18px] text-white" />
                </Button>
            </div>
        </div>
    );
};

const AuraAssistantMobileSheet = ({ open, onOpenChange, handleAiAction, chatMessages, isAiThinking }: {open: boolean, onOpenChange: (open:boolean)=>void, handleAiAction: (message:string)=>void, chatMessages: any[], isAiThinking: boolean}) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chatMessage, setChatMessage] = useState('');
    const [activeFeature, setActiveFeature] = useState<string|null>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);
    
    const handleSend = () => {
        handleAiAction(chatMessage);
        setChatMessage('');
    };

    const openFeature = (featureId: string) => {
        setActiveFeature(featureId);
    };

    return (
        <>
        <Dialog open={open} onOpenChange={(isOpen) => {
          if (!isOpen) onOpenChange(false);
        }}>
            <DialogContent className="p-0 m-0 bg-background w-screen h-screen max-w-full flex flex-col gap-0 rounded-none border-none">
              <VisuallyHidden>
                  <DialogTitle>Aura AI Assistant</DialogTitle>
                  <DialogDescription>A full-screen chat interface to interact with the Aura AI assistant.</DialogDescription>
              </VisuallyHidden>
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border pt-[calc(env(safe-area-inset-top,0rem)+1rem)]">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <AuraLogo />
                        </div>
                        <div>
                            <h3 className="font-medium">Aura AI Assistant</h3>
                            <p className="text-xs text-green-400">Online</p>
                        </div>
                    </div>
                </div>

                <div ref={chatContainerRef} className="flex-1 space-y-4 p-4 overflow-y-auto">
                    <AnimatePresence>
                    {chatMessages.map((message: any) => (
                        <motion.div
                            key={message.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] p-3 rounded-lg ${
                                message.type === 'user' 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                                : 'bg-card'
                            }`}>
                                {renderFormattedMessage(message.message)}
                                {message.prioritizedTaskIds && (
                                    <div className="mt-3 space-y-2">
                                        {message.prioritizedTaskIds.map((taskId: string) => (
                                            <ChatTaskCard key={taskId} taskId={taskId} />
                                        ))}
                                    </div>
                                )}
                                 {message.dayPlan && (
                                    <div className="mt-4 space-y-2">
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="11" rx="2" stroke="white" strokeWidth="1.5"/><path d="M1 6h14" stroke="white" strokeWidth="1.5"/><path d="M5 1v4M11 1v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                        </div>
                                        <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">Today's Schedule</span>
                                      </div>
                                      {message.dayPlan.timeBlocks.map((block: any, index: number) => {
                                        const isOpen = block.activity.toLowerCase().includes('open');
                                        const blockColors = [
                                          { bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400', time: 'text-red-400', badge: 'bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20' },
                                          { bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-400', time: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                                          { bg: 'bg-purple-500/10', border: 'border-purple-500/30', dot: 'bg-purple-400', time: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
                                          { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400', time: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
                                        ];
                                        const color = isOpen ? blockColors[3] : blockColors[index % 3];
                                        return (
                                          <div key={index} className={`relative flex gap-3 p-3.5 rounded-[14px] border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] cursor-default ${color.bg} ${color.border}`}>
                                            <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${color.dot} shrink-0 shadow-[0_0_6px_2px] shadow-current mt-2`} />
                                            <div className="flex-1 min-w-0">
                                              <div className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${color.time}`}>{block.time}</div>
                                              <div className="text-[13px] font-semibold leading-snug text-foreground/90">{block.activity}</div>
                                            </div>
                                            {isOpen && (
                                              <div className={`self-center ml-2 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${color.badge} shrink-0`}>Free</div>
                                            )}
                                            {!isOpen && index === 0 && (
                                              <div className="self-center ml-2 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20 shrink-0">Overdue</div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                )}
                                {message.suggestions && Array.isArray(message.suggestions) && message.suggestions.length > 0 && (
                                    <div className="mt-3 grid gap-2">
                                        {message.suggestions.map((suggestion: string, index: number) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                className="w-full justify-start text-left h-auto py-1.5 px-3 bg-background/50 hover:bg-background"
                                                onClick={() => handleAiAction(suggestion)}
                                            >
                                                {suggestion}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isAiThinking && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="max-w-[85%] p-3 rounded-lg bg-card flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground"/>
                                <p className="text-sm text-muted-foreground">Aura is thinking...</p>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                
                <div className="flex-shrink-0 p-4 border-t border-border bg-background pb-[calc(env(safe-area-inset-bottom,0rem)+1rem)]">
                    <div className="flex space-x-2">
                        <Input
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Message Aura AI..."
                            className="text-sm bg-card"
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isAiThinking}
                        />
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <Zap className="w-5 h-5"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2 mb-2">
                                 <div className="space-y-1">
                                    {allFeatures.map(feature => {
                                        const Icon = feature.icon;
                                        return (
                                            <Button
                                                key={feature.id}
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={() => openFeature(feature.id)}
                                            >
                                                <Icon className="w-4 h-4 mr-2" />
                                                {feature.title}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button 
                            size="icon" 
                            onClick={handleSend}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                            disabled={isAiThinking || !chatMessage.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        <Dialog open={!!activeFeature} onOpenChange={(isOpen) => {
            if (!isOpen) setActiveFeature(null);
        }}>
           <DialogContent className="max-w-4xl bg-background/95 p-0 border-border">
              <VisuallyHidden>
                  <DialogTitle>AI Toolkit Feature</DialogTitle>
                  <DialogDescription>Details for the selected AI tool.</DialogDescription>
              </VisuallyHidden>
                <AiFeaturesPanel featureId={activeFeature || undefined} onFeatureSelect={setActiveFeature} />
            </DialogContent>
        </Dialog>
        </>
    );
};


export function EnhancedDashboard() { 
  const { 
      tasks, 
      teams, 
      users,
      currentUser,
      activities,
      handleLogout,
      handleNavigate,
      handleUpdateTask, 
      handleAddTask, 
      handleColleagueRequest,
      handleTeamInvite
    } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'my-tasks' | 'team-tasks'>('all');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
        id: 'aura-intro',
        type: 'ai',
        message: "Hello! I'm Aura, your intelligent work assistant. How can I help you get started?",
        suggestions: [
            "What are my top priorities for today?",
            "Plan my day.",
            "Create a task to prepare the weekly report",
        ]
    }
  ]);
  const [showPilot, setShowPilot] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const handleAiAction = async (message: string) => {
    if (!message.trim() || !currentUser) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message,
    };
    
    setChatMessages(prev => {
        const updatedPrev = prev.map(m => {
            if (!m.suggestions) return m;
            const { suggestions, ...rest } = m;
            return rest;
        });
        return [...updatedPrev, userMessage];
    });

    setIsAiThinking(true);

    try {
        const simpleUsers = users.map(u => ({id: u.id, name: u.name, email: u.email}));
        const simpleTeams = teams.map(t => ({id: t.id, name: t.name, members: t.members}));

      const result = await conversationalAgent({
        query: message,
        tasks: tasksRef.current,
        users: simpleUsers,
        teams: simpleTeams,
      });

      if (result.createdTask) {
        const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
          ...result.createdTask,
          description: result.createdTask.description || '',
          priority: result.createdTask.priority || 'medium',
          status: 'inbox' as const,
          createdBy: currentUser.id,
          assignedTo: [currentUser.id],
        };
        handleAddTask(newTask);
      }
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: result.response,
        prioritizedTaskIds: result.prioritizedTasks,
        dayPlan: result.dayPlan,
      };
      setChatMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error with conversational agent:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: "I'm sorry, I encountered an error. Please try again.",
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
    
    setIsAiThinking(false);
  };

  const getFilteredTasks = (status: Task['status']) => {
    let filtered = tasks.filter(task => task.status === status);
    
    if (selectedFilter === 'my-tasks') {
        filtered = filtered.filter(task => task.assignedTo?.includes(currentUser!.id) && !task.teamId);
    } else if (selectedFilter === 'team-tasks') {
        filtered = filtered.filter(task => {
            const isAssignedToMe = task.assignedTo?.includes(currentUser!.id);
            const isUnassignedOnMyTeam = task.teamId && 
                                       (!task.assignedTo || task.assignedTo.length === 0) && 
                                       teams.some(team => team.id === task.teamId && team.members.includes(currentUser!.id));
            return isAssignedToMe || isUnassignedOnMyTeam;
        });
    } else { 
        filtered = filtered.filter(task => {
            const isAssignedToMe = task.assignedTo?.includes(currentUser!.id);
            const isPersonalAndCreatedByMe = !task.teamId && task.createdBy === currentUser!.id;
            
            // For team tasks, only show if assigned to me OR if it's still unassigned 
            // (so it can be picked up) AND I am a member of that team.
            const isUnassignedOnMyTeam = task.teamId && 
                                       (!task.assignedTo || task.assignedTo.length === 0) && 
                                       teams.some(team => team.id === task.teamId && team.members.includes(currentUser!.id));
                                       
            return isAssignedToMe || isPersonalAndCreatedByMe || isUnassignedOnMyTeam;
        });
    }
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    return filtered;
  };
  
  const columns: { status: Task['status']; title: string; color: string }[] = [
    { status: 'inbox', title: 'Inbox', color: 'text-muted-foreground' },
    { status: 'in-progress', title: 'In Progress', color: 'text-yellow-400' },
    { status: 'done', title: 'Done', color: 'text-green-400' },
  ];

  const pendingRequests = activities.filter(
    (a) => a.action === 'colleague_request' && a.status === 'pending'
  );


  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden relative selection:bg-primary/30">
      {/* Premium Deep Purple/Blue Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background">
        <div className="absolute top-0 right-1/4 w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[140px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[140px] translate-y-1/2"></div>
      </div>

      <header className="flex-shrink-0 sticky top-0 z-40 backdrop-blur-3xl bg-background/60 border-b border-border/40 py-1.5 relative">
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 w-full">
          <div className="flex items-center space-x-2 sm:space-x-4">
             <Sheet open={showPilot} onOpenChange={setShowPilot}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                        <Menu className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-background/95 p-0">
                    <VisuallyHidden>
                      <SheetTitle>Pilot Panel</SheetTitle>
                      <SheetDescription>This panel contains the main dashboard controls and overview.</SheetDescription>
                    </VisuallyHidden>
                    <PilotPanel />
                </SheetContent>
            </Sheet>
            <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_2px_10px_rgba(99,102,241,0.4)]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2L13.5 13H2.5L8 2Z" fill="white" opacity="0.3"/>
                      <path d="M8 5L11 11H5L8 5Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[18px] font-extrabold tracking-tight">Aura</span>
                    <span className="text-[11px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase pb-0.5">AI</span>
                  </div>
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {pendingRequests.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 backdrop-blur-3xl bg-card/80 border-border/50 rounded-2xl shadow-2xl" align="end">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-[14px] tracking-tight">Notifications</h4>
                    {pendingRequests.length > 0 && <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{pendingRequests.length} pending</span>}
                  </div>
                  <div className="space-y-3">
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map(req => (
                        <div key={req.id}>
                          {req.action === 'colleague_request' ? (
                            <>
                              <p className="text-sm">
                                <span className="font-medium">{req.fromUser?.name}</span> wants to be your colleague.
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" className="text-xs h-7" onClick={() => handleColleagueRequest(req, 'accept')}>
                                  <UserCheck className="w-3 h-3 mr-1" /> Accept
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleColleagueRequest(req, 'reject')}>
                                  <UserX className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </div>
                            </>
                          ) : req.action === 'team_invite' ? null : (
                            <>
                              <p className="text-sm">
                                <span className="font-medium">{req.fromUser?.name}</span> invited you to join <span className="font-medium">{req.targetName}</span>.
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" className="text-xs h-7" onClick={() => handleTeamInvite(req, 'accept')}>
                                  <UserCheck className="w-3 h-3 mr-1" /> Accept
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleTeamInvite(req, 'reject')}>
                                  <UserX className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" onClick={() => handleNavigate('settings')}><Settings className="w-5 h-5" /></Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 cursor-pointer">
                  {currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" /> : <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">{currentUser?.name.charAt(0)}</AvatarFallback>}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <aside className="hidden lg:block w-80 border-r border-border/40 flex-shrink-0 overflow-y-auto bg-card/10 backdrop-blur-sm">
           <PilotPanel />
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden w-full max-w-[1600px] mx-auto">
           <div className="flex-shrink-0 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-8 px-4 sm:px-8 pt-6 sm:pt-8 w-full">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] shrink-0">
                   <Target className="w-6 h-6 text-foreground dark:text-white" />
               </div>
               <h2 className="text-[26px] font-semibold tracking-tight shrink-0">Task Tracker</h2>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative w-full md:w-48 lg:w-64">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                <Input placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 h-10 rounded-xl bg-card/40 backdrop-blur-xl border-border/40 focus:border-primary/50 font-medium text-[14px]" />
              </div>
              <Select value={selectedFilter} onValueChange={(v) => setSelectedFilter(v as any)}>
                <SelectTrigger className="w-full md:w-36 lg:w-44 h-10 rounded-xl bg-card/40 backdrop-blur-xl border-border/40 focus:border-primary/50 font-medium text-[14px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="my-tasks">My Tasks</SelectItem>
                  <SelectItem value="team-tasks">Group Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
           <div className="flex-1 md:hidden overflow-y-auto px-4 sm:px-6 pb-4 space-y-8">
             {columns.map(col => (
                <div key={col.status}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-3.5 rounded-full ${
                            col.status === 'inbox' ? 'bg-slate-400/60' :
                            col.status === 'in-progress' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                          <h3 className="font-semibold text-[13px] text-foreground/80 tracking-wide">{col.title}</h3>
                        </div>
                        <div className={`min-w-[22px] h-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-black ${
                          col.status === 'inbox' ? 'bg-slate-500/15 text-slate-400' :
                          col.status === 'in-progress' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                        }`}>{getFilteredTasks(col.status).length}</div>
                    </div>
                    <DropZone status={col.status}>
                        <div className="space-y-3 min-h-[50px]">
                            <AnimatePresence>
                                {getFilteredTasks(col.status).map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </DropZone>
                </div>
            ))}
          </div>

          <div className="flex-1 hidden md:grid md:grid-cols-3 gap-6 overflow-hidden px-4 sm:px-6 pb-6">
            {columns.map(col => (
              <div key={col.status} className="flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-5 flex-shrink-0 px-1">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-4 rounded-full ${
                        col.status === 'inbox' ? 'bg-slate-400/60' :
                        col.status === 'in-progress' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <h3 className="font-semibold text-[13px] text-foreground/80 tracking-wide">{col.title}</h3>
                    </div>
                    <div className={`min-w-[24px] h-6 px-2 rounded-full flex items-center justify-center text-[11px] font-black ${
                      col.status === 'inbox' ? 'bg-slate-500/15 text-slate-400' :
                      col.status === 'in-progress' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>{getFilteredTasks(col.status).length}</div>
                  </div>
                  <DropZone status={col.status} className="flex-1 overflow-y-auto p-2 -m-2">
                      <div className="space-y-3">
                        <AnimatePresence>
                          {getFilteredTasks(col.status).map(task => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                        </AnimatePresence>
                      </div>
                  </DropZone>
              </div>
            ))}
          </div>
        </main>

        <aside className="hidden xl:flex flex-col w-96 border-l border-border flex-shrink-0 h-full overflow-y-auto">
            <AuraAssistantPanel isAiThinking={isAiThinking} handleAiAction={handleAiAction} chatMessages={chatMessages} />
        </aside>

        <div className="xl:hidden">
            <button
                className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl shadow-[0_8px_30px_rgba(99,102,241,0.5)] bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-[0_12px_40px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
                onClick={() => setShowMobileChat(true)}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C7.03 3 3 6.58 3 11c0 2.3 1.1 4.38 2.87 5.9L5 21l4.33-1.74C10.4 19.74 11.19 20 12 20c4.97 0 9-3.58 9-8s-4.03-9-9-9z" fill="white" opacity="0.25"/>
                  <path d="M12 5.5C7.86 5.5 4.5 7.98 4.5 11c0 1.64.88 3.11 2.31 4.17l-.45 2.83 2.66-1.07C9.88 17.27 10.92 17.5 12 17.5c4.14 0 7.5-2.48 7.5-5.5S16.14 5.5 12 5.5z" stroke="white" strokeWidth="1.2" fill="none"/>
                  <circle cx="9" cy="11" r="1" fill="white"/>
                  <circle cx="12" cy="11" r="1" fill="white"/>
                  <circle cx="15" cy="11" r="1" fill="white"/>
                </svg>
            </button>

            <AuraAssistantMobileSheet
                open={showMobileChat}
                onOpenChange={setShowMobileChat}
                handleAiAction={handleAiAction}
                chatMessages={chatMessages}
                isAiThinking={isAiThinking}
            />
        </div>

      </div>
    </div>
  );
}
