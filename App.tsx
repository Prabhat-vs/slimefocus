
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, View, FocusSession } from './types';
import { loadState, addSession, saveState } from './services/storageService';
import Header from './components/Header';
import Home from './components/Home';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import StatusBar from './components/StatusBar';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(loadState());
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [isSystemLinked, setIsSystemLinked] = useState(false);

  useEffect(() => {
    setIsSystemLinked(true);
    setStatusMessage('System Linked ✅');
    const timer = setTimeout(() => {
      setStatusMessage('Focus Mode: Standby');
      setIsSystemLinked(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const refreshState = useCallback(() => {
    setAppState(loadState());
  }, []);

  const handleSessionComplete = (session: FocusSession) => {
    addSession(session);
    refreshState();
    setStatusMessage(`Session Saved! +${session.exp} XP`);
  };

  const handleUpdateStatus = (msg: string) => {
    setStatusMessage(msg);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-white">
      <Header 
        isPremium={appState.isPremium} 
        currentView={currentView}
        onNavigate={setCurrentView}
        xp={appState.totalXP}
      />

      <main className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        {currentView === View.Home && (
          <Home 
            completedSessionsCount={appState.completedSessionsCount}
            longBreakDuration={appState.longBreakDuration}
            sessionsBeforeLongBreak={appState.sessionsBeforeLongBreak}
            onSessionFinish={handleSessionComplete} 
            onUpdateStatus={handleUpdateStatus}
          />
        )}
        {currentView === View.Analytics && (
          <Analytics 
            sessions={appState.sessions} 
            isPremium={appState.isPremium}
            onRefresh={refreshState}
          />
        )}
        {currentView === View.Settings && (
          <Settings 
            isPremium={appState.isPremium}
            cloudStatus={appState.cloudStatus}
            cloudEmail={appState.cloudEmail}
            longBreakDuration={appState.longBreakDuration}
            sessionsBeforeLongBreak={appState.sessionsBeforeLongBreak}
            onRefresh={refreshState}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      <StatusBar 
        message={statusMessage} 
        isLinked={isSystemLinked} 
        isCloudLinked={appState.cloudStatus === 'connected'}
      />
    </div>
  );
};

export default App;