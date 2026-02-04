
export type SessionStatus = 'completed' | 'aborted' | 'active' | 'break' | 'long-break';

export interface FocusSession {
  id: string;
  name: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  durationSec: number;
  status: SessionStatus;
  exp: number;
}

export type CloudStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface AppState {
  totalXP: number;
  isPremium: boolean;
  sessions: FocusSession[];
  cloudStatus: CloudStatus;
  cloudEmail?: string;
  lastSync?: string;
  // Long break settings
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  completedSessionsCount: number;
}

export enum View {
  Home = 'home',
  Analytics = 'analytics',
  Settings = 'settings'
}