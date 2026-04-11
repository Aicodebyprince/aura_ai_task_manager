
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Calendar,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  CheckCircle2,
  ArrowUpRight,
  Layers,
  Timer,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  RadialBarChart, RadialBar
} from 'recharts';
import { useAppContext } from '@/context/AppContext';

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 border border-border/50 backdrop-blur-2xl rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="text-[18px] font-bold text-foreground">{payload[0].value} <span className="text-sm font-medium text-muted-foreground">tasks</span></p>
      </div>
    );
  }
  return null;
};

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-8">
    <div className="h-4 w-[3px] bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
    <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-[0.18em]">{children}</span>
  </div>
);

// ─── KPI Card ──────────────────────────────────────────────────────────────────
const KPICard = ({ stat, index }: { stat: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
  >
    <Card className="relative p-6 backdrop-blur-3xl bg-card/30 border-border/30 shadow-2xl rounded-2xl overflow-hidden group hover:border-border/60 transition-all duration-500 hover:-translate-y-0.5 h-full">
      {/* Corner glow */}
      <div className={`absolute -right-8 -top-8 w-36 h-36 bg-gradient-to-br ${stat.glow} opacity-20 rounded-full blur-2xl group-hover:opacity-40 group-hover:scale-125 transition-all duration-700 pointer-events-none`} />
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.gradient} opacity-60`} />

      <div className="relative z-10 flex items-start justify-between mb-5">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          <stat.icon className="w-5 h-5 text-foreground dark:text-white" />
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <ArrowUpRight className="w-3 h-3" />
          <span>Active</span>
        </div>
      </div>

      <div className="relative z-10">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-2">{stat.label}</div>
        <div className="text-[34px] font-extrabold leading-none tracking-tight text-foreground mb-1">{stat.value}</div>
        {stat.sub && <div className="text-[12px] font-medium text-muted-foreground/70">{stat.sub}</div>}
      </div>
    </Card>
  </motion.div>
);

// ─── MAIN ANALYTICS COMPONENT ─────────────────────────────────────────────────
export function Analytics() {
  const { tasks, handleNavigate } = useAppContext();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  // ── Data computation ────────────────────────────────────────────────────────
  const data = useMemo(() => {
    const completedTasks = tasks.filter(t => t.status === 'done');
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
    const overdueTasks = tasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length;

    // Productivity last 7 days
    const productivityData = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { name: d.toLocaleDateString('en-US', { weekday: 'short' }), tasks: 0, date: d };
    });
    tasks.filter(t => t.status === 'done' && t.updatedAt).forEach(t => {
      const updatedDate = new Date(t.updatedAt);
      const diffDays = Math.floor((new Date().getTime() - updatedDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays < 7) {
        const dayName = updatedDate.toLocaleDateString('en-US', { weekday: 'short' });
        const idx = productivityData.findIndex(d => d.name === dayName);
        if (idx !== -1) productivityData[idx].tasks++;
      }
    });

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const completionByDay = daysOfWeek.map(day => ({ day, count: 0 }));
    completedTasks.forEach(task => {
      const dayIndex = new Date(task.updatedAt).getDay();
      completionByDay[dayIndex].count++;
    });
    const mostProductiveDay = completionByDay.reduce((max, day) => day.count > max.count ? day : max, { day: 'N/A', count: 0 });

    const totalTimeSpent = completedTasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
    const avgCompletionTime = completedTasks.length > 0 ? totalTimeSpent / completedTasks.length : 0;
    const onTimeTasks = completedTasks.filter(t => t.completionStatus === 'on-time').length;
    const lateTasks = completedTasks.filter(t => t.completionStatus === 'late').length;
    const onTimeRate = completedTasks.length > 0 ? Math.round((onTimeTasks / completedTasks.length) * 100) : 0;

    const taskDistribution = [
      { name: 'Completed', value: completedTasks.length, color: '#10b981' },
      { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#3b82f6' },
      { name: 'Inbox', value: tasks.filter(t => t.status === 'inbox').length, color: '#8b5cf6' },
    ];
    const completionAnalysis = [
      { name: 'On-Time', value: onTimeTasks, color: '#10b981' },
      { name: 'Late', value: lateTasks, color: '#ef4444' },
    ];

    const activityPatterns = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}`, tasks: 0 }));
    tasks.forEach(task => {
      const hour = new Date(task.createdAt).getHours();
      activityPatterns[hour].tasks++;
    });
    const formattedActivityPatterns = activityPatterns.map(p => ({
      hour: `${parseInt(p.hour) % 12 || 12}${parseInt(p.hour) >= 12 ? 'PM' : 'AM'}`,
      tasks: p.tasks,
    })).slice(6, 19);

    const peakTime = formattedActivityPatterns.reduce((max, p) => p.tasks > max.tasks ? p : max, { hour: 'N/A', tasks: 0 });
    const totalCompletedToday = productivityData[productivityData.length - 1]?.tasks ?? 0;

    const aiInsights = [
      {
        icon: Clock,
        color: 'from-blue-500 to-cyan-500',
        glow: 'rgba(59,130,246,0.3)',
        title: 'Peak Performance Window',
        description: `Your highest task creation occurs around ${peakTime.hour}. Consider scheduling deep-focus work during this window.`,
        impact: 'high',
        action: 'Block Calendar',
      },
      {
        icon: Target,
        color: 'from-violet-500 to-indigo-500',
        glow: 'rgba(139,92,246,0.3)',
        title: 'Daily Progress',
        description: `You've completed ${totalCompletedToday} task${totalCompletedToday !== 1 ? 's' : ''} today. ${totalCompletedToday > 2 ? 'Excellent momentum!' : 'Keep pushing!'}`,
        impact: 'medium',
        action: 'View Goals',
      },
      {
        icon: Layers,
        color: 'from-amber-500 to-orange-500',
        glow: 'rgba(245,158,11,0.3)',
        title: 'Inbox Clearing',
        description: `You have ${tasks.filter(t => t.status === 'inbox').length} unprocessed tasks in your inbox. Process them to free mental bandwidth.`,
        impact: 'medium',
        action: 'Clear Inbox',
      },
      {
        icon: TrendingUp,
        color: 'from-emerald-500 to-teal-500',
        glow: 'rgba(16,185,129,0.3)',
        title: 'Efficiency Insight',
        description: `Your on-time completion rate is ${onTimeRate}%. ${onTimeRate >= 70 ? 'Great work maintaining deadlines!' : 'Review late tasks to find bottlenecks.'}`,
        impact: onTimeRate >= 70 ? 'medium' : 'high',
        action: 'Review Tasks',
      },
    ];

    return {
      totalTasks, completedTasks: completedTasks.length, completionRate,
      highPriorityTasks, overdueTasks, productivityData, taskDistribution,
      formattedActivityPatterns, aiInsights, mostProductiveDay,
      avgCompletionTime, onTimeRate, completionAnalysis,
    };
  }, [tasks, timeRange]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const kpiStats = [
    {
      label: 'Total Tasks',
      value: data.totalTasks,
      icon: Layers,
      gradient: 'from-blue-500 to-blue-700',
      glow: 'from-blue-500 to-blue-700',
      sub: 'All time across all boards',
    },
    {
      label: 'Completed',
      value: data.completedTasks,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'from-emerald-500 to-teal-600',
      sub: `${data.completionRate}% completion rate`,
    },
    {
      label: 'On-Time Rate',
      value: `${data.onTimeRate}%`,
      icon: Timer,
      gradient: 'from-violet-500 to-purple-700',
      glow: 'from-violet-500 to-purple-700',
      sub: 'Tasks finished before deadline',
    },
    {
      label: 'High Priority',
      value: data.highPriorityTasks,
      icon: Zap,
      gradient: 'from-orange-500 to-red-600',
      glow: 'from-orange-500 to-red-600',
      sub: `${data.overdueTasks} overdue tasks`,
    },
  ];

  const DONUT_COLORS = ['#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 right-0 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-3xl bg-background/70 border-b border-border/30">
        <div className="flex items-center justify-between px-6 sm:px-10 h-[68px] w-full max-w-[1600px] mx-auto">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate('dashboard')}
              className="rounded-full w-9 h-9 hover:bg-white/8 transition-colors"
            >
              <ArrowLeft className="w-[18px] h-[18px] text-foreground/70" />
            </Button>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_4px_16px_rgba(99,102,241,0.4)]">
                <BarChart3 className="w-5 h-5 text-foreground dark:text-white" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold tracking-tight leading-none">Analytics</h1>
                <p className="text-[12.5px] text-muted-foreground font-medium hidden sm:block mt-0.5">Productivity intelligence center</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <Tabs value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <TabsList className="bg-card/30 backdrop-blur-xl border border-border/30 h-9 rounded-xl p-1 gap-0.5">
              {(['week', 'month', 'quarter'] as const).map(v => (
                <TabsTrigger
                  key={v}
                  value={v}
                  className="text-[12.5px] font-semibold rounded-lg px-4 capitalize data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  {v}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* ── Page Body ────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 px-6 sm:px-10 py-10 space-y-10 max-w-[1600px] mx-auto w-full pb-16">

        {/* ── KPI Strip ─────────────────────────────────────────────────── */}
        <section>
          <SectionTitle>Key Metrics</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {kpiStats.map((stat, i) => (
              <KPICard key={i} stat={stat} index={i} />
            ))}
          </div>
        </section>

        {/* ── Bento Row 1: Area Chart (2/3) + Efficiency Ring (1/3) ─────── */}
        <section>
          <SectionTitle>Trend & Efficiency</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Area Chart */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="relative p-7 h-[380px] flex flex-col bg-card/30 border-border/30 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-xl group hover:border-border/50 transition-all duration-500">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/6 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-1000 pointer-events-none" />
                <div className="flex items-center justify-between mb-6 shrink-0 relative z-10">
                  <div>
                    <h3 className="text-[17px] font-bold tracking-tight">Productivity Trend</h3>
                    <p className="text-[12.5px] text-muted-foreground mt-1 font-medium">Tasks completed per day — last 7 days</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_2px_rgba(59,130,246,0.4)]" />
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">7-Day</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.productivityData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2.5} fill="url(#areaGrad)"
                        activeDot={{ r: 5, strokeWidth: 0, fill: '#3b82f6', style: { filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.8))' } }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Efficiency Radial */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="relative p-7 h-[380px] flex flex-col bg-card/30 border-border/30 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-xl group hover:border-border/50 transition-all duration-500">
                <div className="absolute top-0 right-0 w-56 h-56 bg-purple-500/8 rounded-full blur-3xl group-hover:bg-purple-500/12 transition-all duration-1000 pointer-events-none" />
                <div className="shrink-0 relative z-10 mb-2">
                  <h3 className="text-[17px] font-bold tracking-tight">Completion Rate</h3>
                  <p className="text-[12.5px] text-muted-foreground mt-1 font-medium">Tasks done vs. total created</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                  <div className="relative w-[180px] h-[180px] group-hover:scale-105 transition-transform duration-700">
                    {/* Background ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 180 180">
                      <circle cx="90" cy="90" r="75" fill="none" stroke="hsl(var(--border))" strokeWidth="12" strokeOpacity="0.3" />
                      <circle
                        cx="90" cy="90" r="75" fill="none"
                        stroke="url(#ringGrad)" strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 75 * data.completionRate / 100} ${2 * Math.PI * 75}`}
                        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)' }}
                      />
                      <defs>
                        <linearGradient id="ringGrad" x1="1" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[44px] font-black bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent leading-none">{data.completionRate}%</span>
                      <span className="text-[11px] font-bold text-muted-foreground tracking-[0.18em] uppercase mt-1">Rate</span>
                    </div>
                  </div>
                  {/* Mini stats */}
                  <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                    {[
                      { label: 'Done', value: data.completedTasks, color: 'text-emerald-400' },
                      { label: 'Remaining', value: data.totalTasks - data.completedTasks, color: 'text-muted-foreground' },
                    ].map((s, i) => (
                      <div key={i} className="bg-background/40 border border-border/30 rounded-xl p-3 text-center">
                        <div className={`text-[20px] font-extrabold ${s.color}`}>{s.value}</div>
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ── Bento Row 2: Bar Chart (2/3) + Donut (1/3) ────────────────── */}
        <section>
          <SectionTitle>Activity & Distribution</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Activity Bar Chart */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="relative p-7 h-[360px] flex flex-col bg-card/30 border-border/30 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-xl group hover:border-border/50 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/4 to-transparent pointer-events-none" />
                <div className="flex items-center justify-between mb-6 shrink-0 relative z-10">
                  <div>
                    <h3 className="text-[17px] font-bold tracking-tight">Daily Activity</h3>
                    <p className="text-[12.5px] text-muted-foreground mt-1 font-medium">Tasks created by hour of day (6AM–7PM)</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.formattedActivityPatterns} margin={{ top: 8, right: 4, left: -28, bottom: 0 }} barSize={22}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(52,211,153,0.06)', radius: 6 } as any} />
                      <Bar dataKey="tasks" fill="url(#barGrad)" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Donut Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="relative p-7 h-[360px] flex flex-col bg-card/30 border-border/30 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-xl group hover:border-border/50 transition-all duration-500">
                <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/6 rounded-full blur-3xl pointer-events-none" />
                <div className="shrink-0 relative z-10 mb-2">
                  <h3 className="text-[17px] font-bold tracking-tight">Task Status</h3>
                  <p className="text-[12.5px] text-muted-foreground mt-1 font-medium">Breakdown across all states</p>
                </div>

                {/* Donut */}
                <div className="h-[170px] w-full relative z-10 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.taskDistribution}
                        cx="50%" cy="50%"
                        innerRadius={55} outerRadius={78}
                        paddingAngle={4} dataKey="value" stroke="none"
                        animationBegin={0} animationDuration={1000}
                      >
                        {data.taskDistribution.map((entry, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                            style={{ filter: `drop-shadow(0 4px 8px ${DONUT_COLORS[i % DONUT_COLORS.length]}50)` }} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex-1 flex flex-col justify-end gap-2.5 relative z-10 mt-2">
                  {data.taskDistribution.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-background/30 border border-border/25 rounded-xl px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length], boxShadow: `0 0 8px ${DONUT_COLORS[i % DONUT_COLORS.length]}80` }} />
                        <span className="text-[12.5px] font-semibold text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-[14px] font-black text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ── Performance Stats Strip ────────────────────────────────────── */}
        <section>
          <SectionTitle>Performance Breakdown</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: 'Most Productive Day', value: data.mostProductiveDay.day, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
              { label: 'Avg. Completion Time', value: formatTime(data.avgCompletionTime), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'On-Time Completions', value: `${data.onTimeRate}%`, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'High Priority Tasks', value: data.highPriorityTasks, icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <Card className="bg-card/30 border-border/30 backdrop-blur-3xl rounded-2xl p-5 flex items-center gap-4 hover:border-border/60 transition-all duration-300 group shadow-lg">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${s.bg}`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{s.label}</div>
                    <div className="text-[22px] font-extrabold leading-none">{s.value}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── AI Insights Full-Width ─────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionTitle>AI-Powered Insights</SectionTitle>
          <Card className="relative p-7 bg-card/30 border-border/30 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-xl group hover:border-border/50 transition-all duration-500">
            {/* Header */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/4 via-purple-500/4 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_8px_24px_rgba(99,102,241,0.4)]">
                <Sparkles className="w-6 h-6 text-foreground dark:text-white" />
              </div>
              <div>
                <h3 className="text-[20px] font-bold tracking-tight">Personalized Analysis</h3>
                <p className="text-[13px] text-muted-foreground font-medium mt-0.5">Deep recommendations generated by Aura AI based on your activity</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
              {data.aiInsights.map((insight, i) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    className="group/card"
                  >
                    <div className="h-full p-5 rounded-[18px] bg-background/40 border border-border/35 backdrop-blur-xl flex flex-col gap-4 hover:bg-background/60 hover:border-border/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                      {/* Icon + badge */}
                      <div className="flex items-start justify-between">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-5 h-5 text-foreground dark:text-white" />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${insight.impact === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/25' : 'bg-amber-500/10 text-amber-400 border-amber-500/25'}`}>
                          {insight.impact}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-[14.5px] font-bold tracking-tight mb-2 leading-snug">{insight.title}</h4>
                        <p className="text-[12.5px] text-muted-foreground leading-relaxed font-medium">{insight.description}</p>
                      </div>
                      {/* CTA */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full h-9 rounded-xl text-[12.5px] font-bold border bg-gradient-to-r ${insight.color} text-white opacity-85 hover:opacity-100 shadow-sm hover:shadow-md transition-all duration-300 border-0`}
                      >
                        <Zap className="w-3.5 h-3.5 mr-1.5" />
                        {insight.action}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.section>

      </main>
    </div>
  );
}
