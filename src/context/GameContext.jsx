import { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react';
import { loadState, saveState } from '../utils/storage';
import { getQuestRewards, checkLevelUp, checkAchievements, levelProgress, generateNightTip } from '../utils/gameLogic';

const GameContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return action.state;

    case 'ADD_QUEST': {
      const rewards = getQuestRewards(action.quest.difficulty);
      const newQuest = {
        id: Date.now().toString(),
        title: action.quest.title,
        difficulty: action.quest.difficulty,
        type: action.quest.type || 'important',
        project: action.quest.project,
        completed: false,
        xpReward: rewards.xp,
        energyCost: rewards.energy,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      return { ...state, quests: [...state.quests, newQuest] };
    }

    case 'COMPLETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.id);
      if (!quest || quest.completed) return state;

      const updatedQuest = { ...quest, completed: true, completedAt: new Date().toISOString() };
      const newXp = state.player.xp + quest.xpReward;
      const newEnergy = Math.max(0, state.player.energy - quest.energyCost);
      const today = new Date().toISOString().split('T')[0];

      return {
        ...state,
        quests: state.quests.map(q => q.id === action.id ? updatedQuest : q),
        player: { ...state.player, xp: newXp, energy: newEnergy },
        dailyStats: {
          ...state.dailyStats,
          [today]: {
            completed: (state.dailyStats[today]?.completed || 0) + 1,
            xpGained: (state.dailyStats[today]?.xpGained || 0) + quest.xpReward,
            energySpent: (state.dailyStats[today]?.energySpent || 0) + quest.energyCost,
          },
        },
      };
    }

    case 'UNCOMPLETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.id);
      if (!quest || !quest.completed) return state;

      const newEnergy = Math.min(state.player.maxEnergy, state.player.energy + quest.energyCost);
      const newXp = Math.max(0, state.player.xp - quest.xpReward);
      const today = new Date().toISOString().split('T')[0];

      return {
        ...state,
        quests: state.quests.map(q => q.id === action.id ? { ...q, completed: false, completedAt: null } : q),
        player: { ...state.player, xp: newXp, energy: newEnergy },
        dailyStats: {
          ...state.dailyStats,
          [today]: {
            ...state.dailyStats[today],
            completed: Math.max(0, (state.dailyStats[today]?.completed || 1) - 1),
          },
        },
      };
    }

    case 'DELETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.id);
      if (!quest) return state;

      let newXp = state.player.xp;
      let newEnergy = state.player.energy;

      if (quest.completed) {
        newXp = Math.max(0, newXp - quest.xpReward);
        newEnergy = Math.min(state.player.maxEnergy, newEnergy + quest.energyCost);
      }

      return {
        ...state,
        quests: state.quests.filter(q => q.id !== action.id),
        player: { ...state.player, xp: newXp, energy: newEnergy },
      };
    }

    case 'EDIT_QUEST': {
      const rewards = getQuestRewards(action.quest.difficulty);
      return {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.id
            ? { ...q, ...action.quest, xpReward: rewards.xp, energyCost: rewards.energy }
            : q
        ),
      };
    }

    case 'UPDATE_PLAYER_NAME':
      return { ...state, player: { ...state.player, name: action.name } };

    case 'REFILL_ENERGY':
      return { ...state, player: { ...state.player, energy: state.player.maxEnergy } };

    case 'UPDATE_STREAK': {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      const hadActivityYesterday = state.dailyStats[yesterdayStr]?.completed > 0;
      const hasActivityToday = state.dailyStats[today]?.completed > 0;

      let newStreak = state.player.streak;
      if (hasActivityToday) {
        if (hadActivityYesterday || state.player.streak === 0) {
          newStreak = state.player.streak + 1;
        } else {
          newStreak = 1;
        }
      }
      return { ...state, player: { ...state.player, streak: newStreak, lastCheckIn: today } };
    }

    case 'UNLOCK_ACHIEVEMENT':
      if (state.player.achievements.includes(action.id)) return state;
      return {
        ...state,
        player: { ...state.player, achievements: [...state.player.achievements, action.id] },
        achievements: state.achievements.map(a =>
          a.id === action.id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
        ),
      };

    case 'ADD_NIGHT_TIP':
      return {
        ...state,
        nightAgentTips: [
          { date: new Date().toISOString().split('T')[0], tip: action.tip },
          ...state.nightAgentTips.slice(0, 6),
        ],
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, { id: action.project.id, name: action.project.name, icon: action.project.icon, color: action.project.color }],
      };

    case 'RESET_DAY':
      return {
        ...state,
        player: { ...state.player, energy: state.player.maxEnergy },
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null);
  const prevStateRef = useRef(null);
  const [levelUpData, setLevelUpData] = useState(null);

  useEffect(() => {
    const loaded = loadState();
    const today = new Date().toISOString().split('T')[0];
    const lastRefill = localStorage.getItem('questlog_last_refill');
    if (lastRefill !== today) {
      loaded.player.energy = loaded.player.maxEnergy;
      localStorage.setItem('questlog_last_refill', today);
    }
    prevStateRef.current = loaded;
    dispatch({ type: 'LOAD', state: loaded });
  }, []);

  useEffect(() => {
    if (state) {
      saveState(state);
    }
  }, [state]);

  useEffect(() => {
    if (!state || !prevStateRef.current) return;
    const prev = prevStateRef.current;

    const newXp = state.player.xp;
    const oldXp = prev.player.xp;
    const levelUp = checkLevelUp(oldXp, newXp);
    if (levelUp) {
      const progress = levelProgress(newXp);
      setLevelUpData({ level: progress.level, xp: newXp });
    }

    const newAchievements = checkAchievements(state, prev);
    newAchievements.forEach(id => {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', id });
    });

    prevStateRef.current = state;
  }, [state]);

  if (!state) return null;

  return (
    <GameContext.Provider value={{ state, dispatch, levelUpData, setLevelUpData }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
