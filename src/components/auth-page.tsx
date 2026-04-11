import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Sun, Moon, LogIn, ChevronDown } from 'lucide-react';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface AuthPageProps {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
  onAuthSuccess: (user: FirebaseUser) => void;
  onBack: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AuraLogo = ({ className = "h-6 w-6 text-white" }: { className?: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 4.75L19.25 19.25H4.75L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 8L15.25 15.25H8.75L12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);

export function AuthPage({ mode, onModeChange, onAuthSuccess, onBack, isDarkMode, toggleTheme }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSpecificDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      onAuthSuccess(userCredential.user);
    } catch (signInError: any) {
      if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/wrong-password') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
          const displayName = demoEmail.split('@')[0];
          if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
          }
          // Re-fetch the user to get the updated profile
          const updatedUser = auth.currentUser;
          if (updatedUser) {
            onAuthSuccess(updatedUser);
          }
        } catch (signUpError: any) {
          setError(signUpError.message || `Failed to create demo account for ${demoEmail}.`);
        }
      } else {
        setError(signInError.message || 'An error occurred during demo login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let userCredential;
      if (mode === 'register') {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess(userCredential.user);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (providerName: 'Google') => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      onAuthSuccess(result.user);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-background selection:bg-primary/30 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
      </div>

      {/* Floating navigation */}
      <motion.div
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </motion.div>

      <motion.div
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[400px] relative z-10 flex flex-col justify-center max-h-full"
      >
        <Card className="bg-card/40 backdrop-blur-3xl border-border/40 p-6 sm:px-8 sm:py-7 shadow-2xl rounded-[1.5rem] sm:rounded-[2rem]">
          {/* Header */}
          <div className="text-center mb-5">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(139,92,246,0.3)] relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50" />
              <AuraLogo className="w-6 h-6 text-foreground dark:text-white drop-shadow-md" />
            </motion.div>
            
            <h1 className="text-2xl font-semibold tracking-tight mb-1.5 text-foreground leading-none">
              {mode === 'login' ? 'Welcome Back' : 'Join Aura AI'}
            </h1>
            <p className="text-[14px] text-muted-foreground font-medium leading-tight">
              {mode === 'login' 
                ? 'Continue your productivity journey' 
                : 'Start your AI-powered productivity journey'
              }
            </p>
          </div>
          
          <div className="space-y-2.5 mb-5">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={isLoading}
                        className="w-full h-10 bg-background/30 border-border/60 hover:bg-muted/50 transition-colors flex justify-between rounded-lg px-4 text-[14px] font-medium"
                    >
                        <div className="flex items-center text-foreground">
                           <LogIn className="w-[16px] h-[16px] mr-2.5 opacity-70" />
                           Continue with Demo Login
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg" align="center">
                    <DropdownMenuItem className="py-2 cursor-pointer text-sm" onClick={() => handleSpecificDemoLogin('testuser@gmail.com', 'testuser')}>
                        Demo User 1
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 cursor-pointer text-sm" onClick={() => handleSpecificDemoLogin('testuser2@gmail.com', 'testuser2')}>
                        Demo User 2
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 cursor-pointer text-sm" onClick={() => handleSpecificDemoLogin('testuser3@gmail.com', 'testuser3')}>
                        Demo User 3
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleSocialAuth('Google')}
              disabled={isLoading}
              className="w-full h-10 bg-background/30 border-border/60 hover:bg-muted/50 transition-colors rounded-lg px-4 text-[14px] font-medium text-foreground"
            >
              <svg className="w-[16px] h-[16px] mr-2.5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <Separator className="flex-1 bg-border/40" />
            <span className="text-[12px] text-muted-foreground uppercase tracking-wider">or</span>
            <Separator className="flex-1 bg-border/40" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <AnimatePresence mode="popLayout">
                {mode === 'register' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-1.5 overflow-hidden"
                >
                    <Label htmlFor="name" className="text-[12px] font-semibold text-foreground/90 pl-1">Full Name</Label>
                    <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-[16px] h-[16px] text-muted-foreground/60" />
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 pl-9 bg-background/50 border-border/40 hover:border-border focus:border-primary/50 transition-colors rounded-lg text-[14px]"
                        placeholder="Enter your full name"
                        required
                    />
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[12px] font-semibold text-foreground/90 pl-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-[16px] h-[16px] text-muted-foreground/60" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 pl-9 bg-background/50 border-border/40 hover:border-border focus:border-primary/50 transition-colors rounded-lg text-[14px]"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[12px] font-semibold text-foreground/90 pl-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-[16px] h-[16px] text-muted-foreground/60" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 pl-9 pr-9 bg-background/50 border-border/40 hover:border-border focus:border-primary/50 transition-colors rounded-lg text-[14px]"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
                </button>
              </div>
            </div>
            
            {error && (
              <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-[12px] text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20 mt-1.5">
                  {error}
              </motion.p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full h-10 mt-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] hover:-translate-y-[1px] rounded-lg text-[14px] font-medium border-0"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <AuraLogo className="w-4 h-4 text-white mr-2" />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </Button>
          </form>

          {/* Switch mode */}
          <div className="text-center mt-5">
            <p className="text-[13px] text-muted-foreground">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
                className="ml-1.5 text-blue-500 hover:text-blue-400 font-medium transition-colors focus:outline-none"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <AnimatePresence>
              {mode === 'login' && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-center mt-3"
                >
                  <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium focus:outline-none">
                    Forgot your password?
                  </button>
                </motion.div>
              )}
          </AnimatePresence>
        </Card>

        {/* Welcome animation for registration */}
        <AnimatePresence>
            {mode === 'register' && (
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="text-center mt-4 text-[12px] text-muted-foreground px-2 leading-relaxed"
            >
                By creating an account, you agree to our <a href="#" className="flex-auto text-foreground hover:underline">Terms of Service</a> and <a href="#" className="flex-auto text-foreground hover:underline">Privacy Policy</a>.
            </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
