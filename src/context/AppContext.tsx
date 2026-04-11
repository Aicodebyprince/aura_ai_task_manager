
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, getDoc, query, where, getDocs, Unsubscribe } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { Task, User, Team, Activity, AppSettings, AppState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AppContextType extends AppState {
    isLoading: boolean;
    authMode: 'login' | 'register';
    setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'register'>>;
    handleNavigate: (page: string, teamId?: string) => void;
    handleLogout: () => void;
    handleUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    handleAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    handleDeleteTask: (taskId: string) => Promise<void>;
    handleDeleteTeam: (teamId: string) => Promise<void>;
    handleUpdateAppState: (updates: Partial<AppState>) => Promise<void>;
    sendColleagueRequest: (email: string) => Promise<string>;
    handleColleagueRequest: (activity: Activity, response: 'accept' | 'reject') => Promise<void>;
    handleTeamInvite: (activity: Activity, response: 'accept' | 'reject') => Promise<void>;
    handleAuth: (firebaseUser: FirebaseUser) => Promise<void>;
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

const initialAppState: AppState = {
  isLoggedIn: false,
  currentUser: null,
  currentPage: 'landing',
  tasks: [],
  users: [],
  teams: [],
  activities: [],
  settings: {
    theme: 'dark',
    notifications: true,
    soundEffects: false,
    aiSuggestions: true,
    focusMode: false,
    language: 'en',
    workingHours: { start: '09:00', end: '17:00' },
    timezone: 'America/New_York',
  },
  currentTeamId: null,
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const createActivity = useCallback(async (action: Activity['action'], targetId: string, targetName: string, forUserId?: string, fromUser?: { id: string; name: string; }) => {
    if (!appState.currentUser) return;
    const status: Activity['status'] = ['colleague_request', 'team_invite'].includes(action) ? 'pending' : 'completed';
    await addDoc(collection(db, 'activities'), {
      userId: forUserId || appState.currentUser.id,
      action,
      targetId,
      targetName,
      timestamp: new Date().toISOString(),
      ...(fromUser && { fromUser }),
      status,
    });
  }, [appState.currentUser]);

  const handleAuth = useCallback(async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    let user: User;
    if (userSnap.exists()) {
      user = userSnap.data() as User;
    } else {
      const newUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Aura AI User',
        email: firebaseUser.email || '',
        status: 'online',
        role: 'admin',
        joinedAt: new Date().toISOString(),
        colleagues: [],
        colleagueRequests: []
      };

      if (firebaseUser.photoURL) {
        newUser.avatarUrl = firebaseUser.photoURL;
      }
      
      await setDoc(userRef, newUser, { merge: true });
      
      await setDoc(doc(db, 'settings', newUser.id), initialAppState.settings);
      user = newUser;
    }
    
    const tasksQuery = query(collection(db, 'tasks'), where('createdBy', '==', user.id));
    const tasksSnapshot = await getDocs(tasksQuery);

    if (tasksSnapshot.empty) {
      const demoTasks = [
        {
          title: 'Finalize Q3 marketing report',
          description: 'Review the latest campaign data and compile the final report for the quarterly review meeting.',
          status: 'in-progress',
          priority: 'high',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
          estimatedTime: 4,
        },
        {
          title: 'Brainstorm for new landing page design',
          description: 'Gather inspiration and create wireframes for the new homepage. Focus on improving user engagement.',
          status: 'inbox',
          priority: 'high',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
          estimatedTime: 3,
        },
        {
          title: 'Update team collaboration guidelines',
          description: 'Incorporate feedback from the last retro and update the documentation for the team.',
          status: 'inbox',
          priority: 'medium',
          estimatedTime: 2,
        },
        {
          title: 'Research competitor API integrations',
          description: 'Analyze APIs from top 3 competitors to identify potential features for our own product.',
          status: 'inbox',
          priority: 'medium',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
          estimatedTime: 8,
        },
        {
          title: 'Organize digital assets for "Project Phoenix"',
          description: 'Sort and tag all photos, videos, and documents related to the Project Phoenix launch.',
          status: 'inbox',
          priority: 'low',
          estimatedTime: 2.5,
        },
        {
          title: 'Prepare presentation for client kickoff',
          description: 'Create the initial slide deck for the kickoff meeting with the new client "Globex Corp".',
          status: 'done',
          priority: 'high',
          dueDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
          completionStatus: 'on-time',
        },
        {
          title: 'Review and approve expense reports',
          description: 'Go through the team\'s expense reports from last month and approve them in the system.',
          status: 'done',
          priority: 'medium',
          dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
          completionStatus: 'on-time',
        },
      ];

      for (const task of demoTasks) {
        await addDoc(collection(db, 'tasks'), {
          ...task,
          createdBy: user.id,
          assignedTo: [user.id],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          teamId: null,
        });
      }
    }
    
    const settingsRef = doc(db, 'settings', user.id);
    const settingsSnap = await getDoc(settingsRef);
    const userSettings = settingsSnap.exists() ? settingsSnap.data() as AppSettings : initialAppState.settings;
    
    setAppState(prev => ({
      ...initialAppState,
      isLoggedIn: true,
      currentUser: user,
      settings: userSettings,
      currentPage: 'dashboard',
    }));
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await handleAuth(firebaseUser);
      } else {
        setAppState(initialAppState);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [handleAuth]);
  
  useEffect(() => {
    if (appState.isLoggedIn && appState.currentUser) {
      let allUnsubs: Unsubscribe[] = [];

      const personalTasksQuery = query(collection(db, 'tasks'), where('createdBy', '==', appState.currentUser.id), where('teamId', '==', null));
      const personalTasksUnsub = onSnapshot(personalTasksQuery, (snapshot) => {
        const personalTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        setAppState(prev => {
          const teamTasks = prev.tasks.filter(t => t.teamId);
          return { ...prev, tasks: [...personalTasks, ...teamTasks] };
        });
      });
      allUnsubs.push(personalTasksUnsub);

      const userTeams = appState.teams.filter(team => team.members.includes(appState.currentUser!.id));
      userTeams.forEach(team => {
        const teamTasksQuery = query(collection(db, 'tasks'), where('teamId', '==', team.id));
        const teamTasksUnsub = onSnapshot(teamTasksQuery, (snapshot) => {
          const teamTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
          setAppState(prev => {
            const otherTasks = prev.tasks.filter(t => t.teamId !== team.id);
            return { ...prev, tasks: [...otherTasks, ...teamTasks] };
          });
        });
        allUnsubs.push(teamTasksUnsub);
      });
      
      const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setAppState(prev => ({ ...prev, users }));
      });
      allUnsubs.push(usersUnsub);

      const teamsUnsub = onSnapshot(query(collection(db, 'teams'), where('members', 'array-contains', appState.currentUser.id)), (snapshot) => {
        const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
        setAppState(prev => ({ ...prev, teams }));
      });
      allUnsubs.push(teamsUnsub);
      
      const settingsUnsub = onSnapshot(doc(db, 'settings', appState.currentUser.id), (doc) => {
        if (doc.exists()) {
          setAppState(prev => ({ ...prev, settings: doc.data() as AppSettings }));
        }
      });
      allUnsubs.push(settingsUnsub);
      
      const activitiesQuery = query(collection(db, 'activities'), where('userId', '==', appState.currentUser.id));
      const activitiesUnsub = onSnapshot(activitiesQuery, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
        const sortedActivities = activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAppState(prev => ({ ...prev, activities: sortedActivities }));
      });
      allUnsubs.push(activitiesUnsub);
      
      const userUnsub = onSnapshot(doc(db, 'users', appState.currentUser.id), (doc) => {
          if (doc.exists()) {
              const currentUserData = doc.data() as User;
              setAppState(prev => ({ ...prev, currentUser: currentUserData }));

              if (currentUserData.colleagueRequests && currentUserData.colleagueRequests.length > 0) {
                  const currentPendingRequestIds = new Set(
                      appState.activities
                          .filter(a => a.action === 'colleague_request' && a.status === 'pending')
                          .map(a => a.fromUser?.id)
                  );
                  
                  currentUserData.colleagueRequests.forEach(req => {
                      if (!currentPendingRequestIds.has(req.from)) {
                          createActivity('colleague_request', appState.currentUser!.id, appState.currentUser!.name, appState.currentUser!.id, {id: req.from, name: req.name});
                      }
                  });
              }
          }
      });
      allUnsubs.push(userUnsub);


      return () => {
        allUnsubs.forEach(unsub => unsub());
      };
    }
  }, [appState.isLoggedIn, appState.currentUser?.id, appState.teams.length, createActivity]);

  useEffect(() => {
    const applyTheme = () => {
      if (typeof window === 'undefined') return;
      const root = window.document.documentElement;
      const isDarkMode =
        appState.settings.theme === 'dark' ||
        (appState.settings.theme === 'auto' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.remove(isDarkMode ? 'light' : 'dark');
      root.classList.add(isDarkMode ? 'dark' : 'light');
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [appState.settings.theme]);

  const handleUpdateAppState = useCallback(async (updates: Partial<AppState>) => {
    if (updates.currentPage) {
      setAppState(prev => ({ ...prev, currentPage: updates.currentPage! }));
    }

    if (updates.settings) {
      setAppState(prev => ({ ...prev, settings: { ...prev.settings, ...updates.settings! } }));
    }

    if (updates.users) {
      for (const user of updates.users) {
        const { id, ...userData } = user;
        if (id) {
          await updateDoc(doc(db, 'users', id), userData);
        }
      }
    }

    if (updates.teams) {
      for (const team of updates.teams) {
        const { id, ...teamData } = team;
        if (id) { // Existing team
          const teamRef = doc(db, 'teams', id);
          const existingTeam = appState.teams.find(t => t.id === id);
          
          if (existingTeam) {
            // Find NEW pending members to send invites
            const currentPending = existingTeam.pendingMembers || [];
            const updatedPending = teamData.pendingMembers || [];
            const newPending = updatedPending.filter(m => !currentPending.includes(m) && !existingTeam.members.includes(m));
            
            for (const userId of newPending) {
              await createActivity('team_invite', id, team.name, userId, { id: appState.currentUser!.id, name: appState.currentUser!.name });
            }
          }
          await updateDoc(teamRef, teamData);
        } else { // New team
          const docRef = await addDoc(collection(db, 'teams'), teamData);
          await createActivity('created_team', docRef.id, team.name);
          
          // Send invites to all pending members
          if (teamData.pendingMembers && teamData.pendingMembers.length > 0) {
            for (const userId of teamData.pendingMembers) {
              await createActivity('team_invite', docRef.id, team.name, userId, { id: appState.currentUser!.id, name: appState.currentUser!.name });
            }
          }
        }
      }
    }
    
    if (updates.settings && appState.currentUser) {
      await setDoc(doc(db, 'settings', appState.currentUser.id), updates.settings, { merge: true });
    }
    const { tasks: _, teams: __, activities: ___, users: ____, ...restUpdates } = updates;
    setAppState(prev => ({ ...prev, ...restUpdates }));
  }, [appState.teams, appState.users, appState.currentUser, appState.activities, createActivity]);

  const toggleTheme = useCallback(() => {
    const newTheme = appState.settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdateAppState({ settings: { ...appState.settings, theme: newTheme }});
  }, [appState.settings, handleUpdateAppState]);

  const handleNavigate = useCallback((page: string, teamId?: string) => {
    setAppState(prev => ({ ...prev, currentPage: page, currentTeamId: teamId || null }));
  }, []);
  
  const handleLogout = useCallback(async () => {
    await auth.signOut();
    setAppState(initialAppState);
  }, []);
  
  const handleUpdateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    const taskRef = doc(db, 'tasks', taskId);
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;

    let finalUpdates = { ...updates, updatedAt: new Date().toISOString() };

    if (updates.status === 'done' && task.status !== 'done') {
        const isLateByDate = task.dueDate && new Date(task.dueDate) < new Date();
        const completionStatus = isLateByDate ? 'late' : 'on-time';
        finalUpdates = { ...finalUpdates, completionStatus };
        
        if (task.createdBy !== appState.currentUser?.id) {
            await createActivity('completed_task', taskId, task.title, task.createdBy);
        }
    }
    
    await updateDoc(taskRef, finalUpdates);
  }, [appState.tasks, appState.currentUser?.id, createActivity]);

  const handleAddTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      teamId: task.teamId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await createActivity('created_task', docRef.id, task.title, task.createdBy);
  }, [createActivity]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  }, []);

  const handleDeleteTeam = useCallback(async (teamId: string) => {
    if (!teamId) return;
    const team = appState.teams.find(t => t.id === teamId);
    if (!team) return;
    if (team.createdBy !== appState.currentUser?.id) {
       toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only the team creator can delete the team.",
      });
      return;
    }
    await deleteDoc(doc(db, 'teams', teamId));
  }, [appState.teams, appState.currentUser?.id, toast]);

  const sendColleagueRequest = useCallback(async (email: string) => {
    if (!appState.currentUser) return "You must be logged in.";

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return "No user found with that email address.";
    }

    const targetUserDoc = querySnapshot.docs[0];
    const targetUser = targetUserDoc.data() as User;
    if (targetUser.id === appState.currentUser.id) return "You cannot add yourself as a colleague.";

    const targetUserRef = doc(db, 'users', targetUser.id);
    const existingRequests = targetUser.colleagueRequests || [];
    if (existingRequests.some(req => req.from === appState.currentUser!.id)) {
        return "Request already sent.";
    }
    await updateDoc(targetUserRef, {
        colleagueRequests: [...existingRequests, { from: appState.currentUser.id, name: appState.currentUser.name }]
    });

    await createActivity('colleague_request', appState.currentUser.id, appState.currentUser.name, targetUser.id, { id: appState.currentUser.id, name: appState.currentUser.name });

    return "Colleague request sent!";
  }, [appState.currentUser, createActivity]);
  
  const handleColleagueRequest = useCallback(async (activity: Activity, response: 'accept' | 'reject') => {
    if (!appState.currentUser || !activity.fromUser) return;

    const senderRef = doc(db, 'users', activity.fromUser.id);
    const currentUserRef = doc(db, 'users', appState.currentUser.id);

    const newCurrentUserRequests = appState.currentUser.colleagueRequests.filter(req => req.from !== activity.fromUser!.id);
    await updateDoc(currentUserRef, { colleagueRequests: newCurrentUserRequests });

    if (response === 'accept') {
        const senderSnap = await getDoc(senderRef);
        if (!senderSnap.exists()) return;
        const sender = senderSnap.data() as User;

        await updateDoc(currentUserRef, { colleagues: [...(appState.currentUser.colleagues || []), sender.id] });
        await updateDoc(senderRef, { colleagues: [...(sender.colleagues || []), appState.currentUser.id] });
        
        await createActivity('colleague_accepted', appState.currentUser.id, appState.currentUser.name, sender.id);
        await createActivity('colleague_accepted', sender.id, sender.name, appState.currentUser.id);
    } else {
        await createActivity('colleague_rejected', appState.currentUser.id, appState.currentUser.name, activity.fromUser.id);
    }

    const activityRef = doc(db, 'activities', activity.id);
    await updateDoc(activityRef, { status: response === 'accept' ? 'accepted' : 'rejected' });
  }, [appState.currentUser, createActivity]);
  
  const handleTeamInvite = useCallback(async (activity: Activity, response: 'accept' | 'reject') => {
      if (!appState.currentUser) return;
      const teamId = activity.targetId;
      const teamRef = doc(db, 'teams', teamId);
      const teamSnap = await getDoc(teamRef);

      if (!teamSnap.exists()) return;
      const team = teamSnap.data() as Team;

      const newPendingMembers = team.pendingMembers.filter(id => id !== appState.currentUser!.id);

      if (response === 'accept') {
          const newMembers = [...team.members, appState.currentUser.id];
          await updateDoc(teamRef, { members: newMembers, pendingMembers: newPendingMembers });
          await createActivity('added_user', appState.currentUser.id, appState.currentUser.name, team.createdBy);
      } else {
          await updateDoc(teamRef, { pendingMembers: newPendingMembers });
      }

      const activityRef = doc(db, 'activities', activity.id);
      await updateDoc(activityRef, { status: response === 'accept' ? 'accepted' : 'rejected' });
  }, [appState.currentUser, createActivity]);

    const value: AppContextType = {
        ...appState,
        isLoading,
        authMode,
        setAuthMode,
        handleNavigate,
        handleLogout,
        handleUpdateTask,
        handleAddTask,
        handleDeleteTask,
        handleDeleteTeam,
        handleUpdateAppState,
        sendColleagueRequest,
        handleColleagueRequest,
        handleTeamInvite,
        handleAuth,
        toggleTheme
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
