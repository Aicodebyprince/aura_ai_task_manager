
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Plus,
  Trash2,
  Settings,
  MoreVertical,
  CheckCircle2,
  ListTodo,
  Check,
  Calendar as CalendarIcon,
  UserX,
  ShieldCheck,
  Shield,
  UserCog,
  BarChart3,
  BrainCircuit,
} from 'lucide-react';
import type { User, Team, Task } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { getTopAssignees, AssigneeScore } from '@/lib/assignment-algorithm';

export function TeamManagement() { 
    const { 
      currentUser, 
      users, 
      teams, 
      tasks,
      currentTeamId,
      handleNavigate, 
      handleUpdateAppState, 
      handleAddTask, 
      handleDeleteTask,
      handleDeleteTeam,
    } = useAppContext();

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(currentTeamId ? teams.find(t => t.id === currentTeamId) || null : null);
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [showBulkTaskDialog, setShowBulkTaskDialog] = useState(false);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [topAssignees, setTopAssignees] = useState<AssigneeScore[]>([]);
  const { toast } = useToast();
  
  interface BulkTask {
      id: string; title: string; priority: Task['priority']; estimatedTime: number; assignedTo: string[]; aiSuggestions?: AssigneeScore[];
  }
  const [bulkTasks, setBulkTasks] = useState<BulkTask[]>([
      { id: '1', title: '', priority: 'medium', estimatedTime: 1, assignedTo: [] }
  ]);

  
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    members: [] as string[]
  });
  
  const [membersToInvite, setMembersToInvite] = useState<string[]>([]);

  const [newTaskForm, setNewTaskForm] = useState<{
    title: string;
    description: string;
    priority: Task['priority'];
    dueDate: string;
    assignedTo: string[];
    tags: string[];
    teamId: string;
    estimatedTime: number;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: [],
    tags: [],
    teamId: '',
    estimatedTime: 1
  });

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim() || !currentUser) return;

    const teamData = {
      ...newTeam,
      id: '', // Firestore will generate
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      pendingMembers: newTeam.members,
      members: [currentUser.id],
      admins: [currentUser.id],
    };
    
    handleUpdateAppState({ teams: [...teams, teamData] });

    setNewTeam({ name: '', description: '', color: '#3b82f6', members: [] });
    setShowCreateTeamDialog(false);
  };
  
  const handleInviteMembers = () => {
      if (!selectedTeam || membersToInvite.length === 0) return;
      
      const updatedTeam = {
          ...selectedTeam,
          pendingMembers: [...new Set([...selectedTeam.pendingMembers, ...membersToInvite])]
      };
      
      const otherTeams = teams.filter(t => t.id !== selectedTeam.id);

      handleUpdateAppState({ teams: [...otherTeams, updatedTeam] });
      setSelectedTeam(updatedTeam);
      setMembersToInvite([]);
      setShowInviteDialog(false);
  }

  const handleTeamTaskSubmit = () => {
    if (!newTaskForm.title.trim() || !selectedTeam || !currentUser) return;

    const taskData = {
        ...newTaskForm,
        teamId: selectedTeam.id,
        createdBy: currentUser.id,
        status: 'inbox' as const,
    };
    handleAddTask(taskData);
    setShowNewTaskDialog(false);
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
  };

  const handleAddBulkTaskRow = () => {
      setBulkTasks([...bulkTasks, { id: Date.now().toString(), title: '', priority: 'medium', estimatedTime: 1, assignedTo: [] }]);
  };

  const updateBulkTask = (index: number, field: string, value: any) => {
      const newTasks = [...bulkTasks];
      newTasks[index] = { ...newTasks[index], [field]: value };
      setBulkTasks(newTasks);
  };

  const handleAutoAssignBulk = () => {
       let simulatedTasks = [...tasks];
       let eligibleMembers = teamMembers.filter(m => m.id !== currentUser?.id);
       if (eligibleMembers.length === 0) eligibleMembers = teamMembers;
       const updatedBulkTasks = [...bulkTasks];

       const priorityWeights: Record<string, number> = { high: 3, medium: 2, low: 1 };
       const sortedIndices = updatedBulkTasks
            .map((task, index) => ({ task, index }))
            .sort((a, b) => priorityWeights[b.task.priority] - priorityWeights[a.task.priority]);

       for (const { task, index } of sortedIndices) {
           if (task.assignedTo.length > 0) continue; 
           if (!task.title.trim()) continue; 
           
           const top = getTopAssignees({ ...task, description: '' }, eligibleMembers, simulatedTasks);
           if (top && top.length > 0) {
               const bestMatch = top[0].user;
               updatedBulkTasks[index].assignedTo = [bestMatch.id];
               updatedBulkTasks[index].aiSuggestions = top;
               simulatedTasks.push({
                   ...task,
                   id: 'sim_' + Date.now(),
                   assignedTo: [bestMatch.id],
                   status: 'inbox',
                   createdBy: currentUser?.id || '',
                   createdAt: new Date().toISOString(),
                   updatedAt: new Date().toISOString()
               } as Task);
           }
       }
       setBulkTasks(updatedBulkTasks);
       toast({ title: 'AI Assignment Complete', description: 'Team members intelligently assigned based on current workload and priorities.' });
  };

  const handleBulkSubmit = () => {
       if (!selectedTeam || !currentUser) return;
       const validTasks = bulkTasks.filter(t => t.title.trim());
       validTasks.forEach(task => {
           handleAddTask({
               title: task.title,
               priority: task.priority,
               estimatedTime: task.estimatedTime,
               assignedTo: task.assignedTo,
               teamId: selectedTeam.id,
               status: 'inbox',
               createdBy: currentUser.id,
               description: '',
               tags: [],
               dueDate: ''
           });
       });
       setShowBulkTaskDialog(false);
       setBulkTasks([{ id: '1', title: '', priority: 'medium', estimatedTime: 1, assignedTo: [] }]);
       toast({ title: 'Tasks Created', description: `Successfully added ${validTasks.length} task(s).` });
  };
  
  const handleToggleTeamMember = (userId: string, memberList: string[], setMemberList: (ids: string[]) => void) => {
    const currentIndex = memberList.indexOf(userId);
    const newMembers = [...memberList];

    if (currentIndex === -1) {
      newMembers.push(userId);
    } else {
      newMembers.splice(currentIndex, 1);
    }
    setMemberList(newMembers);
  };

  const handleAssignUser = (userId: string) => {
    const assignedTo = [...newTaskForm.assignedTo];
    const index = assignedTo.indexOf(userId);
    if (index > -1) {
      assignedTo.splice(index, 1);
    } else {
      assignedTo.push(userId);
    }
    setNewTaskForm({ ...newTaskForm, assignedTo });
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedTeam) return;
    const user = users.find(u => u.id === memberId);
    if (user) {
        setUserToRemove(user);
    }
  };

  const confirmRemoveMember = () => {
    if (!selectedTeam || !userToRemove) return;

    const updatedTeam = { 
        ...selectedTeam, 
        members: selectedTeam.members.filter(id => id !== userToRemove.id),
        admins: selectedTeam.admins.filter(id => id !== userToRemove.id)
    };
    
    const otherTeams = teams.filter(t => t.id !== selectedTeam.id);

    handleUpdateAppState({ teams: [...otherTeams, updatedTeam] });
    setSelectedTeam(updatedTeam);
    toast({
        title: "Member Removed",
        description: `${userToRemove.name} has been removed from the group.`,
    });
    setUserToRemove(null);
  };
  
  const handleRoleChange = (memberId: string, newRole: 'admin' | 'member') => {
      if (!selectedTeam) return;
      
      let newAdmins = [...(selectedTeam.admins || [])];
      if (newRole === 'admin') {
          if (!newAdmins.includes(memberId)) newAdmins.push(memberId);
      } else {
          newAdmins = newAdmins.filter(id => id !== memberId);
      }

      const updatedTeam = { ...selectedTeam, admins: newAdmins };
      const otherTeams = teams.filter(t => t.id !== selectedTeam.id);
      handleUpdateAppState({ teams: [...otherTeams, updatedTeam] });
      setSelectedTeam(updatedTeam);
      toast({
          title: "Role Updated",
          description: `The role for the user has been updated to ${newRole}.`
      });
  }


  const userTeams = useMemo(() => {
    if (!currentUser) return [];
    return teams.filter(team => (team.members && team.members.includes(currentUser!.id)) || team.createdBy === currentUser.id);
  }, [teams, currentUser]);

  const teamTasks = useMemo(() => {
      if (!selectedTeam) return [];
      return tasks.filter(task => task.teamId === selectedTeam.id);
  }, [tasks, selectedTeam]);

  const teamMembers = useMemo(() => {
    if(!selectedTeam) return [];
    return users.filter(user => selectedTeam.members.includes(user.id));
  }, [users, selectedTeam]);

    if (selectedTeam) {
    const isCurrentUserAdmin = (selectedTeam.admins || []).includes(currentUser?.id || '');
    return (
       <div className="min-h-screen bg-background">
        <AlertDialog open={!!userToRemove} onOpenChange={(open) => !open && setUserToRemove(null)}>
            <AlertDialogContent className="backdrop-blur-3xl bg-background/90 border-border/40 rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold text-[17px]">Remove Member?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[13.5px]">
                        This will permanently remove <span className="font-bold text-foreground">{userToRemove?.name}</span> from the group. They will lose access to all group tasks and data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmRemoveMember} className="rounded-xl bg-red-500 hover:bg-red-600">Yes, remove</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
          {/* Ambient */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ backgroundColor: selectedTeam.color + '12' }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/7 rounded-full blur-[120px]" />
          </div>
          <header className="sticky top-0 z-40 backdrop-blur-3xl bg-background/70 border-b border-border/30">
            <div className="flex items-center justify-between px-6 sm:px-10 h-[68px] max-w-[1800px] mx-auto w-full">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedTeam(null)} className="rounded-full w-9 h-9 hover:bg-white/8">
                  <ArrowLeft className="w-[18px] h-[18px] text-foreground/70" />
                </Button>
                <div className="flex items-center gap-3.5">
                    <div
                        className="w-10 h-10 rounded-[12px] flex items-center justify-center shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${selectedTeam.color}cc, ${selectedTeam.color}88)`, boxShadow: `0 4px 16px ${selectedTeam.color}40` }}
                    >
                        <Users className="w-5 h-5 text-foreground dark:text-white" />
                    </div>
                    <div>
                        <h1 className="text-[20px] font-extrabold tracking-tight leading-none">{selectedTeam.name}</h1>
                        <p className="text-[12px] text-muted-foreground font-medium mt-0.5 hidden sm:block">{selectedTeam.description || `${selectedTeam.members.length} members`}</p>
                    </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                 <div className="hidden sm:flex -space-x-2 mr-1">
                    {selectedTeam.members.slice(0, 5).map((memberId) => {
                      const member = users.find(u => u.id === memberId);
                      return member ? (
                        <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                           {member.avatarUrl ? <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" /> : <AvatarFallback className="text-[11px] font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">{member.name.charAt(0)}</AvatarFallback>}
                        </Avatar>
                      ) : null;
                    })}
                    {selectedTeam.members.length > 5 && (
                      <Avatar className="w-8 h-8 border-2 border-background">
                        <AvatarFallback className="text-[11px] font-bold">+{selectedTeam.members.length - 5}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                <Button size="sm" variant="outline" onClick={() => handleNavigate('group-analytics', selectedTeam.id)} className="h-9 px-3 rounded-xl border-border/40 bg-card/30 text-[13px] font-semibold hover:bg-card/60">
                    <BarChart3 className="w-4 h-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Analytics</span>
                </Button>
                <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-9 px-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white border-0 text-[13px] font-semibold shadow-[0_4px_14px_rgba(99,102,241,0.3)]"><Plus className="w-4 h-4 sm:mr-1.5" /> <span className="hidden sm:inline">New Task</span></Button>
                    </DialogTrigger>
                    <DialogContent className="backdrop-blur-xl bg-background/80 border-border">
                        <DialogHeader><DialogTitle>Create Task for {selectedTeam.name}</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="taskTitle">Title</Label>
                                <Input id="taskTitle" value={newTaskForm.title} onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })} placeholder="Task title..." className="backdrop-blur-sm bg-background" />
                            </div>
                            <div>
                                <Label htmlFor="taskDescription">Description</Label>
                                <Textarea id="taskDescription" value={newTaskForm.description} onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })} placeholder="Task description..." className="backdrop-blur-sm bg-background" />
                            </div>
                            <div>
                                <Label>Assign To</Label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="flex-1 justify-start backdrop-blur-sm bg-background">
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                {newTaskForm.assignedTo.length > 0 ? `${newTaskForm.assignedTo.length} member(s)` : 'Assign manually'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <Command>
                                                <CommandInput placeholder="Search members..." />
                                                <CommandList>
                                                    <CommandEmpty>No members found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {teamMembers.map((user) => (
                                                            <CommandItem key={user.id} onSelect={() => handleAssignUser(user.id)}>
                                                                <Check className={`mr-2 h-4 w-4 ${newTaskForm.assignedTo.includes(user.id) ? 'opacity-100' : 'opacity-0'}`} />
                                                                {user.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            let eligibleMembers = teamMembers.filter(m => m.id !== currentUser?.id);
                                            if (eligibleMembers.length === 0) eligibleMembers = teamMembers;
                                            const top = getTopAssignees(newTaskForm, eligibleMembers, tasks);
                                            setTopAssignees(top);
                                        }}
                                        className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                                    >
                                        <BrainCircuit className="w-4 h-4 mr-2" /> AI Auto Assign
                                    </Button>
                                </div>
                                {topAssignees.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Top Match Suggestions</Label>
                                        {topAssignees.map(t => (
                                            <Card key={t.user.id} className={`p-2 border-border cursor-pointer transition-colors ${newTaskForm.assignedTo.includes(t.user.id) ? 'bg-primary/5 border-primary/50' : 'bg-card/50 hover:bg-accent'}`} onClick={() => handleAssignUser(t.user.id)}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="w-8 h-8">
                                                            {t.user.avatarUrl ? <img src={t.user.avatarUrl} alt={t.user.name} /> : <AvatarFallback>{t.user.name.charAt(0)}</AvatarFallback>}
                                                        </Avatar>
                                                        <div className="text-sm">
                                                            <div className="font-semibold flex items-center">
                                                                {t.user.name} 
                                                                <Badge variant="secondary" className="ml-2 text-[10px] py-0 px-1 bg-green-500/10 text-green-500 hover:bg-green-500/10 dark:bg-green-500/20">{Math.round(t.score)}% Match</Badge>
                                                            </div>
                                                            <div className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px] truncate" title={`${t.matchReasons.join(' • ')} • Starts in ${t.availableInHours.toFixed(1)}h`}>
                                                                {t.matchReasons.join(' • ')} • Est. Start in {t.availableInHours.toFixed(1)}h
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {newTaskForm.assignedTo.includes(t.user.id) ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border border-muted-foreground/30" />
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
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
                                <Button onClick={handleTeamTaskSubmit}>Create Task</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                
                <Dialog open={showBulkTaskDialog} onOpenChange={setShowBulkTaskDialog}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="secondary"><ListTodo className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Bulk Add Tasks</span></Button>
                    </DialogTrigger>
                    <DialogContent className="backdrop-blur-xl bg-background/80 border-border max-w-2xl max-h-[80vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Muti-Task AI Adder for {selectedTeam.name}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto space-y-4 p-1 custom-scrollbar">
                           {bulkTasks.map((task, idx) => (
                               <Card key={task.id} className="p-4 border-border/50 bg-card/40 relative">
                                  {bulkTasks.length > 1 && (
                                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 w-6 h-6 text-red-400 opacity-50 hover:opacity-100" onClick={() => setBulkTasks(bulkTasks.filter((_, i) => i !== idx))}>
                                        <Trash2 className="w-4 h-4" />
                                     </Button>
                                  )}
                                  <div className="grid gap-3">
                                     <div>
                                        <Label className="text-xs">Task Title</Label>
                                        <Input value={task.title} onChange={e => updateBulkTask(idx, 'title', e.target.value)} placeholder="e.g. Write homepage copy" className="h-8 text-sm bg-background/50" />
                                     </div>
                                     <div className="flex items-end gap-3">
                                         <div className="w-1/3">
                                             <Label className="text-xs">Priority</Label>
                                             <Select value={task.priority} onValueChange={v => updateBulkTask(idx, 'priority', v)}>
                                                <SelectTrigger className="h-8 text-xs bg-background/50"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="low">Low</SelectItem>
                                                </SelectContent>
                                             </Select>
                                         </div>
                                         <div className="w-1/3">
                                            <Label className="text-xs">Est. Hours</Label>
                                            <Input type="number" min="0.5" step="0.5" value={task.estimatedTime} onChange={e => updateBulkTask(idx, 'estimatedTime', parseFloat(e.target.value)||1)} className="h-8 text-sm bg-background/50" />
                                         </div>
                                         <div className="w-1/3 text-xs flex flex-col justify-end pb-1 border-b border-dashed border-border mb-0.5">
                                             {task.assignedTo.length > 0 ? (
                                                 <span className="text-primary truncate w-full flex items-center gap-1">
                                                     <CheckCircle2 className="w-3 h-3" /> 
                                                     {task.aiSuggestions?.find(s => s.user.id === task.assignedTo[0])?.user.name || teamMembers.find(m => m.id === task.assignedTo[0])?.name || 'Assigned'}
                                                 </span>
                                             ) : <span className="text-muted-foreground">Unassigned</span>}
                                         </div>
                                     </div>
                                  </div>
                                  {task.aiSuggestions && task.aiSuggestions.length > 0 && (
                                     <div className="mt-3 pt-3 border-t border-border/50">
                                         <Label className="text-[10px] text-muted-foreground uppercase flex items-center mb-2">
                                             <BrainCircuit className="w-3 h-3 mr-1 text-primary"/> AI Match Options (Click to select)
                                         </Label>
                                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                             {task.aiSuggestions.map(suggestion => (
                                                 <div 
                                                     key={suggestion.user.id} 
                                                     onClick={() => updateBulkTask(idx, 'assignedTo', [suggestion.user.id])}
                                                     className={`p-2 rounded-md text-xs cursor-pointer border transition-all ${task.assignedTo.includes(suggestion.user.id) ? 'bg-primary/20 border-primary shadow-sm ring-1 ring-primary/50' : 'bg-background hover:bg-accent border-border'}`}
                                                 >
                                                     <div className="flex justify-between items-center mb-1">
                                                         <span className="font-semibold truncate">{suggestion.user.name}</span>
                                                         <Badge variant="secondary" className="text-[9px] py-0 px-1 bg-green-500/10 text-green-500">{Math.round(suggestion.score)}%</Badge>
                                                     </div>
                                                     <div className="text-[9px] text-muted-foreground leading-tight line-clamp-2" title={`${suggestion.matchReasons.join(' • ')} • Starts in ${suggestion.availableInHours.toFixed(1)}h`}>
                                                         {suggestion.matchReasons.join(' • ')} • Est. Start in {suggestion.availableInHours.toFixed(1)}h
                                                     </div>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>
                                  )}
                               </Card>
                           ))}
                        </div>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border mt-auto">
                            <Button variant="outline" size="sm" onClick={handleAddBulkTaskRow} className="w-full sm:w-auto"><Plus className="w-3 h-3 mr-2" /> Add row</Button>
                            <div className="flex w-full sm:w-auto gap-2">
                                <Button variant="secondary" size="sm" onClick={handleAutoAssignBulk} className="flex-1 sm:flex-none border border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary">
                                    <BrainCircuit className="w-3 h-3 mr-2" /> Smart Assign All
                                </Button>
                                <Button size="sm" onClick={handleBulkSubmit} className="flex-1 sm:flex-none">Create Tasks</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline"><UserPlus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Invite</span></Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-xl bg-background/80 border-border">
                    <DialogHeader>
                      <DialogTitle>Invite Members to {selectedTeam.name}</DialogTitle>
                    </DialogHeader>
                     <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup>
                                {users
                                .filter(user => !selectedTeam.members.includes(user.id) && !selectedTeam.pendingMembers.includes(user.id))
                                .map((user: User) => (
                                <CommandItem key={user.id} onSelect={() => handleToggleTeamMember(user.id, membersToInvite, setMembersToInvite)}>
                                    <Check className={`mr-2 h-4 w-4 ${membersToInvite.includes(user.id) ? 'opacity-100' : 'opacity-0'}`} />
                                    {user.name}
                                </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
                      <Button onClick={handleInviteMembers}>Send {membersToInvite.length} Invite(s)</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>
          
           <main className="relative z-10 flex-1 grid md:grid-cols-3 gap-6 overflow-hidden p-4 sm:p-6">
                <div className="md:col-span-2 flex flex-col min-h-0">
                    <h2 className="font-bold text-[17px] tracking-tight mb-5">Group Tasks</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-full overflow-y-auto lg:overflow-hidden">
                        {(['inbox', 'in-progress', 'done'] as const).map(status => (
                            <div key={status} className="flex flex-col min-h-0">
                                <div className="flex items-center justify-between mb-4 px-1">
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-1.5 h-4 rounded-full ${ status === 'inbox' ? 'bg-slate-400/60' : status === 'in-progress' ? 'bg-amber-400' : 'bg-emerald-400' }`} />
                                    <h3 className="font-semibold text-[13px] text-foreground/80">{status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}</h3>
                                  </div>
                                  <div className={`min-w-[24px] h-6 px-2 rounded-full flex items-center justify-center text-[11px] font-black ${ status === 'inbox' ? 'bg-slate-500/15 text-slate-400' : status === 'in-progress' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400' }`}>{teamTasks.filter(t => t.status === status).length}</div>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-2.5 p-1 -m-1">
                                    {teamTasks.filter(t => t.status === status).map(task => (
                                        <Card key={task.id} className="p-3.5 bg-card/40 border-border/30 backdrop-blur-sm rounded-xl hover:border-border/60 transition-all duration-200">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-medium text-sm mb-2 flex-1 pr-2">{task.title}</h4>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="w-6 h-6"><MoreVertical className="w-4 h-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => {}}>Edit Task</DropdownMenuItem>
                                                            {isCurrentUserAdmin && (
                                                                <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-400">
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Delete Task
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">{task.priority}</Badge>
                                                <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                            <div className="flex -space-x-2 mt-3">
                                                {task.assignedTo?.map(id => users.find(u => u.id === id)).filter(Boolean).map(member => (
                                                    <Avatar key={member!.id} className="w-6 h-6 border-2 border-background">
                                                        {member!.avatarUrl ? <img src={member!.avatarUrl} alt={member!.name} className="w-full h-full object-cover" /> : <AvatarFallback className="text-xs">{member!.name.charAt(0)}</AvatarFallback>}
                                                    </Avatar>
                                                ))}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col min-h-0">
                    <h2 className="text-lg font-medium mb-4">Group Members ({teamMembers.length})</h2>
                    <div className="flex-1 overflow-y-auto space-y-3 p-1 -m-1">
                        {teamMembers.map(member => {
                             const isMemberAdmin = (selectedTeam.admins || []).includes(member.id);
                             return (
                                <Card key={member.id} className="p-3 bg-card border-border flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-8 h-8">
                                            {member.avatarUrl ? <img src={member.avatarUrl} alt={member.name} /> : <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>}
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm flex items-center">
                                                {member.name}
                                                {isMemberAdmin && <ShieldCheck className="w-3.5 h-3.5 ml-2 text-green-400" />}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                    {isCurrentUserAdmin && currentUser?.id !== member.id && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="w-8 h-8">
                                                    <UserCog className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {isMemberAdmin ? (
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'member')}>
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        Make Member
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                                        Make Admin
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-red-400">
                                                    <UserX className="w-4 h-4 mr-2" />
                                                    Remove from Group
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </Card>
                             );
                        })}
                    </div>
                </div>
           </main>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate('dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
             <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4 text-foreground dark:text-white" />
                </div>
                <div>
                <h1 className="text-lg font-medium">Study Groups</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Manage your group projects</p>
                </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Create Group</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-background/80 border-border">
                <DialogHeader>
                  <DialogTitle>Create New Study Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teamName">Group Name</Label>
                    <Input id="teamName" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} placeholder="e.g., Physics 101 Study Group" className="backdrop-blur-sm bg-background" />
                  </div>
                  <div>
                    <Label htmlFor="teamDescription">Description</Label>
                    <Textarea id="teamDescription" value={newTeam.description} onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })} placeholder="Describe the group's purpose..." className="backdrop-blur-sm bg-background" />
                  </div>
                  <div>
                    <Label>Invite Members</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start backdrop-blur-sm bg-background">
                            <UserPlus className="mr-2 h-4 w-4" />
                            {newTeam.members.length > 0 ? `${newTeam.members.length} user(s) selected` : 'Select members'}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                        <Command>
                            <CommandInput placeholder="Search classmates..." />
                            <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup>
                                {users
                                .filter(user => user.id !== currentUser?.id)
                                .map((user: User) => (
                                <CommandItem key={user.id} onSelect={() => handleToggleTeamMember(user.id, newTeam.members, (members) => setNewTeam({...newTeam, members}))}>
                                    <Check className={`mr-2 h-4 w-4 ${newTeam.members.includes(user.id) ? 'opacity-100' : 'opacity-0'}`} />
                                    {user.name}
                                </CommandItem>
                                ))}
                            </CommandGroup>
                            </CommandList>
                        </Command>
                        </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="teamColor">Group Color</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <input type="color" value={newTeam.color} onChange={(e) => setNewTeam({ ...newTeam, color: e.target.value })} className="w-12 h-12 rounded-lg border border-border bg-transparent" />
                      <div className="flex space-x-2">
                        {['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#ec4899'].map((color) => (
                          <button key={color} onClick={() => setNewTeam({ ...newTeam, color })} className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateTeamDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateTeam}>Create Group</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 py-10">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {userTeams.map((team, ti) => {
              const teamTotal = tasks.filter(t => t.teamId === team.id).length;
              const teamDone  = tasks.filter(t => t.teamId === team.id && t.status === 'done').length;
              const progress  = teamTotal > 0 ? Math.round((teamDone / teamTotal) * 100) : 0;
              return (
                <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: ti * 0.06 }}
                >
                    <div
                      className="relative flex flex-col rounded-2xl border border-border/30 bg-card/30 backdrop-blur-3xl overflow-hidden hover:border-border/60 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 group cursor-pointer h-full"
                      onClick={() => setSelectedTeam(team)}
                    >
                      {/* Subtle top accent bar */}
                      <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${team.color}, ${team.color}44)` }} />

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3.5">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0"
                              style={{ background: `linear-gradient(135deg, ${team.color}dd, ${team.color}66)`, boxShadow: `0 4px 16px ${team.color}30` }}
                            >
                              <Users className="w-6 h-6 text-foreground dark:text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-[15px] tracking-tight">{team.name}</h3>
                              <p className="text-[12px] text-muted-foreground mt-0.5">{team.members.length} member{team.members.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                                  <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Group Settings</DropdownMenuItem>
                                  {currentUser?.id === team.createdBy && (
                                      <DropdownMenuItem onClick={() => handleDeleteTeam(team.id)} className="text-red-400">
                                          <Trash2 className="w-4 h-4 mr-2" />Delete Group
                                      </DropdownMenuItem>
                                  )}
                              </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-[13px] text-muted-foreground mb-4 line-clamp-2 flex-1 leading-relaxed">
                          {team.description || 'No description provided.'}
                        </p>

                        {/* Members */}
                        <div className="flex -space-x-2 mb-5">
                          {team.members.slice(0, 7).map((memberId) => {
                            const member = users.find(u => u.id === memberId);
                            return member ? (
                              <Avatar key={member.id} className="w-8 h-8 border-2 border-background shadow-sm">
                                {member.avatarUrl ? <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" /> : <AvatarFallback className="text-[11px] font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">{member.name.charAt(0)}</AvatarFallback>}
                              </Avatar>
                            ) : null;
                          })}
                          {team.members.length > 7 && (
                            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[11px] font-bold">+{team.members.length - 7}</div>
                          )}
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">Progress</span>
                            <span className="text-[12px] font-extrabold" style={{ color: team.color }}>{progress}%</span>
                          </div>
                          <div className="h-1.5 bg-background/60 rounded-full overflow-hidden border border-border/20">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${progress}%`, background: `linear-gradient(to right, ${team.color}, ${team.color}88)` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11.5px] text-muted-foreground">
                            <span className="flex items-center gap-1"><ListTodo className="w-3 h-3" /> {teamTotal} tasks</span>
                            <span className="flex items-center gap-1 text-emerald-400 font-semibold"><CheckCircle2 className="w-3 h-3" /> {teamDone} done</span>
                          </div>
                        </div>
                      </div>
                    </div>
                </motion.div>
              );
            })}
        </div>
      </main>
    </div>
  );
}
