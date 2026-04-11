
"use client";

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LandingPage } from '../components/landing-page';
import { AuthPage } from '../components/auth-page';
import { EnhancedDashboard } from '../components/enhanced-dashboard';
import { Analytics } from '../components/analytics';
import { GroupAnalytics } from '../components/group-analytics';
import { CalendarView } from '../components/calendar-view';
import { TeamManagement } from '../components/team-management';
import { ColleaguesPage } from '../components/colleagues-page';
import { Settings } from '../components/settings';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider, useAppContext } from '@/context/AppContext';

const AppRouter = () => {
  const { 
    currentPage, 
    isLoggedIn,
    isLoading,
    authMode,
    setAuthMode,
    toggleTheme,
    handleAuth,
    handleNavigate,
    settings
  } = useAppContext();

  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const checkDarkMode = () => {
      if (settings.theme === 'auto') {
        setIsDarkMode(darkModeQuery.matches);
      } else {
        setIsDarkMode(settings.theme === 'dark');
      }
    };

    checkDarkMode();
    darkModeQuery.addEventListener('change', checkDarkMode);
    return () => darkModeQuery.removeEventListener('change', checkDarkMode);
  }, [settings.theme]);


  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  const renderPage = () => {
    if (!isLoggedIn) {
        if (currentPage === 'auth') {
             return (
              <AuthPage
                mode={authMode}
                onModeChange={setAuthMode}
                onAuthSuccess={handleAuth}
                onBack={() => handleNavigate('landing')}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              />
            );
        }
        return (
          <LandingPage
            onNavigateToAuth={() => handleNavigate('auth')}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        );
    }
    
    switch (currentPage) {
      case 'dashboard':
        return (
            <EnhancedDashboard />
        );
      case 'analytics':
        return <Analytics />;
       case 'group-analytics':
        return <GroupAnalytics />;
      case 'calendar':
        return <CalendarView />;
      case 'team':
        return <TeamManagement />;
      case 'colleagues':
          return <ColleaguesPage />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <LandingPage
            onNavigateToAuth={() => handleNavigate('auth')}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        );
    }
  };

  return <div className={isDarkMode ? 'dark' : ''}><Toaster />{renderPage()}</div>;
}


const Home: React.FC = () => {
  return (
    <AppProvider>
        <DndProvider backend={HTML5Backend}>
            <AppRouter />
        </DndProvider>
    </AppProvider>
  );
};

export default Home;

    