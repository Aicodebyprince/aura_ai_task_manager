
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  ArrowLeft, Settings as SettingsIcon, User, Bell, Palette,
  Zap, Sun, Moon, Monitor, Camera, Check
} from 'lucide-react';
import type { AppSettings } from '@/lib/types';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const TABS = [
  { value: 'profile',      label: 'Profile',       icon: User,        gradient: 'from-blue-500 to-cyan-500' },
  { value: 'appearance',   label: 'Appearance',    icon: Palette,     gradient: 'from-violet-500 to-purple-600' },
  { value: 'notifications',label: 'Notifications', icon: Bell,        gradient: 'from-amber-500 to-orange-500' },
  { value: 'productivity', label: 'Productivity',  icon: Zap,         gradient: 'from-emerald-500 to-teal-600' },
];

// ─── Row Toggle for settings ───────────────────────────────────────────────────
const SettingRow = ({
  label, description, checked, onChange,
}: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-6 py-4 border-b border-border/25 last:border-0">
    <div>
      <p className="font-semibold text-[14px] tracking-tight">{label}</p>
      <p className="text-[12.5px] text-muted-foreground mt-0.5">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export function Settings() {
  const { currentUser, settings, handleNavigate, handleUpdateAppState } = useAppContext();

  const [profileData, setProfileData] = useState({
    name:     currentUser?.name  || '',
    email:    currentUser?.email || '',
    timezone: settings.timezone,
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleProfileUpdate = () => {
    if (!currentUser) return;
    handleUpdateAppState({
      users:       [{ ...currentUser, name: profileData.name, email: profileData.email }],
      currentUser: { ...currentUser, name: profileData.name, email: profileData.email },
      settings:    { ...settings, timezone: profileData.timezone },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    handleUpdateAppState({ settings: { ...settings, [key]: value } });
  };

  const currentTab = TABS.find(t => t.value === activeTab)!;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-violet-600/7 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/7 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-3xl bg-background/70 border-b border-border/30">
        <div className="flex items-center px-6 sm:px-10 h-[68px] max-w-[1400px] mx-auto w-full gap-4">
          <Button
            variant="ghost" size="icon"
            onClick={() => handleNavigate('dashboard')}
            className="rounded-full w-9 h-9 hover:bg-white/8 transition-colors"
          >
            <ArrowLeft className="w-[18px] h-[18px] text-foreground/70" />
          </Button>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-[0_4px_16px_rgba(139,92,246,0.35)]">
              <SettingsIcon className="w-5 h-5 text-foreground dark:text-white" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight leading-none">Settings</h1>
              <p className="text-[12px] text-muted-foreground font-medium mt-0.5 hidden sm:block">Customize your Aura AI experience</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 py-10">
        <div className="flex gap-8">

          {/* Sidebar Nav */}
          <aside className="hidden md:flex flex-col gap-1 w-56 shrink-0 sticky top-24">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-semibold transition-all duration-200 text-left',
                  activeTab === tab.value
                    ? 'bg-card/50 border border-border/40 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/20'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                  activeTab === tab.value
                    ? `bg-gradient-to-br ${tab.gradient} shadow-md`
                    : 'bg-muted/30',
                )}>
                  <tab.icon className={cn('w-4 h-4', activeTab === tab.value ? 'text-white' : 'text-muted-foreground')} />
                </div>
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Mobile tab strip */}
          <div className="md:hidden w-full mb-2">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {TABS.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all',
                    activeTab === tab.value
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                      : 'bg-card/30 border border-border/30 text-muted-foreground'
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content pane */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >

                {/* ── PROFILE ───────────────────────────────────────── */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-3xl p-7 shadow-xl">
                      {/* Avatar area */}
                      <div className="flex items-center gap-6 mb-8 pb-7 border-b border-border/25">
                        <div className="relative">
                          <Avatar className="w-24 h-24 border-2 border-border/30 shadow-xl">
                            {currentUser?.avatarUrl
                              ? <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                              : <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[32px] font-black">
                                  {currentUser?.name.charAt(0)}
                                </AvatarFallback>
                            }
                          </Avatar>
                          <button className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-background">
                            <Camera className="w-4 h-4 text-foreground dark:text-white" />
                          </button>
                        </div>
                        <div>
                          <h3 className="font-bold text-[18px] tracking-tight">{currentUser?.name}</h3>
                          <p className="text-[13px] text-muted-foreground mt-0.5">{currentUser?.email}</p>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">{currentUser?.role || 'Member'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</Label>
                          <Input
                            value={profileData.name}
                            onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                            className="bg-background/50 border-border/50 rounded-xl h-11 text-[13.5px] font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</Label>
                          <Input
                            type="email"
                            value={profileData.email}
                            onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                            className="bg-background/50 border-border/50 rounded-xl h-11 text-[13.5px] font-medium"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Timezone</Label>
                          <Select value={profileData.timezone} onValueChange={v => setProfileData({ ...profileData, timezone: v })}>
                            <SelectTrigger className="bg-background/50 border-border/50 rounded-xl h-11 text-[13.5px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                ['UTC', 'UTC'],
                                ['America/New_York', 'Eastern Time (ET)'],
                                ['America/Chicago', 'Central Time (CT)'],
                                ['America/Denver', 'Mountain Time (MT)'],
                                ['America/Los_Angeles', 'Pacific Time (PT)'],
                                ['Europe/London', 'London (GMT)'],
                                ['Europe/Paris', 'Paris (CET)'],
                                ['Asia/Kolkata', 'India (IST)'],
                                ['Asia/Tokyo', 'Tokyo (JST)'],
                              ].map(([val, label]) => (
                                <SelectItem key={val} value={val}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end mt-7">
                        <Button
                          onClick={handleProfileUpdate}
                          className={cn(
                            'h-11 px-6 rounded-xl font-semibold text-[13.5px] transition-all duration-300 border-0',
                            saved
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)]'
                          )}
                        >
                          {saved ? <><Check className="w-4 h-4 mr-2" />Saved!</> : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── APPEARANCE ─────────────────────────────────────── */}
                {activeTab === 'appearance' && (
                  <div className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-3xl p-7 shadow-xl">
                    <div className="mb-7">
                      <h3 className="font-bold text-[17px] tracking-tight">Theme</h3>
                      <p className="text-[13px] text-muted-foreground mt-1">Choose your preferred color scheme across the app.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light',  label: 'Light',  icon: Sun,     preview: 'bg-white border-slate-200' },
                        { value: 'dark',   label: 'Dark',   icon: Moon,    preview: 'bg-slate-900 border-slate-700' },
                        { value: 'auto',   label: 'System', icon: Monitor, preview: 'bg-gradient-to-br from-white to-slate-900 border-slate-400' },
                      ].map(theme => (
                        <button
                          key={theme.value}
                          onClick={() => handleSettingChange('theme', theme.value as AppSettings['theme'])}
                          className={cn(
                            'relative p-5 rounded-2xl border-2 transition-all duration-200 text-center group hover:-translate-y-0.5',
                            settings.theme === theme.value
                              ? 'border-violet-500 bg-violet-500/8 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                              : 'border-border/40 hover:border-border/70 bg-card/20'
                          )}
                        >
                          {settings.theme === theme.value && (
                            <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {/* Preview swatch */}
                          <div className={`w-full h-14 rounded-xl border mb-4 ${theme.preview}`} />
                          <div className="flex items-center justify-center gap-2">
                            <theme.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold text-[13.5px]">{theme.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── NOTIFICATIONS ──────────────────────────────────── */}
                {activeTab === 'notifications' && (
                  <div className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-3xl p-7 shadow-xl">
                    <div className="mb-7">
                      <h3 className="font-bold text-[17px] tracking-tight">Notification Preferences</h3>
                      <p className="text-[13px] text-muted-foreground mt-1">Control how and when Aura notifies you.</p>
                    </div>
                    <SettingRow
                      label="Push Notifications"
                      description="Receive real-time alerts about tasks, teams, and colleague requests"
                      checked={settings.notifications}
                      onChange={v => handleSettingChange('notifications', v)}
                    />
                    <SettingRow
                      label="Due Date Reminders"
                      description="Get notified 24 hours before a task deadline"
                      checked={true}
                      onChange={() => {}}
                    />
                    <SettingRow
                      label="Team Activity"
                      description="Stay informed when teammates complete or update tasks"
                      checked={true}
                      onChange={() => {}}
                    />
                    <SettingRow
                      label="AI Recommendations"
                      description="Let Aura AI proactively suggest tasks and improvements"
                      checked={settings.aiSuggestions}
                      onChange={v => handleSettingChange('aiSuggestions', v)}
                    />
                  </div>
                )}

                {/* ── PRODUCTIVITY ───────────────────────────────────── */}
                {activeTab === 'productivity' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-3xl p-7 shadow-xl">
                      <div className="mb-6">
                        <h3 className="font-bold text-[17px] tracking-tight">Work Preferences</h3>
                        <p className="text-[13px] text-muted-foreground mt-1">Tune your productivity tools and work schedule.</p>
                      </div>
                      <SettingRow
                        label="Focus Mode"
                        description="Minimize distractions and UI noise during active work sessions"
                        checked={settings.focusMode}
                        onChange={v => handleSettingChange('focusMode', v)}
                      />
                      <SettingRow
                        label="AI Suggestions"
                        description="Get intelligent task recommendations powered by Aura AI"
                        checked={settings.aiSuggestions}
                        onChange={v => handleSettingChange('aiSuggestions', v)}
                      />
                    </div>

                    <div className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-3xl p-7 shadow-xl">
                      <div className="mb-6">
                        <h3 className="font-bold text-[17px] tracking-tight">Working Hours</h3>
                        <p className="text-[13px] text-muted-foreground mt-1">Define your standard work window for scheduling.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Start Time</Label>
                          <Input
                            type="time"
                            value={settings.workingHours.start}
                            onChange={e => handleSettingChange('workingHours', { ...settings.workingHours, start: e.target.value })}
                            className="bg-background/50 border-border/50 rounded-xl h-11 text-[13.5px] font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">End Time</Label>
                          <Input
                            type="time"
                            value={settings.workingHours.end}
                            onChange={e => handleSettingChange('workingHours', { ...settings.workingHours, end: e.target.value })}
                            className="bg-background/50 border-border/50 rounded-xl h-11 text-[13.5px] font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-3xl p-7 shadow-xl">
                      <div className="mb-5">
                        <h3 className="font-bold text-[17px] tracking-tight">Language</h3>
                        <p className="text-[13px] text-muted-foreground mt-1">Choose your preferred display language.</p>
                      </div>
                      <Select value={settings.language} onValueChange={v => handleSettingChange('language', v)}>
                        <SelectTrigger className="bg-background/50 border-border/50 rounded-xl h-11 text-[13.5px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['ja','日本語'],['zh','中文'],['hi','हिन्दी']].map(([v,l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
