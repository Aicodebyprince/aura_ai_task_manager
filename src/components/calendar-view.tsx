
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Plus, CheckCircle2, Clock, AlertCircle, Circle
} from 'lucide-react';
import type { Task } from '@/lib/types';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const PRIORITY_CONFIG: Record<Task['priority'], { dot: string; label: string; bg: string }> = {
  high:   { dot: 'bg-red-400',    label: 'High',   bg: 'bg-red-500/15 text-red-400 border-red-500/25' },
  medium: { dot: 'bg-amber-400',  label: 'Medium', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  low:    { dot: 'bg-emerald-400',label: 'Low',    bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
};
const STATUS_CONFIG: Record<Task['status'], { bg: string; label: string; icon: any }> = {
  done:         { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Done',        icon: CheckCircle2 },
  'in-progress':{ bg: 'bg-amber-500/10  text-amber-400  border-amber-500/20',  label: 'In Progress', icon: Clock },
  inbox:        { bg: 'bg-slate-500/10  text-slate-400  border-slate-500/20',  label: 'Inbox',       icon: Circle },
};

export function CalendarView() {
  const { tasks, currentUser, handleNavigate, handleAddTask } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);

  const [newTaskForm, setNewTaskForm] = useState({
    title: '', description: '', priority: 'medium' as Task['priority'], dueDate: '', estimatedTime: 1,
  });

  const toYYYYMMDD = (date: Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const handleAddTaskSubmit = () => {
    if (!newTaskForm.title.trim() || !currentUser) return;
    handleAddTask({ ...newTaskForm, status: 'inbox' as const, createdBy: currentUser.id, assignedTo: [currentUser.id] });
    setShowNewTaskDialog(false);
    setNewTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', estimatedTime: 1 });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear(), month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    const days: (Date | null)[] = Array(firstDay.getDay()).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    const ds = toYYYYMMDD(date);
    return tasks.filter(t => t.dueDate === ds);
  };

  const tasksForSelectedDate = useMemo(() => {
    if (!selectedDate) return { due: [], completed: [] };
    const ds = toYYYYMMDD(selectedDate);
    return {
      due:       tasks.filter(t => t.dueDate === ds),
      completed: tasks.filter(t => t.status === 'done' && t.updatedAt && toYYYYMMDD(new Date(t.updatedAt)) === ds),
    };
  }, [selectedDate, tasks]);

  const navigateMonth = (dir: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + (dir === 'next' ? 1 : -1));
      return d;
    });
  };

  const isToday = (date: Date | null) => !!date && date.toDateString() === new Date().toDateString();
  const isSelected = (date: Date | null) => !!date && !!selectedDate && date.toDateString() === selectedDate.toDateString();

  const days = getDaysInMonth(currentDate);

  // Stats
  const thisMonthTaskCount = tasks.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
  }).length;
  const overdueCount = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-blue-600/7 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/7 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-3xl bg-background/70 border-b border-border/30">
        <div className="flex items-center justify-between px-6 sm:px-10 h-[68px] max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => handleNavigate('dashboard')} className="rounded-full w-9 h-9 hover:bg-white/8">
              <ArrowLeft className="w-[18px] h-[18px] text-foreground/70" />
            </Button>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.35)]">
                <CalendarIcon className="w-5 h-5 text-foreground dark:text-white" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold tracking-tight leading-none">Calendar</h1>
                <p className="text-[12px] text-muted-foreground font-medium mt-0.5 hidden sm:block">
                  {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick stats */}
            <div className="hidden sm:flex items-center gap-2">
              {overdueCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[12px] font-bold text-red-400">{overdueCount} overdue</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="text-[12px] font-bold text-blue-400">{thisMonthTaskCount} tasks this month</span>
              </div>
            </div>

            <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
              <DialogTrigger asChild>
                <Button className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-semibold text-[13px] border-0 shadow-[0_4px_14px_rgba(99,102,241,0.3)]">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-3xl bg-background/90 border-border/40 rounded-2xl shadow-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-[18px] font-bold tracking-tight">New Calendar Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11.5px] font-bold text-muted-foreground uppercase tracking-wider">Title</Label>
                    <Input value={newTaskForm.title} onChange={e => setNewTaskForm({...newTaskForm, title: e.target.value})} placeholder="Task title..." className="bg-background/50 border-border/50 rounded-xl h-11 text-[13.5px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11.5px] font-bold text-muted-foreground uppercase tracking-wider">Description</Label>
                    <Textarea value={newTaskForm.description} onChange={e => setNewTaskForm({...newTaskForm, description: e.target.value})} placeholder="Optional..." className="bg-background/50 border-border/50 rounded-xl text-[13.5px] resize-none h-24" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11.5px] font-bold text-muted-foreground uppercase tracking-wider">Priority</Label>
                      <Select value={newTaskForm.priority} onValueChange={(v: any) => setNewTaskForm({...newTaskForm, priority: v})}>
                        <SelectTrigger className="bg-background/50 border-border/50 rounded-xl h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11.5px] font-bold text-muted-foreground uppercase tracking-wider">Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn('w-full justify-start font-normal bg-background/50 border-border/50 rounded-xl h-11 text-[13px]', !newTaskForm.dueDate && 'text-muted-foreground')}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newTaskForm.dueDate ? format(new Date(newTaskForm.dueDate), 'MMM d') : 'Pick date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={newTaskForm.dueDate ? new Date(newTaskForm.dueDate) : undefined} onSelect={d => setNewTaskForm({...newTaskForm, dueDate: d ? toYYYYMMDD(d) : ''})} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={() => setShowNewTaskDialog(false)} className="h-10 px-4 rounded-xl text-[13px]">Cancel</Button>
                    <Button onClick={handleAddTaskSubmit} disabled={!newTaskForm.title.trim()} className="h-10 px-5 rounded-xl text-[13.5px] font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">Add Task</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <Dialog open={!!selectedDate} onOpenChange={open => !open && setSelectedDate(null)}>
            <DialogContent className="backdrop-blur-3xl bg-background/90 border-border/40 rounded-2xl shadow-2xl max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-[18px] font-bold tracking-tight">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 mt-1 max-h-[60vh] overflow-y-auto pr-1">
                {/* Due tasks */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3.5 w-[3px] bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                    <p className="text-[12px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">Tasks Due ({tasksForSelectedDate.due.length})</p>
                  </div>
                  {tasksForSelectedDate.due.length > 0 ? (
                    <div className="space-y-2.5">
                      {tasksForSelectedDate.due.map(task => {
                        const s = STATUS_CONFIG[task.status];
                        const p = PRIORITY_CONFIG[task.priority];
                        return (
                          <div key={task.id} className="flex items-start gap-3 p-4 rounded-xl border border-border/35 bg-card/30 backdrop-blur-sm">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${p.dot}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[14px] truncate">{task.title}</p>
                              {task.description && <p className="text-[12.5px] text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>}
                            </div>
                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold shrink-0 ${s.bg}`}>
                              <s.icon className="w-3 h-3" />
                              {s.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[13px] text-muted-foreground py-2">No tasks due on this day.</p>
                  )}
                </div>

                {/* Completed tasks */}
                {tasksForSelectedDate.completed.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-3.5 w-[3px] bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                      <p className="text-[12px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">Completed ({tasksForSelectedDate.completed.length})</p>
                    </div>
                    <div className="space-y-2.5">
                      {tasksForSelectedDate.completed.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <p className="text-[13.5px] text-muted-foreground line-through truncate">{task.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Calendar Grid */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateMonth('prev')}
              className="w-9 h-9 rounded-xl border border-border/40 bg-card/30 hover:bg-card/60 transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4 text-foreground/70" />
            </button>
            <h2 className="text-[22px] font-extrabold tracking-tight">
              {MONTH_NAMES[currentDate.getMonth()]} <span className="text-muted-foreground font-medium">{currentDate.getFullYear()}</span>
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="w-9 h-9 rounded-xl border border-border/40 bg-card/30 hover:bg-card/60 transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="h-9 px-4 rounded-xl border-border/40 bg-card/30 hover:bg-card/60 text-[13px] font-semibold"
          >
            Today
          </Button>
        </div>

        {/* Day name headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center py-2 text-[11.5px] font-bold text-muted-foreground/80 dark:text-muted-foreground/50 uppercase tracking-widest">{d}</div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((date, i) => {
            const dayTasks  = getTasksForDate(date);
            const todayCell = isToday(date);
            const selCell   = isSelected(date);
            const hasOver   = date ? dayTasks.some(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done') : false;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15, delay: i * 0.008 }}
                className={cn(
                  'min-h-[100px] sm:min-h-[130px] p-2.5 rounded-2xl border transition-all duration-200 relative',
                  !date && 'border-transparent bg-transparent',
                  date && 'cursor-pointer',
                  date && !todayCell && !selCell && 'border-border/25 bg-card/20 hover:bg-card/45 hover:border-border/45',
                  todayCell && 'border-blue-500/50 bg-blue-500/8  shadow-[0_0_20px_rgba(59,130,246,0.12)]',
                  selCell   && 'border-purple-500/50 bg-purple-500/8 shadow-[0_0_20px_rgba(139,92,246,0.12)]',
                )}
                onClick={() => date && setSelectedDate(date)}
              >
                {date && (
                  <>
                    {/* Date number */}
                    <div className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center text-[13px] font-bold mb-1.5 transition-colors',
                      todayCell ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' : 'text-foreground/70',
                    )}>
                      {date.getDate()}
                    </div>

                    {/* Task pills */}
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map(task => {
                        const p = PRIORITY_CONFIG[task.priority];
                        return (
                          <div
                            key={task.id}
                            className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-background/40 border border-border/25 backdrop-blur-sm"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.dot}`} />
                            <span className="text-[10.5px] font-semibold text-foreground/70 truncate hidden sm:block">{task.title}</span>
                            <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />
                          </div>
                        );
                      })}
                      {dayTasks.length > 3 && (
                        <div className="text-[10px] font-bold text-muted-foreground/60 px-1.5 hidden sm:block">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Overdue indicator */}
                    {hasOver && (
                      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.7)]" />
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 flex-wrap">
          {[
            { dot: 'bg-red-400',    label: 'High priority' },
            { dot: 'bg-amber-400',  label: 'Medium priority' },
            { dot: 'bg-emerald-400',label: 'Low priority' },
            { dot: 'bg-blue-500',   label: 'Today', ring: true },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${l.dot}`} />
              <span className="text-[12px] text-muted-foreground font-medium">{l.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
