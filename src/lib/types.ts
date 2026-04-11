
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'inbox' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignedTo?: string[];
  createdBy: string;
  tags?: string[];
  teamId?: string;
  estimatedTime?: number; // in hours
  subtasks?: { id: string; title: string; completed: boolean }[];
  aiSuggestion?: string;
  timerStartedAt?: string | null;
  timeSpent?: number; // in seconds
  completionStatus?: 'on-time' | 'late';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status?: 'online' | 'away' | 'offline';
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
  colleagues: string[];
  colleagueRequests: { from: string, name: string }[];
  skills?: string[];
}

export interface Team {
  id: string;
  name: string;
  color: string;
  members: string[];
  admins: string[];
  pendingMembers: string[];
  description?: string;
  createdAt: string;
  createdBy: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: 'created_task' | 'completed_task' | 'added_user' | 'created_team' | 'colleague_request' | 'colleague_accepted' | 'colleague_rejected' | 'team_invite';
  targetId: string; // can be task id, user id, team id
  targetName: string;
  timestamp: string;
  fromUser?: { id: string; name: string; }; // for requests
  status?: 'pending' | 'accepted' | 'rejected' | 'completed';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  soundEffects: boolean;
  aiSuggestions: boolean;
  focusMode: boolean;
  language: string;
  workingHours: {
    start: string;
    end: string;
  };
  timezone: string;
}

export interface AppState {
  isLoggedIn: boolean;
  currentUser: User | null;
  currentPage: string;
  tasks: Task[];
  users: User[];
  teams: Team[];
  activities: Activity[];
  settings: AppSettings;
  currentTeamId: string | null;
}

    