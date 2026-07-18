// XP needed to reach a given level (exclusive threshold)
export function xpForLevel(level) {
  return level * 100;
}

// Total XP needed from level 1 to reach a level
export function totalXpForLevel(level) {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

// Current level progress: { level, currentXP, xpNeeded, progress 0-1 }
export function levelProgress(xp) {
  let level = 1;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }
  const xpNeeded = xpForLevel(level);
  return { level, currentXP: xp, xpNeeded, progress: xp / xpNeeded };
}

// Check if xp gain triggers a level up
export function checkLevelUp(oldXp, newXp) {
  let oldLevel = 0;
  let tempXp = oldXp;
  while (tempXp >= xpForLevel(oldLevel + 1)) {
    tempXp -= xpForLevel(oldLevel + 1);
    oldLevel++;
  }
  let newLevel = 0;
  tempXp = newXp;
  while (tempXp >= xpForLevel(newLevel + 1)) {
    tempXp -= xpForLevel(newLevel + 1);
    newLevel++;
  }
  return newLevel > oldLevel ? newLevel : null;
}

const DIFFICULTY_XP = { easy: 10, medium: 25, hard: 50, epic: 100 };
const DIFFICULTY_ENERGY = { easy: 5, medium: 10, hard: 20, epic: 35 };

export function getQuestRewards(difficulty) {
  return {
    xp: DIFFICULTY_XP[difficulty] || 25,
    energy: DIFFICULTY_ENERGY[difficulty] || 10,
  };
}

// Achievement unlock checks
export function checkAchievements(state, prevState) {
  const { player, quests, streak } = state;
  const unlocked = [];
  const now = new Date().toISOString();

  // First Blood
  if (!prevState.player.achievements.includes('first-blood') && quests.some(q => q.completed)) {
    unlocked.push('first-blood');
  }
  // Epic Win
  if (!prevState.player.achievements.includes('epic-win') && quests.some(q => q.completed && q.difficulty === 'epic')) {
    unlocked.push('epic-win');
  }
  // Battle Tested (100 quests)
  const totalCompleted = quests.filter(q => q.completed).length;
  if (!prevState.player.achievements.includes('battle-tested') && totalCompleted >= 100) {
    unlocked.push('battle-tested');
  }
  // Level achievements
  if (!prevState.player.achievements.includes('level-5') && player.level >= 5) {
    unlocked.push('level-5');
  }
  if (!prevState.player.achievements.includes('level-10') && player.level >= 10) {
    unlocked.push('level-10');
  }
  // Streak achievements
  if (!prevState.player.achievements.includes('hot-streak') && streak >= 7) {
    unlocked.push('hot-streak');
  }
  if (!prevState.player.achievements.includes('streak-14') && streak >= 14) {
    unlocked.push('streak-14');
  }
  if (!prevState.player.achievements.includes('streak-30') && streak >= 30) {
    unlocked.push('streak-30');
  }
  // Decision Speed
  const fastQuest = quests.find(q => {
    if (!q.completed || !q.createdAt || !q.completedAt) return false;
    const created = new Date(q.createdAt).getTime();
    const completed = new Date(q.completedAt).getTime();
    return (completed - created) < 5 * 60 * 1000;
  });
  if (!prevState.player.achievements.includes('decision-speed') && fastQuest) {
    unlocked.push('decision-speed');
  }
  // All projects
  const projectIds = [...new Set(quests.filter(q => !q.completed).map(q => q.project))];
  if (!prevState.player.achievements.includes('all-projects') && projectIds.length >= 5) {
    unlocked.push('all-projects');
  }
  // Energy manager: finish day with 50+ energy remaining
  if (!prevState.player.achievements.includes('energy-manager') && player.energy >= 50) {
    unlocked.push('energy-manager');
  }

  return unlocked;
}

export function generateNightTip(state) {
  const today = new Date().toISOString().split('T')[0];
  const todayStats = state.dailyStats[today];
  const quests = state.quests;
  const completed = quests.filter(q => q.completed);
  const pending = quests.filter(q => !q.completed);

  const tips = [];

  if (pending.length > 10) {
    tips.push(`You have ${pending.length} pending quests — that's overwhelming. Try to leave 3-5 for tomorrow so you're not starting at a deficit.`);
  }
  if (state.player.energy < 30) {
    tips.push(`Energy was low today. Consider blocking one hour tomorrow morning before phone/messages hit — that quiet time is your highest-leverage window.`);
  }
  if (state.streak > 0 && state.streak % 7 === 0) {
    tips.push(`${state.streak}-day streak! You're in the habit. The key now: don't let one off day break the chain. One quest is enough to maintain it.`);
  }
  if (completed.length === 0) {
    tips.push(`Zero quests completed today — that's okay. Tomorrow is a fresh start. Pick 1 easy quest and just get momentum going.`);
  }
  if (completed.length >= 8) {
    tips.push(`You crushed ${completed.length} quests today. Log your wins — that pattern of high output is your competitive advantage.`);
  }

  // Find the hardest pending quest
  const hardPending = pending.filter(q => q.difficulty === 'hard' || q.difficulty === 'epic');
  if (hardPending.length > 0) {
    tips.push(`Your most important move tomorrow: tackle the "${hardPending[0].title}" quest first. High-difficulty tasks lose value when you're tired.`);
  }

  const pendingByProject = pending.reduce((acc, q) => {
    acc[q.project] = (acc[q.project] || 0) + 1;
    return acc;
  }, {});

  const topProject = Object.entries(pendingByProject).sort((a, b) => b[1] - a[1])[0];
  if (topProject) {
    tips.push(`Most of your pending work (${topProject[1]} quests) is in ${topProject[0].replace('-', ' ')}. Batch those tomorrow morning.`);
  }

  if (tips.length === 0) {
    tips.push(`You're doing great. Keep the streak alive and remember: one quest per day is still a victory.`);
  }

  return tips[0];
}
