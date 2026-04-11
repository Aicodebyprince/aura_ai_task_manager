
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  ListTodo,
  TrendingUp,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useAppContext } from '@/context/AppContext';

const PIE_COLORS = ['#10b981', '#f59e0b', '#6b7280'];

export function GroupAnalytics() {
  const { currentTeamId, teams, tasks, users, handleNavigate: onNavigate } = useAppContext();

  const analyticsData = useMemo(() => {
    const team = teams.find(t => t.id === currentTeamId);
    if (!team) return null;

    const teamTasks = tasks.filter(t => t.teamId === team.id);
    const completedTasks = teamTasks.filter(t => t.status === 'done');
    const totalTasks = teamTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    const productivityData = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = d.toLocaleDateString('en-US', { weekday: 'short' });
      return { name: day, tasks: 0 };
    }).reverse();

    teamTasks.filter(t => t.status === 'done' && t.updatedAt).forEach(t => {
      const updatedDate = new Date(t.updatedAt);
      const diffDays = Math.floor((new Date().getTime() - updatedDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays < 7) {
        const dayName = updatedDate.toLocaleDateString('en-US', { weekday: 'short' });
        const dayIndex = productivityData.findIndex(d => d.name === dayName);
        if (dayIndex !== -1) {
          productivityData[dayIndex].tasks++;
        }
      }
    });

    const taskDistribution = [
      { name: 'Completed', value: completedTasks.length },
      { name: 'In Progress', value: teamTasks.filter(t => t.status === 'in-progress').length },
      { name: 'Inbox', value: teamTasks.filter(t => t.status === 'inbox').length }
    ];

    const memberContributions = team.members.map(memberId => {
        const member = users.find(u => u.id === memberId);
        return {
            name: member?.name || 'Unknown User',
            tasks: teamTasks.filter(t => t.assignedTo?.includes(memberId)).length
        };
    }).sort((a,b) => b.tasks - a.tasks);

    return {
      team,
      totalTasks,
      completedTasks: completedTasks.length,
      completionRate,
      productivityData,
      taskDistribution,
      memberContributions,
    };
  }, [currentTeamId, teams, tasks, users]);

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Could not load analytics data. Please select a group first.</p>
        <Button onClick={() => onNavigate('team')} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const { team, totalTasks, completionRate, productivityData, taskDistribution, memberContributions } = analyticsData;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('team')}
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: team.color + '20', border: `1px solid ${team.color}40` }}
              >
                <Users className="w-4 h-4" style={{ color: team.color }} />
              </div>
              <div>
                <h1 className="text-lg font-medium">{team.name} Analytics</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Performance dashboard for your group</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 w-full space-y-6">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Group Performance Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-3">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                            <p className="text-2xl font-bold">{completionRate}%</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <ListTodo className="w-8 h-8 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                            <p className="text-2xl font-bold">{totalTasks}</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-4 rounded-md border p-4">
                        <Users className="w-8 h-8 text-purple-500" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                            <p className="text-2xl font-bold">{team.members.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-3"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                            Productivity Trend (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={productivityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                            <Area type="monotone" dataKey="tasks" stroke="#10b981" fill="url(#colorTasks)" />
                            <defs>
                                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                        </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Task Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                            <Pie data={taskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                {taskDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                         <div className="flex justify-center space-x-4 mt-4">
                            {taskDistribution.map((item, index) => (
                            <div key={index} className="flex items-center text-sm">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                {item.name}: {item.value}
                            </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Member Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={memberContributions} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                                <Bar dataKey="tasks" fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
      </main>
    </div>
  );
}

    