
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  ArrowLeft, Users, UserPlus, Mail, Search,
  UserCheck, UserX, Bell, Clock, Send
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

// ─── Shared page header shared with all sub-pages ─────────────────────────────
const PageHeader = ({
  onBack, icon: Icon, title, subtitle, gradient, children,
}: {
  onBack: () => void;
  icon: any;
  title: string;
  subtitle: string;
  gradient: string;
  children?: React.ReactNode;
}) => (
  <header className="sticky top-0 z-40 backdrop-blur-3xl bg-background/70 border-b border-border/30">
    <div className="flex items-center justify-between px-6 sm:px-10 h-[68px] max-w-[1400px] mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost" size="icon"
          onClick={onBack}
          className="rounded-full w-9 h-9 hover:bg-white/8 transition-colors"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-foreground/70" />
        </Button>
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-[12px] bg-gradient-to-br ${gradient} flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25)]`}>
            <Icon className="w-5 h-5 text-foreground dark:text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight leading-none">{title}</h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-0.5 hidden sm:block">{subtitle}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  </header>
);

export function ColleaguesPage() {
  const { currentUser, users, activities, handleNavigate, sendColleagueRequest, handleColleagueRequest } = useAppContext();
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSendRequest = async () => {
    if (!email.trim()) return;
    const result = await sendColleagueRequest(email);
    toast({
      title: result.includes('sent') ? 'Request Sent' : 'Notice',
      description: result,
    });
    if (result.includes('sent')) setEmail('');
  };

  const colleagues = useMemo(() => {
    if (!currentUser?.colleagues) return [];
    return users.filter(u => currentUser?.colleagues.includes(u.id));
  }, [currentUser?.colleagues, users]);

  const filteredColleagues = useMemo(() => {
    if (!searchTerm) return colleagues;
    return colleagues.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [colleagues, searchTerm]);

  const pendingRequests = useMemo(() =>
    activities.filter(a => a.action === 'colleague_request' && a.status === 'pending'),
  [activities]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-blue-600/7 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/7 rounded-full blur-[120px]" />
      </div>

      <PageHeader
        onBack={() => handleNavigate('dashboard')}
        icon={Users}
        title="Colleagues"
        subtitle="Build and manage your professional network"
        gradient="from-blue-500 to-purple-600"
      >
        {colleagues.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[12px] font-bold text-blue-400">{colleagues.length} connected</span>
          </div>
        )}
      </PageHeader>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-10 py-10 space-y-8">

        {/* Pending Requests Banner */}
        <AnimatePresence>
          {pendingRequests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-amber-500/25 bg-amber-500/6 backdrop-blur-xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <Bell className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px]">Pending Requests</h3>
                  <p className="text-[12.5px] text-muted-foreground">{pendingRequests.length} colleague invitation{pendingRequests.length > 1 ? 's' : ''} awaiting your response</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {pendingRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between bg-background/40 border border-border/30 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-amber-500/30">
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-sm">
                          {req.fromUser?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[14px]">{req.fromUser?.name}</p>
                        <p className="text-[12px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Wants to connect
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-8 px-4 rounded-lg text-[12.5px] font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white border-0 transition-all duration-200"
                        onClick={() => handleColleagueRequest(req, 'accept')}
                      >
                        <UserCheck className="w-3.5 h-3.5 mr-1.5" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 rounded-lg text-[12.5px] font-semibold text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => handleColleagueRequest(req, 'reject')}
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Colleague Panel */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-3xl p-6 sticky top-24 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/25">
                  <UserPlus className="w-5 h-5 text-foreground dark:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px]">Invite Colleague</h3>
                  <p className="text-[12px] text-muted-foreground">Send a connection request</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendRequest()}
                    placeholder="colleague@company.com"
                    className="pl-10 bg-background/50 border-border/50 rounded-xl h-11 text-[13.5px] font-medium focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <Button
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-[13.5px] shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] transition-all duration-300 border-0"
                  onClick={handleSendRequest}
                  disabled={!email.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-5 border-t border-border/30 grid grid-cols-2 gap-3">
                <div className="bg-background/40 border border-border/25 rounded-xl p-3 text-center">
                  <div className="text-[22px] font-black text-blue-400">{colleagues.length}</div>
                  <div className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Connected</div>
                </div>
                <div className="bg-background/40 border border-border/25 rounded-xl p-3 text-center">
                  <div className="text-[22px] font-black text-amber-400">{pendingRequests.length}</div>
                  <div className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Pending</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Colleagues List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[17px] tracking-tight">Your Network</h2>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                <Input
                  placeholder="Search colleagues..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 bg-card/30 border-border/30 rounded-xl text-[13px] focus:border-border/60 transition-colors"
                />
              </div>
            </div>

            {filteredColleagues.length > 0 ? (
              <div className="space-y-3">
                {filteredColleagues.map((colleague, i) => (
                  <motion.div
                    key={colleague.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-xl hover:border-border/60 hover:bg-card/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12 border-2 border-border/30">
                          {colleague.avatarUrl
                            ? <img src={colleague.avatarUrl} alt={colleague.name} className="w-full h-full object-cover" />
                            : <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-[15px]">
                                {colleague.name.charAt(0)}
                              </AvatarFallback>
                          }
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-background shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                      </div>
                      <div>
                        <p className="font-bold text-[14.5px] tracking-tight">{colleague.name}</p>
                        <p className="text-[12.5px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {colleague.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-bold text-emerald-400">
                        Connected
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border/30 bg-card/10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-blue-400/60" />
                </div>
                <p className="font-bold text-foreground/70 text-[15px]">No colleagues yet</p>
                <p className="text-[13px] text-muted-foreground mt-1.5 text-center max-w-xs">
                  {searchTerm ? `No results for "${searchTerm}"` : 'Send an invitation to start building your professional network.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
