// localStorage keys
const STORAGE_KEY = 'questlog_state';

// Default fresh state
const defaultState = {
  player: {
    name: 'GOATED',
    level: 1,
    xp: 0,
    energy: 100,
    maxEnergy: 100,
    streak: 0,
    lastCheckIn: null,
    gold: 0,
    achievements: [],
    createdAt: new Date().toISOString(),
  },
  quests: [],
  projects: [
    { id: 'life-admin', name: 'Life Admin', icon: '⚔️', color: '#FF2D78' },
    { id: 'home', name: 'Home', icon: '🏠', color: '#00E5FF' },
    { id: 'apps', name: 'Apps', icon: '🚀', color: '#00FF88' },
    { id: 'family', name: 'Family', icon: '👨‍👧‍👦', color: '#FFD700' },
    { id: 'self', name: 'Self', icon: '💪', color: '#FF9500' },
  ],
  achievements: [
    { id: 'first-blood', name: 'First Blood', description: 'Complete your first quest', icon: '⚔️', unlocked: false, unlockedAt: null },
    { id: 'hot-streak', name: 'Hot Streak', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false, unlockedAt: null },
    { id: 'epic-win', name: 'Epic Win', description: 'Complete an Epic quest', icon: '🏆', unlocked: false, unlockedAt: null },
    { id: 'decimation', name: 'Decimation', description: 'Complete 10 quests in one day', icon: '💀', unlocked: false, unlockedAt: null },
    { id: 'battle-tested', name: 'Battle Tested', description: 'Complete 100 quests total', icon: '🛡️', unlocked: false, unlockedAt: null },
    { id: 'decision-speed', name: 'Decision Speed', description: 'Complete a quest within 5 minutes of creating it', icon: '⚡', unlocked: false, unlockedAt: null },
    { id: 'level-5', name: 'Veteran', description: 'Reach level 5', icon: '🎖️', unlocked: false, unlockedAt: null },
    { id: 'level-10', name: 'Elite', description: 'Reach level 10', icon: '⭐', unlocked: false, unlockedAt: null },
    { id: 'streak-14', name: 'Two Weeks', description: 'Maintain a 14-day streak', icon: '🌟', unlocked: false, unlockedAt: null },
    { id: 'streak-30', name: 'Monthly Grind', description: 'Maintain a 30-day streak', icon: '💎', unlocked: false, unlockedAt: null },
    { id: 'all-projects', name: 'Diversified', description: 'Have quests in all 5 projects', icon: '📦', unlocked: false, unlockedAt: null },
    { id: 'energy-manager', name: 'Energy Manager', description: 'Finish a day with 50+ energy remaining', icon: '🔋', unlocked: false, unlockedAt: null },
  ],
  dailyStats: {},
  nightAgentTips: [],
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle schema additions
    return {
      ...defaultState,
      ...parsed,
      player: { ...defaultState.player, ...parsed.player },
      projects: parsed.projects?.length ? parsed.projects : defaultState.projects,
      achievements: parsed.achievements?.length ? parsed.achievements : defaultState.achievements,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}
