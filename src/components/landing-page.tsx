import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  Sparkles, Brain, ArrowRight, Moon, Sun, 
  Play, ChevronRight, Layers, BarChart,
  Users, Building, User, BookOpen, Bot, Zap, Workflow,
  Calendar, Briefcase, GraduationCap, LayoutDashboard, Clock
} from 'lucide-react';
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

interface LandingPageProps {
  onNavigateToAuth: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AuraLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground dark:text-foreground dark:text-white drop-shadow-md">
        <path d="M12 4.75L19.25 19.25H4.75L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 8L15.25 15.25H8.75L12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);

export function LandingPage({ onNavigateToAuth, isDarkMode, toggleTheme }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      question: "How does the AI smart-assign actually work?",
      answer: "Aura AI utilizes a proprietary scoring algorithm. It evaluates 5 key metrics: current capacity (30%), skill match (20%), historical completion rate (20%), on-time delivery (20%), and time efficiency (10%). It instantly ranks your team to find the absolute best candidate for any task."
    },
    {
      question: "Can I use Aura AI for personal productivity and studies?",
      answer: "Yes. While powerful enough for enterprise software teams, Aura AI scales perfectly down to individual students and group projects. You can use it as a smart daily planner and an interactive calendar to optimize your own time."
    },
    {
      question: "Does the bulk-assign feature take current workload into account?",
      answer: "Absolutely. When you bulk-add 10 or 20 tasks at once and click 'Smart Assign All', Aura AI simulates the assignment of the first task, recalculates the individual's future workload, and then assigns the second task. This ensures work is distributed evenly."
    },
    {
      question: "Is there a specific methodology supported (Agile, Kanban)?",
      answer: "Aura provides immersive Kanban boards, calendar views, and list views natively. It is highly flexible and perfectly supports Agile sprint planning, asynchronous agency workflows, and traditional structured task management."
    }
  ];

  const whoIsItFor = [
    {
      icon: Briefcase,
      title: "For Product Teams",
      description: "Ship features faster. Stop wasting sprint planning time arguing over who takes what ticket. Let the algorithm distribute the workload securely.",
      color: "blue"
    },
    {
      icon: Users,
      title: "For Agencies & PMs",
      description: "Manage multiple client projects effortlessly. Get live ETAs on when your freelancers will finish their backlog and become available.",
      color: "teal"
    },
    {
      icon: GraduationCap,
      title: "For Education & Students",
      description: "Organize academic life perfectly. Break down massive projects, let AI structure your day, and manage group assignments effortlessly.",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center overflow-x-hidden font-sans selection:bg-primary/30">
      
      {/* Dynamic Animated Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 dark:bg-blue-600/15 blur-[120px]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 dark:bg-purple-600/15 blur-[120px]"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      {/* Navbar */}
      <motion.nav 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/70 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group flex items-center justify-center cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-[1.02] transition-transform duration-300">
                <AuraLogo />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Aura AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-muted">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" className="hidden sm:flex font-medium" onClick={onNavigateToAuth}>Sign In</Button>
            <Button className="rounded-full px-6 font-medium shadow-lg hover:shadow-primary/25 transition-all bg-foreground text-background hover:bg-foreground/90" onClick={onNavigateToAuth}>
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Premium Hero Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-40 pb-20 flex flex-col items-center text-center">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }} 
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
           <a href="#" className="group inline-flex items-center rounded-full border border-border/50 bg-muted/20 px-3 py-1 text-sm font-medium transition-colors hover:bg-muted/40 mb-8 backdrop-blur-md">
             <span className="flex w-2 h-2 rounded-full bg-foreground mr-2" />
             The Intelligent Productivity Engine
             <ChevronRight className="ml-1 h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
           </a>
           
           <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter max-w-5xl leading-[1.05] mb-8 text-foreground drop-shadow-sm">
              Focus on the work. <br className="hidden sm:block" />
              <span className="text-muted-foreground">Let AI distribute it.</span>
           </h1>
           
           <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
             Aura AI is the next-generation task manager that intelligently assigns tickets based on your team's live capacity, skills, and historical efficiency. Built for high-velocity teams and ambitious students.
           </p>

           <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
             <Button size="lg" className="rounded-full px-8 h-12 text-sm font-medium transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-foreground hover:bg-foreground/90 text-background" onClick={onNavigateToAuth}>
               Start optimizing for free
             </Button>
             <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-sm font-medium backdrop-blur-sm border-border hover:bg-muted/30 transition-all duration-300 hover:scale-[1.03] hover:border-primary/30" onClick={onNavigateToAuth}>
               View Platform Features <Play className="w-4 h-4 ml-2 text-muted-foreground" />
             </Button>
           </div>
        </motion.div>

        {/* High-end Frameless Mockup for Core App */}
        <motion.div 
          className="w-full max-w-4xl mt-24 relative perspective-[2000px]"
          initial={{ opacity: 0, y: 40, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-20 pointer-events-none rounded-2xl" />
          <div className="relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden shadow-primary/5">
            <div className="h-12 border-b border-border/40 bg-muted/20 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-left">
               {/* Left Column */}
               <div className="col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg flex items-center"><Layers className="w-5 h-5 mr-2 text-primary" /> Active Workspace</h3>
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-medium tracking-wide">Auto-Assign Enabled</Badge>
                  </div>
                  
                  {[1, 2].map((i) => (
                    <div key={i} className={`p-5 rounded-xl border ${i===1 ? 'border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 shadow-[0_0_30px_rgba(59,130,246,0.1)] ring-1 ring-primary/20' : 'border-border/40 bg-card/60'} relative overflow-hidden transition-all duration-500`}>
                       {i === 1 && <div className="absolute top-0 right-0 w-48 h-48 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />}
                       <div className="flex justify-between items-start mb-5 relative z-10">
                         <div className="space-y-1.5">
                            {i === 1 ? (
                                <>
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-[10px] px-2 py-0 border-blue-500/20">Frontend</Badge>
                                      <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/10 dark:bg-red-500/20 text-[10px] px-2 py-0 border-red-500/20 shadow-sm shadow-red-500/10">P0 Urgent</Badge>
                                    </div>
                                    <h4 className="text-base font-semibold text-foreground tracking-tight">Implement Next.js Edge Caching</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-1">Optimize API routes for global distribution using Vercel edge network.</p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 text-[10px] px-2 py-0 border-purple-500/20">Backend</Badge>
                                      <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 dark:bg-yellow-500/20 text-[10px] px-2 py-0 border-yellow-500/20">P1</Badge>
                                    </div>
                                    <h4 className="text-base font-medium text-foreground/80 tracking-tight">Database Migration Scoping</h4>
                                    <p className="text-sm text-muted-foreground/70 line-clamp-1">Draft schema changes for the upcoming multi-tenant user table split.</p>
                                </>
                            )}
                         </div>
                         {i===1 && <Badge className="bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500/10 dark:bg-green-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.15)] ml-2 whitespace-nowrap py-1 px-2"><Zap className="w-3 h-3 mr-1 text-green-400 fill-green-400"/> 98% Skill Match</Badge>}
                       </div>
                       <div className="flex items-center gap-3 relative z-10 pt-3 border-t border-border/40">
                          <div className={`w-8 h-8 rounded-full ${i===1 ? 'bg-gradient-to-tr from-blue-500 to-purple-500' : 'bg-muted'} flex items-center justify-center border-2 border-background shadow-md overflow-hidden ring-2 ring-background`}>
                             {i === 1 ? <span className="text-[10px] font-bold text-foreground dark:text-white tracking-wider">EJ</span> : <span className="text-[10px] font-bold text-muted-foreground tracking-wider">SM</span>}
                          </div>
                          <div className="flex flex-col">
                             <span className={`text-sm font-semibold ${i===1 ? 'text-foreground' : 'text-foreground/70'}`}>{i===1 ? 'Elena J.' : 'Sam M.'}</span>
                             {i===1 && <div className="text-[11px] font-medium text-primary/80 tracking-wide flex items-center mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 shadow-[0_0_5px_rgba(59,130,246,0.6)]" /> Highly Available • Est. Start in 0.0h</div>}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               {/* Right Column */}
               <div className="space-y-4">
                 <h3 className="font-semibold text-lg flex items-center"><BarChart className="w-5 h-5 mr-2 text-primary" /> Velocity Metrics</h3>
                 <div className="p-5 rounded-xl border border-border/40 bg-card/60 space-y-6 hover:border-primary/20 transition-colors duration-500 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500" />
                    <div>
                      <div className="flex justify-between items-end mb-2">
                          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Historical Efficiency</div>
                          <div className="text-sm font-bold text-primary">82%</div>
                      </div>
                      <div className="h-2 w-full bg-muted/80 rounded-full overflow-hidden shadow-inner"><motion.div initial={{width:0}} animate={{width:"82%"}} transition={{duration:1.5, delay:1.5, ease:"easeOut"}} className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full relative" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">On-Time Delivery</div>
                          <div className="text-sm font-bold text-purple-500">95%</div>
                      </div>
                      <div className="h-2 w-full bg-muted/80 rounded-full overflow-hidden shadow-inner"><motion.div initial={{width:0}} animate={{width:"95%"}} transition={{duration:1.5, delay:1.7, ease:"easeOut"}} className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full relative" /></div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between items-end mb-2">
                          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Team Capacity</div>
                          <div className="text-sm font-bold text-green-500">64%</div>
                      </div>
                      <div className="h-2 w-full bg-muted/80 rounded-full overflow-hidden shadow-inner"><motion.div initial={{width:0}} animate={{width:"64%"}} transition={{duration:1.5, delay:1.9, ease:"easeOut"}} className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full relative" /></div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid: Core Product Features */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 mt-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Complete Productivity Engine</h2>
          <p className="text-lg text-muted-foreground/80 font-medium max-w-2xl mx-auto">Skip the endless assignment meetings and manual spreadsheets. Aura handles the operational logistics entirely.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Big box */}
           <div className="md:col-span-2 row-span-2 rounded-[2rem] border border-border/40 bg-card/30 p-10 flex flex-col relative overflow-hidden group hover:border-primary/20 hover:bg-card/40 transition-colors backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-colors" />
              <Brain className="w-10 h-10 text-primary mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-3 relative z-10 tracking-tight">Adaptive AI Assignment Model</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md relative z-10 font-medium">
                Our proprietary algorithm constantly evaluates past project completion rates, inbox capacities, and specific skill mappings to instantly nominate the absolute best candidate for any given task.
              </p>
              <div className="mt-8 flex-1 border border-border/40 rounded-2xl bg-background/50 p-6 relative z-10 flex flex-col gap-4 shadow-inner">
                 <div className="w-full h-8 bg-muted/40 rounded animate-pulse" />
                 <div className="w-4/5 h-8 bg-muted/30 rounded animate-pulse" />
                 <div className="w-5/6 h-8 bg-muted/20 rounded animate-pulse" />
              </div>
           </div>

           {/* Small Box 1 */}
           <div className="rounded-[2rem] border border-border/40 bg-card/30 p-8 relative overflow-hidden group hover:border-purple-500/20 hover:bg-card/40 transition-colors backdrop-blur-sm">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors" />
              <Layers className="w-8 h-8 text-purple-500 mb-4 relative z-10" />
              <h3 className="text-xl font-bold mb-2 relative z-10 tracking-tight">Instant Bulk Scheduling</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed relative z-10">Create entire sprint backlogs at once. Click 'Smart Assign' and watch dozens of tasks map to the perfect team member instantly.</p>
           </div>

           {/* Small Box 2 */}
           <div className="rounded-[2rem] border border-border/40 bg-card/30 p-8 relative overflow-hidden group hover:border-teal-500/20 hover:bg-card/40 transition-colors backdrop-blur-sm">
              <div className="absolute top-1/2 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-[80px] group-hover:bg-teal-500/20 transition-colors transform -translate-y-1/2" />
              <Clock className="w-8 h-8 text-teal-500 mb-4 relative z-10" />
              <h3 className="text-xl font-bold mb-2 relative z-10 tracking-tight">Live Workload Forecasting</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed relative z-10">Prevent team burnout. Aura statically analyzes existing queues to compute an exact ETA of when a new task will be started.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="p-8 border border-border/40 bg-card/30 hover:bg-card/60 transition-colors backdrop-blur-sm rounded-[2rem]">
                <LayoutDashboard className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Interactive Kanban Boards</h3>
                <p className="text-sm text-muted-foreground">Seamless drag-and-drop interfaces to take tasks from Inbox to In-Progress to Done flawlessly.</p>
            </Card>
            <Card className="p-8 border border-border/40 bg-card/30 hover:bg-card/60 transition-colors backdrop-blur-sm rounded-[2rem]">
                <Calendar className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Full Calendar Integration</h3>
                <p className="text-sm text-muted-foreground">Visualize your entire month's workload globally and locally with an expansive calendar toolkit.</p>
            </Card>
            <Card className="p-8 border border-border/40 bg-card/30 hover:bg-card/60 transition-colors backdrop-blur-sm rounded-[2rem]">
                <BarChart className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Deep Performance Analytics</h3>
                <p className="text-sm text-muted-foreground">Get empirical data on completion timelines, individual velocity metrics, and organizational efficiency.</p>
            </Card>
        </div>
      </section>

      {/* "Who is it for?" Section */}
      <section className="py-20 px-6 w-full relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Scales with every workflow</h2>
            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
              From enterprise scaling to university studying, adapt Aura AI to the way you work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {whoIsItFor.map((persona, index) => (
              <div key={index} className="rounded-[2rem] border border-border/40 bg-card/30 p-8 hover:bg-card/60 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-lg">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r from-${persona.color}-500 to-${persona.color}-600 flex items-center justify-center mb-6 shadow-md`}>
                    <persona.icon className="w-6 h-6 text-foreground dark:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{persona.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{persona.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 w-full relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
          </div>
          
          <div className="rounded-[2rem] border border-border/40 bg-card/30 p-8 backdrop-blur-sm shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/40">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-primary transition-colors text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 mb-20">
         <div className="rounded-[2.5rem] border border-primary/20 bg-gradient-to-b from-primary/10 to-background/50 p-16 text-center relative overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to work like the absolute best?</h2>
              <p className="text-xl text-muted-foreground/80 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">Join thousands of engineers, project managers, and students who have completely automated their task delegation.</p>
              <Button size="lg" className="rounded-full px-10 h-14 shadow-lg shadow-primary/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:scale-[1.03] transition-all duration-300 text-base" onClick={onNavigateToAuth}>
                Get Started Free <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border/20 bg-background/50 backdrop-blur-lg py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
               <AuraLogo />
            </div>
            <span className="text-lg font-bold tracking-tight">Aura AI</span>
          </div>
          <p className="text-muted-foreground/70 font-medium text-sm text-center md:text-left">© 2026 Aura AI Inc. Built for peak productivity.</p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground/70">
             <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
             <a href="#" className="hover:text-foreground transition-colors">Terms</a>
             <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
