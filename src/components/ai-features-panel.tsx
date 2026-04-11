
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import {
  Sparkles,
  BrainCircuit,
  Users,
  FileText,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Clock,
  Zap,
  Target,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { taskPrioritizer } from '@/ai/flows/task-prioritizer-flow';
import type { Team } from '@/lib/types';
import type { TaskPrioritizerOutput } from '@/ai/schemas/task-prioritizer-schema';
import { Avatar, AvatarFallback } from './ui/avatar';
import type { LucideIcon } from 'lucide-react';
import { summarizer } from '@/ai/flows/summarizer-flow';
import type { SummarizerOutput } from '@/ai/schemas/summarizer-schema';;
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppContext } from '@/context/AppContext';
import { format, differenceInDays } from 'date-fns';

interface AiFeaturesPanelProps {
  featureId?: string;
  onFeatureSelect?: (featureId: string | null) => void;
}

const allFeatures = [
  {
    id: 'task-prioritizer',
    icon: BrainCircuit,
    title: 'Smart Prioritizer',
    description: 'Analyses urgency, deadlines, and context to surface the tasks that matter most right now.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.25)',
    accent: 'border-blue-500/30 hover:border-blue-400/50',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
  },
  {
    id: 'project-assistant',
    icon: Users,
    title: 'Team Sync',
    description: 'Get a live pulse on all your team projects — progress, deadlines, and top contributors.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.25)',
    accent: 'border-emerald-500/30 hover:border-emerald-400/50',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  {
    id: 'flowchart-summary',
    icon: FileText,
    title: 'Summarizer',
    description: 'Paste any meeting notes or document and get a clean, actionable summary in seconds.',
    gradient: 'from-violet-500 to-indigo-500',
    glow: 'rgba(139,92,246,0.25)',
    accent: 'border-violet-500/30 hover:border-violet-400/50',
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    dot: 'bg-violet-400',
  },
  {
    id: 'progress-tracker',
    icon: TrendingUp,
    title: 'Analytics',
    description: 'Navigate to your personal analytics dashboard for deep productivity insights.',
    gradient: 'from-fuchsia-500 to-pink-500',
    glow: 'rgba(217,70,239,0.25)',
    accent: 'border-fuchsia-500/30 hover:border-fuchsia-400/50',
    badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    dot: 'bg-fuchsia-400',
  },
] as const;

type FeatureId = typeof allFeatures[number]['id'];

// ─── Team Sync Result ──────────────────────────────────────────────────────────
const TeamSyncResult = () => {
  const { currentUser, teams, tasks, users } = useAppContext();

  const userTeams = useMemo(() => {
    if (!currentUser) return [];
    return teams.filter(team => team.members.includes(currentUser!.id));
  }, [teams, currentUser]);

  const getTeamStats = (team: Team) => {
    const teamTasks = tasks.filter(t => t.teamId === team.id);
    const totalTasks = teamTasks.length;
    if (totalTasks === 0) return { progress: 0, completed: 0, inProgress: 0, inbox: 0, upcoming: [], memberContributions: [] };

    const completed = teamTasks.filter(t => t.status === 'done').length;
    const inProgress = teamTasks.filter(t => t.status === 'in-progress').length;
    const inbox = teamTasks.filter(t => t.status === 'inbox').length;
    const progress = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    const upcoming = teamTasks
      .filter(t => t.status !== 'done' && t.dueDate)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 3);

    const memberContributions = team.members.map(memberId => {
      const member = users.find(u => u.id === memberId);
      const tasksCompleted = teamTasks.filter(t => t.assignedTo?.includes(memberId) && t.status === 'done').length;
      return { name: member?.name || 'Unknown', tasksCompleted, avatarUrl: member?.avatarUrl };
    }).sort((a, b) => b.tasksCompleted - a.tasksCompleted);

    return { progress, completed, inProgress, inbox, upcoming, memberContributions };
  };

  if (userTeams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-emerald-400/60" />
        </div>
        <p className="text-foreground/70 font-semibold">No teams yet</p>
        <p className="text-sm text-muted-foreground mt-1">Join or create a team to see sync data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {userTeams.map((team, ti) => {
        const stats = getTeamStats(team);
        return (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: ti * 0.08 }}
            className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden"
          >
            {/* Team Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold text-sm">
                  {team.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[15px] tracking-tight">{team.name}</h4>
                  <p className="text-[11.5px] text-muted-foreground">{team.members.length} members</p>
                </div>
              </div>
              <div className="flex -space-x-2">
                {team.members.slice(0, 5).map(memberId => {
                  const member = users.find(u => u.id === memberId);
                  return (
                    <Avatar key={memberId} className="w-7 h-7 border-2 border-background">
                      {member?.avatarUrl ? <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" /> : <AvatarFallback className="text-[10px] font-bold">{member?.name.charAt(0)}</AvatarFallback>}
                    </Avatar>
                  );
                })}
                {team.members.length > 5 && (
                  <Avatar className="w-7 h-7 border-2 border-background">
                    <AvatarFallback className="text-[10px] font-bold bg-muted">+{team.members.length - 5}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Overall Progress</span>
                  <span className="text-[13px] font-extrabold text-emerald-400">{stats.progress}%</span>
                </div>
                <div className="h-2 bg-background/60 rounded-full overflow-hidden border border-border/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.progress}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Done', value: stats.completed, color: 'text-emerald-400', bg: 'bg-emerald-500/8' },
                  { label: 'In Progress', value: stats.inProgress, color: 'text-amber-400', bg: 'bg-amber-500/8' },
                  { label: 'Inbox', value: stats.inbox, color: 'text-muted-foreground', bg: 'bg-muted/30' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border border-border/30 rounded-xl p-3 text-center`}>
                    <div className={`text-[22px] font-extrabold leading-none ${s.color}`}>{s.value}</div>
                    <div className="text-[10.5px] font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Upcoming Deadlines */}
              {stats.upcoming.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em] mb-2.5">Upcoming Deadlines</p>
                  <div className="space-y-2">
                    {stats.upcoming.map(task => {
                      const daysLeft = differenceInDays(new Date(task.dueDate!), new Date());
                      const urgency = daysLeft < 0 ? { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/25', label: 'Overdue' } :
                                      daysLeft < 3 ? { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/25', label: `${daysLeft}d` } :
                                      { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/25', label: format(new Date(task.dueDate!), 'MMM d') };
                      return (
                        <div key={task.id} className="flex items-center justify-between text-sm px-3.5 py-2.5 rounded-xl bg-background/30 border border-border/30">
                          <span className="font-medium text-foreground/80 truncate mr-3">{task.title}</span>
                          <div className={`flex items-center gap-1.5 ${urgency.bg} border px-2 py-0.5 rounded-full shrink-0`}>
                            <Clock className={`w-3 h-3 ${urgency.color}`} />
                            <span className={`text-[11px] font-bold ${urgency.color}`}>{urgency.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Contributions */}
              {stats.memberContributions.filter(c => c.tasksCompleted > 0).length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em] mb-2.5">Top Contributors</p>
                  <div className="space-y-2">
                    {stats.memberContributions.filter(c => c.tasksCompleted > 0).slice(0, 3).map((contrib, ci) => (
                      <div key={contrib.name} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-background/30 border border-border/30">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                            {ci + 1}
                          </div>
                          <Avatar className="w-6 h-6">
                            {contrib.avatarUrl ? <img src={contrib.avatarUrl} alt={contrib.name} className="w-full h-full object-cover" /> : <AvatarFallback className="text-[10px]">{contrib.name.charAt(0)}</AvatarFallback>}
                          </Avatar>
                          <span className="text-sm font-semibold text-foreground/80">{contrib.name}</span>
                        </div>
                        <span className="text-[12px] font-bold text-emerald-400">{contrib.tasksCompleted} done</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Loading State ─────────────────────────────────────────────────────────────
const LoadingState = ({ feature }: { feature: typeof allFeatures[number] }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-6">
    <div className="relative">
      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)]`}>
        {React.createElement(feature.icon, { className: 'w-10 h-10 text-white' })}
      </div>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      </div>
    </div>
    <div className="text-center">
      <p className="font-bold text-[16px] tracking-tight">Aura is thinking...</p>
      <p className="text-sm text-muted-foreground mt-1">Analysing your workspace data</p>
    </div>
    <div className="flex gap-1.5">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className={`w-2 h-2 rounded-full bg-gradient-to-br ${feature.gradient}`}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </div>
);

// ─── Error State ───────────────────────────────────────────────────────────────
const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
      <AlertCircle className="w-7 h-7 text-red-400" />
    </div>
    <p className="font-bold text-foreground">Something went wrong</p>
    <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">{message}</p>
  </div>
);

// ─── Prioritizer Result ────────────────────────────────────────────────────────
const PrioritizerResult = ({ result }: { result: TaskPrioritizerOutput }) => (
  <div className="space-y-5">
    <div className="p-4 rounded-2xl bg-blue-500/6 border border-blue-500/20">
      <p className="text-[13.5px] text-foreground/80 leading-relaxed font-medium">{result.summary}</p>
    </div>
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">Priority Queue</p>
      {result.prioritizedTasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.07 }}
          className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm hover:border-blue-500/30 hover:bg-card/50 transition-all duration-300 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 text-white font-black text-[13px] group-hover:scale-110 transition-transform duration-300">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[14px] tracking-tight text-foreground mb-1 truncate">{task.title}</h4>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">{task.reasoning}</p>
          </div>
          <Target className="w-4 h-4 text-blue-400/60 shrink-0 mt-1 group-hover:text-blue-400 transition-colors" />
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Summarizer Input ──────────────────────────────────────────────────────────
const SummarizerInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="space-y-4">
    <div className="p-4 rounded-2xl bg-violet-500/6 border border-violet-500/20">
      <p className="text-[13.5px] text-foreground/80 leading-relaxed font-medium">
        Paste your meeting notes, document excerpt, or any long-form text below, and Aura will distil it into a clear, concise summary.
      </p>
    </div>
    <Textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="e.g., The Q2 planning meeting covered three main areas: roadmap priorities, budget allocation, and team structure changes..."
      className="h-40 bg-card/40 border-border/50 resize-none rounded-xl text-[13.5px] font-medium placeholder:text-muted-foreground/80 dark:text-muted-foreground/50 focus:border-violet-500/50 transition-colors"
    />
    <p className="text-[11px] text-muted-foreground/60 text-right">{value.length} characters</p>
  </div>
);

// ─── Summary Result ────────────────────────────────────────────────────────────
const SummaryResult = ({ result }: { result: SummarizerOutput }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 pb-4 border-b border-border/30">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
        <CheckCircle2 className="w-5 h-5 text-foreground dark:text-white" />
      </div>
      <div>
        <p className="font-bold text-[14px] tracking-tight">Summary Ready</p>
        <p className="text-[12px] text-muted-foreground">AI-generated from your text</p>
      </div>
    </div>
    <div className="p-5 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm">
      <p className="text-[14px] text-foreground/85 leading-relaxed font-medium">{result.summary}</p>
    </div>
  </div>
);

// ─── Feature Picker Grid ───────────────────────────────────────────────────────
const FeatureGrid = ({ onSelect }: { onSelect: (id: string) => void }) => (
  <div className="p-6">
    {/* Header */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-[11.5px] font-bold text-primary uppercase tracking-widest">AI Toolkit</span>
      </div>
      <h2 className="text-[28px] font-extrabold tracking-tight leading-none mb-3">Choose a Feature</h2>
      <p className="text-[14px] text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
        Supercharge your workflow with powerful AI features built for modern teams.
      </p>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-2 gap-4">
      {allFeatures.map((feature, i) => (
        <motion.button
          key={feature.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
          onClick={() => onSelect(feature.id)}
          className={`text-left p-5 rounded-2xl border bg-card/30 backdrop-blur-xl transition-all duration-300 hover:bg-card/60 hover:-translate-y-0.5 hover:shadow-xl group ${feature.accent}`}
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`} style={{ boxShadow: `0 8px 24px ${feature.glow}` }}>
            {React.createElement(feature.icon, { className: 'w-6 h-6 text-white' })}
          </div>
          <h3 className="font-bold text-[15px] tracking-tight mb-1.5">{feature.title}</h3>
          <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
          <div className="flex items-center gap-1.5 mt-4 text-[11.5px] font-bold text-muted-foreground/60 group-hover:text-foreground/80 transition-colors">
            <span>Open feature</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.button>
      ))}
    </div>
  </div>
);

// ─── Main Modal Content ────────────────────────────────────────────────────────
const FeatureModal = ({
  featureId, isLoading, error, result, userInput, onInputChange,
  onExecute, onClose,
}: {
  featureId: FeatureId | null;
  isLoading: boolean;
  error: string | null;
  result: any;
  userInput: string;
  onInputChange: (v: string) => void;
  onExecute: () => void;
  onClose: () => void;
}) => {
  const feature = allFeatures.find(f => f.id === featureId);
  if (!feature) return null;

  const showSubmit = featureId === 'flowchart-summary' && !result && !isLoading;

  return (
    <div className="flex flex-col h-full">
      {/* Modal Header */}
      <div className="flex items-start gap-4 pb-5 border-b border-border/30 shrink-0">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.2)]`} style={{ boxShadow: `0 8px 24px ${feature.glow}` }}>
          {React.createElement(feature.icon, { className: 'w-7 h-7 text-white' })}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-extrabold text-[18px] tracking-tight leading-none">{feature.title}</h3>
          <p className="text-[13px] text-muted-foreground font-medium mt-1.5 leading-snug">{feature.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-5 min-h-0">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState feature={feature} />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ErrorState message={error} />
            </motion.div>
          ) : featureId === 'project-assistant' ? (
            <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TeamSyncResult />
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {featureId === 'task-prioritizer' && <PrioritizerResult result={result as TaskPrioritizerOutput} />}
              {featureId === 'flowchart-summary' && <SummaryResult result={result as SummarizerOutput} />}
            </motion.div>
          ) : featureId === 'flowchart-summary' ? (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SummarizerInput value={userInput} onChange={onInputChange} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/30 shrink-0">
        <Button variant="ghost" onClick={onClose} className="text-[13.5px] font-semibold text-muted-foreground hover:text-foreground">
          Close
        </Button>
        {showSubmit && (
          <Button
            onClick={onExecute}
            disabled={!userInput.trim()}
            className={`bg-gradient-to-r ${feature.gradient} text-white font-semibold text-[13.5px] h-10 px-5 rounded-xl shadow-md hover:opacity-90 transition-opacity border-0`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Summary
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
export function AiFeaturesPanel({ featureId, onFeatureSelect }: AiFeaturesPanelProps) {
  const appState = useAppContext();
  const [activeFeature, setActiveFeature] = useState<FeatureId | null>((featureId as FeatureId) || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    if (featureId) {
      handleFeatureActivation(featureId as FeatureId);
    }
  }, [featureId]);

  const handleClose = () => {
    setActiveFeature(null);
    setResult(null);
    setError(null);
    setUserInput('');
    setShowGrid(false);
    if (onFeatureSelect) onFeatureSelect(null);
  };

  const handleFeatureActivation = async (id: FeatureId) => {
    setResult(null);
    setError(null);
    setActiveFeature(id);
    setShowGrid(false);
    if (onFeatureSelect) onFeatureSelect(id);

    if (id === 'progress-tracker') {
      appState.handleNavigate('analytics');
      handleClose();
      return;
    }
    if (id === 'flowchart-summary') {
      setUserInput('');
      return;
    }
    if (id === 'project-assistant') {
      return; // rendered directly
    }
    await executeFeature(id);
  };

  const executeFeature = async (id: FeatureId, topic?: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      let response: any;
      switch (id) {
        case 'task-prioritizer':
          response = await taskPrioritizer({ tasks: appState.tasks });
          break;
        case 'flowchart-summary':
          if (!topic) { setError('Please provide text to summarize.'); setIsLoading(false); return; }
          response = await summarizer({ notes: topic });
          break;
        default:
          await new Promise(r => setTimeout(r, 1200));
          response = { summary: 'This feature is coming soon!' };
      }
      setResult(response);
    } catch (e: any) {
      console.error('AI feature error:', e);
      setError(e.message || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  };

  // ── When called from the Popover (featureId prop set) ──────────────────────
  if (featureId) {
    const currentFeature = allFeatures.find(f => f.id === featureId);
    if (!currentFeature) return null;
    return (
      <DialogContent className="max-w-2xl backdrop-blur-3xl bg-background/90 border-border/40 shadow-2xl rounded-2xl p-6 flex flex-col max-h-[85vh]">
        <VisuallyHidden>
          <DialogTitle>{currentFeature.title}</DialogTitle>
          <DialogDescription>{currentFeature.description}</DialogDescription>
        </VisuallyHidden>
        <FeatureModal
          featureId={activeFeature}
          isLoading={isLoading}
          error={error}
          result={result}
          userInput={userInput}
          onInputChange={setUserInput}
          onExecute={() => executeFeature(activeFeature!, userInput)}
          onClose={handleClose}
        />
      </DialogContent>
    );
  }

  // ── Standalone mode (full-page experience) ────────────────────────────────
  return (
    <>
      <div className="min-h-[520px] flex flex-col bg-background/80 backdrop-blur-3xl">
        <FeatureGrid onSelect={id => handleFeatureActivation(id as FeatureId)} />
      </div>

      <Dialog open={!!activeFeature} onOpenChange={open => !open && handleClose()}>
        <DialogContent className="max-w-2xl backdrop-blur-3xl bg-background/90 border-border/40 shadow-2xl rounded-2xl p-6 flex flex-col max-h-[85vh]">
          <VisuallyHidden>
            <DialogTitle>{allFeatures.find(f => f.id === activeFeature)?.title || 'AI Feature'}</DialogTitle>
            <DialogDescription>{allFeatures.find(f => f.id === activeFeature)?.description || ''}</DialogDescription>
          </VisuallyHidden>
          <FeatureModal
            featureId={activeFeature}
            isLoading={isLoading}
            error={error}
            result={result}
            userInput={userInput}
            onInputChange={setUserInput}
            onExecute={() => executeFeature(activeFeature!, userInput)}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
